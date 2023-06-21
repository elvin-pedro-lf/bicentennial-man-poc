import React from "react";
import GridLoader from "react-spinners/GridLoader";

const PageLoader = (props) => {
  const message = props.message || "Your request has been submitted.";
  return (
    <div id="pageLoading">
      {message}
      <br />
      This may take a few seconds to complete.
      <br />
      Please wait...
      <div id="loader">
        <GridLoader
          color="#d11f2e"
          size={15}
          aria-label="Loading Box Spinner"
          data-testid="loader"
        />
      </div>
    </div>
  );
};

export default PageLoader;
