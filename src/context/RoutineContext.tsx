import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

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

const defaultTasks = [
    { name: 'Cleanser', category: 'morning', time: '7:30 AM' },
    { name: 'Toner', category: 'morning', time: '7:35 AM' },
    { name: 'Serum', category: 'morning', time: '7:40 AM' },
    { name: 'Moisturizer', category: 'morning', time: '7:45 AM' },
    { name: 'Sunscreen', category: 'morning', time: '7:50 AM' },
    { name: 'Cleanser', category: 'night', time: '9:00 PM' },
    { name: 'Toner', category: 'night', time: '9:05 PM' },
    { name: 'Treatment', category: 'night', time: '9:10 PM' },
    { name: 'Night Cream', category: 'night', time: '9:15 PM' },
];

const RoutineContext = createContext<RoutineContextType | undefined>(undefined);

export const RoutineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [morningTasks, setMorningTasks] = useState<RoutineTask[]>([]);
    const [nightTasks, setNightTasks] = useState<RoutineTask[]>([]);

    useEffect(() => {
        if (user?.id) {
            loadRoutine();
        } else {
            setMorningTasks([]);
            setNightTasks([]);
        }
    }, [user?.id]);

    const loadRoutine = async () => {
        if (!user?.id) return;
        try {
            // Fetch tasks
            const { data: tasksData, error: tasksError } = await supabase
                .from('routine_tasks')
                .select('*')
                .eq('user_id', user.id)
                .order('time', { ascending: true });

            if (tasksError) throw tasksError;

            // Handle new user default tasks
            let allTasks = tasksData || [];
            if (allTasks.length === 0) {
                const newTasks = defaultTasks.map(t => ({
                    user_id: user.id,
                    name: t.name,
                    category: t.category,
                    time: t.time,
                    is_default: true
                }));
                const { data: insertedData, error: insertError } = await supabase
                    .from('routine_tasks')
                    .insert(newTasks)
                    .select('*');
                if (insertError) throw insertError;
                allTasks = insertedData || [];
            }

            // Fetch today's log for completions
            const today = new Date().toISOString().split('T')[0];
            const { data: logData, error: logError } = await supabase
                .from('routine_logs')
                .select('completed_task_ids')
                .eq('user_id', user.id)
                .eq('date', today)
                .maybeSingle();

            if (logError && logError.code !== 'PGRST116') throw logError;

            const completedIds = logData?.completed_task_ids || [];

            const mTasks: RoutineTask[] = [];
            const nTasks: RoutineTask[] = [];

            allTasks.forEach((t: any) => {
                const rt: RoutineTask = {
                    id: t.id,
                    name: t.name,
                    category: t.category as 'morning' | 'night',
                    time: t.time,
                    completed: completedIds.includes(t.id)
                };
                if (rt.category === 'morning') mTasks.push(rt);
                else nTasks.push(rt);
            });

            setMorningTasks(mTasks);
            setNightTasks(nTasks);

        } catch (error) {
            console.error('Failed to load routine from Supabase', error);
        }
    };

    const updateLog = async (completedId: string, isAdding: boolean) => {
        if (!user?.id) return;
        const today = new Date().toISOString().split('T')[0];

        try {
            // Get current log
            const { data: logData, error: logError } = await supabase
                .from('routine_logs')
                .select('id, completed_task_ids')
                .eq('user_id', user.id)
                .eq('date', today)
                .maybeSingle();

            if (logError && logError.code !== 'PGRST116') throw logError;

            let newIds = logData?.completed_task_ids || [];

            if (isAdding) {
                if (!newIds.includes(completedId)) newIds.push(completedId);
            } else {
                newIds = newIds.filter((i: string) => i !== completedId);
            }

            const totalCount = morningTasks.length + nightTasks.length;
            const completionRate = totalCount > 0 ? Math.round((newIds.length / totalCount) * 100) : 0;

            if (logData) {
                // Update
                await supabase.from('routine_logs').update({
                    completed_task_ids: newIds,
                    completion_rate: completionRate
                }).eq('id', logData.id);
            } else {
                // Insert
                await supabase.from('routine_logs').insert([{
                    user_id: user.id,
                    date: today,
                    completed_task_ids: newIds,
                    completion_rate: completionRate
                }]);
            }
        } catch (error) {
            console.error('Error updating routine log:', error);
        }
    };

    const toggleTask = async (id: string, category: 'morning' | 'night') => {
        let isNowCompleted = false;

        if (category === 'morning') {
            const updated = morningTasks.map(t => {
                if (t.id === id) {
                    isNowCompleted = !t.completed;
                    return { ...t, completed: isNowCompleted };
                }
                return t;
            });
            setMorningTasks(updated);
        } else {
            const updated = nightTasks.map(t => {
                if (t.id === id) {
                    isNowCompleted = !t.completed;
                    return { ...t, completed: isNowCompleted };
                }
                return t;
            });
            setNightTasks(updated);
        }

        await updateLog(id, isNowCompleted);
    };

    const addTask = async (name: string, category: 'morning' | 'night', time?: string) => {
        if (!user?.id) return;
        try {
            const { data, error } = await supabase
                .from('routine_tasks')
                .insert([{
                    user_id: user.id,
                    name,
                    category,
                    time: time || (category === 'morning' ? '8:00 AM' : '9:00 PM'),
                    is_default: false
                }])
                .select('*')
                .single();

            if (error) throw error;

            const newTask: RoutineTask = {
                id: data.id,
                name: data.name,
                completed: false,
                time: data.time,
                category: data.category
            };

            if (category === 'morning') {
                setMorningTasks([...morningTasks, newTask]);
            } else {
                setNightTasks([...nightTasks, newTask]);
            }
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    const removeTask = async (id: string, category: 'morning' | 'night') => {
        if (!user?.id) return;
        try {
            const { error } = await supabase
                .from('routine_tasks')
                .delete()
                .eq('id', id);

            if (error) throw error;

            if (category === 'morning') {
                setMorningTasks(morningTasks.filter(t => t.id !== id));
            } else {
                setNightTasks(nightTasks.filter(t => t.id !== id));
            }
        } catch (error) {
            console.error('Error removing task:', error);
        }
    };

    const resetDailyTasks = async () => {
        if (!user?.id) return;
        const m = morningTasks.map(t => ({ ...t, completed: false }));
        const n = nightTasks.map(t => ({ ...t, completed: false }));
        setMorningTasks(m);
        setNightTasks(n);

        const today = new Date().toISOString().split('T')[0];
        try {
            await supabase.from('routine_logs').update({
                completed_task_ids: [],
                completion_rate: 0
            }).eq('user_id', user.id).eq('date', today);
        } catch (error) {
            console.error('Error resetting routine:', error);
        }
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
