import axios from 'axios'
import { useEffect, useState } from 'react'

export default function useLocation() {
  const [userLocation, setUserLocation] = useState('')
  const [userLocationIsLoading, setUserLocationIsLoading] = useState(true)
  //create loading state to give user feedback, that the location is still being fetched

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      const lat = position.coords.latitude
      const lon = position.coords.longitude

      axios
        .get(
          `https://eu1.locationiq.com/v1/reverse.php?key=pk.bdf564897f7c87e4a19e06e928604689&lat=${lat}&lon=${lon}&format=json`
        )
        .then((response) => response.data)
        .then((data) => setUserLocation(data.display_name))
        .catch((error) => console.log(error.message))
        .finally(setUserLocationIsLoading(false))
    })

    //if no fetching o the location is possible, the input field will eventually show, so the user can manually type a location
    setTimeout(function () {
      setUserLocationIsLoading(false)
    }, 10000)
  }, [])
  return [userLocation, userLocationIsLoading]
}
