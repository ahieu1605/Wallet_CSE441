import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function getDaysArray(start: Date, end: Date) {
    const arr = [];
    let dt = new Date(start);
    while (dt <= end) {
        arr.push(new Date(dt));
        dt.setDate(dt.getDate() + 1);
    }
    return arr;
}

function getCalendarMatrix(days: Date[]) {
    const matrix = [];
    let week = new Array(7).fill(null);
    let firstDay = days[0].getDay(); // 0: Sun, 1: Mon, ...
    let startIdx = (firstDay + 6) % 7; // 0: Mon, 6: Sun
    let dayIdx = 0;
    for (let i = 0; i < 7; i++) {
        if (i < startIdx) week[i] = null;
        else week[i] = days[dayIdx++];
    }
    matrix.push(week);
    while (dayIdx < days.length) {
        week = new Array(7).fill(null);
        for (let i = 0; i < 7 && dayIdx < days.length; i++) {
            week[i] = days[dayIdx++];
        }
        matrix.push(week);
    }
    return matrix;
}

interface GoalCalendarProps {
    goal: number;
    startDate: Date;
    endDate: Date;
}

const GoalCalendar: React.FC<GoalCalendarProps> = ({ goal, startDate, endDate }) => {
    const days = getDaysArray(startDate, endDate);
    const calendar = getCalendarMatrix(days);
    const totalDays = days.length;
    const dailyAmount = Math.ceil(goal / totalDays / 1000) * 1000;
    let accum = 0;
    const accumAmounts = days.map(() => (accum += dailyAmount));
    const [saved, setSaved] = useState<boolean[]>(Array(totalDays).fill(false));

    const toggleSaved = (idx: number) => {
        setSaved((prev) => {
            const copy = [...prev];
            copy[idx] = !copy[idx];
            return copy;
        });
    };

    return (
        <View style={styles.calendarWrap}>
            <ScrollView horizontal>
                <View>
                    {/* Header */}
                    <View style={styles.row}>
                        {WEEK_DAYS.map((d) => (
                            <View style={styles.headerCell} key={d}>
                                <Text style={styles.headerText}>{d}</Text>
                            </View>
                        ))}
                    </View>
                    {/* Calendar Rows */}
                    {calendar.map((week, i) => (
                        <View style={styles.row} key={i}>
                            {week.map((date, j) => {
                                if (!date) return <View style={styles.cell} key={j} />;
                                const idx = days.findIndex(
                                    (d) => d.toDateString() === date.toDateString()
                                );
                                const isSaved = saved[idx];
                                return (
                                    <TouchableOpacity
                                        style={[styles.cell, isSaved && styles.savedCell]}
                                        key={j}
                                        onPress={() => toggleSaved(idx)}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={styles.dateText}>{date.getDate()}</Text>
                                        <Text style={styles.amountText}>{accumAmounts[idx].toLocaleString()}</Text>
                                        {isSaved && <Text style={styles.checkMark}>✓</Text>}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

export default GoalCalendar;

const styles = StyleSheet.create({
    calendarWrap: {
        marginTop: 10,
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
    },
    headerCell: {
        flex: 1,
        backgroundColor: '#f9e7a1',
        padding: 6,
        borderWidth: 0.5,
        borderColor: '#f3e2a9',
        alignItems: 'center',
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 15,
    },
    cell: {
        flex: 1,
        minHeight: 60,
        borderWidth: 0.5,
        borderColor: '#f3e2a9',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fffbe7',
        padding: 2,
        position: 'relative',
    },
    savedCell: {
        backgroundColor: '#c6f7e2',
        borderColor: '#2ecc71',
    },
    dateText: {
        fontSize: 14,
        color: '#6d4c00',
    },
    amountText: {
        fontSize: 13,
        color: '#b8860b',
        fontWeight: 'bold',
    },
    checkMark: {
        position: 'absolute',
        right: 4,
        top: 2,
        color: '#2ecc71',
        fontWeight: 'bold',
        fontSize: 18,
    },
});
