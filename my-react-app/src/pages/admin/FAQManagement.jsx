import React, { useState } from 'react';

const FAQManagement = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const mockFAQs = [
    {
      id: 1,
      question: 'How often should I work out?',
      answer: 'We recommend 3-5 workouts per week depending on your fitness level and goals. Beginners should start with 3 sessions per week, allowing for rest days in between. As you progress, you can increase frequency and intensity.',
      category: 'Workouts',
      createdDate: 'Oct 10, 2023',
    },
    {
      id: 2,
      question: 'Can I access workouts offline?',
      answer: 'Yes, you can download workouts for offline access in the premium version of the app. Simply go to the workout page and click the download icon to save it for offline use.',
      category: 'App Features',
      createdDate: 'Sep 22, 2023',
    },
    {
      id: 3,
      question: 'How do I track my progress?',
      answer: 'Progress tracking is available in the "Progress" tab of your profile. You can see metrics like workout completion, consistency, and improvement over time. You can also manually log measurements and take progress photos.',
      category: 'Tracking',
      createdDate: 'Sep 15, 2023',
    },
    {
      id: 4,
      question: 'What should I eat before and after workouts?',
      answer: 'Pre-workout: Eat a balanced meal with carbs and protein 2-3 hours before, or a small snack 30-60 minutes before. Post-workout: Consume protein and carbs within 30-60 minutes after your workout to aid recovery and muscle growth.',
      category: 'Nutrition',
      createdDate: 'Aug 05, 2023',
    },
  ];

  const toggleFAQ = (id) => {
    if (expandedFAQ === id) {
      setExpandedFAQ(null);
    } else {
      setExpandedFAQ(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">FAQ Management</h1>
        <div className="flex space-x-4">
          <button className="admin-button-primary flex items-center space-x-2">
            {/* Plus Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Add FAQ</span>
          </button>
        </div>
      </div>

      <div className="admin-card">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-6">
          <div className="relative w-full md:w-72">
            {/* Search Icon */}
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search FAQs..."
              className="admin-input pl-10"
            />
          </div>

          <div className="flex space-x-4">
            <button
              className="admin-button-secondary flex items-center space-x-2"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              {/* Filter Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="22 3 16 3 12 10 8 3 2 3 10 16 10 21 14 21 14 16 22 3"></polygon>
              </svg>
              <span>Filter</span>
            </button>
          </div>
        </div>

        {filterOpen && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg animate-fade-in">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select className="admin-input">
                <option value="">All Categories</option>
                <option>Workouts</option>
                <option>Nutrition</option>
                <option>App Features</option>
                <option>Tracking</option>
                <option>Billing</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Added</label>
              <select className="admin-input">
                <option value="">Any Time</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>Last year</option>
              </select>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {mockFAQs.map((faq) => (
            <div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <div
                className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
                onClick={() => toggleFAQ(faq.id)}
              >
                <div className="flex items-center space-x-3">
                  {/* MessageSquare Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-fitness-purple"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  <h3 className="font-medium">{faq.question}</h3>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">{faq.category}</span>
                  <div className="flex space-x-2">
                    <button className="p-1.5 rounded text-blue-600 hover:bg-blue-50 transition-colors">
                      {/* Edit Icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M11 4h7a2 2 0 0 1 2 2v7"></path>
                        <path d="M18 2l4 4"></path>
                        <path d="M2 22l10-10"></path>
                      </svg>
                    </button>
                    <button className="p-1.5 rounded text-red-600 hover:bg-red-50 transition-colors">
                      {/* Trash Icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6l-2 14H7L5 6"></path>
                        <path d="M10 11v6"></path>
                        <path d="M14 11v6"></path>
                      </svg>
                    </button>
                    {expandedFAQ === faq.id ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-500"
                      >
                        <polyline points="18 15 12 9 6 15"></polyline>
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-500"
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    )}
                  </div>
                </div>
              </div>
              {expandedFAQ === faq.id && (
                <div className="p-4 bg-white animate-fade-in">
                  <p className="text-gray-700">{faq.answer}</p>
                  <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                    <span>Added on {faq.createdDate}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-500">Showing 1-4 of 56 FAQs</div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 rounded border border-gray-200 bg-white text-gray-600 hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-1 rounded bg-fitness-purple text-white hover:bg-fitness-dark-purple">
              1
            </button>
            <button className="px-3 py-1 rounded border border-gray-200 bg-white text-gray-600 hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-1 rounded border border-gray-200 bg-white text-gray-600 hover:bg-gray-50">
              3
            </button>
            <button className="px-3 py-1 rounded border border-gray-200 bg-white text-gray-600 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQManagement;