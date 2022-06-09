import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

const Header = () => (
  <header>
    <Link to='/events/'>
      <h1>Event Manager</h1>
    </Link>
  </header>
);

export default Header;