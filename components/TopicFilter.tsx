'use client';

import { Topic } from '@/types';

const topics: Topic[] = [
  'נדה',
  'שבת',
  'בשר בחלב',
  'טבילת כלים',
  'ברכות',
  'תפילה',
  'חגים',
  'חושן משפט'
];

interface TopicFilterProps {
  selectedTopic: Topic | 'all';
  onTopicChange: (topic: Topic | 'all') => void;
}

const TopicFilter: React.FC<TopicFilterProps> = ({ selectedTopic, onTopicChange }) => {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <button
        onClick={() => onTopicChange('all')}
        className={`px-4 py-2 rounded-full transition-colors ${
          selectedTopic === 'all'
            ? 'bg-primary-600 text-white'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
        }`}
      >
        הכל
      </button>
      {topics.map((topic) => (
        <button
          key={topic}
          onClick={() => onTopicChange(topic)}
          className={`px-4 py-2 rounded-full transition-colors ${
            selectedTopic === topic
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
          }`}
        >
          {topic}
        </button>
      ))}
    </div>
  );
};

export default TopicFilter;
