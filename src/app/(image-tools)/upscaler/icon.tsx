import React from 'react';
import clsx from 'clsx';

interface CircleIconProps {
  className?: string;
  radius?: number;
  strokeWidth?: number;
}

const CircleIcon: React.FC<CircleIconProps> = ({
  className,
  radius = 12,
  strokeWidth = 1,
}) => {
  const diameter = radius * 2;

  return (
    <div className={clsx('overflow-hidden', className)}>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox={`0 0 ${diameter + 2 * strokeWidth} ${
          diameter + 2 * strokeWidth
        }`}
        width={diameter} // Set the width based on the diameter
        height={diameter} // Set the height based on the diameter
        fill='none'
        stroke='currentColor'
        strokeWidth={strokeWidth} // Adjust this value to change the stroke width
      >
        <circle
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
          r={radius}
        />
      </svg>
    </div>
  );
};

export default CircleIcon;
