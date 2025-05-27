import React from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../hooks/useFavorites';

export const CharacterCard = ({ character }) => {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const isCharacterFavorite = isFavorite(character.uid, 'character');

  return (
    <div className="card mb-3">
      <img 
        src={`https://starwars-visualguide.com/assets/img/characters/${character.uid}.jpg`}
        className="card-img-top"
        alt={character.name}
        onError={(e) => {
          e.target.src = 'https://starwars-visualguide.com/assets/img/placeholder.jpg';
        }}
      />
      <div className="card-body">
        <h5 className="card-title">{character.name}</h5>
        <div className="d-flex justify-content-between align-items-center">
          <Link to={`/character/${character.uid}`} className="btn btn-primary">
            Learn more!
          </Link>
          <button 
            className={`btn ${isCharacterFavorite ? 'btn-danger' : 'btn-outline-danger'}`}
            onClick={() => {
              isCharacterFavorite
                ? removeFavorite(character.uid, 'character')
                : addFavorite(character, 'character');
            }}
          >
            <i className={`fas fa-heart`}></i>
          </button>
        </div>
      </div>
    </div>
  );
}; 