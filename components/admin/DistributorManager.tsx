'use client';

import { useState, useEffect } from 'react';
import { Distributor } from '@/types';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const DistributorManager = () => {
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDistributor, setCurrentDistributor] = useState<Partial<Distributor>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentDistributor.id) {
        await fetch('/api/distributors', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: currentDistributor.id, ...currentDistributor }),
        });
      } else {
        await fetch('/api/distributors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(currentDistributor),
        });
      }
      setIsEditing(false);
      setCurrentDistributor({});
      loadDistributors();
    } catch (error) {
      console.error('Error saving distributor:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק מפיץ זה?')) return;
    try {
      await fetch('/api/distributors', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      loadDistributors();
    } catch (error) {
      console.error('Error deleting distributor:', error);
    }
  };

  const loadDistributors = async () => {
    try {
      const response = await fetch('/api/distributors');
      const data = await response.json();
      setDistributors(data);
    } catch (error) {
      console.error('Error loading distributors:', error);
    }
  };

  useEffect(() => {
    loadDistributors();
  }, []);

  return (
    <div className="space-y-6">
      <button
        onClick={() => {
          setCurrentDistributor({});
          setIsEditing(true);
        }}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
      >
        <Plus size={20} />
        הוסף מפיץ חדש
      </button>

      {isEditing && (
        <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-4 rounded">
          <div>
            <label className="block text-sm font-medium text-gray-700">שם</label>
            <input
              type="text"
              value={currentDistributor.name || ''}
              onChange={(e) => setCurrentDistributor(prev => ({ ...prev, name: e.target.value }))}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">כתובת</label>
            <input
              type="text"
              value={currentDistributor.address || ''}
              onChange={(e) => setCurrentDistributor(prev => ({ ...prev, address: e.target.value }))}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">עיר</label>
            <input
              type="text"
              value={currentDistributor.city || ''}
              onChange={(e) => setCurrentDistributor(prev => ({ ...prev, city: e.target.value }))}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">טלפון</label>
            <input
              type="tel"
              value={currentDistributor.phone || ''}
              onChange={(e) => setCurrentDistributor(prev => ({ ...prev, phone: e.target.value }))}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">דוא"ל</label>
            <input
              type="email"
              value={currentDistributor.email || ''}
              onChange={(e) => setCurrentDistributor(prev => ({ ...prev, email: e.target.value }))}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">הערות</label>
            <textarea
              value={currentDistributor.notes || ''}
              onChange={(e) => setCurrentDistributor(prev => ({ ...prev, notes: e.target.value }))}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm"
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setCurrentDistributor({});
              }}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              ביטול
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              שמור
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {distributors.map((distributor) => (
          <div key={distributor.id} className="border rounded-lg p-4 bg-white">
            <div className="flex justify-between items-start">
              <div>
                {distributor.name && (
                  <h3 className="font-semibold">{distributor.name}</h3>
                )}
                {(distributor.address || distributor.city) && (
                  <p className="text-sm text-gray-600">
                    {[distributor.address, distributor.city].filter(Boolean).join(', ')}
                  </p>
                )}
                {distributor.phone && (
                  <p className="text-sm text-gray-600">{distributor.phone}</p>
                )}
                {distributor.notes && (
                  <p className="text-sm text-gray-500 mt-2">{distributor.notes}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setCurrentDistributor(distributor);
                    setIsEditing(true);
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => distributor.id && handleDelete(distributor.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DistributorManager;
