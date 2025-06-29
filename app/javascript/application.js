import React from "react";
import ReactDOM from "react-dom/client";
import BillingForm from "./components/BillingForm";

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<BillingForm />);
}