import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

export interface ScanLog {
    id: string;
    date: string;
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
    refreshHistory: () => Promise<void>;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [scanHistory, setScanHistory] = useState<ScanLog[]>([]);
    const [routineHistory, setRoutineHistory] = useState<RoutineLog[]>([]);

    useEffect(() => {
        if (user?.id) {
            loadHistory();
        } else {
            setScanHistory([]);
            setRoutineHistory([]);
        }
    }, [user?.id]);

    const loadHistory = async () => {
        if (!user?.id) return;
        try {
            // Load real scan history
            const { data: scansData, error: scansError } = await supabase
                .from('scans')
                .select('id, created_at, skin_score, issues')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (scansError) throw scansError;

            const mappedScans: ScanLog[] = scansData.map((s: any) => {
                // Extract names of detected issues if stored as objects
                const issuesArray = s.issues || [];
                const issueNames = Array.isArray(issuesArray) && issuesArray.length > 0 && typeof issuesArray[0] === 'object'
                    ? issuesArray.filter((i: any) => i.detected).map((i: any) => i.name)
                    : (Array.isArray(issuesArray) ? issuesArray : []);

                return {
                    id: s.id,
                    date: s.created_at,
                    score: s.skin_score,
                    issues: issueNames
                };
            });
            setScanHistory(mappedScans);

            // Load routine logs for the last 30 days
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const { data: routinesData, error: routinesError } = await supabase
                .from('routine_logs')
                .select('date, completion_rate')
                .eq('user_id', user.id)
                .gte('date', thirtyDaysAgo.toISOString().split('T')[0])
                .order('date', { ascending: false });

            if (routinesError) throw routinesError;

            if (routinesData) {
                const mappedRoutines: RoutineLog[] = routinesData.map((r: any) => ({
                    date: r.date,
                    completionRate: r.completion_rate
                }));
                setRoutineHistory(mappedRoutines);
            }

        } catch (error) {
            console.error('Failed to load history', error);
        }
    };

    const addScanLog = (score: number, issues: string[]) => {
        // We already add scans to the database in ScanService. This context function
        // is legacy, but we can keep it purely to optimistically update the state.
        const newLog: ScanLog = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            score,
            issues
        };
        setScanHistory(prev => [newLog, ...prev]);
    };

    const logDailyRoutine = (completionRate: number) => {
        // Let RoutineContext handle the actual db update, just update local state here
        const today = new Date().toISOString().split('T')[0];
        const existingIndex = routineHistory.findIndex(log => log.date === today);
        let updated;

        if (existingIndex >= 0) {
            updated = [...routineHistory];
            updated[existingIndex].completionRate = completionRate;
        } else {
            updated = [{ date: today, completionRate }, ...routineHistory];
        }

        setRoutineHistory(updated);
    };

    const getWeeklyRoutineStats = () => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const today = new Date();
        const currentDay = today.getDay();
        const diffToMonday = currentDay === 0 ? 6 : currentDay - 1;

        const monday = new Date(today);
        monday.setDate(today.getDate() - diffToMonday);
        monday.setHours(0, 0, 0, 0);

        const stats = [];

        // Get Monday to Sunday for this week
        for (let i = 0; i < 7; i++) {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
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

    const refreshHistory = async () => {
        await loadHistory();
    };

    return (
        <HistoryContext.Provider value={{
            scanHistory,
            routineHistory,
            addScanLog,
            logDailyRoutine,
            getWeeklyRoutineStats,
            refreshHistory
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
