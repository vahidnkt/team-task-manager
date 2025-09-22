import React from "react";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Task Manager Frontend
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          Layout and UI components are ready!
        </p>
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Components Created:
          </h2>
          <ul className="text-left space-y-2 text-gray-600">
            <li>
              ✅ Layout Components (Header, Sidebar, Layout, ProtectedRoute)
            </li>
            <li>
              ✅ UI Components (UserAvatar, StatusBadge, PriorityBadge,
              SearchInput)
            </li>
            <li>✅ Common Components (Button, Input, Modal, Loading, etc.)</li>
            <li>✅ Redux Store & RTK Query APIs</li>
            <li>✅ Custom Hooks</li>
            <li>✅ TypeScript Types</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
