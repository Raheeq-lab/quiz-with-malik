
import React from 'react';

const SignupImageSection: React.FC = () => {
  return (
    <div className="lg:w-1/2 p-4 hidden lg:flex items-center justify-center">
      <div className="rounded-lg overflow-hidden shadow-xl">
        <img 
          src="/lovable-uploads/809a7775-32d7-4138-94d3-e6fb31052ee0.png" 
          alt="Students in a math session" 
          className="w-full h-auto"
        />
      </div>
    </div>
  );
};

export default SignupImageSection;
