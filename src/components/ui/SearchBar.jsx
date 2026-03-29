import { useState, useCallback, useEffect } from 'react';

export default function SearchBar({ onChange, variant = 'full', defaultValue = '' }) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleChange = useCallback((e) => {
    const newValue = e.target.value;
    setValue(newValue);

    // 300ms debounce
    const debounceTimer = setTimeout(() => {
      onChange?.(newValue);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [onChange]);

  const handleClear = () => {
    setValue('');
    onChange?.('');
  };

  if (variant === 'compact') {
    return (
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Search beers..."
        style={{
          width: '100%',
          padding: '8px 12px 8px 32px',
          borderRadius: '4px',
          border: `2px solid var(--border-subtle)`,
          backgroundColor: 'var(--background-secondary)',
          color: 'var(--text-primary)',
          fontSize: '14px',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23E8920A' stroke-width='2'%3E%3Ccircle cx='11' cy='11' r='8'%3E%3C/circle%3E%3Cpath d='m21 21-4.35-4.35'%3E%3C/path%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: '8px center',
          outline: 'none',
        }}
      />
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '500px' }}>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Search beers, brewers, styles..."
        style={{
          width: '100%',
          padding: '12px 40px 12px 40px',
          borderRadius: '6px',
          border: `2px solid var(--border-subtle)`,
          backgroundColor: 'var(--background-secondary)',
          color: 'var(--text-primary)',
          fontSize: '16px',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%23E8920A' stroke-width='2'%3E%3Ccircle cx='11' cy='11' r='8'%3E%3C/circle%3E%3Cpath d='m21 21-4.35-4.35'%3E%3C/path%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: '12px center',
          outline: 'none',
          transition: 'border-color 200ms ease',
        }}
        onFocus={(e) => e.target.style.borderColor = 'var(--accent-amber)'}
        onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
      />
      {value && (
        <button
          onClick={handleClear}
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            color: 'var(--text-secondary)',
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
}
