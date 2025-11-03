import React from 'react';

/**
 * Simple component to allow the user to select a color from predefined swatches.
 * @param {object} props
 * @param {string} props.selectedColor - The currently selected hex color string.
 * @param {function} props.onChange - Callback function when a color is selected.
 */
const ColorPicker = ({ selectedColor, onChange }) => {
  // Define a set of default, visually appealing colors for projects
  const colors = [
    '#34495e', // Dark Blue/Gray
    '#27ae60', // Emerald Green
    '#8e44ad', // Amethyst Purple
    '#e67e22', // Carrot Orange
    '#2980b9', // Belize Hole Blue
    '#e74c3c', // Alizarin Red
    '#f1c40f', // Sun Flower Yellow
    '#95a5a6', // Concrete Gray
  ];

  const handleColorChange = (color) => {
    onChange(color);
  };

  return (
    <div className="colorPickerContainer">
      {colors.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => handleColorChange(color)}
          style={{ backgroundColor: color, borderColor: color === selectedColor ? '#3b82f6' : 'transparent' }}
          aria-label={`Select color ${color}`}
        >
          {/* Checkmark icon for the selected color */}
          {selectedColor === color && (
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-full w-full p-1" 
              viewBox="0 0 24 24" 
              fill="#FFFFFF"
            >
              <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
            </svg>
          )}
        </button>
      ))}
      <input
        type="color"
        value={selectedColor}
        onChange={(e) => handleColorChange(e.target.value)}
        className="w-8 h-8 p-0 border-none rounded-full cursor-pointer overflow-hidden shadow-md"
        style={{ margin: 0 }}
        aria-label="Custom color picker"
      />
    </div>
  );
};

export default ColorPicker;