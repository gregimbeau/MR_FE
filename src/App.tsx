import React from "react";
import axios from "axios";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AppointmentList from "./AppointmentList";
import AppointmentForm from "./AppointmentForm";
import Navbar from "./Navbar";
import { REACT_APP_API_URL } from "./config";


function App() {
  const handleSeedDatabase = async () => {
    try {
      const response = await axios.post(
        `${REACT_APP_API_URL}/seed-database`
      );
      console.log(response.data);
      alert("Database seeded successfully");
    } catch (error) {
      console.error("Error seeding database: ", error);
      alert("Error seeding database");
    }
  };

  const handleClearDatabase = async () => {
    try {
      const response = await axios.post(
        `${REACT_APP_API_URL}/clear-database`
      );
      console.log(response.data);
      alert("Database cleared successfully");
    } catch (error) {
      console.error("Error clearing database: ", error);
      alert("Error clearing database");
    }
  };

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
            {/* Seed and Clear Database Buttons */}
            <div className='db-button-container'>
              <button onClick={handleSeedDatabase} className='db-button'>
                Seed (vendors/buyers)
              </button>
              <button onClick={handleClearDatabase} className='db-button'>
                Clear DB from all data
              </button>
            </div>
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
