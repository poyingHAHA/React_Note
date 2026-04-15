import React from 'react';
import { useState } from 'react';
import './DropArea.css';

const DropArea = ({ onDrop }) => {
  const [showDropArea, setShowDropArea] = useState(false);
  return (
    <section
      onDragEnter={() => setShowDropArea(true)}
      onDragLeave={() => setShowDropArea(false)}
      onDrop={() => {
        onDrop();
        setShowDropArea(false);
      }}
      onDragOver={(e) => e.preventDefault()}
      className={showDropArea ? 'drop_area' : 'hide_drop'}
    >
      Drop Here
    </section>
  );
};

export default DropArea;
