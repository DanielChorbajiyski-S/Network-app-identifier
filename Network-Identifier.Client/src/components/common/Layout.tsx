import { Link, Outlet, useLocation } from 'react-router-dom';

export default function Layout() {
  const location = useLocation();

  const getLinkClass = (path: string) => {
    return location.pathname === path
      ? "bg-indigo-700 text-white px-3 py-2 rounded-md text-sm font-medium"
      : "text-white hover:bg-indigo-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* Navigation Bar */}
      <nav className="bg-indigo-600 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 text-white font-bold text-xl tracking-wide">
                NetID
              </div>
              <div className="ml-10 flex items-baseline space-x-4">
                <Link to="/" className={getLinkClass('/')}>Home</Link>
                <Link to="/config" className={getLinkClass('/config')}>Configuration</Link>
                <Link to="/dashboard" className={getLinkClass('/dashboard')}>Dashboard</Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content injected here */}
      <main className="flex-1">
        <Outlet />
      </main>
      
    </div>
  );
}