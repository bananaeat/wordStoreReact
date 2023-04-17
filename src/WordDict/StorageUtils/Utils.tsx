// Save data to localStorage
export const saveToLocal = (key: string, data: any) => {
    try {
        const jsonData = JSON.stringify(data);
        localStorage.setItem(key, jsonData);
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
};

// Load data from localStorage
export const loadFromLocal = (key: string) => {
    try {
        const jsonData = localStorage.getItem(key);
        return jsonData
            ? JSON.parse(jsonData)
            : null;
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return null;
    }
};