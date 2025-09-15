import React from 'react';
import { cn } from '../../lib/utils';

const WavyCard = ({
  title,
  subtitle,
  children,
  className = '',
  headerClassName = '',
  variant = 'default',
  flagBackground = null,
}) => {
  const headerBg = variant === 'accent' ? 'bg-blue-600' : 'bg-primary-orange';
  const headerText = variant === 'accent' ? 'text-white' : 'text-white';

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100 h-full flex flex-col',
        className
      )}
    >
      {/* Wavy Header */}
      <div
        className={cn('relative px-6 py-10 md:py-12 overflow-hidden', !flagBackground && headerBg, headerClassName)}
        style={flagBackground ? {
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.5)), url(${flagBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        } : {}}
      >
        {/* Dynamic wavy bottom border using SVG */}
        <svg
          className="absolute bottom-0 left-0 w-full h-20"
          viewBox="0 0 400 80"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M0,45 C50,68 100,72 160,55 C200,45 240,38 280,32 C320,26 360,28 400,35 L400,80 L0,80 Z"
            fill="white"
            className="text-white"
          />
        </svg>

        {/* Header Content */}
        <div className="relative z-10">
          <h3 className={cn('text-2xl font-bold text-balance leading-tight', flagBackground ? 'text-white drop-shadow-lg' : headerText)}>
            {title}
          </h3>
          {subtitle && (
            <p className={cn('mt-2 text-sm', flagBackground ? 'text-white/90 drop-shadow-md' : 'opacity-90', flagBackground ? '' : headerText)}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="px-6 py-6 text-gray-800 flex-1 flex flex-col">{children}</div>
    </div>
  );
};

export default WavyCard;