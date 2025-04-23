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
      question: 'How often should I work out?',
      answer: 'We recommend 3-5 workouts per week depending on your fitness level and goals. Beginners should start with 3 sessions per week, allowing for rest days in between. As you progress, you can increase frequency and intensity.',
      category: 'Workouts',
      createdDate: '2023-10-10',
    },
    {
      id: 2,
      question: 'Can I access workouts offline?',
      answer: 'Yes, you can download workouts for offline access in the premium version of the app. Simply go to the workout page and click the download icon to save it for offline use.',
      category: 'App Features',
      createdDate: '2023-09-22',
    },
    {
      id: 3,
      question: 'How do I track my progress?',
      answer: 'Progress tracking is available in the "Progress" tab of your profile. You can see metrics like workout completion, consistency, and improvement over time. You can also manually log measurements and take progress photos.',
      category: 'Tracking',
      createdDate: '2023-09-15',
    },
    {
      id: 4,
      question: 'What should I eat before and after workouts?',
      answer: 'Pre-workout: Eat a balanced meal with carbs and protein 2-3 hours before, or a small snack 30-60 minutes before. Post-workout: Consume protein and carbs within 30-60 minutes after your workout to aid recovery and muscle growth.',
      category: 'Nutrition',
      createdDate: '2023-08-05',
    },
    {
      id: 5,
      question: 'How do I cancel my subscription?',
      answer: 'You can cancel your subscription from your account settings. Go to Profile > Subscription > Cancel Subscription. Your access will continue until the end of your current billing period.',
      category: 'Billing',
      createdDate: '2023-07-18',
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

  const handleDeleteClick = (faq) => {
    setSelectedFAQ(faq);
    setIsDeleteModalOpen(true);
    setActiveDropdown(null);
  };

  const handleCreateFAQ = () => {
    // Set an empty FAQ template
    const newFAQTemplate = {
      id: `temp-${Date.now()}`,
      question: "",
      answer: "",
      category: "Workouts",
      createdDate: new Date().toISOString().split('T')[0]
    };
    
    setSelectedFAQ(newFAQTemplate);
    setIsEditModalOpen(true);
    setIsCreateModalOpen(true);
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
          
          <button 
            className="admin-btn primary"  // Change this to match other admin buttons
            onClick={handleCreateFAQ}
          >
            <Plus size={16} />
            <span>Add New FAQ</span>
          </button>
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
                          <button 
                            className="dropdown-item"
                            onClick={() => handleEditFAQ(faq)}
                          >
                            <Edit size={16} />
                            <span>Edit</span>
                          </button>
                          <button 
                            className="dropdown-item delete"
                            onClick={() => handleDeleteClick(faq)}
                          >
                            <Trash2 size={16} />
                            <span>Delete</span>
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

      {/* Edit FAQ Modal (used for both edit and create) */}
      {isEditModalOpen && selectedFAQ && (
        <div className="modal-overlay">
          <div className="modal faq-edit-modal">
            <button 
              className="modal-close-btn" 
              onClick={() => {
                setIsEditModalOpen(false);
                setIsCreateModalOpen(false);
                setSelectedFAQ(null);
              }}
            >
              &times;
            </button>
            <h2>{isCreateModalOpen ? 'Create New FAQ' : 'Edit FAQ'}</h2>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              // In a real app, you would save the changes to your backend
              // This is just a mock implementation
              if (isCreateModalOpen) {
                mockFAQs.push({
                  ...selectedFAQ,
                  id: mockFAQs.length + 1
                });
              } else {
                // Find and update the FAQ
                const index = mockFAQs.findIndex(faq => faq.id === selectedFAQ.id);
                if (index !== -1) {
                  mockFAQs[index] = selectedFAQ;
                }
              }
              setIsEditModalOpen(false);
              setIsCreateModalOpen(false);
              setSelectedFAQ(null);
            }}>
              <div className="form-group">
                <label htmlFor="faqCategory">Category</label>
                <select 
                  id="faqCategory"
                  value={selectedFAQ.category}
                  onChange={(e) => setSelectedFAQ({
                    ...selectedFAQ, 
                    category: e.target.value
                  })}
                  required
                >
                  <option value="Workouts">Workouts</option>
                  <option value="Nutrition">Nutrition</option>
                  <option value="App Features">App Features</option>
                  <option value="Tracking">Tracking</option>
                  <option value="Billing">Billing</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="faqQuestion">Question</label>
                <input 
                  type="text"
                  id="faqQuestion"
                  value={selectedFAQ.question}
                  onChange={(e) => setSelectedFAQ({
                    ...selectedFAQ, 
                    question: e.target.value
                  })}
                  placeholder="Enter FAQ question..."
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="faqAnswer">Answer</label>
                <textarea 
                  id="faqAnswer"
                  value={selectedFAQ.answer}
                  onChange={(e) => setSelectedFAQ({
                    ...selectedFAQ, 
                    answer: e.target.value
                  })}
                  rows={6}
                  placeholder="Enter detailed answer..."
                  required
                />
              </div>
              
              <div className="modal-footer">
                <button 
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setIsCreateModalOpen(false);
                    setSelectedFAQ(null);
                  }} 
                  className="cancel-btn"
                >
                  Cancel
                </button>
                
                <button 
                  type="submit"
                  className="save-btn"
                >
                  {isCreateModalOpen ? 'Create' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedFAQ && (
        <div className="modal-overlay">
          <div className="modal confirmation-modal">
            <h2>Confirm Delete</h2>
            <p>
              Are you sure you want to delete this FAQ?<br />
              <strong className="delete-emphasis">"{selectedFAQ.question.length > 50 ? 
                `${selectedFAQ.question.substring(0, 50)}...` : 
                selectedFAQ.question}"</strong>
              <br />
              This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button 
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedFAQ(null);
                }} 
                className="cancel-btn"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  // In a real app, you would delete from your backend
                  // This is just a mock implementation
                  const index = mockFAQs.findIndex(faq => faq.id === selectedFAQ.id);
                  if (index !== -1) {
                    mockFAQs.splice(index, 1);
                  }
                  setIsDeleteModalOpen(false);
                  setSelectedFAQ(null);
                }} 
                className="delete-btn"
              >
                Delete FAQ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQManagement;