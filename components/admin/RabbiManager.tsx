'use client';

import { useState, useEffect } from 'react';
import { Rabbi, Topic } from '@/types';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import ImageUpload from './ImageUpload';

const defaultRabbi: Partial<Rabbi> = {
  firstName: '',
  lastName: '',
  phone: '',
  topics: [],
  photo: '',
  address: '',
  city: '',
  description: ''
};

const RabbiManager = () => {
  const [rabbis, setRabbis] = useState<Rabbi[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRabbi, setCurrentRabbi] = useState<Partial<Rabbi>>(defaultRabbi);
  const [currentImage, setCurrentImage] = useState<File | null>(null);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const validateForm = () => {
    if (!currentRabbi.firstName?.trim()) {
      setError('נא להזין שם פרטי');
      return false;
    }
    if (!currentRabbi.lastName?.trim()) {
      setError('נא להזין שם משפחה');
      return false;
    }
    if (!currentRabbi.phone?.trim()) {
      setError('נא להזין מספר טלפון');
      return false;
    }
    if (!currentRabbi.address?.trim()) {
      setError('נא להזין כתובת');
      return false;
    }
    if (!currentRabbi.city?.trim()) {
      setError('נא להזין עיר');
      return false;
    }
    if (!currentRabbi.topics || currentRabbi.topics.length === 0) {
      setError('נא לבחור לפחות נושא אחד');
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
      let photoUrl = currentRabbi.photo;

      // Upload image if there's a new one
      if (currentImage) {
        const formData = new FormData();
        formData.append('file', currentImage);
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!uploadResponse.ok) {
          throw new Error('שגיאה בהעלאת התמונה');
        }
        
        const { url } = await uploadResponse.json();
        photoUrl = url;
      }

      const rabbiData = {
        ...currentRabbi,
        photo: photoUrl
      };

      const response = currentRabbi.id
        ? await fetch('/api/rabbis', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: currentRabbi.id, ...rabbiData }),
          })
        : await fetch('/api/rabbis', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(rabbiData),
          });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'שגיאה בשמירת הרב');
      }

      setIsEditing(false);
      setCurrentRabbi(defaultRabbi);
      setCurrentImage(null);
      loadRabbis();
    } catch (error) {
      console.error('Error saving rabbi:', error);
      setError(error instanceof Error ? error.message : 'שגיאה בשמירת הרב');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק רב זה?')) return;
    try {
      const response = await fetch('/api/rabbis', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        throw new Error('שגיאה במחיקת הרב');
      }
      loadRabbis();
    } catch (error) {
      console.error('Error deleting rabbi:', error);
      setError('שגיאה במחיקת הרב');
    }
  };

  const loadRabbis = async () => {
    try {
      const response = await fetch('/api/rabbis');
      if (!response.ok) {
        throw new Error('שגיאה בטעינת הרבנים');
      }
      const data = await response.json();
      setRabbis(data || []);
    } catch (error) {
      console.error('Error loading rabbis:', error);
      setError('שגיאה בטעינת הרבנים');
      setRabbis([]);
    }
  };

  useEffect(() => {
    loadRabbis();
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => {
          setCurrentRabbi(defaultRabbi);
          setIsEditing(true);
          setError(null);
        }}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
      >
        <Plus size={20} />
        הוסף רב חדש
      </button>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {isEditing && (
        <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-4 rounded">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">שם פרטי</label>
              <input
                type="text"
                value={currentRabbi.firstName || ''}
                onChange={(e) => setCurrentRabbi(prev => ({ ...prev, firstName: e.target.value }))}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">שם משפחה</label>
              <input
                type="text"
                value={currentRabbi.lastName || ''}
                onChange={(e) => setCurrentRabbi(prev => ({ ...prev, lastName: e.target.value }))}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">טלפון</label>
              <input
                type="tel"
                value={currentRabbi.phone || ''}
                onChange={(e) => setCurrentRabbi(prev => ({ ...prev, phone: e.target.value }))}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">עיר</label>
              <input
                type="text"
                value={currentRabbi.city || ''}
                onChange={(e) => setCurrentRabbi(prev => ({ ...prev, city: e.target.value }))}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">כתובת</label>
            <input
              type="text"
              value={currentRabbi.address || ''}
              onChange={(e) => setCurrentRabbi(prev => ({ ...prev, address: e.target.value }))}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">תמונה</label>
            <ImageUpload
              currentImage={currentRabbi.photo}
              onImageChange={setCurrentImage}
              onImageRemove={() => setCurrentRabbi(prev => ({ ...prev, photo: '' }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">תחומי התמחות</label>
            <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
              {(['נדה', 'שבת', 'בשר בחלב', 'טבילת כלים', 'ברכות', 'תפילה', 'חגים', 'חושן משפט'] as Topic[]).map((topic) => (
                <label key={topic} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={currentRabbi.topics?.includes(topic) || false}
                    onChange={(e) => {
                      const topics = currentRabbi.topics || [];
                      setCurrentRabbi(prev => ({
                        ...prev,
                        topics: e.target.checked
                          ? [...topics, topic]
                          : topics.filter(t => t !== topic)
                      }));
                    }}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="mr-2 text-sm text-gray-700">{topic}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">תיאור</label>
            <textarea
              value={currentRabbi.description || ''}
              onChange={(e) => setCurrentRabbi(prev => ({ ...prev, description: e.target.value }))}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setCurrentRabbi(defaultRabbi);
                setCurrentImage(null);
                setError(null);
              }}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
              disabled={isSubmitting}
            >
              ביטול
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'שומר...' : currentRabbi.id ? 'עדכן' : 'הוסף'} רב
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rabbis.map((rabbi) => (
          <div key={rabbi.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {rabbi.photo && (
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={rabbi.photo}
                  alt={`${rabbi.firstName} ${rabbi.lastName}`}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold">
                  {rabbi.firstName} {rabbi.lastName}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setCurrentRabbi(rabbi);
                      setIsEditing(true);
                      setError(null);
                    }}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(rabbi.id)}
                    className="p-1 hover:bg-gray-100 rounded text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                <div>{rabbi.phone}</div>
                <div>{rabbi.address}</div>
                <div>{rabbi.city}</div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {rabbi.topics.map((topic) => (
                  <span
                    key={topic}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RabbiManager;
