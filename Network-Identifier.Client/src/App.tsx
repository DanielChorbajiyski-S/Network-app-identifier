import { Link } from 'react-router-dom';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-md p-8 text-center">
        <h1 className="text-3xl font-bold text-black mb-5">Network Identifier</h1>
        
        <div className="flex flex-col gap-4">
          <Link
            to="/config"
            className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Open Configuration
          </Link>
          
          <Link
            to="/dashboard"
            className="w-full py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Open Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default App;