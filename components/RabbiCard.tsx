'use client';

import { Rabbi } from '@/types';
import { Phone, MapPin } from 'lucide-react';

interface RabbiCardProps {
  rabbi: Rabbi;
}

const RabbiCard: React.FC<RabbiCardProps> = ({ rabbi }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="aspect-square relative overflow-hidden">
        <img
          src={rabbi.photo}
          alt={`הרב ${rabbi.firstName} ${rabbi.lastName}`}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-primary-800 mb-2">
          הרב {rabbi.firstName} {rabbi.lastName}
        </h3>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gray-600">
            <Phone size={18} />
            <a href={`tel:${rabbi.phone}`} className="hover:text-primary-600">
              {rabbi.phone}
            </a>
          </div>

          <div className="flex items-start gap-2 text-gray-600">
            <MapPin size={18} className="mt-1 flex-shrink-0" />
            <span>{rabbi.address}</span>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            {rabbi.topics.map((topic) => (
              <span
                key={topic}
                className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"       
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        {rabbi.description && (
          <p className="mt-4 text-gray-600">{rabbi.description}</p>
        )}
      </div>
    </div>
  );
};

export default RabbiCard;
