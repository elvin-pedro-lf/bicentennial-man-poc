import React from "react";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import parse from "html-react-parser";

const HistoryItem = (props) => {
  return (
    <>
      {props.item.role === "user" && (
        <>
          <Row className="user">
            <Col className="role">
              <strong>You asked:</strong>
            </Col>
          </Row>
          <Row>
            <Col className="content">{props.item.content}</Col>
          </Row>
        </>
      )}
      {props.item.role === "assistant" && (
        <>
          <Row className="assistant">
            <Col className="role">
              <strong>Coach Drew answered:</strong>
            </Col>
          </Row>
          <Row>
            <Col className="content">{parse(props.item.content)}</Col>
          </Row>
        </>
      )}
    </>
  );
};

export default HistoryItem;
