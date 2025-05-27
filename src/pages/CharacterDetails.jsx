import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchDetails } from '../services/swapi';
import { useFavorites } from '../hooks/useFavorites';

export const CharacterDetails = () => {
  const { id } = useParams();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    const loadCharacter = async () => {
      try {
        const data = await fetchDetails(`https://swapi.tech/api/people/${id}`);
        setCharacter(data);
        setLoading(false);
      } catch (err) {
        setError('Error loading character details');
        setLoading(false);
      }
    };

    loadCharacter();
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

  if (!character) return null;

  const isCharacterFavorite = isFavorite(id, 'character');

  return (
    <div className="container py-4">
      <div className="card">
        <div className="row g-0">
          <div className="col-md-4">
            <img
              src={`https://starwars-visualguide.com/assets/img/characters/${id}.jpg`}
              className="img-fluid rounded-start"
              alt={character.name}
              onError={(e) => {
                e.target.src = 'https://starwars-visualguide.com/assets/img/placeholder.jpg';
              }}
            />
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="card-title">{character.name}</h2>
                <button 
                  className={`btn ${isCharacterFavorite ? 'btn-danger' : 'btn-outline-danger'}`}
                  onClick={() => {
                    isCharacterFavorite
                      ? removeFavorite(id, 'character')
                      : addFavorite({ uid: id, name: character.name }, 'character');
                  }}
                >
                  <i className="fas fa-heart"></i>
                </button>
              </div>
              <ul className="list-group list-group-flush mt-3">
                <li className="list-group-item"><strong>Height:</strong> {character.height} cm</li>
                <li className="list-group-item"><strong>Mass:</strong> {character.mass} kg</li>
                <li className="list-group-item"><strong>Hair Color:</strong> {character.hair_color}</li>
                <li className="list-group-item"><strong>Skin Color:</strong> {character.skin_color}</li>
                <li className="list-group-item"><strong>Eye Color:</strong> {character.eye_color}</li>
                <li className="list-group-item"><strong>Birth Year:</strong> {character.birth_year}</li>
                <li className="list-group-item"><strong>Gender:</strong> {character.gender}</li>
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