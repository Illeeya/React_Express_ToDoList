import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAmYrFLfrri5BG36JaN7WWppAubgji8XwQ",
  authDomain: "todolist-26c89.firebaseapp.com",
  projectId: "todolist-26c89",
  storageBucket: "todolist-26c89.appspot.com",
  messagingSenderId: "451735672521",
  appId: "1:451735672521:web:cc13a25277bca393ae9f18",
  measurementId: "G-E0S50QWQPY",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
// const analytics = getAnalytics(firebaseApp);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  //<React.StrictMode>
  <App />
  // </React.StrictMode>
);
