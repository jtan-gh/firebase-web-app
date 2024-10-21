import React from "react";
import { Route, Routes } from "react-router-dom";
import { Link } from "react-router-dom";
import SignUp from "./authenticate/signup";
import SignIn from "./authenticate/signin";
import "./App.css"
import MonthlyCalendar from "./assets/MonthlyCalendar";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={
          <div>
            <h1>Hello now go signin</h1>
            <a href="/signin">Click to Sign In</a>
            <br></br>
            <a href="/signup">Click to Sign up</a>
          </div>
        } />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/protected" element={<p>hello</p>} />
        <Route path="/calendar" element={<MonthlyCalendar />} />
      </Routes>
    </div>
  );
}

export default App;
