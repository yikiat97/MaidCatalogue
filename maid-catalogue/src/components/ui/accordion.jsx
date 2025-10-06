import React, { useState, createContext, useContext } from 'react';
import PropTypes from 'prop-types';

// Accordion Context for shadcn-style API
const AccordionContext = createContext();

// Helper function to parse text with bold formatting
const parseTextWithBold = (text) => {
  if (!text || typeof text !== 'string') {
    return text;
  }

  // Split text by **bold** markers while preserving the markers
  const parts = text.split(/(\*\*.*?\*\*)/);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      // Remove the ** markers and wrap in strong tag
      const boldText = part.slice(2, -2);
      return <strong key={index} className="font-bold text-white">{boldText}</strong>;
    }
    return part; // Return regular text as is
  });
};

// Utility function to format FAQ content with proper line breaks, bullet points, and bold text
const formatFAQContent = (content) => {
  if (typeof content !== 'string') {
    return content; // If it's already JSX, return as is
  }

  const lines = content.split('\n');
  const elements = [];

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();

    if (!trimmedLine) {
      // Empty line - add some spacing
      elements.push(<div key={`space-${index}`} className="h-2" />);
    } else if (trimmedLine.startsWith('•')) {
      // Main bullet point
      const bulletContent = trimmedLine.replace('•', '').trim();
      elements.push(
        <div key={index} className="flex items-start mb-2">
          <span className="text-white mr-2 mt-1 flex-shrink-0">•</span>
          <span className="text-white">{parseTextWithBold(bulletContent)}</span>
        </div>
      );
    } else if (trimmedLine.startsWith('◦')) {
      // Sub bullet point (indented)
      const bulletContent = trimmedLine.replace('◦', '').trim();
      elements.push(
        <div key={index} className="flex items-start mb-2 ml-4">
          <span className="text-white mr-2 mt-1 flex-shrink-0">◦</span>
          <span className="text-white">{parseTextWithBold(bulletContent)}</span>
        </div>
      );
    } else if (/^\d+\./.test(trimmedLine)) {
      // Numbered list item
      elements.push(
        <div key={index} className="flex items-start mb-2 ml-4">
          <span className="text-white">{parseTextWithBold(trimmedLine)}</span>
        </div>
      );
    } else {
      // Regular paragraph
      elements.push(
        <div key={index} className="text-white mb-2">
          {parseTextWithBold(trimmedLine)}
        </div>
      );
    }
  });

  return <div>{elements}</div>;
};

// Legacy AccordionItem for backward compatibility
const LegacyAccordionItem = ({ title, children, isOpen, onToggle }) => {
  return (
    <div className="bg-[#ff690dd3] rounded-[20px] shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
      <button
        onClick={onToggle}
        className="w-full px-4 py-4 text-left flex justify-between items-center focus:outline-none"
      >
        <span className="text-sm sm:text-base md:text-lg lg:text-xl font-avenir-next font-semibold leading-relaxed text-white pr-4">
          {title}
        </span>
        <div className="bg-white rounded-[12px] w-[25px] h-[25px] flex items-center justify-center shadow-[0_4px_4px_rgba(246,170,95,0.25)] flex-shrink-0">
          <img
            src="/images/img_vector_2.svg"
            alt="Toggle"
            className={`w-[11px] h-[5px] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </button>
      {isOpen && (
        <div className="px-4 pb-4">
          <div className="text-[16px] leading-[22px]">
            {formatFAQContent(children)}
          </div>
        </div>
      )}
    </div>
  );
};

// Legacy Accordion for backward compatibility
const LegacyAccordion = ({ items, allowMultiple = false, className = '', spacing = '6' }) => {
  const [openItems, setOpenItems] = useState(new Set());

  const toggleItem = (index) => {
    const newOpenItems = new Set(openItems);
    
    if (allowMultiple) {
      if (newOpenItems.has(index)) {
        newOpenItems.delete(index);
      } else {
        newOpenItems.add(index);
      }
    } else {
      if (newOpenItems.has(index)) {
        newOpenItems.clear();
      } else {
        newOpenItems.clear();
        newOpenItems.add(index);
      }
    }
    
    setOpenItems(newOpenItems);
  };

  // Safety check for items prop
  if (!items || !Array.isArray(items)) {
    return (
      <div className={`space-y-${spacing} ${className}`}>
        <div className="text-gray-500 text-center py-4">
          No items to display
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-${spacing} ${className}`}>
      {items.map((item, index) => (
        <LegacyAccordionItem
          key={index}
          title={item.title}
          isOpen={openItems.has(index)}
          onToggle={() => toggleItem(index)}
        >
          {item.content}
        </LegacyAccordionItem>
      ))}
    </div>
  );
};

// Shadcn-style Accordion components
const Accordion = ({ type = "single", collapsible = true, defaultValue, value, onValueChange, className = "", children }) => {
  const [openItems, setOpenItems] = useState(new Set(defaultValue || []));

  const toggleItem = (itemValue) => {
    const newOpenItems = new Set(openItems);
    
    if (type === "multiple") {
      if (newOpenItems.has(itemValue)) {
        newOpenItems.delete(itemValue);
      } else {
        newOpenItems.add(itemValue);
      }
    } else {
      if (newOpenItems.has(itemValue)) {
        if (collapsible) {
          newOpenItems.clear();
        }
      } else {
        newOpenItems.clear();
        newOpenItems.add(itemValue);
      }
    }
    
    setOpenItems(newOpenItems);
    if (onValueChange) {
      onValueChange(Array.from(newOpenItems));
    }
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem }}>
      <div className={className}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

const AccordionItem = ({ value, className = "", children }) => {
  const { openItems, toggleItem } = useContext(AccordionContext);
  const isOpen = openItems.has(value);

  return (
    <div className={`border-b ${className}`}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { 
            isOpen, 
            onToggle: () => toggleItem(value),
            value 
          });
        }
        return child;
      })}
    </div>
  );
};

const AccordionTrigger = ({ children, className = "", isOpen, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180 ${className}`}
    >
      {children}
      <svg
        className="h-4 w-4 shrink-0 transition-transform duration-200"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
      >
        <polyline points="6,9 12,15 18,9"></polyline>
      </svg>
    </button>
  );
};

const AccordionContent = ({ children, className = "", isOpen }) => {
  return (
    <div className={`overflow-hidden text-sm transition-all ${isOpen ? 'animate-accordion-down' : 'animate-accordion-up'}`}>
      <div className={`pb-4 pt-0 ${className}`}>
        {children}
      </div>
    </div>
  );
};

// PropTypes
LegacyAccordionItem.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  isOpen: PropTypes.bool,
  onToggle: PropTypes.func,
};

LegacyAccordion.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      content: PropTypes.node,
    })
  ),
  allowMultiple: PropTypes.bool,
  className: PropTypes.string,
  spacing: PropTypes.string,
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

// Export both legacy and new components
export default Accordion;
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent, LegacyAccordion as LegacyAccordion, LegacyAccordionItem };