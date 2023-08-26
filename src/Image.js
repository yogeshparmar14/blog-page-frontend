import React from 'react';

const Image = ({ imageUrl, altText }) => {
  return <img src="https://images.unsplash.com/photo-1420593248178-d88870618ca0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bmF0dXJhbHxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80" alt={altText} className="blog-image" />;
};

export default Image;
