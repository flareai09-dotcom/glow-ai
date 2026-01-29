import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface RoutineTask {
    id: string;
    name: string;
    completed: boolean;
    time: string; // e.g., "7:30 AM" or "Pending" if not done, or target time
    category: 'morning' | 'night';
}

interface RoutineContextType {
    morningTasks: RoutineTask[];
    nightTasks: RoutineTask[];
    toggleTask: (id: string, category: 'morning' | 'night') => void;
    addTask: (name: string, category: 'morning' | 'night', time?: string) => void;
    removeTask: (id: string, category: 'morning' | 'night') => void;
    resetDailyTasks: () => void;
}

const defaultMorning: RoutineTask[] = [
    { id: 'm1', name: 'Cleanser', completed: false, time: '7:30 AM', category: 'morning' },
    { id: 'm2', name: 'Toner', completed: false, time: '7:35 AM', category: 'morning' },
    { id: 'm3', name: 'Serum', completed: false, time: '7:40 AM', category: 'morning' },
    { id: 'm4', name: 'Moisturizer', completed: false, time: '7:45 AM', category: 'morning' },
    { id: 'm5', name: 'Sunscreen', completed: false, time: '7:50 AM', category: 'morning' },
];

const defaultNight: RoutineTask[] = [
    { id: 'n1', name: 'Cleanser', completed: false, time: '9:00 PM', category: 'night' },
    { id: 'n2', name: 'Toner', completed: false, time: '9:05 PM', category: 'night' },
    { id: 'n3', name: 'Treatment', completed: false, time: '9:10 PM', category: 'night' },
    { id: 'n4', name: 'Night Cream', completed: false, time: '9:15 PM', category: 'night' },
];

const RoutineContext = createContext<RoutineContextType | undefined>(undefined);

export const RoutineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [morningTasks, setMorningTasks] = useState<RoutineTask[]>(defaultMorning);
    const [nightTasks, setNightTasks] = useState<RoutineTask[]>(defaultNight);
    const [lastOpened, setLastOpened] = useState<string>('');

    useEffect(() => {
        loadRoutine();
    }, []);

    const loadRoutine = async () => {
        try {
            const storedMorning = await AsyncStorage.getItem('morning_routine');
            const storedNight = await AsyncStorage.getItem('night_routine');
            const storedDate = await AsyncStorage.getItem('last_routine_date');

            const today = new Date().toDateString();

            if (storedDate !== today) {
                // New day, reset completion but keep structure if customized users exist
                // For now just reset default structure if it's a new day or if nothing stored
                // In a real app we'd keep the list but reset 'completed' to false
                if (storedMorning) {
                    const parsedM = JSON.parse(storedMorning);
                    setMorningTasks(parsedM.map((t: RoutineTask) => ({ ...t, completed: false })));
                }
                if (storedNight) {
                    const parsedN = JSON.parse(storedNight);
                    setNightTasks(parsedN.map((t: RoutineTask) => ({ ...t, completed: false })));
                }
                setLastOpened(today);
                await AsyncStorage.setItem('last_routine_date', today);
            } else {
                if (storedMorning) setMorningTasks(JSON.parse(storedMorning));
                if (storedNight) setNightTasks(JSON.parse(storedNight));
            }

        } catch (error) {
            console.error('Failed to load routine', error);
        }
    };

    const saveRoutine = async (m: RoutineTask[], n: RoutineTask[]) => {
        try {
            await AsyncStorage.setItem('morning_routine', JSON.stringify(m));
            await AsyncStorage.setItem('night_routine', JSON.stringify(n));
        } catch (error) {
            console.error('Failed to save routine', error);
        }
    };

    const toggleTask = (id: string, category: 'morning' | 'night') => {
        if (category === 'morning') {
            const updated = morningTasks.map(t =>
                t.id === id ? { ...t, completed: !t.completed } : t
            );
            setMorningTasks(updated);
            saveRoutine(updated, nightTasks);
        } else {
            const updated = nightTasks.map(t =>
                t.id === id ? { ...t, completed: !t.completed } : t
            );
            setNightTasks(updated);
            saveRoutine(morningTasks, updated);
        }
    };

    const addTask = (name: string, category: 'morning' | 'night', time?: string) => {
        const newTask: RoutineTask = {
            id: Date.now().toString(),
            name,
            completed: false,
            time: time || (category === 'morning' ? '8:00 AM' : '9:00 PM'),
            category
        };

        if (category === 'morning') {
            const updated = [...morningTasks, newTask];
            setMorningTasks(updated);
            saveRoutine(updated, nightTasks);
        } else {
            const updated = [...nightTasks, newTask];
            setNightTasks(updated);
            saveRoutine(morningTasks, updated);
        }
    };

    const removeTask = (id: string, category: 'morning' | 'night') => {
        if (category === 'morning') {
            const updated = morningTasks.filter(t => t.id !== id);
            setMorningTasks(updated);
            saveRoutine(updated, nightTasks);
        } else {
            const updated = nightTasks.filter(t => t.id !== id);
            setNightTasks(updated);
            saveRoutine(morningTasks, updated);
        }
    };

    // Explicit reset for debugging or manual trigger
    const resetDailyTasks = () => {
        const m = morningTasks.map(t => ({ ...t, completed: false }));
        const n = nightTasks.map(t => ({ ...t, completed: false }));
        setMorningTasks(m);
        setNightTasks(n);
        saveRoutine(m, n);
    };

    return (
        <RoutineContext.Provider value={{
            morningTasks,
            nightTasks,
            toggleTask,
            addTask,
            removeTask,
            resetDailyTasks
        }}>
            {children}
        </RoutineContext.Provider>
    );
};

export const useRoutine = () => {
    const context = useContext(RoutineContext);
    if (!context) throw new Error('useRoutine must be used within RoutineProvider');
    return context;
};
