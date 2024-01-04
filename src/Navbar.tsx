import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <div className='navbar'>
      <nav>
        <ul>
          <li>
            <Link to='/'>Home</Link>
          </li>
          <li>
            <Link to='/appointments'>Appointments</Link>{" "}
          </li>{" "}
          <li>
            <Link to='/new-appointment' className='button'>
              New Appointment
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
