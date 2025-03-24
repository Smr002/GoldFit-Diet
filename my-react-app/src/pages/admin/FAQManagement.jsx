import React, { useState } from 'react';
import { Plus, Search, Filter, MessageSquare, Edit, Trash, ChevronUp, ChevronDown } from 'lucide-react';

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
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">FAQ Management</h1>
        <button className="admin-btn admin-btn-primary">
          <Plus size={18} />
          <span>Add FAQ</span>
        </button>
      </div>

      <div className="admin-card">
        <div className="admin-toolbar">
          <div className="admin-search">
            <Search className="admin-search-icon" size={18} />
            <input
              type="text"
              placeholder="Search FAQs..."
              className="admin-input"
            />
          </div>

          <button
            className="admin-btn admin-btn-secondary"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <Filter size={18} />
            <span>Filter</span>
          </button>
        </div>

        {filterOpen && (
          <div className="admin-filter-panel">
            <div className="admin-form-group">
              <label className="admin-label">Category</label>
              <select className="admin-input">
                <option value="">All Categories</option>
                <option>Workouts</option>
                <option>Nutrition</option>
                <option>App Features</option>
                <option>Tracking</option>
                <option>Billing</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Date Added</label>
              <select className="admin-input">
                <option value="">Any Time</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>Last year</option>
              </select>
            </div>
          </div>
        )}

        <div className="admin-list">
          {mockFAQs.map((faq) => (
            <div key={faq.id} className="admin-list-item">
              <div
                className="admin-list-item-header"
                onClick={() => toggleFAQ(faq.id)}
              >
                <div className="admin-list-item-title">
                  <MessageSquare size={20} className="admin-icon" />
                  <h3>{faq.question}</h3>
                </div>
                <div className="admin-list-item-actions">
                  <span className="admin-tag">{faq.category}</span>
                  <div className="admin-action-buttons">
                    <button className="admin-action-btn admin-action-edit">
                      <Edit size={16} />
                    </button>
                    <button className="admin-action-btn admin-action-delete">
                      <Trash size={16} />
                    </button>
                    {expandedFAQ === faq.id ? (
                      <ChevronUp size={20} className="admin-icon" />
                    ) : (
                      <ChevronDown size={20} className="admin-icon" />
                    )}
                  </div>
                </div>
              </div>
              {expandedFAQ === faq.id && (
                <div className="admin-list-item-content">
                  <p>{faq.answer}</p>
                  <div className="admin-list-item-meta">
                    <span>Added on {faq.createdDate}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="admin-pagination">
          <span className="admin-pagination-info">Showing 1-4 of 56 FAQs</span>
          <div className="admin-pagination-buttons">
            <button className="admin-btn admin-btn-secondary">Previous</button>
            <button className="admin-btn admin-btn-primary">1</button>
            <button className="admin-btn admin-btn-secondary">2</button>
            <button className="admin-btn admin-btn-secondary">3</button>
            <button className="admin-btn admin-btn-secondary">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQManagement;