import React, { useEffect, useState } from 'react'; // Importa useEffect e useState
import { useParams, useNavigate } from 'react-router-dom'; // Importa useParams e useNavigate
import axios from 'axios'; // Importa axios
import'./ViewTrips.css';
const ViewTrips = () => {
    const { id } = useParams();
    const [trips, setTrips] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
  
    useEffect(() => {
      const fetchTrips = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/');
          return;
        }
  
        try {
          const response = await axios.get(`http://localhost:4000/ships/${id}/viagens`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setTrips(response.data);
        } catch (error) {   
          console.error('Erro ao buscar viagens:', error);
          setError('Erro ao buscar viagens');
        }
      };
  
      fetchTrips();
    }, [id, navigate]);
  
    return (
      <div  className="viagi abacaxi">
        <h2>Viagens do Navio</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {trips.length > 0 ? (
          <ul>
            
            {trips.map((trip) => (
              <li key={trip.id}>
                <p><strong>Quantidade de Carga:</strong> {trip.cargo_quantity}</p>
                <p><strong>Tipo de Carga:</strong> {trip.cargo_type}</p>
                <p><strong>Data de Chegada:</strong> {trip.arrival_date}</p>
                <p><strong>Equipamento:</strong> {trip.equipment}</p>
                <p><strong>Documento:</strong> {trip.cargo_document}</p>
                <p><strong>Tempo de Estadia:</strong> {trip.stay_time}</p>
                <p><strong>Telefone do Representante:</strong> {trip.representative_phone}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhuma viagem encontrada para este navio.</p>
        )}
        <button onClick={() => navigate('/ships')}>Voltar</button>
      </div>
    );
  };
  
  export default ViewTrips;
  