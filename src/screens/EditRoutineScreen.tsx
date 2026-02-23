import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput, SafeAreaView, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { ChevronLeft, Plus, Trash2, Clock, Sun, Moon } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRoutine, RoutineTask } from '../context/RoutineContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

export function EditRoutineScreen({ navigation }: { navigation: any }) {
    const { morningTasks, nightTasks, addTask, removeTask } = useRoutine();
    const [activeTab, setActiveTab] = useState<'morning' | 'night'>('morning');
    const [newItemName, setNewItemName] = useState('');
    const [newItemTime, setNewItemTime] = useState('');
    const [showPicker, setShowPicker] = useState(false);
    const [date, setDate] = useState(new Date());

    const { colors } = useTheme();

    const onTimeChange = (event: any, selectedDate?: Date) => {
        setShowPicker(Platform.OS === 'ios');
        if (selectedDate) {
            setDate(selectedDate);
            let hours = selectedDate.getHours();
            const minutes = selectedDate.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12;
            const minutesStr = minutes < 10 ? '0' + minutes : minutes;
            setNewItemTime(`${hours}:${minutesStr} ${ampm}`);
        }
    };

    const tasks = activeTab === 'morning' ? morningTasks : nightTasks;

    const themeStyles = {
        container: { backgroundColor: colors.background },
        headerTitle: { color: colors.text },
        backButton: { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.primary },
        tab: { backgroundColor: colors.card, borderColor: colors.border },
        activeTab: { borderColor: colors.primary },
        tabText: { color: colors.subText },
        activeTabText: { color: colors.primary },
        taskItem: { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.primary },
        taskName: { color: colors.text },
        taskTime: { color: colors.subText },
        deleteButton: { backgroundColor: `${colors.error}1A`, borderColor: `${colors.error}4D` },
        inputContainer: { backgroundColor: colors.background, borderColor: colors.border, shadowColor: colors.primary },
        inputLabel: { color: colors.text },
        input: { backgroundColor: colors.card, borderColor: colors.border, color: colors.text },
    };

    const handleAdd = () => {
        if (newItemName.trim()) {
            addTask(newItemName, activeTab, newItemTime || undefined);
            setNewItemName('');
            setNewItemTime('');
        }
    };

    return (
        <SafeAreaView style={[styles.container, themeStyles.container, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backButton, themeStyles.backButton]}>
                    <ChevronLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, themeStyles.headerTitle]}>Edit Routine</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, themeStyles.tab, activeTab === 'morning' && styles.activeTab, activeTab === 'morning' && themeStyles.activeTab]}
                    onPress={() => setActiveTab('morning')}
                >
                    <Sun size={20} color={activeTab === 'morning' ? colors.primary : colors.subText} />
                    <Text style={[styles.tabText, themeStyles.tabText, activeTab === 'morning' && styles.activeTabText, activeTab === 'morning' && themeStyles.activeTabText]}>Morning</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, themeStyles.tab, activeTab === 'night' && styles.activeTab, activeTab === 'night' && themeStyles.activeTab]}
                    onPress={() => setActiveTab('night')}
                >
                    <Moon size={20} color={activeTab === 'night' ? colors.primary : colors.subText} />
                    <Text style={[styles.tabText, themeStyles.tabText, activeTab === 'night' && styles.activeTabText, activeTab === 'night' && themeStyles.activeTabText]}>Evening</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {tasks.map((task) => (
                    <View key={task.id} style={[styles.taskItem, themeStyles.taskItem]}>
                        <View style={styles.taskInfo}>
                            <Text style={[styles.taskName, themeStyles.taskName]}>{task.name}</Text>
                            <View style={styles.taskTimeContainer}>
                                <Clock size={14} color={colors.subText} />
                                <Text style={[styles.taskTime, themeStyles.taskTime]}>{task.time}</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={() => removeTask(task.id, activeTab)}
                            style={[styles.deleteButton, themeStyles.deleteButton]}
                        >
                            <Trash2 size={20} color={colors.error} />
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={[styles.inputContainer, themeStyles.inputContainer]}
            >
                <Text style={[styles.inputLabel, themeStyles.inputLabel]}>Add New Step</Text>
                <View style={styles.inputRow}>
                    <TextInput
                        style={[styles.input, themeStyles.input]}
                        placeholder="Product name (e.g. Vitamin C)"
                        placeholderTextColor={colors.subText}
                        value={newItemName}
                        onChangeText={setNewItemName}
                    />
                    <TouchableOpacity
                        style={[styles.input, styles.timeInput, themeStyles.input, { justifyContent: 'center' }]}
                        onPress={() => setShowPicker(true)}
                    >
                        <Text style={{ color: newItemTime ? colors.text : colors.subText }}>
                            {newItemTime || "Time"}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleAdd} style={styles.addButton}>
                        <LinearGradient
                            colors={[colors.primary, colors.secondary]}
                            style={styles.addButtonGradient}
                        >
                            <Plus size={24} color="white" />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>

            {showPicker && (
                <DateTimePicker
                    value={date}
                    mode="time"
                    is24Hour={false}
                    display="default"
                    onChange={onTimeChange}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#09090B',
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
        backgroundColor: '#12121A',
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: 'rgba(0, 229, 255, 0.2)',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#E2E8F0',
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
        backgroundColor: '#12121A',
        gap: 8,
        borderWidth: 1,
        borderColor: 'rgba(0, 229, 255, 0.2)',
    },
    activeTab: {
        borderWidth: 2,
        borderColor: '#00E5FF',
    },
    tabText: {
        fontWeight: '600',
        color: '#94A3B8',
    },
    activeTabText: {
        color: '#00E5FF',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
    },
    taskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#12121A',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
        borderWidth: 1,
        borderColor: 'rgba(0, 229, 255, 0.2)',
    },
    taskInfo: {
        flex: 1,
    },
    taskName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#E2E8F0',
        marginBottom: 4,
    },
    taskTimeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    taskTime: {
        fontSize: 12,
        color: '#94A3B8',
    },
    deleteButton: {
        padding: 8,
        backgroundColor: 'rgba(255, 0, 60, 0.1)',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 0, 60, 0.3)',
    },
    inputContainer: {
        padding: 24,
        backgroundColor: '#09090B',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 10,
        borderTopWidth: 1,
        borderColor: 'rgba(0, 229, 255, 0.2)',
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#E2E8F0',
        marginBottom: 12,
    },
    inputRow: {
        flexDirection: 'row',
        gap: 12,
    },
    input: {
        flex: 2,
        backgroundColor: '#12121A',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 50,
        fontSize: 14,
        color: '#E2E8F0',
        borderWidth: 1,
        borderColor: 'rgba(0, 229, 255, 0.2)',
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
