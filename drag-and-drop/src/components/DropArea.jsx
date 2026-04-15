import React from "react";
import { useState } from "react";
import "./DropArea.css";

const DropArea = () => {
  const [showDropArea, setShowDropArea] = useState(false);
  return (
    <section
      onDragEnter={() => setShowDropArea(true)}
      onDragLeave={() => setShowDropArea(false)}
      className={showDropArea ? "drop_area" : "hide_drop"}
    >
      Drop Here
    </section>
  );
};

export default DropArea;
