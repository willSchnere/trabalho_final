import React, { useState } from 'react';
import axios from 'axios';

const CreateShip = () => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [formData, setFormData] = useState({
    nome_navio: '', 
    tipo: '', 
    imo_number: '', 
    size: '', 
    cargo_capacity: '', 
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await axios.post(
        'http://localhost:3000/ships',
        { name, type },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Navio cadastrado com sucesso!');
    } catch (error) {
      alert('Erro ao cadastrar navio');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nome do Navio"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Tipo de Navio"
        value={type}
        onChange={(e) => setType(e.target.value)}
      />
      <button type="submit">Cadastrar Navio</button>
    </form>
  );
};

export default CreateShip;
