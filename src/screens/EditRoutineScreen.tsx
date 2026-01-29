import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { ChevronLeft, Plus, Trash2, Clock, Sun, Moon } from 'lucide-react-native';
import { useRoutine, RoutineTask } from '../context/RoutineContext';
import { LinearGradient } from 'expo-linear-gradient';

export function EditRoutineScreen({ navigation }: { navigation: any }) {
    const { morningTasks, nightTasks, addTask, removeTask } = useRoutine();
    const [activeTab, setActiveTab] = useState<'morning' | 'night'>('morning');
    const [newItemName, setNewItemName] = useState('');
    const [newItemTime, setNewItemTime] = useState('');

    const tasks = activeTab === 'morning' ? morningTasks : nightTasks;

    const handleAdd = () => {
        if (newItemName.trim()) {
            addTask(newItemName, activeTab, newItemTime || undefined);
            setNewItemName('');
            setNewItemTime('');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Routine</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'morning' && styles.activeTab]}
                    onPress={() => setActiveTab('morning')}
                >
                    <Sun size={20} color={activeTab === 'morning' ? '#14B8A6' : '#9CA3AF'} />
                    <Text style={[styles.tabText, activeTab === 'morning' && styles.activeTabText]}>Morning</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'night' && styles.activeTab]}
                    onPress={() => setActiveTab('night')}
                >
                    <Moon size={20} color={activeTab === 'night' ? '#14B8A6' : '#9CA3AF'} />
                    <Text style={[styles.tabText, activeTab === 'night' && styles.activeTabText]}>Evening</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {tasks.map((task) => (
                    <View key={task.id} style={styles.taskItem}>
                        <View style={styles.taskInfo}>
                            <Text style={styles.taskName}>{task.name}</Text>
                            <View style={styles.taskTimeContainer}>
                                <Clock size={14} color="#9CA3AF" />
                                <Text style={styles.taskTime}>{task.time}</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={() => removeTask(task.id, activeTab)}
                            style={styles.deleteButton}
                        >
                            <Trash2 size={20} color="#EF4444" />
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.inputContainer}
            >
                <Text style={styles.inputLabel}>Add New Step</Text>
                <View style={styles.inputRow}>
                    <TextInput
                        style={styles.input}
                        placeholder="Product name (e.g. Vitamin C)"
                        value={newItemName}
                        onChangeText={setNewItemName}
                    />
                    <TextInput
                        style={[styles.input, styles.timeInput]}
                        placeholder="Time"
                        value={newItemTime}
                        onChangeText={setNewItemTime}
                    />
                    <TouchableOpacity onPress={handleAdd} style={styles.addButton}>
                        <LinearGradient
                            colors={['#14B8A6', '#10B981']}
                            style={styles.addButtonGradient}
                        >
                            <Plus size={24} color="white" />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAF7F5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    backButton: {
        padding: 8,
        borderRadius: 12,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    tabs: {
        flexDirection: 'row',
        padding: 16,
        gap: 12,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 12,
        backgroundColor: 'white',
        gap: 8,
    },
    activeTab: {
        borderWidth: 2,
        borderColor: '#14B8A6',
    },
    tabText: {
        fontWeight: '600',
        color: '#9CA3AF',
    },
    activeTabText: {
        color: '#14B8A6',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
    },
    taskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    taskInfo: {
        flex: 1,
    },
    taskName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    taskTimeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    taskTime: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    deleteButton: {
        padding: 8,
        backgroundColor: '#FEF2F2',
        borderRadius: 8,
    },
    inputContainer: {
        padding: 24,
        backgroundColor: 'white',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 10,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#374151',
        marginBottom: 12,
    },
    inputRow: {
        flexDirection: 'row',
        gap: 12,
    },
    input: {
        flex: 2,
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 50,
        fontSize: 14,
    },
    timeInput: {
        flex: 1,
    },
    addButton: {
        width: 50,
        height: 50,
    },
    addButtonGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
