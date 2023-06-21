import React from "react";

const ActionRejected = ({ message }) => {
  return (
    <div id="pageLoading">
      Something went wrong!
      <br />
      Please contact your System Administrator!
      <br />
      <br />
      <code
        style={{
          display: "block",
          padding: "10px",
          backgroundColor: "#000",
          color: "#fff",
        }}
      >
        <strong>System Error:</strong>
        <br />
        {message}
      </code>
    </div>
  );
};

export default ActionRejected;
