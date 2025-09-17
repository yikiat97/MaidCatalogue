import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const AccordionContext = createContext();

const Accordion = ({ type = 'single', collapsible = true, defaultValue, value, onValueChange, className = '', children }) => {
  const [internalValue, setInternalValue] = useState(defaultValue || []);
  const currentValue = value !== undefined ? value : internalValue;
  
  const handleValueChange = (newValue) => {
    if (onValueChange) {
      onValueChange(newValue);
    } else {
      setInternalValue(newValue);
    }
  };

  const toggleItem = (itemValue) => {
    if (type === 'single') {
      const newValue = currentValue.includes(itemValue) ? [] : [itemValue];
      handleValueChange(newValue);
    } else {
      const newValue = currentValue.includes(itemValue)
        ? currentValue.filter(v => v !== itemValue)
        : [...currentValue, itemValue];
      handleValueChange(newValue);
    }
  };

  return (
    <AccordionContext.Provider value={{ currentValue, toggleItem, type }}>
      <div className={`space-y-2 ${className}`}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

const AccordionItem = ({ value, className = '', children }) => {
  const { currentValue, toggleItem } = useContext(AccordionContext);
  const isOpen = currentValue.includes(value);

  return (
    <div className={`border border-gray-200 rounded-lg ${className}`}>
      {React.Children.map(children, child => 
        React.cloneElement(child, { isOpen, onToggle: () => toggleItem(value) })
      )}
    </div>
  );
};

const AccordionTrigger = ({ children, className = '', isOpen, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50 transition-colors ${className}`}
    >
      {children}
      <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
        ▼
      </span>
    </button>
  );
};

const AccordionContent = ({ children, className = '', isOpen }) => {
  if (!isOpen) return null;
  
  return (
    <div className={`px-4 pb-4 ${className}`}>
      {children}
    </div>
  );
};

Accordion.propTypes = {
  type: PropTypes.oneOf(['single', 'multiple']),
  collapsible: PropTypes.bool,
  defaultValue: PropTypes.array,
  value: PropTypes.array,
  onValueChange: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.node,
};

AccordionItem.propTypes = {
  value: PropTypes.string.isRequired,
  className: PropTypes.string,
  children: PropTypes.node,
};

AccordionTrigger.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  isOpen: PropTypes.bool,
  onToggle: PropTypes.func,
};

AccordionContent.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  isOpen: PropTypes.bool,
};

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
export default Accordion;