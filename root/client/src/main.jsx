import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import { ChatContextProvider } from "./context/ChatContext.jsx";
import { ImgViewProvider } from "./context/ImgViewer.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthContextProvider>
    <ChatContextProvider>
      <ImgViewProvider>
        <App />
      </ImgViewProvider>
    </ChatContextProvider>
  </AuthContextProvider>
);