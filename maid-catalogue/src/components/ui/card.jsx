import React from 'react';
import PropTypes from 'prop-types';

const Card = ({ 
  children, 
  className = '', 
  variant = 'default',
  padding = 'medium',
  shadow = true,
  rounded = true,
  ...props 
}) => {
  const baseClasses = 'bg-white transition-all duration-200';
  
  const variants = {
    default: 'border border-gray-200',
    elevated: 'border-none',
    outlined: 'border-2 border-[#ff690d26]',
  };

  const paddings = {
    none: 'p-0',
    small: 'p-2',
    medium: 'p-4',
    large: 'p-6',
  };

  const shadows = {
    true: 'shadow-[0_2px_5px_rgba(0,0,0,0.1)]',
    false: '!shadow-none',
  };

  const roundings = {
    true: 'rounded-[30px]',
    false: '',
  };

  const cardClasses = `${baseClasses} ${variants[variant]} ${paddings[padding]} ${shadows[shadow]} ${roundings[rounded]} ${className}`;

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

const CardContent = ({ 
  children, 
  className = '', 
  ...props 
}) => {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  );
};

const CardHeader = ({ 
  children, 
  className = '', 
  ...props 
}) => {
  return (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'elevated', 'outlined']),
  padding: PropTypes.oneOf(['none', 'small', 'medium', 'large']),
  shadow: PropTypes.bool,
  rounded: PropTypes.bool,
};

CardContent.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

CardHeader.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export { Card, CardContent, CardHeader };
export default Card;