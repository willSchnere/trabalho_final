import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Ships from './components/Ships/Ships';
import Viagem from './components/Ships/Viagem';
import EditShip from './components/Ships/EditShip'; 
import ViewTrips from './components/Ships/ViewTrips';



const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/ships" element={<Ships />} />
        <Route path="/edit-ship" element={<EditShip />} /> {/* Rota para a página de edição */}
        <Route path="/viagem" element={<Viagem />} />
        <Route path="/ships/:id/viagens" element={<ViewTrips />} />
      </Routes>
    </Router>
  );
};

export default App;
