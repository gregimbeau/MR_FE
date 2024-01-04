import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AppointmentList from "./AppointmentList";
import AppointmentForm from "./AppointmentForm";
import Navbar from "./Navbar";

function App() {
  return (
    <Router>
      <div className='App'>
        <header className='App-header'>
          <h1>ModaResa Appointment System</h1>

          <div className='button-container'>
            <a
              href='https://github.com/gregimbeau/MR_FE'
              target='_blank'
              className='git-button'
              rel='noreferrer'>
              Front End Repo
            </a>
            <a
              href='https://github.com/gregimbeau/MR_BE'
              target='_blank'
              className='git-button'
              rel='noreferrer'>
              Back End Repo
            </a>
          </div>

          <Navbar />
        </header>
        <main>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/appointments' element={<AppointmentList />} />
            <Route path='/new-appointment' element={<AppointmentForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

function Home() {
  return <p>Welcome to the ModaResa Appointment System!</p>;
}