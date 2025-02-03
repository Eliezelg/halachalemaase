'use client';

import { useState, useEffect } from 'react';
import { QA, Topic } from '@/types';
import TopicFilter from '@/components/TopicFilter';
import QuestionCard from '@/components/QuestionCard';

const QuestionsPage = () => {
  const [selectedTopic, setSelectedTopic] = useState<Topic | 'all'>('all');
  const [questions, setQuestions] = useState<QA[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch('/api/qa');
        if (!response.ok) {
          throw new Error('Failed to load questions');
        }
        const data = await response.json();
        setQuestions(data);
      } catch (err) {
        console.error('Error loading questions:', err);
        setError('שגיאה בטעינת השאלות');
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  const filteredQuestions = selectedTopic === 'all'
    ? questions
    : questions.filter(q => q.topic === selectedTopic);

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
          שאלות ותשובות
        </h1>

        <div className="max-w-4xl mx-auto">
          <TopicFilter
            selectedTopic={selectedTopic}
            onTopicChange={setSelectedTopic}
          />

          <div className="mt-8 space-y-6">
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((qa) => (
                <QuestionCard key={qa.id} qa={qa} />
              ))
            ) : (
              <div className="text-center text-gray-500">
                לא נמצאו שאלות התואמות את החיפוש
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default QuestionsPage;
