import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { ChevronLeft, Calendar, TrendingUp } from 'lucide-react-native';

const historyData = [
    { date: 'Today', score: 78, improvements: ['Less redness', 'Better hydration'], image: null },
    { date: 'Yesterday', score: 75, improvements: ['Reduced acne'], image: null },
    { date: 'Jan 25', score: 72, improvements: [], image: null },
    { date: 'Jan 20', score: 68, improvements: ['Starting baseline'], image: null },
];

export function HistoryScreen({ navigation }: { navigation: any }) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Scan History</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.chartCard}>
                    <View style={styles.chartHeader}>
                        <TrendingUp size={20} color="#14B8A6" />
                        <Text style={styles.chartTitle}>Progress Trend</Text>
                    </View>
                    <View style={styles.placeholderChart}>
                        <View style={[styles.bar, { height: '60%' }]} />
                        <View style={[styles.bar, { height: '70%' }]} />
                        <View style={[styles.bar, { height: '75%' }]} />
                        <View style={[styles.bar, { height: '78%', backgroundColor: '#14B8A6' }]} />
                    </View>
                    <View style={styles.chartLabels}>
                        <Text style={styles.chartLabel}>Jan 20</Text>
                        <Text style={styles.chartLabel}>Today</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Recent Scans</Text>

                <View style={styles.list}>
                    {historyData.map((item, index) => (
                        <TouchableOpacity key={index} style={styles.historyItem}>
                            <View style={styles.dateBox}>
                                <Text style={styles.dateText}>{item.date.split(' ')[0]}</Text>
                                <Text style={styles.dateSub}>{item.date.split(' ')[1] || ''}</Text>
                            </View>
                            <View style={styles.itemContent}>
                                <View style={styles.scoreRow}>
                                    <Text style={styles.scoreLabel}>Skin Score</Text>
                                    <Text style={[styles.scoreValue, { color: item.score >= 75 ? '#10B981' : '#F59E0B' }]}>
                                        {item.score}
                                    </Text>
                                </View>
                                {item.improvements.length > 0 && (
                                    <Text style={styles.improvements}>
                                        {item.improvements.join(' • ')}
                                    </Text>
                                )}
                            </View>
                            <ChevronLeft size={20} color="#D1D5DB" style={{ transform: [{ rotate: '180deg' }] }} />
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
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
    content: {
        padding: 24,
    },
    chartCard: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 20,
        marginBottom: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 4,
    },
    chartHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    placeholderChart: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: 100,
        paddingHorizontal: 16,
        gap: 16,
    },
    bar: {
        flex: 1,
        backgroundColor: '#E5E7EB',
        borderRadius: 8,
    },
    chartLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
        paddingHorizontal: 8,
    },
    chartLabel: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 16,
    },
    list: {
        gap: 12,
    },
    historyItem: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    dateBox: {
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F0FDFA',
        borderRadius: 12,
        paddingVertical: 8,
    },
    dateText: {
        fontWeight: 'bold',
        color: '#14B8A6',
        fontSize: 12,
    },
    dateSub: {
        fontSize: 10,
        color: '#14B8A6',
    },
    itemContent: {
        flex: 1,
    },
    scoreRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    scoreLabel: {
        fontSize: 14,
        color: '#4B5563',
        fontWeight: '500',
    },
    scoreValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    improvements: {
        fontSize: 12,
        color: '#9CA3AF',
    },
});
