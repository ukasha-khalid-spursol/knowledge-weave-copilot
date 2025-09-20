import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

export const JiraIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      width={size}
      height={size}
    >
      <path d="M11.53 2c0 2.4 1.97 4.35 4.35 4.35h1.78v1.7c0 2.4 1.96 4.35 4.35 4.35V2.84a.84.84 0 0 0-.84-.84H11.53zM6.77 6.8c0 2.4 1.94 4.35 4.35 4.35h1.78v1.7c0 2.4 1.97 4.35 4.35 4.35V7.63a.84.84 0 0 0-.84-.83H6.77zM2 11.6c0 2.4 1.95 4.35 4.35 4.35h1.78v1.7c0 2.38 1.96 4.35 4.35 4.35v-9.57a.84.84 0 0 0-.84-.83H2z"/>
    </svg>
  );
};