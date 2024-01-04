import React, { useState } from "react";
import axios from "axios";
import "./App.css"; 

type AppointmentFormProps = {
};

const AppointmentForm: React.FC<AppointmentFormProps> = () => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [hostId, setHostId] = useState("");
  const [clientId, setClientId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/appointments",
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
    } catch (error) {
      console.error("Error submitting form: ", error);
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
          onChange={(e) => setHostId(e.target.value)}
          placeholder='Enter your Host ID number'
          className='form-input'
        />
        <input
          type='text'
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          placeholder='Enter your Client ID number'
          className='form-input'
        />
        <p>Start</p>
        <input
          type='datetime-local'
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className='form-input'
        />
        <p>End</p>

        <input
          type='datetime-local'
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className='form-input'
        />
        <button type='submit' className='form-button'>
          Submit
        </button>
      </form>
    </div>
  );
};

export default AppointmentForm;