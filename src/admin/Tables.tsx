import React from 'react';

export default function TablesManager() {
  return (
    <div className="flex items-start justify-center h-full w-full grid grid-rows-12">
      <div className="row-span-1">
        <div className="flex items-center justify-center h-full w-full">
          <h1 className="text-4xl font-bold">Tables Manager</h1>
        </div>
      </div>

      <div className="row-span-10">
        <div className="flex flex-col items-center justify-center h-full w-full">
          <div className="flex items-center justify-center h-1/4 w-1/2">
            <h1 className="text-4xl font-bold">Tables</h1>
          </div>
          <div className="flex items-center justify-center h-3/4 w-1/2">
            <p className="text-xl">Coming soon...</p>
          </div>
        </div>
      </div>

    </div>
  );
}