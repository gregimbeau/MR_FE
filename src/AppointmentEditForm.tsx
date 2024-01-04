import React, { useState, useEffect } from "react";
import axios from "axios";

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

type AppointmentEditFormProps = {
  appointment: Appointment;
  closeEditForm: () => void;
  refreshAppointments: () => void;
};

const AppointmentEditForm: React.FC<AppointmentEditFormProps> = ({
  appointment,
  closeEditForm,
  refreshAppointments,
}) => {
  const [title, setTitle] = useState(appointment.title);
  const [type, setType] = useState(appointment.type);
  const [location, setLocation] = useState(appointment.location);
  const [hostId, setHostId] = useState(appointment.host_id);
  const [clientId, setClientId] = useState(appointment.client_id);
  const [startTime, setStartTime] = useState(appointment.start_time);
  const [endTime, setEndTime] = useState(appointment.end_time);

  useEffect(() => {}, [appointment]);

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:3000/api/appointments/${appointment.id}`,
        {
          title,
          type,
          location,
          host_id: hostId,
          client_id: clientId,
          start_time: startTime,
          end_time: endTime,
        }
      );
      console.log(response.data);
      refreshAppointments(); // Refresh the appointment list
      closeEditForm(); // Close the edit form
      window.scrollTo(0, 0); // Scroll to the top
    } catch (error) {
      console.error("Error updating appointment: ", error);
    }
  };
  return (
    <div className='appointment-form-container'>
      <form onSubmit={handleSubmit} className='appointment-form'>
        <input
          type='text'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder='Title'
          className='form-input'
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className='form-input'>
          <option value=''>Select Type</option>
          <option value='ponctual'>Ponctual</option>
          <option value='recurring'>Recurring</option>
          <option value='other'>Other</option>
        </select>
        <input
          type='text'
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder='Location'
          className='form-input'
        />
        <input
          type='text'
          value={hostId}
          onChange={(e) =>
            setHostId(e.target.value ? Number(e.target.value) : 0)
          }
          placeholder='Host ID'
          className='form-input'
        />

        <input
          type='text'
          value={clientId}
          onChange={(e) =>
            setClientId(e.target.value ? Number(e.target.value) : 0)
          }
          placeholder='Client ID'
          className='form-input'
        />
        <input
          type='datetime-local'
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className='form-input'
        />
        <input
          type='datetime-local'
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className='form-input'
        />
        <button type='submit' className='form-button'>
          Update
        </button>
        <button type='button' className='form-button' onClick={closeEditForm}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AppointmentEditForm;
