import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './Ships.css';
import axios from 'axios';


const EditShip = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [shipData, setShipData] = useState(
    location.state || { nome_navio: '', imo_number: '', tipo: '', size: '', cargo_capacity: '' }
  );
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShipData({ ...shipData, [name]: value });
  };
  
  const handleSave = async () => {
    const token = localStorage.getItem('token');
  
    try {
      await axios.put(
        `http://localhost:4000/ships/${shipData.id}`,
        shipData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Navio atualizado com sucesso!');
      navigate('/ships'); // Redireciona para a lista de navios
    } catch (error) {
      console.error('Erro ao atualizar navio:', error);
      alert('Erro ao atualizar navio');
    }
  };
  const handleCancel = () => {
    navigate('/ships'); // Redirecione para a página de lista de navios
  };

  return (
    <>
      <Header />
      <div className="edit-container">
        <h2>Edição</h2>
        <form className="edit-form">
          <div>
            <label>Nome do Navio:</label>
            <input
              type="text"
              name="nome_navio"
              value={shipData.nome_navio}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Número do IMO:</label>
            <input
              type="text"
              name="imo_number"
              value={shipData.imo_number}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Tipo de navio:</label>
            <input
              type="text"
              name="tipo"
              value={shipData.tipo}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Tamanho do navio:</label>
            <input
              type="text"
              name="size"
              value={shipData.size}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Capacidade de Carga:</label>
            <input
              type="text"
              name="cargo_capacity"
              value={shipData.capacity}
              onChange={handleInputChange}
            />
          </div>
          <div className="edit-buttons">
            <button type="button" onClick={handleSave}>
              Confirmar edição
            </button>
            <button type="button" onClick={handleCancel}>
              Cancelar edição
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default EditShip;
