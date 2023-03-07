import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./components/App/App";
import "./globals.css";

const renderApp = () =>
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById("root")
  );

renderApp();
