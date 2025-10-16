// Helper functions to manage localStorage

export const saveToLocalStorage = (key: string, data: any): boolean => {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
    console.log(`Saved to localStorage: ${key}`, data);
    return true;
  } catch (error) {
    console.error(`Error saving to localStorage: ${key}`, error);
    return false;
  }
};

export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const serializedData = localStorage.getItem(key);
    if (serializedData === null) {
      console.log(`No data found in localStorage for key: ${key}, using default`);
      return defaultValue;
    }
    const parsedData = JSON.parse(serializedData) as T;
    console.log(`Loaded from localStorage: ${key}`, parsedData);
    return parsedData;
  } catch (error) {
    console.error(`Error loading from localStorage: ${key}`, error);
    return defaultValue;
  }
};

export const clearLocalStorageItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
    console.log(`Cleared localStorage item: ${key}`);
  } catch (error) {
    console.error(`Error clearing localStorage item: ${key}`, error);
  }
};

export const debugLocalStorage = (): void => {
  console.log("Local Storage Debug:");
  const items: Record<string, string> = {};
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      items[key] = localStorage.getItem(key) || 'null';
    }
  }
  
  console.table(items);
};