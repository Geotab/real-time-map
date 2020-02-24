import React, { Component } from "react";

export const LoginPage = props => {
  console.warn('4', props);
  return (<div className="login-form">
    <input id="RTM-login-server" type="text" placeholder="Server name"></input>
    <input id="RTM-login-database" type="text" placeholder="Database name"></input>
    <input id="RTM-login-email" type="text" placeholder="Email"></input>
    <input id="RTM-login-password" type="password" placeholder="Password"></input>
    <button id="login-button" onClick={props.handleFormSubmit}>
      Login
    </button>
  </div>);
}

  ;
