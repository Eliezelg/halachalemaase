'use client';

import React, { useState } from 'react';
import { BlessingCategory } from '@/data/brachot';

interface BlessingListProps {
  categories: BlessingCategory[];
}

const BlessingList: React.FC<BlessingListProps> = ({ categories }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredCategories = categories.map(category => ({
    ...category,
    blessings: category.blessings.filter(blessing =>
      blessing.name.includes(searchTerm) ||
      (blessing.description?.includes(searchTerm))
    )
  })).filter(category => category.blessings.length > 0);

  return (
    <div 
      className="w-full max-w-4xl mx-auto select-none"
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
      onPaste={(e) => e.preventDefault()}
      onSelect={(e) => e.preventDefault()}
    >
      {/* Barre de recherche */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="חיפוש ברכה..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded-lg text-right"
          dir="rtl"
        />
      </div>

      {/* Navigation des catégories */}
      <div className="flex flex-wrap gap-2 mb-6 justify-end">
        {categories.map(category => (
          <button
            key={category.title}
            onClick={() => setSelectedCategory(category.title === selectedCategory ? null : category.title)}
            className={`px-4 py-2 rounded-lg ${
              category.title === selectedCategory
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {category.title}
          </button>
        ))}
      </div>

      {/* Liste des bénédictions */}
      <div className="space-y-8">
        {filteredCategories.map(category => (
          (!selectedCategory || category.title === selectedCategory) && (
            <div key={category.title} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4 text-right">{category.title}</h2>
              <div className="space-y-4">
                {category.blessings.map((blessing, index) => (
                  <div 
                    key={index} 
                    className="border-b pb-4 text-right select-none"
                    onCopy={(e) => e.preventDefault()}
                    onCut={(e) => e.preventDefault()}
                    onPaste={(e) => e.preventDefault()}
                    onSelect={(e) => e.preventDefault()}
                  >
                    <div className="flex justify-between items-start">
                      <div className="text-right flex-grow">
                        <h3 className="text-xl font-semibold mb-2">{blessing.name}</h3>
                        {blessing.description && (
                          <p className="text-gray-600 mb-2">{blessing.description}</p>
                        )}
                        <div className="flex gap-4 justify-end text-sm">
                          {blessing.firstBlessing && (
                            <div>
                              <span className="font-medium">ברכה ראשונה: </span>
                              <span>{blessing.firstBlessing}</span>
                            </div>
                          )}
                          {blessing.lastBlessing && (
                            <div>
                              <span className="font-medium">ברכה אחרונה: </span>
                              <span>{blessing.lastBlessing}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default BlessingList;
