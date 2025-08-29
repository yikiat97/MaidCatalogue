import React, { useState } from 'react';
import PropTypes from 'prop-types';

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
          <div className="text-white text-[16px] leading-[20px]">
            {children}
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