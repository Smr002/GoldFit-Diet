import React, { useState, useRef, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, MoreVertical, Filter, ChevronUp, ChevronDown, MessageSquare } from 'lucide-react';
import 'admin.css';

const FAQManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    dateAdded: ''
  });
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFAQ, setSelectedFAQ] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Add this ref to track dropdown containers
  const dropdownRef = useRef(null);
  
  // Add this useEffect to handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    // Add event listener when dropdown is open
    if (activeDropdown !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    // Cleanup function to remove the listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdown]);
  
  // Add this function to determine which dropdowns should flip up
  const shouldFlipDropdown = (index, total) => {
    // Always flip the last 2 rows' dropdowns
    return index >= total - 2;
  };

  const mockFAQs = [
  {
    id: 1,
    question: 'How do I log my meals?',
    answer: 'Tap the "Add Food" button under any meal section (Breakfast, Lunch, Dinner, or Snack) to open the food search. From there, you can search for a food, select it, and add it to your meal.',
    category: 'Nutrition',
    createdDate: '2024-01-01',
  },
  {
    id: 2,
    question: 'How do I search for and add foods to my meals?',
    answer: 'Use the search bar to find foods by name. Once you select a food item:\n• You can view detailed nutritional info\n• Adjust the serving size and unit (e.g., grams, cups, slices)\n• Tap "Add Food" to log it into your selected meal',
    category: 'Nutrition',
    createdDate: '2024-01-02',
  },
  {
    id: 3,
    question: 'Can I customize serving sizes?',
    answer: 'Yes. When adding food, you can:\n• Enter a specific amount\n• Select your preferred unit of measurement (e.g., g, ml, cup, tbsp)\n• The nutritional info updates automatically',
    category: 'Nutrition',
    createdDate: '2024-01-03',
  },
  {
    id: 4,
    question: 'How are calories calculated?',
    answer: 'Calories are based on the food’s nutritional content, adjusted to your selected serving size. Protein and carbs contribute 4 calories per gram, while fats contribute 9 calories per gram.',
    category: 'Nutrition',
    createdDate: '2024-01-04',
  },
  {
    id: 5,
    question: 'What meal types can I log?',
    answer: 'You can log meals in four categories:\n• Breakfast (6:00–10:00 AM)\n• Snack (10:00 AM–6:00 PM)\n• Lunch (12:00–2:00 PM)\n• Dinner (6:00–8:00 PM)',
    category: 'Nutrition',
    createdDate: '2024-01-05',
  },
  {
    id: 6,
    question: 'Can I edit or remove meals I’ve logged?',
    answer: 'Yes. You can:\n• Expand a meal to see the food items\n• Delete any individual food from the list\nYour daily totals will update automatically.',
    category: 'Nutrition',
    createdDate: '2024-01-06',
  },
  {
    id: 7,
    question: 'How can I see my meal history?',
    answer: 'Use the daily or weekly views to review past meals. These are accessible through the calorie tracker. You can select different days and view historical trends in your nutrition.',
    category: 'Nutrition',
    createdDate: '2024-01-07',
  },
  {
    id: 8,
    question: 'How do I log my water intake?',
    answer: 'Tap the "+" button in the Water Tracker section and select a preset amount (e.g., 250ml, 500ml). Your progress is shown on a visual bar and updates automatically.',
    category: 'Nutrition',
    createdDate: '2024-01-08',
  },
  {
    id: 9,
    question: 'What is the recommended daily intake?',
    answer: 'The default goal is 2000ml (2 liters) per day, but you can personalize this based on your needs.',
    category: 'Nutrition',
    createdDate: '2024-01-09',
  },
  {
    id: 10,
    question: 'How do I log my sleep?',
    answer: 'Go to the Sleep Tracker to:\n• Input the number of hours you slept\n• Rate your sleep quality\n• Track trends in your sleep over time',
    category: 'App Features',
    createdDate: '2024-01-10',
  },
  {
    id: 11,
    question: 'How do I view my weekly calorie intake?',
    answer: 'The calorie tracker shows:\n• A weekly graph of your daily calorie intake\n• A progress bar for the current day\n• Indicators for under/near/over your calorie goal',
    category: 'App Features',
    createdDate: '2024-01-11',
  },
  {
    id: 12,
    question: 'Can I see a breakdown of macronutrients?',
    answer: 'Yes. You’ll see:\n• Daily totals for protein, carbs, and fats\n• A percentage-based chart showing how your intake compares to your goals',
    category: 'App Features',
    createdDate: '2024-01-12',
  },
  {
    id: 13,
    question: 'How are daily calorie goals set?',
    answer: 'Your target is based on your personal details, lifestyle, and weight goals. By default, the daily calorie goal is 1961 kcal, but it adjusts based on your inputs.',
    category: 'App Features',
    createdDate: '2024-01-13',
  },
  {
    id: 14,
    question: 'Can I customize macronutrient goals?',
    answer: 'Yes. Default targets are:\n• Protein: 98g\n• Carbs: 196g\n• Fats: 65g\nYou can change these according to your diet plan.',
    category: 'App Features',
    createdDate: '2024-01-14',
  },
  {
    id: 15,
    question: 'Food search isn’t working—what can I do?',
    answer: 'Try the following:\n• Check your internet connection\n• Make sure the food name is spelled correctly\n• Refresh the page\nIf the issue continues, contact support.',
    category: 'App Features',
    createdDate: '2024-01-15',
  },
  {
    id: 16,
    question: 'How do I refresh my data?',
    answer: 'Data updates automatically every 30 seconds. You can also:\n• Tap the manual refresh icon\n• Log out and back in if needed',
    category: 'App Features',
    createdDate: '2024-01-16',
  },
  {
    id: 17,
    question: 'How is my nutrition data stored?',
    answer: 'Your data is securely saved and includes:\n• Daily meal logs\n• Weekly calorie and macro summaries\n• Long-term historical data for progress tracking',
    category: 'App Features',
    createdDate: '2024-01-17',
  },
  {
    id: 18,
    question: 'Can I use this app on my phone?',
    answer: 'Yes. The app is fully responsive and works on:\n• Smartphones\n• Tablets\n• Desktop computers\nThe interface adjusts automatically to your screen size.',
    category: 'App Features',
    createdDate: '2024-01-18',
  },
  {
    id: 19,
    question: 'How can I get the most out of the app?',
    answer: 'For best results:\n• Log meals right after eating\n• Use accurate serving sizes\n• Track water throughout the day\n• Log your sleep each morning\n• Review your weekly progress to stay on track',
    category: 'App Features',
    createdDate: '2024-01-19',
  },
  {
    id: 20,
    question: 'How often should I log my meals?',
    answer: 'Ideally:\n• Log meals immediately after eating\n• Update water intake as you go\n• Log sleep once you wake up\n• Check your progress at least once a day',
    category: 'App Features',
    createdDate: '2024-01-20',
  }
];


  const faqsPerPage = 10;
  
  const toggleFAQ = (id) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleViewDetails = (faq) => {
    setSelectedFAQ(faq);
    setIsViewModalOpen(true);
    setActiveDropdown(null);
  };

  const handleEditFAQ = (faq) => {
    setSelectedFAQ(faq);
    setIsEditModalOpen(true);
    setActiveDropdown(null);
  };




  const filteredFAQs = mockFAQs.filter(faq => {
    const searchTerm = searchQuery.toLowerCase();
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchTerm) || 
      faq.answer.toLowerCase().includes(searchTerm);
    
    const matchesCategory = !filters.category || faq.category === filters.category;
    
    let matchesDate = true;
    if (filters.dateAdded) {
      const faqDate = new Date(faq.createdDate);
      const now = new Date();
      
      if (filters.dateAdded === 'last30') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30);
        matchesDate = faqDate >= thirtyDaysAgo;
      } else if (filters.dateAdded === 'last90') {
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(now.getDate() - 90);
        matchesDate = faqDate >= ninetyDaysAgo;
      } else if (filters.dateAdded === 'lastYear') {
        const lastYear = new Date();
        lastYear.setFullYear(now.getFullYear() - 1);
        matchesDate = faqDate >= lastYear;
      }
    }
    
    return matchesSearch && matchesCategory && matchesDate;
  });

  const indexOfLastFAQ = currentPage * faqsPerPage;
  const indexOfFirstFAQ = indexOfLastFAQ - faqsPerPage;
  const currentFAQs = filteredFAQs.slice(indexOfFirstFAQ, indexOfLastFAQ);
  const pageCount = Math.ceil(filteredFAQs.length / faqsPerPage);

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">FAQ Management</h1>
        <div className="admin-header-actions">
          <div className="admin-search-box">
            <button className="admin-btn-search">
              <Search size={20} />
            </button>
            <input
              type="text"
              className="admin-input-search"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          

        </div>
      </div>

      <div className="filters-container">
        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="">All Categories</option>
          <option value="Workouts">Workouts</option>
          <option value="Nutrition">Nutrition</option>
          <option value="App Features">App Features</option>
          <option value="Tracking">Tracking</option>
          <option value="Billing">Billing</option>
        </select>

        <select
          name="dateAdded"
          value={filters.dateAdded}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="">Any Time</option>
          <option value="last30">Last 30 days</option>
          <option value="last90">Last 90 days</option>
          <option value="lastYear">Last year</option>
        </select>
      </div>

      <div className="users-table-container">
        {filteredFAQs.length > 0 ? (
          <table className="users-table faq-table" key={`${filters.category}-${filters.dateAdded}-${searchQuery}`}>
            <thead>
              <tr>
                <th className="actions-column">Actions</th>
                <th className="question-column">Question</th>
                <th className="category-column">Category</th>
                <th className="date-column">Created Date</th>
              </tr>
            </thead>
            <tbody>
              {currentFAQs.map((faq, index) => (
                <tr key={faq.id} className="animate-fade-in">
                  <td className="actions-column">
                    <div 
                      className="actions-dropdown"
                      ref={activeDropdown === faq.id ? dropdownRef : null}
                    >
                      <button 
                        className="dropdown-trigger"
                        onClick={() => setActiveDropdown(activeDropdown === faq.id ? null : faq.id)}
                      >
                        <MoreVertical size={20} />
                      </button>
                      {activeDropdown === faq.id && (
                        <div className={`dropdown-menu ${shouldFlipDropdown(index, currentFAQs.length) ? 'flip-up' : ''}`}>
                          <button 
                            className="dropdown-item"
                            onClick={() => handleViewDetails(faq)}
                          >
                            <Eye size={16} />
                            <span>View Details</span>
                          </button>
                        
                        </div>
                      )}
                    </div>
                  </td>
                  <td 
                    onClick={() => toggleFAQ(faq.id)} 
                    className="faq-question-cell question-column"
                  >
                    <div className="faq-question-wrapper">
                      <div className="faq-question-text">{faq.question}</div>
                      <div className={`faq-toggle-icon ${expandedFAQ === faq.id ? 'expanded' : ''}`}>
                        <ChevronDown size={16} />
                      </div>
                    </div>
                    {expandedFAQ === faq.id && (
                      <div className="faq-answer-preview">
                        {faq.answer}
                      </div>
                    )}
                  </td>
                  <td className="category-column">
                    <span className={`category-badge ${faq.category.toLowerCase().replace(/\s+/g, '-')}`}>
                      {faq.category}
                    </span>
                  </td>
                  <td className="date-column">{new Date(faq.createdDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-results">
            <div className="no-results-content">
              <MessageSquare size={48} className="no-results-icon" />
              <h3>No FAQs found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          </div>
        )}
        
        <div className="pagination">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {currentPage} of {pageCount || 1}
          </span>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
            disabled={currentPage === pageCount || pageCount === 0}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      </div>

      {/* Add your modals for View, Edit and Delete as needed */}
      {/* The implementation would be similar to your other management pages */}
      {/* View FAQ Modal */}
      {isViewModalOpen && selectedFAQ && (
        <div className="modal-overlay">
          <div className="modal faq-details-modal">
            <button 
              className="modal-close-btn" 
              onClick={() => {
                setIsViewModalOpen(false);
                setSelectedFAQ(null);
              }}
            >
              &times;
            </button>
            <h2>FAQ Details</h2>
            
            <div className="faq-details">
              <div className="faq-detail-header">
                <span className={`category-badge ${selectedFAQ.category.toLowerCase().replace(/\s+/g, '-')}`}>
                  {selectedFAQ.category}
                </span>
                <span className="faq-date">
                  Added on {new Date(selectedFAQ.createdDate).toLocaleDateString()}
                </span>
              </div>
              
              <div className="faq-detail-question">
                <h3>Question</h3>
                <p>{selectedFAQ.question}</p>
              </div>
              
              <div className="faq-detail-answer">
                <h3>Answer</h3>
                <p>{selectedFAQ.answer}</p>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                onClick={() => {
                  setIsViewModalOpen(false);
                  setSelectedFAQ(null);
                }} 
                className="close-btn"
              >
                Close
              </button>
              
              <button 
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleEditFAQ(selectedFAQ);
                }} 
                className="edit-btn"
              >
                <Edit size={16} />
                <span>Edit</span>
              </button>
            </div>
          </div>
        </div>
      )}


      
    </div>
  );
};

export default FAQManagement;