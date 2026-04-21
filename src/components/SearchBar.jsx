import { useState, useCallback, useRef } from 'react';
import { Search, X } from 'lucide-react';
import styles from './SearchBar.module.css';

export default function SearchBar({ onSearch, placeholder = 'Search by name, role, company…' }) {
  const [value, setValue] = useState('');
  const debounceRef = useRef(null);

  const handleChange = useCallback(
    (e) => {
      const val = e.target.value;
      setValue(val);
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => onSearch(val), 400);
    },
    [onSearch]
  );

  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  return (
    <div className={styles.wrap}>
      <Search size={17} className={styles.icon} />
      <input
        type="text"
        className={styles.input}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label="Search profiles"
      />
      {value && (
        <button className={styles.clear} onClick={handleClear} aria-label="Clear search">
          <X size={15} />
        </button>
      )}
    </div>
  );
}
