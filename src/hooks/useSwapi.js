import { useEffect } from 'react';
import useGlobalReducer from './useGlobalReducer';
import { fetchPeople, fetchVehicles, fetchPlanets } from '../services/swapi';

const useSwapi = () => {
  const { store, dispatch } = useGlobalReducer();

  const loadPeople = async () => {
    try {
      dispatch({ type: 'set_loading', payload: true });
      const people = await fetchPeople();
      dispatch({ type: 'set_people', payload: people });
      return true;
    } catch (error) {
      console.error('Error loading people:', error);
      dispatch({ type: 'set_error', payload: 'Error loading people' });
      return false;
    } finally {
      dispatch({ type: 'set_loading', payload: false });
    }
  };

  const loadVehicles = async () => {
    try {
      dispatch({ type: 'set_loading', payload: true });
      const vehicles = await fetchVehicles();
      dispatch({ type: 'set_vehicles', payload: vehicles });
      return true;
    } catch (error) {
      console.error('Error loading vehicles:', error);
      dispatch({ type: 'set_error', payload: 'Error loading vehicles' });
      return false;
    } finally {
      dispatch({ type: 'set_loading', payload: false });
    }
  };

  const loadPlanets = async () => {
    try {
      dispatch({ type: 'set_loading', payload: true });
      const planets = await fetchPlanets();
      dispatch({ type: 'set_planets', payload: planets });
      return true;
    } catch (error) {
      console.error('Error loading planets:', error);
      dispatch({ type: 'set_error', payload: 'Error loading planets' });
      return false;
    } finally {
      dispatch({ type: 'set_loading', payload: false });
    }
  };

  // Cargar los datos secuencialmente
  useEffect(() => {
    const loadAllData = async () => {
      dispatch({ type: 'set_error', payload: null }); // Limpiar errores anteriores
      
      // Cargar todos los recursos en paralelo con un pequeño offset
      Promise.all([
        loadPeople(),
        new Promise(r => setTimeout(r, 500)).then(() => loadVehicles()),
        new Promise(r => setTimeout(r, 1000)).then(() => loadPlanets())
      ]).catch(error => {
        console.error('Error loading resources:', error);
      });
    };

    loadAllData();
  }, []);

  return {
    people: store.people || [],
    vehicles: store.vehicles || [],
    planets: store.planets || [],
    isLoading: store.isLoading,
    error: store.error,
    loadPeople,
    loadVehicles,
    loadPlanets
  };
};

export { useSwapi }; 