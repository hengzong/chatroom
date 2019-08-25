import React from 'react';
import {Link} from "react-router-dom";
import logo from './logo.svg';
import Header from './Header';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header mode="home"/>
      <div className="main-content">
        <Link to="/login" className="link"><div className="main-text">Join the Chat Room and Share Your Story</div></Link>
      </div>
    </div>
  );
}

export default App;
