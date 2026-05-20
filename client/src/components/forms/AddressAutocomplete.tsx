// Address input with Google Places Autocomplete. Parses the selected place into
// individual street, city, state, and zip code fields and calls back with the result.
import React, { useRef, useEffect, useCallback } from 'react';
import { useGoogleMaps } from '../../context/GoogleMapsContext';

interface AddressComponents {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

interface AddressAutocompleteProps {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  onChange: (field: keyof AddressComponents, value: string) => void;
  onAddressSelect?: (components: AddressComponents) => void;
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  street,
  city,
  state,
  zipCode,
  onChange,
  onAddressSelect,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const onChangeRef = useRef(onChange);
  const onAddressSelectRef = useRef(onAddressSelect);

  const { isLoaded } = useGoogleMaps();

  // Keep refs updated
  useEffect(() => {
    onChangeRef.current = onChange;
    onAddressSelectRef.current = onAddressSelect;
  }, [onChange, onAddressSelect]);

  // Update input value when street prop changes from outside
  useEffect(() => {
    if (inputRef.current && inputRef.current.value !== street) {
      inputRef.current.value = street;
    }
  }, [street]);

  const handlePlaceChanged = useCallback(() => {
    try {
      if (autocompleteRef.current) {
        const place = autocompleteRef.current.getPlace();

        if (!place.address_components) {
          return;
        }

        let streetNumber = '';
        let route = '';
        let newCity = '';
        let newState = '';
        let newZipCode = '';

        place.address_components.forEach((component) => {
          const types = component.types;

          if (types.includes('street_number')) {
            streetNumber = component.long_name;
          }
          if (types.includes('route')) {
            route = component.long_name;
          }
          if (types.includes('locality')) {
            newCity = component.long_name;
          }
          if (types.includes('administrative_area_level_1')) {
            newState = component.short_name;
          }
          if (types.includes('postal_code')) {
            newZipCode = component.long_name;
          }
        });

        const newStreet = streetNumber && route ? `${streetNumber} ${route}` : route;

        // Clear the input field first to prevent the full address from showing
        if (inputRef.current) {
          inputRef.current.value = '';
        }

        // Update individual fields using the ref
        onChangeRef.current('street', newStreet);
        onChangeRef.current('city', newCity);
        onChangeRef.current('state', newState);
        onChangeRef.current('zipCode', newZipCode);

        const components: AddressComponents = {
          street: newStreet,
          city: newCity,
          state: newState,
          zipCode: newZipCode,
        };

        // Call the callback with all components
        if (onAddressSelectRef.current) {
          onAddressSelectRef.current(components);
        }
      }
    } catch (error) {
      console.error('Error handling place selection:', error);
    }
  }, []);

  useEffect(() => {
    if (isLoaded && inputRef.current && !autocompleteRef.current) {
      try {
        const input = inputRef.current;

        // Initialize the Autocomplete
        autocompleteRef.current = new google.maps.places.Autocomplete(input, {
          types: ['address'],
          componentRestrictions: { country: 'us' },
          fields: ['address_components', 'formatted_address'],
        });

        // Prevent default form submission on Enter
        const handleKeyDown = (e: KeyboardEvent) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            // Try to trigger place_changed if Enter was pressed
            setTimeout(() => {
              handlePlaceChanged();
            }, 100);
          }
        };

        input.addEventListener('keydown', handleKeyDown);

        // Add listener for place selection
        google.maps.event.addListener(autocompleteRef.current, 'place_changed', () => {
          handlePlaceChanged();
        });

        return () => {
          input.removeEventListener('keydown', handleKeyDown);
          if (autocompleteRef.current) {
            google.maps.event.clearInstanceListeners(autocompleteRef.current);
          }
        };
      } catch (error) {
        console.error('Error initializing autocomplete:', error);
      }
    }
  }, [isLoaded, handlePlaceChanged]);

  if (!isLoaded) {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Street Address
          </label>
          <div className="w-full px-4 py-2.5 border border-gray-300 rounded-xl bg-gray-50">
            <span className="text-gray-400">Loading...</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              City
            </label>
            <div className="w-full px-4 py-2.5 border border-gray-300 rounded-xl bg-gray-50">
              <span className="text-gray-400">Loading...</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              State
            </label>
            <div className="w-full px-4 py-2.5 border border-gray-300 rounded-xl bg-gray-50">
              <span className="text-gray-400">Loading...</span>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Zip Code
          </label>
          <div className="w-full px-4 py-2.5 border border-gray-300 rounded-xl bg-gray-50">
            <span className="text-gray-400">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Street Address
        </label>
        <input
          ref={inputRef}
          type="text"
          defaultValue={street}
          onChange={(e) => onChange('street', e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Start typing an address..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            City
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => onChange('city', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Minneapolis"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            State
          </label>
          <input
            type="text"
            value={state}
            onChange={(e) => onChange('state', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="MN"
            maxLength={2}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Zip Code
        </label>
        <input
          type="text"
          value={zipCode}
          onChange={(e) => onChange('zipCode', e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="55401"
          maxLength={5}
        />
      </div>
    </div>
  );
};

export default AddressAutocomplete;
