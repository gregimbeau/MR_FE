import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";
import AppointmentEditForm from "./AppointmentEditForm";

type Appointment = {
  id: number;
  title: string;
  type: string;
  location: string;
  vendor_name: string;
  buyer_name: string;
  vendor_id: number;
  buyer_id: number;
  start_time: string;
  end_time: string;
};

const formatDateAndTime = (isoString: string) => {
  const date = new Date(isoString);
  return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
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

  const handleDelete = async (appointmentId: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this appointment?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(
          `${
            process.env.REACT_APP_API_URL || "http://localhost:3000/api"
          }/appointments/${appointmentId}`
        );
        fetchAppointments();
      } catch (error) {
        console.error("Error deleting appointment: ", error);
      }
    }
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
                <h4>Type: {appointment.type}</h4>
                {appointment.type === "physical" && (
                  <h4>Location: {appointment.location}</h4>
                )}{" "}
                <p>Vendor: {appointment.vendor_name}</p>
                <p>Buyer: {appointment.buyer_name}</p>
                <p>Start Time: {formatDateAndTime(appointment.start_time)}</p>
                <p>End Time: {formatDateAndTime(appointment.end_time)}</p>
                <button
                  className='button'
                  onClick={() => handleEdit(appointment)}>
                  Edit
                </button>
                <button
                  className='button delete-button'
                  onClick={() => handleDelete(appointment.id)}>
                  Delete
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
