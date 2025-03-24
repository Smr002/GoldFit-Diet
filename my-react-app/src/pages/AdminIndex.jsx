
import { Link } from 'react-router-dom';

const AdminIndex = () => {
  return (
    <div className="min-h-screen bg-fitness-light-bg">
      {/* Header / Navigation */}
      <header className="w-full py-4 px-6 md:px-12 flex items-center justify-between bg-white shadow-sm">
        <div className="flex items-center">
          <svg viewBox="0 0 100 100" className="w-10 h-10 text-fitness-purple">
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none" />
            <path d="M30,50 L70,50" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
            <path d="M50,30 L50,70" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
          </svg>
          <span className="ml-2 text-xl font-bold text-gray-800">Fitness</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-gray-600 hover:text-fitness-purple transition-colors">Our Vision</a>
          <a href="#" className="text-gray-600 hover:text-fitness-purple transition-colors">Workouts</a>
          <a href="#" className="text-gray-600 hover:text-fitness-purple transition-colors">Prices</a>
          <a href="#" className="text-gray-600 hover:text-fitness-purple transition-colors">Contact Us</a>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Link to="/admin/dashboard" className="bg-fitness-purple text-white px-6 py-2 rounded-full font-medium hover:bg-fitness-dark-purple transition-colors">
            Try Now
          </Link>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto py-16 px-6 md:px-12 md:py-24 flex flex-col md:flex-row items-center">
        {/* Left content */}
        <div className="md:w-1/2 md:pr-12 mb-12 md:mb-0">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-fitness-purple leading-tight mb-6">
            Achieve Your Fitness Goals with Ease
          </h1>
          <p className="text-gray-700 text-lg mb-8">
            Transform your body and mind with our expert-designed workout and nutrition plans. Start your journey to a healthier, stronger you today and see results that last.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button className="bg-fitness-purple text-white px-8 py-3 rounded-full font-medium hover:bg-fitness-dark-purple transition-colors">
              Get Started
            </button>
            <button className="border border-fitness-purple text-fitness-purple px-8 py-3 rounded-full font-medium hover:bg-fitness-purple hover:text-white transition-colors">
              Sign In
            </button>
          </div>
        </div>
        
        {/* Right content (illustration) */}
        <div className="md:w-1/2 bg-white p-8 rounded-2xl shadow-lg">
          <div className="relative">
            <div className="h-72 w-full flex items-center justify-center">
              <div className="relative w-80 h-80">
                {/* Cycling Icon */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
                  <div className="w-24 h-24 rounded-full border-4 border-gray-200 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-12 h-12 text-gray-400">
                      <path d="M12 2a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0V3a1 1 0 0 1 1-1zm0 18a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0v-1a1 1 0 0 1 1-1zm9-9a1 1 0 0 1-1 1h-1a1 1 0 0 1 0-2h1a1 1 0 0 1 1 1zm-18 0a1 1 0 0 1-1 1H2a1 1 0 0 1 0-2h1a1 1 0 0 1 1 1zm15.7-6.3a1 1 0 0 1 0 1.4l-1 1a1 1 0 0 1-1.4-1.4l1-1a1 1 0 0 1 1.4 0zM5.3 17.7a1 1 0 0 1 0 1.4l-1 1a1 1 0 0 1-1.4-1.4l1-1a1 1 0 0 1 1.4 0zm12.4 0a1 1 0 0 1 1.4 0l1 1a1 1 0 0 1-1.4 1.4l-1-1a1 1 0 0 1 0-1.4zM5.3 5.3a1 1 0 0 1 1.4 0l1 1a1 1 0 0 1-1.4 1.4l-1-1a1 1 0 0 1 0-1.4z" fill="currentColor" />
                    </svg>
                  </div>
                  <div className="absolute top-6 -right-3 w-32 h-6 bg-fitness-purple rounded-full"></div>
                </div>
                
                {/* Dumbbell Icon */}
                <div className="absolute bottom-0 left-0">
                  <div className="w-24 h-24 rounded-full border-4 border-gray-200 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-12 h-12 text-gray-400">
                      <path d="M6.5 14.5A1.5 1.5 0 0 1 5 13V9a1.5 1.5 0 0 1 3 0v4a1.5 1.5 0 0 1-1.5 1.5zm4 0h-1V9a3 3 0 0 0-6 0v4.5a3 3 0 0 0 6 0V13h1a1 1 0 0 0 0-2h-1V9a3 3 0 0 0-6 0v.5h-1a1 1 0 0 0 0 2h1V13a3 3 0 0 0 6 0v-.5h1a1 1 0 0 0 0-2zm7 0a1.5 1.5 0 0 1-1.5-1.5V9a1.5 1.5 0 0 1 3 0v4a1.5 1.5 0 0 1-1.5 1.5zm0-9A3 3 0 0 0 14 9v4.5a3 3 0 0 0 6 0V9a3 3 0 0 0-3-3.5zM12 10a1 1 0 0 0 0 2 1 1 0 0 0 0-2z" fill="currentColor" />
                    </svg>
                  </div>
                  <div className="absolute top-6 -left-3 w-32 h-6 bg-fitness-purple rounded-full"></div>
                </div>
                
                {/* Heartbeat Icon */}
                <div className="absolute bottom-0 right-0">
                  <div className="w-24 h-24 rounded-full border-4 border-gray-200 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-12 h-12 text-gray-400">
                      <path d="M8 12h2l1-2.5L12 15l1-1h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      <path d="M3.05 11a7 7 0 0 1 13.9 0M20.95 11a7 7 0 0 1-13.9 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                  </div>
                  <div className="absolute top-6 -right-3 w-32 h-6 bg-fitness-purple rounded-full"></div>
                </div>
                
                {/* Character */}
                <div className="absolute right-0 bottom-4">
                  <div className="relative w-32 h-48">
                    {/* Head */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-gray-800"></div>
                    
                    {/* Body */}
                    <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-16 h-24 bg-gray-800 rounded"></div>
                    
                    {/* Arm */}
                    <div className="absolute top-14 left-0 w-8 h-16 bg-gray-800 rounded-l-lg transform -rotate-12"></div>
                    
                    {/* Legs */}
                    <div className="absolute bottom-0 left-6 w-6 h-12 bg-fitness-purple rounded"></div>
                    <div className="absolute bottom-0 right-6 w-6 h-12 bg-fitness-purple rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <div className="text-center mb-8">
        <Link 
          to="/admin/dashboard"
          className="text-fitness-purple hover:underline font-medium"
        >
          Go to Admin Dashboard
        </Link>
      </div>
    </div>
  );
};

export default AdminIndex;
