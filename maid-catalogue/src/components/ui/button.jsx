import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

export const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  type = 'button',
  className = '',
  loading = false,
  loadingText = 'Loading...',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  'aria-pressed': ariaPressed,
  autoFocus = false,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const buttonRef = useRef(null);

  // Auto focus management
  useEffect(() => {
    if (autoFocus && buttonRef.current) {
      buttonRef.current.focus();
    }
  }, [autoFocus]);

  // Enhanced focus management
  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  // Enhanced keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (!disabled && !loading && onClick) {
        onClick(e);
      }
    }
  };

  // Enhanced click handler with loading state
  const handleClick = (e) => {
    if (!disabled && !loading && onClick) {
      onClick(e);
    }
  };

  const baseClasses = 'font-inter font-extrabold rounded-[20px] transition-all duration-200 relative overflow-hidden';

  // Enhanced focus styles for better accessibility
  const focusClasses = isFocused
    ? 'ring-4 ring-offset-2 ring-blue-500/50'
    : 'focus:ring-4 focus:ring-offset-2 focus:ring-blue-500/50 focus:outline-none';

  const variants = {
    primary: `bg-[var(--primary-orange)] text-[#f3f3f3] hover:bg-[var(--primary-orange-dark)]
              disabled:bg-gray-400 disabled:text-gray-200
              focus:ring-orange-500/50 active:transform active:scale-[0.98]`,
    secondary: `bg-gray-200 text-gray-800 hover:bg-gray-300
                disabled:bg-gray-100 disabled:text-gray-400
                focus:ring-gray-500/50 active:transform active:scale-[0.98]`,
    outline: `border-2 border-[var(--primary-orange)] text-[var(--primary-orange)]
              hover:bg-[var(--primary-orange)] hover:text-white
              disabled:border-gray-200 disabled:text-gray-400 disabled:bg-transparent
              focus:ring-orange-500/50 active:transform active:scale-[0.98]`,
  };

  const sizes = {
    small: 'px-3 py-1 text-[16px] leading-[20px] min-h-[32px]',
    medium: 'px-4 py-[15px] text-[20px] leading-[25px] min-h-[50px]',
    large: 'px-6 py-3 text-[24px] leading-[30px] min-h-[60px]',
  };

  const isInteractive = !disabled && !loading;
  const cursorClass = disabled ? 'cursor-not-allowed' : loading ? 'cursor-wait' : 'cursor-pointer';

  const buttonClasses = `${baseClasses} ${focusClasses} ${variants[variant]} ${sizes[size]} ${cursorClass} ${className}`;

  // Enhanced ARIA attributes
  const ariaAttributes = {
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,
    'aria-pressed': ariaPressed,
    'aria-busy': loading,
    'aria-disabled': disabled,
    'role': 'button',
    'tabIndex': disabled ? -1 : 0,
  };

  return (
    <button
      ref={buttonRef}
      type={type}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
      disabled={disabled}
      className={buttonClasses}
      {...ariaAttributes}
      {...props}
    >
      <span className={`flex items-center justify-center gap-2 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </span>

      {/* Loading indicator */}
      {loading && (
        <span
          className="absolute inset-0 flex items-center justify-center"
          aria-live="polite"
        >
          <svg
            className="animate-spin h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="sr-only">{loadingText}</span>
        </span>
      )}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string,
  loading: PropTypes.bool,
  loadingText: PropTypes.string,
  'aria-label': PropTypes.string,
  'aria-describedby': PropTypes.string,
  'aria-pressed': PropTypes.bool,
  autoFocus: PropTypes.bool,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};

export default Button;