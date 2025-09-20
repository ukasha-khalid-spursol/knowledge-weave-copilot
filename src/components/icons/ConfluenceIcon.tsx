import React from 'react';
import confluenceIcon from '@/assets/confluence-icon.png';

interface IconProps {
  className?: string;
  size?: number;
}

export const ConfluenceIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => {
  return (
    <img
      src={confluenceIcon}
      alt="Confluence"
      className={className}
      width={size}
      height={size}
      style={{ objectFit: 'contain' }}
    />
  );
};