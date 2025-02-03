'use client';

import WeeklyDownload from '../WeeklyDownload';

const DownloadsPage = () => {
  return (
    <div className="min-h-screen bg-wheat-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-16">
          <WeeklyDownload />
        </div>
      </div>
    </div>
  );
};

export default DownloadsPage;