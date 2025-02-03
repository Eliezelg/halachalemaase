'use client';

interface CityFilterProps {
  cities: string[];
  selectedCity: string;
  onCityChange: (city: string) => void;
}

const CityFilter: React.FC<CityFilterProps> = ({ cities, selectedCity, onCityChange }) => {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <button
        onClick={() => onCityChange('all')}
        className={`px-4 py-2 rounded-full transition-colors ${
          selectedCity === 'all'
            ? 'bg-primary-600 text-white'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
        }`}
      >
        כל הערים
      </button>
      {cities.map((city) => (
        <button
          key={city}
          onClick={() => onCityChange(city)}
          className={`px-4 py-2 rounded-full transition-colors ${
            selectedCity === city
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
          }`}
        >
          {city}
        </button>
      ))}
    </div>
  );
};

export default CityFilter;
