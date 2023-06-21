import React from "react";

import Container from "react-bootstrap/Container";
import HistoryItem from "./History.Item";

const HistoryList = (props) => {
  const list = props.list;
  return (
    <>
      {list && list.length > 0 && (
        <Container>
          {list.map((item) => {
            return <HistoryItem item={item} />;
          })}
        </Container>
      )}
      {(!list || list.length === 0) && (
        <strong className="error-message">
          We did not find any chat history under your account.
          <br />
          <br />
          If this is an error, please contact your
          <br />
          System Administrator.
        </strong>
      )}
    </>
  );
};

export default HistoryList;
