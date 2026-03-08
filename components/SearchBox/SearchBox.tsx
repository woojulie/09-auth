'use client';

import { useState, useEffect } from 'react';
import css from './SearchBox.module.css';
import { useDebouncedCallback } from 'use-debounce';

interface SearchBoxProps {
  onSearch: (value: string) => void;
  initialValue?: string;
}

export default function SearchBox({ onSearch, initialValue = '' }: SearchBoxProps) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const debouncedSearch = useDebouncedCallback((val: string) => {
    onSearch(val);
  }, 500);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    debouncedSearch(newValue);
  };

  return (
    <input
      className={css.input}
      type="text"
      value={value}
      onChange={handleChange}
      placeholder="Search notes..."
    />
  );
}
