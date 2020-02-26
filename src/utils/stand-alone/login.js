import React, { Component } from "react";

export const LoginPage = props => (
  <form className="login-form" onSubmit={props.handleFormSubmit}>
    <input id="RTM-login-server" type="text" placeholder="Server name (my*.geotab.com)" className="input-row" required ></input>
    <input id="RTM-login-database" type="text" placeholder="Database name" className="input-row" required ></input>
    <input id="RTM-login-email" type="email" placeholder="Email" className="input-row" required ></input>
    <input id="RTM-login-password" type="password" placeholder="Password" className="input-row" required ></input>
    <div className="login-error input-row" id="RTM-Login-error">  Invalid login, please try again. </div>
    <input id="login-button" type="submit" value="Login" className="input-row"></input>
  </form>
);