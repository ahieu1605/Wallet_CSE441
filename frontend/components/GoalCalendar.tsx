import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { styles } from '../assets/styles/home.styles';
import { useAppTheme } from './ThemeProvider';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

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
    const { theme } = useAppTheme();
    const cellHeight = 100;

    const N = days.length;
    const T = goal;
    let a = Math.ceil((T / N * 0.1) / 1000) * 1000;
    let d = Math.ceil((T - N * a) / ((N - 1) * N / 2) / 1000) * 1000;
    let dailyAmounts: number[] = [];
    let total = 0;
    let found = false;
    while (!found && d > 0) {
        dailyAmounts = [];
        for (let n = 1; n < N; n++) {
            let val = Math.ceil((a + (n - 1) * d) / 1000) * 1000;
            dailyAmounts.push(val);
        }
        let sumFirstNMinus1 = dailyAmounts.reduce((acc, cur) => acc + cur, 0);
        let lastDay = T - sumFirstNMinus1;
        if (dailyAmounts.length > 0 && lastDay <= dailyAmounts[dailyAmounts.length - 1]) {
            lastDay = dailyAmounts[dailyAmounts.length - 1] + 1000;
        }
        lastDay = Math.ceil(lastDay / 1000) * 1000;
        dailyAmounts.push(lastDay);
        total = dailyAmounts.reduce((acc, cur) => acc + cur, 0);
        if (total <= T + 10000) {
            found = true;
        } else {
            d -= 1000;
        }
    }
    if (total > T + 10000) {
        let sumFirstNMinus1 = dailyAmounts.slice(0, N - 1).reduce((acc, cur) => acc + cur, 0);
        let lastDay = T - sumFirstNMinus1;
        if (lastDay <= dailyAmounts[N - 2]) {
            lastDay = dailyAmounts[N - 2] + 1000;
        }
        lastDay = Math.ceil(lastDay / 1000) * 1000;
        dailyAmounts[N - 1] = lastDay;
        total = dailyAmounts.reduce((acc, cur) => acc + cur, 0);
    }
    let accum = 0;
    const accumAmounts = dailyAmounts.map((amt) => (accum += amt));
    const [saved, setSaved] = useState<boolean[]>(Array(N).fill(false));

    const toggleSaved = (idx: number) => {
        setSaved((prev) => {
            const copy = [...prev];
            copy[idx] = !copy[idx];
            return copy;
        });
    };
    return (
        <KeyboardAwareScrollView
            style={[styles.calendarWrap, { backgroundColor: theme.background, flex: 1 }]}
            contentContainerStyle={{ minHeight: calendar.length * cellHeight + 10 }}
        >
            <ScrollView horizontal>
                <View>
                    {/* Header */}
                    <View style={[styles.row, { backgroundColor: theme.background }]}>
                        {WEEK_DAYS.map((d) => (
                            <View style={[styles.headerCell, { backgroundColor: theme.primary }, { borderColor: theme.border }]} key={d}>
                                <Text style={[styles.headerText, { color: theme.white }]}>{d}</Text>
                            </View>
                        ))}
                    </View>
                    {/* Calendar Rows */}
                    {calendar.map((week, i) => (
                        <View style={[styles.row, { backgroundColor: theme.primary }, { borderColor: theme.border }]} key={i}>
                            {week.map((date, j) => {
                                if (!date) return <View style={[styles.cell, { backgroundColor: theme.background }, { borderColor: theme.border }]} key={j} />;
                                const idx = days.findIndex(
                                    (d) => d.toDateString() === date.toDateString()
                                );
                                const isSaved = saved[idx];
                                return (
                                    <TouchableOpacity
                                        style={[styles.cell, isSaved && styles.savedCell, { backgroundColor: theme.border }, { borderColor: theme.border }]}
                                        key={j}
                                        onPress={() => toggleSaved(idx)}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={[styles.dateText, { color: theme.text }]}>{date.getDate()}</Text>
                                        <Text style={[styles.amountText, { color: theme.primary }]}>{dailyAmounts[idx] !== undefined ? dailyAmounts[idx].toLocaleString() : ''}</Text>
                                        {isSaved && <Text style={[styles.checkMark, { color: theme.text }]}>✓</Text>}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    ))}
                </View>
            </ScrollView>
        </KeyboardAwareScrollView>
    );
};

export default GoalCalendar;
