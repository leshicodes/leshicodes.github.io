import React from 'react';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  width: string;
  className?: string;
}

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({ 
  src, 
  alt, 
  width,
  className = ''
}) => {
  return (
    <img 
      src={src} 
      alt={alt} 
      style={{ maxWidth: width, height: 'auto' }} 
      className={className}
    />
  );
};

export default ResponsiveImage;