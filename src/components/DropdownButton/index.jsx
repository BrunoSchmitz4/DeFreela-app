import React, { useState } from 'react';
import styles from './DropdownButton.module.css';
import { Link } from 'react-router-dom';

function DropdownButton({ routes }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = () => setIsOpen(true);
  const handleMouseLeave = () => setIsOpen(false);
  const toggleDropdown = () => setIsOpen(prev => !prev);

  return (
    <div
      className={styles.dropdownContainer}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className={styles.dropdownToggle} onClick={toggleDropdown}>
        Menu
      </button>
      <ul className={`${styles.dropdownMenu} ${isOpen ? styles.open : ''}`}>
        {routes.map((route, index) => (
          <li key={index}>
            <Link to={route.path} onClick={() => setIsOpen(false)}>
              {route.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DropdownButton;
