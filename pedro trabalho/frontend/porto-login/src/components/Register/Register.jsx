import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../Register/Header'; // Importando o Header
import Footer from '../Register/Footer'; // Importando o Footer
import './Register.css'; // Estilo próprio para Register

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccessMessage('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    try {
      await axios.post('http://localhost:4000/register', {
        username,
        password,
      });

      setSuccessMessage('Usuário registrado com sucesso! Faça login.');
      setUsername('');
      setPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      setError('Erro ao registrar usuário');
    }
  };

  return (
    <div className="register-container">
      <Header />
      <div className="content-container">
        <h2>Registro</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        <form onSubmit={handleSubmit} className="register-form">
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="register-button">Registrar</button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
