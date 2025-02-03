'use client';

import React, { useState, useEffect } from 'react';
import { Book } from '@/types/books';

export default function BooksAdminPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [nedarimPlusLink, setNedarimPlusLink] = useState('');
  const [isNew, setIsNew] = useState(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const response = await fetch('/api/books');
      const data = await response.json();
      setBooks(data.books);
    } catch (err) {
      setError('שגיאה בטעינת הספרים');
      console.error('Error loading books:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('nedarimPlusLink', nedarimPlusLink);
      formData.append('isNew', isNew.toString());
      
      if (coverImage) {
        formData.append('image', coverImage);
      }

      if (editingBook) {
        formData.append('id', editingBook.id);
      }

      const response = await fetch('/api/books', {
        method: editingBook ? 'PUT' : 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to save book');
      }

      // Reset form
      setTitle('');
      setDescription('');
      setPrice('');
      setNedarimPlusLink('');
      setIsNew(false);
      setCoverImage(null);
      setEditingBook(null);
      
      // Reload books
      await loadBooks();
    } catch (err) {
      setError('שגיאה בשמירת הספר');
      console.error('Error saving book:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setTitle(book.title);
    setDescription(book.description);
    setPrice(book.price.replace(/[^\d]/g, '')); // Extraire seulement le nombre
    setNedarimPlusLink(book.nedarimPlusLink);
    setIsNew(book.isNew || false);
  };

  const handleDelete = async (bookId: string) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק ספר זה?')) return;

    try {
      const response = await fetch(`/api/books?id=${bookId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete book');
      }

      await loadBooks();
    } catch (err) {
      setError('שגיאה במחיקת הספר');
      console.error('Error deleting book:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">ניהול ספרי הרב</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingBook ? 'עריכת ספר' : 'הוספת ספר חדש'}
        </h2>
        
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              שם הספר
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              תיאור
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded-md"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              מחיר (₪)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              קישור נדרים פלוס
            </label>
            <input
              type="url"
              value={nedarimPlusLink}
              onChange={(e) => setNedarimPlusLink(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="https://nedar.im/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              תמונת כריכה
            </label>
            <input
              type="file"
              onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
              className="w-full p-2 border rounded-md"
              accept="image/*"
              required={!editingBook}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isNew"
              checked={isNew}
              onChange={(e) => setIsNew(e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="isNew" className="mr-2 block text-sm text-gray-700">
              סמן כספר חדש
            </label>
          </div>

          <div className="flex justify-end space-x-4">
            {editingBook && (
              <button
                type="button"
                onClick={() => {
                  setEditingBook(null);
                  setTitle('');
                  setDescription('');
                  setPrice('');
                  setNedarimPlusLink('');
                  setIsNew(false);
                  setCoverImage(null);
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                ביטול
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className={`bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'שומר...' : editingBook ? 'עדכן ספר' : 'הוסף ספר'}
            </button>
          </div>
        </form>
      </div>

      {/* Liste des livres */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">רשימת הספרים</h2>
          <div className="space-y-4">
            {books.map((book) => (
              <div
                key={book.id}
                className="border rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  {book.image && (
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{book.title}</h3>
                      {book.isNew && (
                        <span className="bg-burgundy-600 text-white px-2 py-0.5 rounded-full text-xs">
                          חדש
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{book.price}</p>
                    {book.nedarimPlusLink && (
                      <a
                        href={book.nedarimPlusLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        קישור נדרים פלוס
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(book)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ערוך
                  </button>
                  <button
                    onClick={() => handleDelete(book.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    מחק
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
