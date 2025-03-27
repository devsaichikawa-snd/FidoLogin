/**エントリーポイント */
import React from "react";
import ReactDOM from "react-dom/client";

const rootElement: HTMLElement = document.getElementById("root") as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <h1>Hello, Vite + React + TypeScript!</h1>
  </React.StrictMode>
);
