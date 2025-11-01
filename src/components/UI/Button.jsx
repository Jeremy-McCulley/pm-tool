import React from 'react';

/**
 * Reusable button component with support for different styles (variants) and loading state.
 *
 * @param {object} props
 * @param {string} [props.variant='primary'] - Defines the button style: 'primary', 'secondary', 'danger', or 'ghost'.
 * @param {boolean} [props.isLoading=false] - If true, displays a loading spinner and disables the button.
 * @param {string} [props.type='button'] - Button type (e.g., 'submit', 'button').
 * @param {React.ReactNode} props.children - The content inside the button (text, icons).
 * @param {string} [props.className] - Additional CSS classes to apply.
 * @param {function} [props.onClick] - Click handler function.
 * @param {boolean} [props.disabled] - Standard disabled prop.
 */
const Button = ({
  variant = 'primary',
  isLoading = false,
  type = 'button',
  children,
  className = '',
  onClick,
  disabled,
  ...rest
}) => {
  // Define base and variant styles using Tailwind CSS classes
  const baseClasses = 
    "px-4 py-2 text-sm font-medium rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center space-x-2";

  const variantClasses = {
    // Primary: Used for main actions (e.g., Save, Create Project)
    primary: 'text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
    // Secondary: Used for less critical actions (e.g., Cancel, Minor Edits)
    secondary: 'text-gray-700 bg-gray-200 hover:bg-gray-300 focus:ring-gray-400',
    // Danger: Used for destructive actions (e.g., Delete)
    danger: 'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500',
    // Ghost: Used for subtle actions, often with an icon (e.g., simple navigation or menu buttons)
    ghost: 'text-gray-700 bg-transparent shadow-none hover:bg-gray-100 focus:ring-transparent',
  };

  const currentClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <button
      type={type}
      className={currentClasses}
      onClick={onClick}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <>
          {/* Simple Tailwind/CSS Spinner */}
          <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;