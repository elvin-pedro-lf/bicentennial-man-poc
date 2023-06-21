import React from "react";
import { Outlet } from "react-router-dom";

import thumbnail from "../assets/img/fpo-thumbnail.png";

const CoachThumbnail = () => {
  return (
    <>
      <div id="coach-thumbnail">
        <img src={thumbnail} alt="Coach Drew"></img>
      </div>
      <Outlet />
    </>
  );
};

export default CoachThumbnail;
