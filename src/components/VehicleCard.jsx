import React from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../hooks/useFavorites';

export const VehicleCard = ({ vehicle }) => {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const isVehicleFavorite = isFavorite(vehicle.uid, 'vehicle');

  return (
    <div className="card mb-3">
      <img 
        src={`https://starwars-visualguide.com/assets/img/vehicles/${vehicle.uid}.jpg`}
        className="card-img-top"
        alt={vehicle.name}
        onError={(e) => {
          e.target.src = 'https://starwars-visualguide.com/assets/img/placeholder.jpg';
        }}
      />
      <div className="card-body">
        <h5 className="card-title">{vehicle.name}</h5>
        <div className="d-flex justify-content-between align-items-center">
          <Link to={`/vehicle/${vehicle.uid}`} className="btn btn-primary">
            Learn more!
          </Link>
          <button 
            className={`btn ${isVehicleFavorite ? 'btn-danger' : 'btn-outline-danger'}`}
            onClick={() => {
              isVehicleFavorite
                ? removeFavorite(vehicle.uid, 'vehicle')
                : addFavorite(vehicle, 'vehicle');
            }}
          >
            <i className={`fas fa-heart`}></i>
          </button>
        </div>
      </div>
    </div>
  );
}; 