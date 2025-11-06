import { SavedTest } from '../types';

const DB_NAME = 'BoardExamPrepDB';
const STORE_NAME = 'testHistory';
const DB_VERSION = 1;

let db: IDBDatabase;

const initDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        if (db) {
            return resolve(db);
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = (event) => {
            console.error("IndexedDB error:", request.error);
            reject("Error opening database");
        };

        request.onsuccess = (event) => {
            db = (event.target as IDBOpenDBRequest).result;
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const dbInstance = (event.target as IDBOpenDBRequest).result;
            if (!dbInstance.objectStoreNames.contains(STORE_NAME)) {
                // 'id' is the key path
                dbInstance.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        };
    });
};

export const getTestHistory = async (): Promise<SavedTest[]> => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const getAllRequest = store.getAll();

        getAllRequest.onsuccess = () => {
            // Sort by date, newest first
            const sortedResults = getAllRequest.result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            resolve(sortedResults);
        };

        getAllRequest.onerror = () => {
            console.error('Error fetching history:', getAllRequest.error);
            reject('Failed to retrieve test history.');
        };
    });
};

export const saveTest = async (test: SavedTest): Promise<void> => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const putRequest = store.put(test);

        putRequest.onsuccess = () => {
            resolve();
        };

        putRequest.onerror = () => {
            console.error('Error saving test:', putRequest.error);
            reject('Failed to save the test.');
        };
    });
};

export const clearTestHistory = async (): Promise<void> => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const clearRequest = store.clear();
        
        clearRequest.onsuccess = () => {
            resolve();
        };

        clearRequest.onerror = () => {
            console.error('Error clearing history:', clearRequest.error);
            reject('Failed to clear test history.');
        };
    });
};