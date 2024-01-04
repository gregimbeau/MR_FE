import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

type Appointment = {
  id: number;
  title: string;
  type: string;
  location: string;
  host_id: number;
  client_id: number;
  start_time: string;
  end_time: string;
};

const AppointmentList: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          `${
            process.env.REACT_APP_API_URL || "http://localhost:3000/api"
          }/appointments`
        );

        console.log(response.data);
        setAppointments(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setError("Error fetching data. Please try again later.");
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className='appointment-list-container'>
      <h2>Appointments</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className='appointments-container'>
          {appointments.map((appointment) => (
            <div className='card' key={appointment.id}>
              <h3>{appointment.title}</h3>
              <h4>{appointment.location}</h4>
              <p>Start Time: {appointment.start_time}</p>
              <p>Start Time: {appointment.end_time}</p>
              {/* Display other appointment details as needed */}
            </div>
          ))}
        </div>
      )}
      <p>Number of appointments: {appointments.length}</p>
    </div>
  );
};

export default AppointmentList;