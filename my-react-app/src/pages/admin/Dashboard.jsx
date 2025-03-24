import React from 'react';
import StatCard from '../../components/admin/StatCard';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex space-x-4">
          <select className="admin-input w-auto">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
          <button className="admin-button-primary">Export Data</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value="2,456"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-fitness-purple"
            >
              <path d="M16 21v-2a4 4 0 0 0-8 0v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          }
          change="+12% from last month"
          changeType="increase"
        />
        <StatCard
          title="Active Workouts"
          value="128"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-fitness-purple"
            >
              <path d="M6.5 6.5l11 11"></path>
              <path d="M21 21H3V3h18v18z"></path>
            </svg>
          }
          change="+8% from last month"
          changeType="increase"
        />
        <StatCard
          title="Notifications Sent"
          value="1,348"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-fitness-purple"
            >
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          }
          change="+24% from last month"
          changeType="increase"
        />
        <StatCard
          title="FAQs"
          value="56"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-fitness-purple"
            >
              <path d="M21 15a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              <path d="M7 7h10"></path>
              <path d="M7 11h10"></path>
              <path d="M7 15h10"></path>
            </svg>
          }
          change="+3 added this month"
          changeType="increase"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="admin-card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Sign-ups</h2>
            <a href="#" className="text-fitness-purple text-sm">
              View all
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Date Joined</th>
                  <th>Goal</th>
                  <th>Level</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="flex items-center space-x-3">
                    <div className="bg-fitness-purple/10 h-10 w-10 rounded-full flex items-center justify-center">
                      <span className="text-fitness-purple font-medium">JD</span>
                    </div>
                    <div>John Doe</div>
                  </td>
                  <td>Oct 24, 2023</td>
                  <td>Weight Loss</td>
                  <td>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Beginner
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="flex items-center space-x-3">
                    <div className="bg-fitness-purple/10 h-10 w-10 rounded-full flex items-center justify-center">
                      <span className="text-fitness-purple font-medium">JS</span>
                    </div>
                    <div>Jane Smith</div>
                  </td>
                  <td>Oct 23, 2023</td>
                  <td>Muscle Gain</td>
                  <td>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Intermediate
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="flex items-center space-x-3">
                    <div className="bg-fitness-purple/10 h-10 w-10 rounded-full flex items-center justify-center">
                      <span className="text-fitness-purple font-medium">RJ</span>
                    </div>
                    <div>Robert Johnson</div>
                  </td>
                  <td>Oct 22, 2023</td>
                  <td>Endurance</td>
                  <td>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Advanced
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Popular Workouts</h2>
            <a href="#" className="text-fitness-purple text-sm">
              View all
            </a>
          </div>
          <div className="space-y-4">
            <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="bg-fitness-purple/10 h-12 w-12 rounded-lg flex items-center justify-center mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-fitness-purple"
                >
                  <path d="M6.5 6.5l11 11"></path>
                  <path d="M21 21H3V3h18v18z"></path>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Full Body Strength</h3>
                <p className="text-sm text-gray-500">Intermediate • 3x/week</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold">458</div>
                <div className="text-sm text-gray-500">Users</div>
              </div>
            </div>

            <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="bg-fitness-purple/10 h-12 w-12 rounded-lg flex items-center justify-center mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-fitness-purple"
                >
                  <path d="M6.5 6.5l11 11"></path>
                  <path d="M21 21H3V3h18v18z"></path>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Weight Loss Challenge</h3>
                <p className="text-sm text-gray-500">Beginner • 5x/week</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold">312</div>
                <div className="text-sm text-gray-500">Users</div>
              </div>
            </div>

            <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="bg-fitness-purple/10 h-12 w-12 rounded-lg flex items-center justify-center mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-fitness-purple"
                >
                  <path d="M6.5 6.5l11 11"></path>
                  <path d="M21 21H3V3h18v18z"></path>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-medium">High Intensity Interval</h3>
                <p className="text-sm text-gray-500">Advanced • 4x/week</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold">289</div>
                <div className="text-sm text-gray-500">Users</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;