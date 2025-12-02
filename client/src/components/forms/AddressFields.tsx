import React from 'react';

interface AddressComponents {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

interface AddressFieldsProps {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  onChange: (field: keyof AddressComponents, value: string) => void;
}

const AddressFields: React.FC<AddressFieldsProps> = ({
  street,
  city,
  state,
  zipCode,
  onChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Street Address
        </label>
        <input
          type="text"
          value={street}
          onChange={(e) => onChange('street', e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="123 Main St"
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

export default AddressFields;
