import React, { Component } from "react";

export const LoginPage = props => {
  return (
    <div className="login-form">
      <input id="RTM-login-server" type="text" placeholder="Server name" className="input-row"></input>
      <input id="RTM-login-database" type="text" placeholder="Database name" className="input-row"></input>
      <input id="RTM-login-email" type="text" placeholder="Email" className="input-row"></input>
      <input id="RTM-login-password" type="password" placeholder="Password" className="input-row"></input>
      <div className="login-error input-row" style={{ display: props.showError ? "block" : "none" }}>
        Invalid user name or password
    </div>
      <button id="login-button" onClick={props.handleFormSubmit} className="input-row">
        Login
    </button>
    </div>);
};
