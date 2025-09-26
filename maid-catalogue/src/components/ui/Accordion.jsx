import React, { useState } from 'react';
import PropTypes from 'prop-types';

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

const AccordionItem = ({ title, children, isOpen, onToggle }) => {
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

const Accordion = ({ items, allowMultiple = false, className = '', spacing = '6' }) => {
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

  return (
    <div className={`space-y-${spacing} ${className}`}>
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}
          isOpen={openItems.has(index)}
          onToggle={() => toggleItem(index)}
        >
          {item.content}
        </AccordionItem>
      ))}
    </div>
  );
};

AccordionItem.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  isOpen: PropTypes.bool,
  onToggle: PropTypes.func,
};

Accordion.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      content: PropTypes.node,
    })
  ).isRequired,
  allowMultiple: PropTypes.bool,
  className: PropTypes.string,
  spacing: PropTypes.string,
};

export default Accordion;
export { Accordion, AccordionItem };

// For compatibility with shadcn-style imports
export const AccordionContent = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
);

export const AccordionTrigger = ({ children, className = '', onClick }) => (
  <button onClick={onClick} className={className}>{children}</button>
);