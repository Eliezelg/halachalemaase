'use client';

import { useState } from 'react';
import { QA } from '@/types';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface QuestionCardProps {
  qa: QA;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ qa }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div
        className="p-6 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
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
          </div>
          <button className="text-primary-600 p-2">
            {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="px-6 pb-6">
          <div className="pt-4 border-t">
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: qa.answer }}
            />
            <div className="mt-4 text-sm text-gray-500 text-left">
              נכתב ע"י: {qa.authorId}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
