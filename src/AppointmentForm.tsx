import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./App.css";

type Vendor = {
  id: number;
  name: string;
};

type Buyer = {
  id: number;
  name: string;
  company_name: string;
};

const AppointmentForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [buyerId, setBuyerId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchVendorsAndBuyers = async () => {
      try {
        const vendorsResponse = await axios.get(
          "http://localhost:3000/api/vendors"
        );
        const buyersResponse = await axios.get(
          "http://localhost:3000/api/buyers"
        );
        setVendors(vendorsResponse.data);
        setBuyers(buyersResponse.data);
      } catch (error) {
        console.error("Error fetching vendors and buyers: ", error);
      }
    };
    fetchVendorsAndBuyers();
  }, []);

const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault();
  try {
    const response = await axios.post(
      "http://localhost:3000/api/appointments",
      {
        title,
        type,
        location,
        vendor_id: parseInt(vendorId),
        buyer_id: parseInt(buyerId),
        start_time: startTime,
        end_time: endTime,
      }
    );
    console.log(response.data);
    alert("Appointment created successfully!");
    navigate("/appointments"); // Navigate to the appointment list
  } catch (error) {
    console.error("Error submitting form: ", error);
    alert("Error creating appointment");
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
          value={vendorId}
          onChange={(e) => setVendorId(e.target.value)}
          className='form-input'>
          <option value=''>Select Vendor</option>
          {vendors.map((vendor) => (
            <option key={vendor.id} value={vendor.id}>
              {vendor.name}
            </option>
          ))}
        </select>
        <select
          value={buyerId}
          onChange={(e) => setBuyerId(e.target.value)}
          className='form-input'>
          <option value=''>Select Buyer</option>
          {buyers.map((buyer) => (
            <option key={buyer.id} value={buyer.id}>
              {buyer.name}
            </option>
          ))}
        </select>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className='form-input'>
          <option value=''>Select Type</option>
          <option value='virtual'>Virtual</option>
          <option value='physical'>Physical</option>
        </select>

        <input
          type='text'
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder='Location'
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
