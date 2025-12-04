import { useState, useRef } from 'react';

export interface DropdownOption {
  label: string;
  value: string;
}

interface CustomDropdownProps {
  placeholder?: string;
  value?: string;
  options: DropdownOption[];
  onChange: (value: string ) => void;
  width?: number | string;
}

export default function CustomDropdown({
  placeholder = 'Chọn',
  value,
  options,
  onChange,
  width = 150,
}: CustomDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value)?.label;

  return (
    <div
      className={`dropdown ${open ? 'open' : ''}`}
      style={{ width }}
      tabIndex={0}
      onBlur={() => setOpen(false)}
      ref={ref}
    >
      {/* Nút */}
      <button onClick={() => setOpen(!open)}>
        {selected || placeholder}
        <span style={{ float: 'right' }}>v</span>
      </button>

      {/* Menu */}
      <div className="dropdown-content">
        {options.map((opt) => (
          <div
            key={opt.value}
            className="dropdown-item"
            onMouseDown={() => {
              onChange(opt.value);
              setOpen(false);
            }}
            style={{
              padding: '6px 12px',
              cursor: 'pointer',
            }}
          >
            {opt.label}
          </div>
        ))}
      </div>
    </div>
  );
}
