'use client';

import { useState, useEffect } from 'react';
import { QA, Topic, Rabbi } from '@/types';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const defaultQA: Partial<QA> = {
  topic: 'נדה',
  question: '',
  answer: '',
  authorId: '',
  createdAt: new Date().toISOString()
};

const QAManager = () => {
  const [qas, setQAs] = useState<QA[]>([]);
  const [rabbis, setRabbis] = useState<Rabbi[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentQA, setCurrentQA] = useState<Partial<QA>>(defaultQA);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadRabbis();
  }, []);

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
    }
  };

  const validateForm = () => {
    if (!currentQA.topic) {
      setError('נא לבחור נושא');
      return false;
    }
    if (!currentQA.question || currentQA.question.trim() === '') {
      setError('נא להזין שאלה');
      return false;
    }
    if (!currentQA.answer || currentQA.answer.trim() === '') {
      setError('נא להזין תשובה');
      return false;
    }
    if (!currentQA.authorId) {
      setError('נא לבחור רב');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const qaData = {
        ...currentQA,
        createdAt: currentQA.createdAt || new Date().toISOString()
      };

      const response = currentQA.id
        ? await fetch('/api/qa', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: currentQA.id, ...qaData }),
          })
        : await fetch('/api/qa', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(qaData),
          });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'שגיאה בשמירת השאלה');
      }

      setIsEditing(false);
      setCurrentQA(defaultQA);
      loadQAs();
    } catch (error) {
      console.error('Error saving QA:', error);
      setError(error instanceof Error ? error.message : 'שגיאה בשמירת השאלה');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק שאלה זו?')) return;
    try {
      const response = await fetch('/api/qa', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        throw new Error('שגיאה במחיקת השאלה');
      }
      loadQAs();
    } catch (error) {
      console.error('Error deleting QA:', error);
      setError('שגיאה במחיקת השאלה');
    }
  };

  const loadQAs = async () => {
    try {
      const response = await fetch('/api/qa');
      if (!response.ok) {
        throw new Error('שגיאה בטעינת השאלות');
      }
      const data = await response.json();
      setQAs(data || []);
    } catch (error) {
      console.error('Error loading QAs:', error);
      setError('שגיאה בטעינת השאלות');
      setQAs([]);
    }
  };

  useEffect(() => {
    loadQAs();
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => {
          setCurrentQA(defaultQA);
          setIsEditing(true);
          setError(null);
        }}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
      >
        <Plus size={20} />
        הוסף שאלה חדשה
      </button>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {isEditing && (
        <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-4 rounded">
          <div>
            <label className="block text-sm font-medium text-gray-700">נושא</label>
            <select
              value={currentQA.topic || ''}
              onChange={(e) => setCurrentQA(prev => ({ ...prev, topic: e.target.value as Topic }))}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm"
              required
            >
              {(['נדה', 'שבת', 'בשר בחלב', 'טבילת כלים', 'ברכות', 'תפילה', 'חגים', 'חושן משפט'] as Topic[]).map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">רב</label>
            <select
              value={currentQA.authorId || ''}
              onChange={(e) => setCurrentQA(prev => ({ ...prev, authorId: e.target.value }))}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm"
              required
            >
              <option value="">בחר רב</option>
              {rabbis.map((rabbi) => (
                <option key={rabbi.id} value={rabbi.id}>
                  הרב {rabbi.firstName} {rabbi.lastName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">שאלה</label>
            <textarea
              value={currentQA.question || ''}
              onChange={(e) => setCurrentQA(prev => ({ ...prev, question: e.target.value }))}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">תשובה</label>
            <textarea
              value={currentQA.answer || ''}
              onChange={(e) => setCurrentQA(prev => ({ ...prev, answer: e.target.value }))}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm"
              rows={6}
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setCurrentQA(defaultQA);
              }}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              ביטול
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {isSubmitting ? 'שומר...' : currentQA.id ? 'עדכן' : 'הוסף'} שאלה
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {qas.map((qa) => {
          const author = rabbis.find(r => r.id === qa.authorId);
          return (
            <div key={qa.id} className="border rounded-lg p-4 bg-white">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                      {qa.topic}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {new Date(qa.createdAt).toLocaleDateString('he-IL')}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-primary-900 mb-2">
                    {qa.question}
                  </h3>
                  <div className="prose prose-sm max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: qa.answer }} />
                  </div>
                  {author && (
                    <p className="mt-2 text-sm text-gray-500">
                      נכתב ע"י: הרב {author.firstName} {author.lastName}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setCurrentQA(qa);
                      setIsEditing(true);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(qa.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QAManager;
