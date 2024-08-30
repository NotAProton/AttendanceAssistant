import React, { useState, ChangeEvent } from "react";

interface NumberInputProps {
  initialValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
}

const NumberInput: React.FC<NumberInputProps> = ({
  initialValue = 0,
  min = 0,
  max = Infinity,
  step = 1,
  onChange,
}) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      setValue(newValue);
      onChange?.(newValue);
    }
  };

  const handleIncrement = () => {
    const newValue = Math.min(value + step, max);
    setValue(newValue);
    onChange?.(newValue);
  };

  const handleDecrement = () => {
    const newValue = Math.max(value - step, min);
    setValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div className="flex items-center">
      <button
        onClick={handleDecrement}
        disabled={value <= min}
        className="w-8 h-8 text-xl flex items-center justify-center border border-gray-300 rounded-l bg-gray-100 text-gray-600 focus:outline-none hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        -
      </button>
      <input
        type="number"
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
        className="w-8 h-8 text-center border-t border-b border-gray-300 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button
        onClick={handleIncrement}
        disabled={value >= max}
        className="w-8 h-8 text-xl flex items-center justify-center border border-gray-300 rounded-r bg-gray-100 text-gray-600 focus:outline-none hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        +
      </button>
    </div>
  );
};

export default NumberInput;
