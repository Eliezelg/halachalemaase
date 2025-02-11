'use client';

import { useState, useEffect } from 'react';
import { QA, Topic, Rabbi } from '@/types';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useToast } from "@/components/ui/toast";

const TOPICS = [
  'נדה',
  'שבת',
  'בשר בחלב',
  'טבילת כלים',
  'ברכות',
  'תפילה',
  'חגים',
  'חושן משפט'
] as const;

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
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
    loadRabbis();
  }, []);

  const loadRabbis = async () => {
    try {
      const response = await fetch('/api/rabbis');
      if (!response.ok) {
        throw new Error('שגיאה בטעינת רשימת הרבנים');
      }
      const data = await response.json();
      setRabbis(data);
    } catch (err) {
      toast('שגיאה בטעינת הרבנים', 'error');
      console.error('Error loading rabbis:', err);
    }
  };

  const validateForm = () => {
    if (!currentQA.topic) {
      setError('נא לבחור נושא');
      return false;
    }
    if (!currentQA.question?.trim()) {
      setError('נא להזין שאלה');
      return false;
    }
    if (!currentQA.answer?.trim()) {
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

      toast(currentQA.id ? 'השאלה עודכנה בהצלחה' : 'השאלה נוספה בהצלחה', 'success');

      setIsEditing(false);
      setCurrentQA(defaultQA);
      loadQAs();
    } catch (error) {
      toast('שגיאה בשמירת השאלה', 'error');
      console.error('Error saving QA:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
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
      
      toast('השאלה נמחקה בהצלחה', 'success');
      
      loadQAs();
    } catch (error) {
      toast('שגיאה במחיקת השאלה', 'error');
      console.error('Error deleting QA:', error);
    }
  };

  const loadQAs = async () => {
    try {
      const response = await fetch('/api/qa');
      if (!response.ok) {
        throw new Error('שגיאה בטעינת השאלות');
      }
      const data = await response.json();
      // Trier les questions par date de création décroissante (plus récentes en premier)
      const sortedQAs = (data || []).sort((a: QA, b: QA) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setQAs(sortedQAs);
    } catch (error) {
      toast('שגיאה בטעינת השאלות', 'error');
      console.error('Error loading QAs:', error);
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
              {TOPICS.map((topic) => (
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
                  {rabbi.firstName} {rabbi.lastName}
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
              rows={4}
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

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setCurrentQA(defaultQA);
                setError(null);
              }}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
              disabled={isSubmitting}
            >
              ביטול
            </button>

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'שומר...' : currentQA.id ? 'עדכן שאלה' : 'הוסף שאלה'}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-6">
        {qas.map((qa) => (
          <div key={qa.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-2.5 py-0.5 rounded">
                  {qa.topic}
                </span>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(qa.createdAt).toLocaleDateString('he-IL')}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setCurrentQA(qa);
                    setIsEditing(true);
                    setError(null);
                  }}
                  className="text-yellow-500 hover:text-yellow-600"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => handleDelete(Number(qa.id))}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">שאלה:</h3>
                <p className="text-gray-700">{qa.question}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">תשובה:</h3>
                <p className="text-gray-700">{qa.answer}</p>
              </div>
              <div className="text-sm text-gray-500">
                מאת: {rabbis.find(r => r.id === qa.authorId)?.firstName} {rabbis.find(r => r.id === qa.authorId)?.lastName}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QAManager;
