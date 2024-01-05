import React, { useState, useEffect } from "react";
import axios from "axios";

type Vendor = {
  id: number;
  name: string;
};

type Buyer = {
  id: number;
  name: string;
  company_name: string;
};

type Appointment = {
  id: number;
  title: string;
  type: string;
  location: string;
  vendor_id: number;
  buyer_id: number;
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
  const [title, setTitle] = useState(appointment.title || "");
  const [type, setType] = useState(appointment.type || "");
  const [location, setLocation] = useState(appointment.location || "");
  const [vendorId, setVendorId] = useState(appointment.vendor_id || 0);
  const [buyerId, setBuyerId] = useState(appointment.buyer_id || 0);
  const [startTime, setStartTime] = useState(appointment.start_time || "");
  const [endTime, setEndTime] = useState(appointment.end_time || "");
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [buyers, setBuyers] = useState<Buyer[]>([]);

  useEffect(() => {
    const fetchVendorsAndBuyers = async () => {
      try {
        const vendorsResponse = await axios.get(
          `${
            process.env.REACT_APP_API_URL
          }/vendors`
        );
        const buyersResponse = await axios.get(
          `${
            process.env.REACT_APP_API_URL
          }/buyers`
        );
        setVendors(vendorsResponse.data);
        setBuyers(buyersResponse.data);

        // Setting selected vendor and buyer
        if (appointment.vendor_id) setVendorId(appointment.vendor_id);
        if (appointment.buyer_id) setBuyerId(appointment.buyer_id);
      } catch (error) {
        console.error("Error fetching vendors and buyers: ", error);
      }
    };

    fetchVendorsAndBuyers();
  }, [appointment]);

  const formatDateTimeLocal = (isoString: string) => {
    const date = new Date(isoString);
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 16);
  };

  useEffect(() => {
    setStartTime(formatDateTimeLocal(appointment.start_time));
    setEndTime(formatDateTimeLocal(appointment.end_time));
  }, [appointment]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Check if the selected vendorId exists in the vendors array
    const isVendorIdValid = vendors.some((vendor) => vendor.id === vendorId);

    if (!isVendorIdValid) {
      alert("Invalid Vendor selected. Please select a valid Vendor.");
      return;
    }

    // Check if the selected buyerId exists in the buyers array
    const isBuyerIdValid = buyers.some((buyer) => buyer.id === buyerId);

    if (!isBuyerIdValid) {
      alert("Invalid Buyer selected. Please select a valid Buyer.");
      return;
    }
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/appointments/${appointment.id}`,
        {
          title,
          type,
          location,
          vendor_id: vendorId,
          buyer_id: buyerId,
          start_time: startTime,
          end_time: endTime,
        }
      );
      console.log(response.data);
      alert("Appointment updated successfully!");
      refreshAppointments();
      closeEditForm();
      window.scrollTo(0, 0);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 400) {
          // Custom message for overlapping appointments
          alert(
            "Error: Appointment times overlap with an existing appointment."
          );
        } else {
          // General error message for other types of errors
          alert(
            `Error updating appointment: ${
              error.response.data.message || "Please try again later."
            }`
          );
        }
      } else {
        console.error("Error updating appointment: ", error);
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
        {/* Vendor dropdown */}
        <select
          value={vendorId}
          onChange={(e) => setVendorId(Number(e.target.value))}
          className='form-input'>
          <option value=''>Select Vendor</option>
          {vendors.map((vendor) => (
            <option key={vendor.id} value={vendor.id}>
              {vendor.name}
            </option>
          ))}
        </select>

        {/* Buyer dropdown */}
        <select
          value={buyerId}
          onChange={(e) => setBuyerId(Number(e.target.value))}
          className='form-input'>
          <option value=''>Select Buyer</option>
          {buyers.map((buyer) => (
            <option key={buyer.id} value={buyer.id}>
              {buyer.name}
            </option>
          ))}
        </select>
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
