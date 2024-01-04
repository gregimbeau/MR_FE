import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";
import AppointmentEditForm from "./AppointmentEditForm";

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
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);
  const editFormRef = useRef<HTMLDivElement>(null);
  const editFormContainerRef = useRef<HTMLDivElement>(null); 

const handleEdit = (appointment: Appointment) => {
  setEditingAppointment(appointment);
  setIsEditing(true);

  // Wait for the next render to complete
  setTimeout(() => {
    editFormContainerRef.current?.scrollIntoView({ behavior: "smooth" });
  }, 0);
};


  const closeEditForm = () => {
    setEditingAppointment(null);
    setIsEditing(false);
  };

const fetchAppointments = async () => {
  try {
    const response = await axios.get(
      `${
        process.env.REACT_APP_API_URL || "http://localhost:3000/api"
      }/appointments`
    );
    setAppointments(response.data);
    setLoading(false);
  } catch (error) {
    console.error("Error fetching data: ", error);
    setError("Error fetching data. Please try again later.");
    setLoading(false);
  }
};

useEffect(() => {
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
        <>
          <div className='appointments-container'>
            {appointments.map((appointment) => (
              <div className='card' key={appointment.id}>
                <h3>{appointment.title}</h3>
                <h4>{appointment.location}</h4>
                <p>Start Time: {appointment.start_time}</p>
                <p>End Time: {appointment.end_time}</p>
                <button
                  className='button'
                  onClick={() => handleEdit(appointment)}>
                  Edit
                </button>
              </div>
            ))}
          </div>
          <div ref={editFormContainerRef} className='edit-form-container'>
            {editingAppointment && (
              <AppointmentEditForm
                appointment={editingAppointment}
                closeEditForm={closeEditForm}
                refreshAppointments={fetchAppointments}
              />
            )}
          </div>
        </>
      )}
      <p>Number of appointments: {appointments.length}</p>
    </div>
  );
};

export default AppointmentList;
