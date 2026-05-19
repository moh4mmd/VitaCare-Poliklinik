import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import DashboardMain from '../components/DashboardMain';

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <DashboardMain />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
