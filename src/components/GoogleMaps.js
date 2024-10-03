import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';

const libraries = ["places"];

const mapContainerStyle = {
  height: "100%", // Adjusts to parent container
  width: "100%" // Adjusts to parent container
};

const center = {
  lat: 39.882461,
  lng: -3.971784
};

const GoogleMaps = ({ onLocationChange, onAddressChange }) => {
  const [position, setPosition] = useState(center);
  const [autocomplete, setAutocomplete] = useState(null);

  // State to hold the address details
  const [streetName, setStreetName] = useState('');
  const [streetNumber, setStreetNumber] = useState('');
  const [floor, setFloor] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState(''); // State for the country

  useEffect(() => {
    // Notify the parent component about the full address
    const fullAddress = `${streetName} ${streetNumber} ${floor} ${postalCode} ${country}`.trim();
    onAddressChange(fullAddress);
  }, [streetName, streetNumber, floor, postalCode, country, onAddressChange]);

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const newPosition = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        };
        setPosition(newPosition);
        if (onLocationChange) {
          onLocationChange(newPosition); // Notify parent about the new location
        }

        // Actualizar la dirección completa en el input
        setStreetName(place.formatted_address || ''); // Usar formatted_address para capturar la dirección completa

        // Optionally, update other address components as before
        const addressComponents = place.address_components;
        if (addressComponents) {
          const streetNumberComponent = addressComponents.find(component =>
            component.types.includes("street_number")
          );
          const postalCodeComponent = addressComponents.find(component =>
            component.types.includes("postal_code")
          );
          const countryComponent = addressComponents.find(component =>
            component.types.includes("country")
          );
          if (streetNumberComponent) {
            setStreetNumber(streetNumberComponent.long_name);
          }
          if (postalCodeComponent) {
            setPostalCode(postalCodeComponent.long_name);
          }
          if (countryComponent) {
            setCountry(countryComponent.long_name); // Update the country state
          }
        }
      }
    }
  };

  const mapOptions = {
    fullscreenControl: false,
    mapTypeControl: false,
    streetViewControl: false,
    zoomControl: false,
    scaleControl: false,
    gestureHandling: 'cooperative', // Allows basic interaction
  };

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyDVnUL6xDq5S9w5Hw6apAOZn8Nyui5imc0" // Replace with your Google Maps API key
      libraries={libraries}
    >
      <div className="google-maps">
        <Autocomplete
          onLoad={(autocomplete) => setAutocomplete(autocomplete)}
          onPlaceChanged={onPlaceChanged}
        >
          <input
            type="text"
            placeholder="Nombre de la calle:"
            className="map-search-input"
            value={streetName}
            onChange={(e) => setStreetName(e.target.value)} // Update state on change
          />
        </Autocomplete>
        <div className='more-info'>
          <input
            type="text"
            placeholder="Numero:"
            className="map-search-input"
            value={streetNumber}
            onChange={(e) => setStreetNumber(e.target.value)} // Update state on change
          />
          <input
            type="text"
            placeholder="Piso / Puerta:"
            className="map-search-input"
            value={floor}
            onChange={(e) => setFloor(e.target.value)} // Update state on change
          />
        </div>
        <div className='more-info'>
          <input
            type="text"
            placeholder="Codigo postal:"
            className="map-search-input"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)} // Update state on change
          />
          <input
            type="text"
            placeholder="Pais:"
            className="map-search-input"
            value={country}
            onChange={(e) => setCountry(e.target.value)} // Update state on change
          />
        </div>
        <div className="map-container">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={position}
            zoom={14}
            options={mapOptions}
          >
            <Marker
              position={position}
              icon="http://maps.google.com/mapfiles/ms/icons/red-dot.png" // Red pin icon URL
            />
          </GoogleMap>
        </div>

        {/* Display the concatenated address */}
        <div className="shipping-address">
          <p>{`${streetName} ${streetNumber} ${floor} ${postalCode} ${country}`.trim() || 'Introduce tu dirección'}</p> {/* Show a prompt if no address */}
        </div>
      </div>
    </LoadScript>
  );
};

export default GoogleMaps;
