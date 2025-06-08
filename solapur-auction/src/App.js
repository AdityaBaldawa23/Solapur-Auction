// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Admin from './Components/Admin';
import AdminDashboard from './Pages/TeamPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/admin' element={<Admin />} />
        <Route path='/team' element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
