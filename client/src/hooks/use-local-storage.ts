import { useEffect, useState } from "react";

export default function useLocalStorage<T>(
  key: string,
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>();

  useEffect(() => {
    // Retrieve from localStorage
    const item = window.localStorage.getItem(key);
    if (item) {
      setStoredValue(JSON.parse(item as string));
    }
  }, [key]);

  const setValue = (value: T) => {
    // Save state
    setStoredValue(value);
    // Save to localStorage
    window.localStorage.setItem(key, JSON.stringify(value));
  };
  return [storedValue, setValue];
}
