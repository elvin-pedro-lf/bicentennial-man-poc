/* eslint-disable no-restricted-globals */
import React, { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { getBlockOfWorkoutFromChatGPTAction } from "../redux/slice/newClientSlice";

import Button from "react-bootstrap/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";

import { NewClientContent } from "../content/NewClientContent";
import ButtonSelection from "../components/Button/Button.Selection";
import { useNavigate } from "react-router-dom";

import PageLoader from "../components/PageLoader";
import ActionRejected from "../components/ActionRejected";

import parse from "html-react-parser";

const NewClient = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const chatGPTState = useSelector(
    (__state__) => __state__.getBlockOfWorkoutFromChatGPT
  );

  const [pageNumber, setPageNumber] = useState(1);
  const [selection, setSelection] = useState({});
  const content = NewClientContent[pageNumber] || null;

  let ChatGPTPrompt = "";
  let lastPage = false;

  const nextPage = content.reduce(
    (go, q) =>
      go &&
      ((q.required && selection[q.id] && selection[q.id].selected) ||
        !q.required),
    true
  );
  const onSelectHandler = (id, value, subgroup) => {
    if (value instanceof Array && value.length > 1) {
      const value_length = value.length;
      value = value.map((v, i) => {
        v = v !== "HIIT" ? v.toLowerCase() : v;
        return i === value_length - 1 ? `and ${v}` : v;
      });
    }
    let prompt = content.find((e) => e.id === id);
    if (subgroup) {
      prompt = prompt.response.groups.find((e) => e.name === subgroup);
      setSelection({
        ...selection,
        [id]: {
          ...selection[id],
          subgroup: true,
          [subgroup]: {
            value,
            selected: value && value.length ? true : false,
            ChatGPTPrompt: prompt.ChatGPTAPIPrompt(
              value instanceof Array ? value.join(", ") : value,
              NewClientContent.ClientPronoun(selection.clientSexAtBirth.value)
            ),
          },
        },
      });
    } else {
      setSelection({
        ...selection,
        [id]: {
          value,
          selected: value && value.length ? true : false,
          skip: prompt.skip,
          ChatGPTPrompt:
            !prompt.skip &&
            prompt.ChatGPTAPIPrompt(
              value instanceof Array ? value.join(", ") : value,
              NewClientContent.ClientPronoun(selection.clientSexAtBirth.value)
            ),
        },
      });
    }

    console.log("**** SELECTION: ", selection);
  };

  const continueHandler = () => {
    if (lastPage) {
      ChatGPTPrompt =
        NewClientContent.ChatGPTAPIPromptStart +
        NewClientContent.ChatGPTAPIPromptProfile({
          age: selection.clientAge.value,
          gender: selection.clientSexAtBirth.value.toLowerCase(),
        });

      // get responses
      ChatGPTPrompt += "###";
      Object.keys(selection).forEach((key) => {
        const data = selection[key];
        if (!data.skip) {
          if (data.subgroup) {
            Object.keys(data).forEach((_key) => {
              if (_key !== "subgroup" && data[_key].selected)
                ChatGPTPrompt += data[_key].ChatGPTPrompt;
            });
          } else if (data.selected) {
            ChatGPTPrompt += data.ChatGPTPrompt;
          }
        }
      });

      ChatGPTPrompt +=
        "###" +
        NewClientContent.ChatGPTAPIPromptClosing(
          selection.programLengthInWeeks.value
        ) +
        NewClientContent.ChatGPTAPIPromptRequestStartingDate("Monday");
      dispatch(
        getBlockOfWorkoutFromChatGPTAction({
          history: [],
          totalTokens: 0,
          displayPrompt: ChatGPTPrompt.replaceAll("###", "<br/><br/>"),
          validate: false,
          makeAdjustments: false,
          prompt:
            ChatGPTPrompt + NewClientContent.ChatGPTAPIPromptRequestFormat,
          selectedProfileAndPreferences: {
            clientAge: selection.clientAge.value,
            clientSexAtBirth: selection.clientSexAtBirth.value,
            programLengthInWeeks: selection.programLengthInWeeks.value,
          },
        })
      );
    } else {
      if (nextPage) setPageNumber(pageNumber + 1);
    }
  };

  const onFormControlChange = (e) => {
    e.preventDefault();
    if (e.target.value && e.target.value.trim().length > 0) {
      onSelectHandler(e.target.id, e.target.value.trim());
    } else {
      setSelection({ ...selection, [e.target.id]: { selected: false } });
    }
  };

  const viewResultsHandler = (e) => {
    e.preventDefault();
    if (chatGPTState.fulfilled) {
      navigate("/client/new/plan");
    }
  };

  return (
    <div id="new-client">
      {(chatGPTState.pending || chatGPTState.fulfilled) && (
        <>
          {chatGPTState.pending && (
            <PageLoader message="Your information below has been submitted." />
          )}
          <div className="display-prompt">{parse(chatGPTState.prompt)}</div>
          <Button
            className={!chatGPTState.fulfilled ? "btn-inactive" : ""}
            onClick={viewResultsHandler}
          >
            REVIEW YOUR PLAN
          </Button>
        </>
      )}

      {chatGPTState.rejected && <ActionRejected message={chatGPTState.error} />}

      {!chatGPTState.pending &&
        !chatGPTState.rejected &&
        !chatGPTState.fulfilled && (
          <>
            <div id="coach-faq">
              {content &&
                content.map((q, i) => {
                  lastPage = q.end;
                  return (
                    <>
                      <label key={`label${i}_${q.id}`}>{q.prompt}</label>
                      {q.response.component === "buttonGroup" && (
                        <ButtonSelection
                          key={q.id}
                          id={q.id}
                          type={q.response.type}
                          buttons={q.response.choices}
                          onSelect={onSelectHandler}
                        />
                      )}
                      {q.response.component === "textArea" && (
                        <FloatingLabel
                          controlId={q.id}
                          onChange={onFormControlChange}
                        >
                          <Form.Control
                            as="textarea"
                            placeholder="Please enter NONE if not applicable"
                          />
                        </FloatingLabel>
                      )}
                      {q.response.component === "number" && (
                        <Form.Control
                          key={q.id}
                          id={q.id}
                          type="number"
                          min={q.response.min}
                          max={q.response.max}
                          onChange={onFormControlChange}
                        />
                      )}
                      {q.response.component === "multipleButtonGroup" &&
                        q.response.groups.map((g, _i) => {
                          return (
                            <>
                              <p className="subGroup">{g.name}</p>
                              <ButtonSelection
                                key={q.id}
                                id={q.id}
                                subgroup={g.name}
                                type={g.type}
                                buttons={g.choices}
                                onSelect={onSelectHandler}
                              />
                            </>
                          );
                        })}
                    </>
                  );
                })}
            </div>
            <Button
              className={!nextPage && !lastPage ? "btn-inactive" : ""}
              onClick={continueHandler}
              disabled={chatGPTState.pending}
            >
              {lastPage ? "GET YOUR PLAN" : "CONTINUE"}
            </Button>
          </>
        )}
    </div>
  );
};

export default NewClient;
