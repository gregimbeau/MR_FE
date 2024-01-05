import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./App.css";
import { REACT_APP_API_URL } from "./config";


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
          `${REACT_APP_API_URL}/vendors`
        );
        const buyersResponse = await axios.get(
          `${REACT_APP_API_URL}/buyers`
        );
        setVendors(vendorsResponse.data);
        setBuyers(buyersResponse.data);
      } catch (error) {
        console.error("Error fetching vendors and buyers: ", error);
      }
    };
    fetchVendorsAndBuyers();
  }, []);

  const handleVendorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setVendorId(e.target.value);
  };

  const handleBuyerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBuyerId(e.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/appointments`,
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
      navigate("/appointments"); // Navigate to the appointments list
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 400) {
          // Custom message for overlapping appointments
          alert(
            "Error: The appointment times overlap with an existing appointment."
          );
        } else {
          // General error message for other types of errors
          alert(
            `Error creating appointment: ${
              error.response.data.message || "Please try again later."
            }`
          );
        }
      } else {
        console.error("Error submitting form: ", error);
        alert("An unexpected error occurred. Please try again later.");
      }
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
          value={vendorId.toString()}
          onChange={handleVendorChange}
          className='form-input'
          data-testid='vendor-select'>
          <option value=''>Select Vendor</option>
          {vendors.map((vendor) => (
            <option key={vendor.id} value={vendor.id}>
              {vendor.name}
            </option>
          ))}
        </select>
        <select
          value={buyerId.toString()}
          onChange={handleBuyerChange}
          className='form-input'
          data-testid='buyer-select'>
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
          className='form-input'
          data-testid='type-select'>
          <option value=''>Select Type</option>
          <option value='virtual'>Virtual</option>
          <option value='physical'>Physical</option>
        </select>

        {type === "physical" && (
          <input
            type='text'
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder='Location'
            className='form-input'
          />
        )}
        <p>Start</p>
        <input
          type='datetime-local'
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className='form-input'
          data-testid='start-time'
        />
        <p>End</p>

        <input
          type='datetime-local'
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className='form-input'
          data-testid='end-time'
        />
        <button type='submit' className='form-button'>
          Submit
        </button>
      </form>
    </div>
  );
};

export default AppointmentForm;
