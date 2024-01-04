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
            <Link to='/appointments'>Appointments</Link>
          </li>
          {/* Add more navigation links as needed */}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
