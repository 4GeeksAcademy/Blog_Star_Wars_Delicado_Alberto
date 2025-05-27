import React from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../hooks/useFavorites';

export const PlanetCard = ({ planet }) => {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const isPlanetFavorite = isFavorite(planet.uid, 'planet');

  return (
    <div className="card mb-3">
      <img 
        src={`https://starwars-visualguide.com/assets/img/planets/${planet.uid}.jpg`}
        className="card-img-top"
        alt={planet.name}
        onError={(e) => {
          e.target.src = 'https://starwars-visualguide.com/assets/img/placeholder.jpg';
        }}
      />
      <div className="card-body">
        <h5 className="card-title">{planet.name}</h5>
        <div className="d-flex justify-content-between align-items-center">
          <Link to={`/planet/${planet.uid}`} className="btn btn-primary">
            Learn more!
          </Link>
          <button 
            className={`btn ${isPlanetFavorite ? 'btn-danger' : 'btn-outline-danger'}`}
            onClick={() => {
              isPlanetFavorite
                ? removeFavorite(planet.uid, 'planet')
                : addFavorite(planet, 'planet');
            }}
          >
            <i className={`fas fa-heart`}></i>
          </button>
        </div>
      </div>
    </div>
  );
}; 