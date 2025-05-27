import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchDetails } from '../services/swapi';
import { useFavorites } from '../hooks/useFavorites';

export const VehicleDetails = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    const loadVehicle = async () => {
      try {
        const data = await fetchDetails(`https://swapi.tech/api/vehicles/${id}`);
        setVehicle(data);
        setLoading(false);
      } catch (err) {
        setError('Error loading vehicle details');
        setLoading(false);
      }
    };

    loadVehicle();
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  if (!vehicle) return null;

  const isVehicleFavorite = isFavorite(id, 'vehicle');

  return (
    <div className="container py-4">
      <div className="card">
        <div className="row g-0">
          <div className="col-md-4">
            <img
              src={`https://starwars-visualguide.com/assets/img/vehicles/${id}.jpg`}
              className="img-fluid rounded-start"
              alt={vehicle.name}
              onError={(e) => {
                e.target.src = 'https://starwars-visualguide.com/assets/img/placeholder.jpg';
              }}
            />
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="card-title">{vehicle.name}</h2>
                <button 
                  className={`btn ${isVehicleFavorite ? 'btn-danger' : 'btn-outline-danger'}`}
                  onClick={() => {
                    isVehicleFavorite
                      ? removeFavorite(id, 'vehicle')
                      : addFavorite({ uid: id, name: vehicle.name }, 'vehicle');
                  }}
                >
                  <i className="fas fa-heart"></i>
                </button>
              </div>
              <ul className="list-group list-group-flush mt-3">
                <li className="list-group-item"><strong>Model:</strong> {vehicle.model}</li>
                <li className="list-group-item"><strong>Manufacturer:</strong> {vehicle.manufacturer}</li>
                <li className="list-group-item"><strong>Cost:</strong> {vehicle.cost_in_credits} credits</li>
                <li className="list-group-item"><strong>Length:</strong> {vehicle.length} m</li>
                <li className="list-group-item"><strong>Max Speed:</strong> {vehicle.max_atmosphering_speed} km/h</li>
                <li className="list-group-item"><strong>Crew:</strong> {vehicle.crew}</li>
                <li className="list-group-item"><strong>Passengers:</strong> {vehicle.passengers}</li>
                <li className="list-group-item"><strong>Cargo Capacity:</strong> {vehicle.cargo_capacity} kg</li>
              </ul>
              <div className="mt-3">
                <Link to="/" className="btn btn-primary">
                  Back to home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 