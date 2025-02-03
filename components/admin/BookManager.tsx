'use client';

import { useState } from 'react';
import { Book } from '@/types';
import { Plus, Edit2, Trash2, Upload } from 'lucide-react';

const BookManager = () => {
  const [books, setBooks] = useState<Book[]>([]); // Will be fetched from API
  const [isEditing, setIsEditing] = useState(false);
  const [currentBook, setCurrentBook] = useState<Partial<Book>>({});
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Implement save logic
      // 1. Upload files if present
      // 2. Save book data
      setIsEditing(false);
      setCurrentBook({});
      setCoverFile(null);
      setPdfFile(null);
    } catch (error) {
      console.error('Error saving book:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק ספר זה?')) return;
    try {
      // TODO: Implement delete logic
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => {
          setIsEditing(true);
          setCurrentBook({});
        }}
        className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
      >
        <Plus size={20} />
        הוסף ספר חדש
      </button>

      {isEditing && (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="כותרת"
              value={currentBook.title || ''}
              onChange={e => setCurrentBook(prev => ({ ...prev, title: e.target.value }))}
              className="input-field"
            />
            <input
              type="number"
              placeholder="מחיר (אופציונלי)"
              value={currentBook.price || ''}
              onChange={e => setCurrentBook(prev => ({ ...prev, price: Number(e.target.value) }))}
              className="input-field"
            />
          </div>

          <textarea
            placeholder="תיאור"
            value={currentBook.description || ''}
            onChange={e => setCurrentBook(prev => ({ ...prev, description: e.target.value }))}
            className="input-field h-32"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                תמונת כריכה
              </label>
              <label className="cursor-pointer flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setCoverFile(file);
                  }}
                />
                <div className="flex flex-col items-center space-y-2">
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    {coverFile ? coverFile.name : 'העלה תמונת כריכה'}
                  </span>
                </div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                קובץ PDF (אופציונלי)
              </label>
              <label className="cursor-pointer flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setPdfFile(file);
                  }}
                />
                <div className="flex flex-col items-center space-y-2">
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    {pdfFile ? pdfFile.name : 'העלה קובץ PDF'}
                  </span>
                </div>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setCurrentBook({});
                setCoverFile(null);
                setPdfFile(null);
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              ביטול
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              שמור
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <div key={book.id} className="bg-white rounded-lg shadow overflow-hidden">
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold">{book.title}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setCurrentBook(book);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(book.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              {book.price && (
                <p className="text-primary-600 font-semibold mt-2">
                  ₪{book.price}
                </p>
              )}
              <p className="text-gray-600 text-sm mt-2">{book.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookManager;
