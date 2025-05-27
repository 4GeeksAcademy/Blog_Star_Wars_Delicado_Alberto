import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchDetails } from '../services/swapi';
import { useFavorites } from '../hooks/useFavorites';

export const PlanetDetails = () => {
  const { id } = useParams();
  const [planet, setPlanet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    const loadPlanet = async () => {
      try {
        const data = await fetchDetails(`https://swapi.tech/api/planets/${id}`);
        setPlanet(data);
        setLoading(false);
      } catch (err) {
        setError('Error loading planet details');
        setLoading(false);
      }
    };

    loadPlanet();
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

  if (!planet) return null;

  const isPlanetFavorite = isFavorite(id, 'planet');

  return (
    <div className="container py-4">
      <div className="card">
        <div className="row g-0">
          <div className="col-md-4">
            <img
              src={`https://starwars-visualguide.com/assets/img/planets/${id}.jpg`}
              className="img-fluid rounded-start"
              alt={planet.name}
              onError={(e) => {
                e.target.src = 'https://starwars-visualguide.com/assets/img/placeholder.jpg';
              }}
            />
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="card-title">{planet.name}</h2>
                <button 
                  className={`btn ${isPlanetFavorite ? 'btn-danger' : 'btn-outline-danger'}`}
                  onClick={() => {
                    isPlanetFavorite
                      ? removeFavorite(id, 'planet')
                      : addFavorite({ uid: id, name: planet.name }, 'planet');
                  }}
                >
                  <i className="fas fa-heart"></i>
                </button>
              </div>
              <ul className="list-group list-group-flush mt-3">
                <li className="list-group-item"><strong>Climate:</strong> {planet.climate}</li>
                <li className="list-group-item"><strong>Terrain:</strong> {planet.terrain}</li>
                <li className="list-group-item"><strong>Population:</strong> {planet.population}</li>
                <li className="list-group-item"><strong>Diameter:</strong> {planet.diameter} km</li>
                <li className="list-group-item"><strong>Rotation Period:</strong> {planet.rotation_period} hours</li>
                <li className="list-group-item"><strong>Orbital Period:</strong> {planet.orbital_period} days</li>
                <li className="list-group-item"><strong>Gravity:</strong> {planet.gravity}</li>
                <li className="list-group-item"><strong>Surface Water:</strong> {planet.surface_water}%</li>
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