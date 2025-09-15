import React from 'react';
import PropTypes from 'prop-types';

const WavyDivider = ({
  direction = 'up',
  color = '#ffffff',
  gradientColors = null,
  className = '',
  height = 40,
  opacity = 1,
  pattern = 'dramatic',
  ...props
}) => {
  // Generate unique gradient ID for each instance
  const gradientId = `wave-gradient-${Math.random().toString(36).substr(2, 9)}`;

  // Different wave patterns for various use cases
  const patterns = {
    smooth: {
      up: `M0,${height} C100,${height*0.3} 200,${height*0.7} 400,${height*0.4} C500,${height*0.2} 550,${height*0.6} 600,${height*0.1} L600,${height} L0,${height} Z`,
      down: `M0,0 C100,${height*0.7} 200,${height*0.3} 400,${height*0.6} C500,${height*0.8} 550,${height*0.4} 600,${height*0.9} L600,${height} L0,${height} Z`
    },
    gentle: {
      up: `M0,${height} C150,${height*0.4} 300,${height*0.6} 450,${height*0.3} C525,${height*0.2} 575,${height*0.8} 600,${height*0.2} L600,${height} L0,${height} Z`,
      down: `M0,0 C150,${height*0.6} 300,${height*0.4} 450,${height*0.7} C525,${height*0.8} 575,${height*0.2} 600,${height*0.8} L600,${height} L0,${height} Z`
    },
    subtle: {
      up: `M0,${height} C200,${height*0.6} 400,${height*0.4} 600,${height*0.5} L600,${height} L0,${height} Z`,
      down: `M0,0 C200,${height*0.4} 400,${height*0.6} 600,${height*0.5} L600,${height} L0,${height} Z`
    },
    dramatic: {
      up: `M0,${height} C80,${height*0.1} 160,${height*0.9} 240,${height*0.2} C320,${height*0.8} 400,${height*0.1} 480,${height*0.9} C520,${height*0.3} 560,${height*0.7} 600,${height*0.1} L600,${height} L0,${height} Z`,
      down: `M0,0 C80,${height*0.9} 160,${height*0.1} 240,${height*0.8} C320,${height*0.2} 400,${height*0.9} 480,${height*0.1} C520,${height*0.7} 560,${height*0.3} 600,${height*0.9} L600,${height} L0,${height} Z`
    },
    bold: {
      up: `M0,${height} C100,0 200,${height} 300,${height*0.2} C400,${height*0.8} 500,0 600,${height*0.3} L600,${height} L0,${height} Z`,
      down: `M0,0 C100,${height} 200,0 300,${height*0.8} C400,${height*0.2} 500,${height} 600,${height*0.7} L600,${height} L0,${height} Z`
    }
  };

  const wavePath = patterns[pattern] ? patterns[pattern][direction] : patterns.smooth[direction];

  return (
    <div className={`w-full overflow-hidden ${className}`} {...props}>
      <svg
        viewBox={`0 0 600 ${height}`}
        className="w-full h-full"
        preserveAspectRatio="none"
        style={{ display: 'block' }}
      >
        {/* Gradient definition if gradient colors provided */}
        {gradientColors && (
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              {gradientColors.map((colorStop, index) => (
                <stop
                  key={index}
                  offset={`${(index / (gradientColors.length - 1)) * 100}%`}
                  stopColor={colorStop}
                />
              ))}
            </linearGradient>
          </defs>
        )}

        <path
          d={wavePath}
          fill={gradientColors ? `url(#${gradientId})` : color}
          fillOpacity={opacity}
        />
      </svg>
    </div>
  );
};

WavyDivider.propTypes = {
  direction: PropTypes.oneOf(['up', 'down']),
  color: PropTypes.string,
  gradientColors: PropTypes.arrayOf(PropTypes.string),
  className: PropTypes.string,
  height: PropTypes.number,
  opacity: PropTypes.number,
  pattern: PropTypes.oneOf(['smooth', 'gentle', 'subtle', 'dramatic', 'bold']),
};

export default WavyDivider;