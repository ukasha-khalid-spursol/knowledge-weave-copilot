import React from 'react';
import notionIcon from '@/assets/notion-icon.png';

interface IconProps {
  className?: string;
  size?: number;
}

export const NotionIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => {
  return (
    <img
      src={notionIcon}
      alt="Notion"
      className={className}
      width={size}
      height={size}
      style={{ objectFit: 'contain' }}
    />
  );
};