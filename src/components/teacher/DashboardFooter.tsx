
import React from 'react';

const DashboardFooter: React.FC = () => {
  return (
    <footer className="bg-quiz-dark text-white py-4">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} Math with Malik. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default DashboardFooter;
