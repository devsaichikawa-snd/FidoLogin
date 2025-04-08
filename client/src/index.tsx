/**エントリーポイント */
import React from "react";
import ReactDOM from "react-dom/client";

// pages
import Login from "./pages/login";

// CSS
import "./styles/login.css";

const rootElement: HTMLElement = document.getElementById("root") as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

// ルーティング
root.render(
  <React.StrictMode>
    <Login />
  </React.StrictMode>
);
