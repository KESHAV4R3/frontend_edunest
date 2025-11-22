import React from 'react';

const DashboardLiveStream = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
      <div className="mb-6 text-blue-500 dark:text-blue-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 mx-auto"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
        Live Streaming
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md">
        We're working hard to bring you an amazing live streaming experience. This feature will be available soon!
      </p>
      <div className="w-full max-w-sm bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full animate-pulse"
          style={{ width: '65%' }}
        ></div>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
        Development in progress - 65% complete
      </p>
    </div>
  );
};

export default React.memo(DashboardLiveStream);