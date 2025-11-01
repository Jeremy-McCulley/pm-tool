import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App'; // Import the main application component

/**
 * The main entry point file for the React application.
 * It initializes the React root and renders the main App component into the DOM.
 */

// Get the DOM element where the app will be mounted
const container = document.getElementById('root');

// Create a React root, which manages the entire DOM tree
if (container) {
  const root = createRoot(container);
  
  // Render the App component
  // Using React.StrictMode helps surface potential problems in the app
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  // Log an error if the root element is missing (useful for debugging)
  console.error("Failed to find the root element with ID 'root' in the document.");
}