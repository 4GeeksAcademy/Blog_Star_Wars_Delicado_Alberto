const SWAPI_BASE_URL = 'https://swapi.tech/api';

// Cache para almacenar resultados
const cache = {
  people: null,
  vehicles: null,
  planets: null,
  details: {}
};

// Función de utilidad para esperar un tiempo determinado
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Cola de peticiones para controlar el rate limiting
let requestQueue = Promise.resolve();
let lastRequestTime = 0;

// Función para encolar peticiones con tiempo adaptativo
const enqueueRequest = async (fn) => {
  return new Promise((resolve, reject) => {
    requestQueue = requestQueue.then(async () => {
      const now = Date.now();
      const timeSinceLastRequest = now - lastRequestTime;
      const minDelay = 1000; // 1 segundo mínimo entre peticiones
      
      if (timeSinceLastRequest < minDelay) {
        await delay(minDelay - timeSinceLastRequest);
      }
      
      lastRequestTime = Date.now();
      return fn();
    })
    .then(resolve)
    .catch(reject);
  });
};

// Función para hacer fetch con reintentos y delays
async function fetchWithRetry(url, retries = 3, delayMs = 1500) {
  // Primero verificamos si tenemos el resultado en caché
  if (cache.details[url]) {
    return cache.details[url];
  }

  return enqueueRequest(async () => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url);
        
        if (response.status === 429) {
          const waitTime = delayMs * (i + 1);
          console.log(`Rate limit hit, waiting ${waitTime}ms before retry...`);
          await delay(waitTime);
          continue;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();
        try {
          const data = JSON.parse(text);
          cache.details[url] = data;
          return data;
        } catch (e) {
          console.error('Invalid JSON response:', text);
          throw new Error('Invalid JSON response');
        }
      } catch (error) {
        if (i === retries - 1) throw error;
        const waitTime = delayMs * (i + 1);
        await delay(waitTime);
      }
    }
  });
}

async function fetchResourceBatch(resourceType) {
  if (cache[resourceType]) {
    return cache[resourceType];
  }

  try {
    const data = await fetchWithRetry(`${SWAPI_BASE_URL}/${resourceType}`);
    const itemsWithDetails = [];
    const batchSize = 3; // Procesar en lotes de 3
    
    for (let i = 0; i < data.results.length; i += batchSize) {
      const batch = data.results.slice(i, i + batchSize);
      const batchPromises = batch.map(async (item) => {
        try {
          const details = await fetchWithRetry(item.url);
          return {
            ...details.result.properties,
            uid: item.uid,
            url: item.url
          };
        } catch (error) {
          console.error(`Error fetching details for ${resourceType} ${item.uid}:`, error);
          return null;
        }
      });

      // Procesar el lote en paralelo
      const results = await Promise.all(batchPromises);
      itemsWithDetails.push(...results.filter(Boolean));
      
      // Pequeña pausa entre lotes si no es el último
      if (i + batchSize < data.results.length) {
        await delay(1000);
      }
    }
    
    cache[resourceType] = itemsWithDetails;
    return itemsWithDetails;
  } catch (error) {
    console.error(`Error fetching ${resourceType}:`, error);
    throw error;
  }
}

export const fetchPeople = () => fetchResourceBatch('people');
export const fetchVehicles = () => fetchResourceBatch('vehicles');
export const fetchPlanets = () => fetchResourceBatch('planets');

export const fetchDetails = async (url) => {
  try {
    if (cache.details[url]) {
      return {
        ...cache.details[url].result.properties,
        uid: cache.details[url].result.uid
      };
    }

    const data = await fetchWithRetry(url);
    return {
      ...data.result.properties,
      uid: data.result.uid
    };
  } catch (error) {
    console.error('Error fetching details:', error);
    throw error;
  }
}; 