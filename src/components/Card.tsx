import React, { ReactNode } from 'react';

interface CardProps {
  children?: ReactNode;
  className?: string; 
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`w-[100%] max-w-full rounded-lg overflow-hidden shadow-lg bg-white p-6 ${className}`}>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
};

export default Card;
