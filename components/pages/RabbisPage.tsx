'use client';

import { useState, useEffect } from 'react';
import { Rabbi, Topic } from '@/types';
import TopicFilter from '@/components/TopicFilter';
import RabbiCard from '@/components/RabbiCard';
import CityFilter from '@/components/CityFilter';

const RabbisPage = () => {
  const [selectedTopic, setSelectedTopic] = useState<Topic | 'all'>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [rabbis, setRabbis] = useState<Rabbi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRabbis = async () => {
      try {
        const response = await fetch('/api/rabbis');
        if (!response.ok) {
          throw new Error('Failed to load rabbis');
        }
        const data = await response.json();
        setRabbis(data);
      } catch (err) {
        console.error('Error loading rabbis:', err);
        setError('שגיאה בטעינת רשימת הרבנים');
      } finally {
        setLoading(false);
      }
    };

    loadRabbis();
  }, []);

  const filteredRabbis = rabbis.filter(rabbi => {
    const matchesTopic = selectedTopic === 'all' || rabbi.topics.includes(selectedTopic);
    const matchesCity = selectedCity === 'all' || rabbi.city === selectedCity;
    return matchesTopic && matchesCity;
  });

  const cities = Array.from(new Set(rabbis.map(rabbi => rabbi.city)));

  if (loading) {
    return (
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="animate-pulse">טוען...</div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12 text-center text-red-600">
          {error}
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center text-primary-800 mb-8">
          רבני בית ההוראה
        </h1>

        <div className="max-w-6xl mx-auto">
          <div className="space-y-6">
            <TopicFilter
              selectedTopic={selectedTopic}
              onTopicChange={setSelectedTopic}
            />
            
            <CityFilter
              cities={cities}
              selectedCity={selectedCity}
              onCityChange={setSelectedCity}
            />
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRabbis.length > 0 ? (
              filteredRabbis.map((rabbi) => (
                <RabbiCard key={rabbi.id} rabbi={rabbi} />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500">
                לא נמצאו רבנים התואמים את החיפוש
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default RabbisPage;
