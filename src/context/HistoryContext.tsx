import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ScanLog {
    id: string;
    date: string; // ISO date string or formatted date
    score: number;
    issues: string[];
}

export interface RoutineLog {
    date: string; // YYYY-MM-DD
    completionRate: number; // 0-100
}

interface HistoryContextType {
    scanHistory: ScanLog[];
    routineHistory: RoutineLog[];
    addScanLog: (score: number, issues: string[]) => void;
    logDailyRoutine: (completionRate: number) => void;
    getWeeklyRoutineStats: () => { day: string; score: number }[];
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [scanHistory, setScanHistory] = useState<ScanLog[]>([]);
    const [routineHistory, setRoutineHistory] = useState<RoutineLog[]>([]);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            const scans = await AsyncStorage.getItem('scan_history');
            const routines = await AsyncStorage.getItem('routine_history');

            if (scans) setScanHistory(JSON.parse(scans));
            else {
                // Seed mock data for first time
                const mockScans = [
                    { id: '1', date: new Date(Date.now() - 86400000 * 5).toISOString(), score: 65, issues: ['Acne'] },
                    { id: '2', date: new Date(Date.now() - 86400000 * 2).toISOString(), score: 72, issues: ['Dryness'] },
                ];
                setScanHistory(mockScans);
            }

            if (routines) setRoutineHistory(JSON.parse(routines));
            else {
                // Seed mock data
                const mockRoutines = [
                    { date: new Date(Date.now() - 86400000 * 6).toISOString().split('T')[0], completionRate: 60 },
                    { date: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0], completionRate: 80 },
                    { date: new Date(Date.now() - 86400000 * 4).toISOString().split('T')[0], completionRate: 70 },
                    { date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0], completionRate: 90 },
                    { date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0], completionRate: 85 },
                    { date: new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0], completionRate: 95 },
                ];
                setRoutineHistory(mockRoutines);
            }
        } catch (error) {
            console.error('Failed to load history', error);
        }
    };

    const saveData = async (key: string, value: any) => {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Failed to save ${key}`, error);
        }
    };

    const addScanLog = (score: number, issues: string[]) => {
        const newLog: ScanLog = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            score,
            issues
        };
        const updated = [newLog, ...scanHistory];
        setScanHistory(updated);
        saveData('scan_history', updated);
    };

    const logDailyRoutine = (completionRate: number) => {
        const today = new Date().toISOString().split('T')[0];
        // Check if log for today exists
        const existingIndex = routineHistory.findIndex(log => log.date === today);
        let updated;

        if (existingIndex >= 0) {
            updated = [...routineHistory];
            updated[existingIndex].completionRate = completionRate;
        } else {
            updated = [...routineHistory, { date: today, completionRate }];
        }

        setRoutineHistory(updated);
        saveData('routine_history', updated);
    };

    const getWeeklyRoutineStats = () => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const today = new Date();
        const stats = [];

        // Get last 7 days
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const dayName = days[d.getDay()];

            const log = routineHistory.find(l => l.date === dateStr);
            stats.push({
                day: dayName,
                score: log ? log.completionRate : 0
            });
        }
        return stats;
    };

    return (
        <HistoryContext.Provider value={{
            scanHistory,
            routineHistory,
            addScanLog,
            logDailyRoutine,
            getWeeklyRoutineStats
        }}>
            {children}
        </HistoryContext.Provider>
    );
};

export const useHistory = () => {
    const context = useContext(HistoryContext);
    if (!context) throw new Error('useHistory must be used within HistoryProvider');
    return context;
};
