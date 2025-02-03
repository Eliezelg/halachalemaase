'use client';

import { useState } from 'react';
import { Upload, X } from 'lucide-react';

const BrochureUploader = () => {
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<{ type: 'alon' | 'gilion'; file?: File }[]>([
    { type: 'alon' },
    { type: 'gilion' }
  ]);

  const handleFileChange = (type: 'alon' | 'gilion', file: File) => {
    setFiles(prev => prev.map(item => 
      item.type === type ? { ...item, file } : item
    ));
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      for (const { type, file } of files) {
        if (!file) continue;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);
        formData.append('password', 'Lemaaseh'); // Mot de passe pour l'upload

        const response = await fetch('/api/weekly-upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || `Error uploading ${type} file`);
        }
      }

      // Reset the form after successful upload
      setFiles([
        { type: 'alon' },
        { type: 'gilion' }
      ]);
      alert('הקבצים הועלו בהצלחה');
    } catch (error) {
      console.error('Error uploading brochures:', error);
      let errorMessage = 'שגיאה בהעלאת הקבצים';
      if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
      }
      alert(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {files.map(({ type, file }) => (
          <div
            key={type}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
          >
            <h3 className="text-lg font-semibold mb-4">
              {type === 'alon' ? 'עלון הלכות שבת' : 'גליון בהלכות שבת'}
            </h3>
            
            {file ? (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">{file.name}</span>
                <button
                  onClick={() => handleFileChange(type, undefined as any)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <label className="cursor-pointer block">
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileChange(type, file);
                  }}
                />
                <div className="flex flex-col items-center space-y-2">
                  <Upload className="w-12 h-12 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    {type === 'alon' ? 'העלאת עלון שבועי' : 'העלאת גליון שבועי'}
                  </span>
                </div>
              </label>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={handleUpload}
        disabled={uploading || !files.every(f => f.file)}
        className="w-full py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? 'מעלה...' : 'העלה עלונים'}
      </button>
    </div>
  );
};

export default BrochureUploader;
