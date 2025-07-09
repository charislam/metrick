import React from "react";
import { createRoot } from "react-dom/client";
import RootLayout from "./routes/__root";

// biome-ignore lint/style/noNonNullAssertion: this exists in index.html
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RootLayout />
  </React.StrictMode>
);
