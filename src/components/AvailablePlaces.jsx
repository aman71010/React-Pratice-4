import { useEffect, useState } from 'react';

import Places from './Places.jsx';
import Error from './Error.jsx';
import { sortPlacesByDistance } from '../loc.js';
import { fetchAllPlaces } from '../https.js';

export default function AvailablePlaces({ onSelectPlace }) {
  const [ isFetching, setIsFetching ] = useState(false);
  const [ availablePlaces, setAvailablePlaces ] = useState([]);
  const [ error, setError ] = useState();

  useEffect(() => {
    async function fetchPlaces() {
      setIsFetching(true);
      try {
        const places = await fetchAllPlaces();

        navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortPlacesByDistance(
            places, 
            position.coords.latitude,
            position.coords.longitude
          );
          setAvailablePlaces(sortedPlaces);
          setIsFetching(false);
        })
      } catch(err) {
        setError({message: 
          err.message || 'Could not fetch places, please try again later'
        });
        setIsFetching(false);
      }
    }
    fetchPlaces();
  }, []);

  if(error){
    return <Error title="An Error has occured!" message={error.message} />
  }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      loadingText={"Loading places data..."}
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
