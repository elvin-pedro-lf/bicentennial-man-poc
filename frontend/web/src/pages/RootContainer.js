import React from "react";
import { Outlet } from "react-router-dom";

import NavBar from "../layouts/Navbar";

import "../assets/css/default.scss";

const RootContainer = () => {
  return (
    <div className="App">
      <h1>
        <span className="header">Coach Drew</span>
      </h1>
      <NavBar />
      <Outlet />
    </div>
  );
};

export default RootContainer;
