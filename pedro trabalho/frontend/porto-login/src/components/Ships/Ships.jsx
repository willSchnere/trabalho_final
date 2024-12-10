import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../Ships/Header';
import Footer from '../Ships/Footer';
import './Ships.css';

const Ships = () => {
  const [ships, setShips] = useState([]);
  const [newShip, setNewShip] = useState({
    nome_navio: '',
    tipo: '',
    imo_number: '',
    size: '',
    cargo_capacity: '',
  });
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  // Busca os navios na API ao carregar o componente
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    } else {
      axios
        .get('http://localhost:4000/ships', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setShips(response.data))
        .catch((error) => console.error('Erro ao obter navios', error));
    }
  }, [navigate]);
  const handleAddShip = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Usuário não autenticado');
      return;
    }
    try {
      const response = await axios.post('http://localhost:4000/ships', newShip, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Atualize a lista com o objeto completo retornado do servidor
      setShips((prevShips) => [...prevShips, response.data]);
      setNewShip({ nome_navio: '', tipo: '', imo_number: '', size: '', cargo_capacity: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Erro ao cadastrar navio', error);
      setError('Erro ao cadastrar navio');
    }
    await fetchShips();
  };
  // Função para deletar um navio
  const handleDeleteShip = async (shipId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Usuário não autenticado');
      return;
    }
    try {
      // Faz a requisição DELETE para a API
      await axios.delete(`http://localhost:4000/ships/${shipId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove o navio deletado da lista exibida
      setShips((prevShips) => prevShips.filter((ship) => ship.id !== shipId));
    } catch (error) {
      console.error('Erro ao deletar navio', error);
      setError('Erro ao deletar navio');
    }
    await fetchShips();
  };
  const fetchShips = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
    try {
      const response = await axios.get('http://localhost:4000/ships', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShips(response.data);
    } catch (error) {
      console.error('Erro ao buscar navios', error);
    }
    
  };
  return (
    <>
      <Header />
      <div className="ships-container">
        <h2 className="ships-title">Lista de Navios</h2>
        <button className="logout-button" onClick={() => navigate('/')}>
          Logout
        </button>

        <button
          className="add-ship-button"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancelar Cadastro' : 'Cadastrar Navio'}
        </button>

        {showForm && (
          <form className="add-ship-form" onSubmit={handleAddShip}>
            <div>
              <label>Nome do Navio</label>
              <input
                type="text"
                value={newShip.nome_navio}
                onChange={(e) =>
                  setNewShip({ ...newShip, nome_navio: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label>Tipo do Navio</label>
              <input
                type="text"
                value={newShip.tipo}
                onChange={(e) =>
                  setNewShip({ ...newShip, tipo: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label>Número IMO</label>
              <input
                type="text"
                value={newShip.imo_number}
                onChange={(e) =>
                  setNewShip({ ...newShip, imo_number: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label>Tamanho do Navio</label>
              <input
                type="text"
                value={newShip.size}
                onChange={(e) =>
                  setNewShip({ ...newShip, size: e.target.value })
                }
              />
            </div>
            <div>
              <label>Capacidade de Carga</label>
              <input
                type="text"
                value={newShip.cargo_capacity}
                onChange={(e) =>
                  setNewShip({ ...newShip, cargo_capacity: e.target.value })
                }
              />
            </div>
            <button type="submit" className="login-button">
              Cadastrar
            </button>
          </form>
        )}

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <ul className="ships-grid">
          {ships.length > 0 ? (
            ships.map((ship) => (
              <div key={ship.id} className="ship-card">
                <button
                  className="delete-button"
                  onClick={() => handleDeleteShip(ship.id)} // Chama a função de exclusão
                >
                  🗑
                </button>
                <img
                  src="https://portosma.com.br/wp-content/uploads/2023/03/TRIPPLE-2.jpg"
                  alt={ship.nome_navio}
                  className="ship-image"
                />
                <p className="ship-status">Status: {ship.status || 'Ativo/Indo'}</p>
                <p className="ship-date">Data: {ship.date || '12/11/2024 12:00'}</p>
                <p className="ship-imo">IMO: {ship.imo_number}</p>
                <p className="ship-size">Tamanho: {ship.size}</p>
                <p className="ship-capacity">Capacidade: {ship.cargo_capacity}</p>
                <button
                  className="action-button"
                  onClick={() => navigate('/viagem')}
                >
                  Nova viagem
                </button>
                <button
                  className="action-button"
                  onClick={() => navigate(`/ships/${ship.id}/viagens`)}
                >
                Visualizar viagens
                </button>
                <button
                  className="action-button"
                  onClick={() => navigate('/edit-ship', { state: ship })}
                >
                  Editar navio
                </button>
              </div>
            ))
          ) : (
            <p>Carregando navios...</p>
          )}
        </ul>
      </div>
      <Footer />
    </>
  );
};
export default Ships;

