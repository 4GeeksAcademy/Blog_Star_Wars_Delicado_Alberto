import useGlobalReducer from './useGlobalReducer';

export const useFavorites = () => {
  const { store, dispatch } = useGlobalReducer();

  const addFavorite = (item, type) => {
    dispatch({
      type: 'add_favorite',
      payload: {
        id: item.uid,
        name: item.name,
        type: type,
        url: item.url
      }
    });
  };

  const removeFavorite = (id, type) => {
    dispatch({
      type: 'remove_favorite',
      payload: { id, type }
    });
  };

  const isFavorite = (id, type) => {
    return store.favorites.some(fav => fav.id === id && fav.type === type);
  };

  return {
    favorites: store.favorites,
    addFavorite,
    removeFavorite,
    isFavorite
  };
}; 