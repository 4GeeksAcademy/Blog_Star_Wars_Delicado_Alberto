export const initialStore = () => {
  return {
    people: [],
    vehicles: [],
    planets: [],
    favorites: [],
    isLoading: false,
    error: null
  }
}

export default function storeReducer(store, action = {}) {
  switch(action.type) {
    case 'set_people':
      return {
        ...store,
        people: action.payload,
        isLoading: false
      };
    
    case 'set_vehicles':
      return {
        ...store,
        vehicles: action.payload,
        isLoading: false
      };
    
    case 'set_planets':
      return {
        ...store,
        planets: action.payload,
        isLoading: false
      };
    
    case 'add_favorite':
      // Evitar duplicados
      if (store.favorites.some(fav => fav.id === action.payload.id && fav.type === action.payload.type)) {
        return store;
      }
      return {
        ...store,
        favorites: [...store.favorites, action.payload]
      };
    
    case 'remove_favorite':
      return {
        ...store,
        favorites: store.favorites.filter(
          fav => !(fav.id === action.payload.id && fav.type === action.payload.type)
        )
      };
    
    case 'set_loading':
      return {
        ...store,
        isLoading: action.payload
      };
    
    case 'set_error':
      return {
        ...store,
        error: action.payload,
        isLoading: false
      };

    default:
      return store;
  }    
}
