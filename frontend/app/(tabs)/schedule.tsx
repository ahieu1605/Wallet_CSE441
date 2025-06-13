import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ScrollView, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import GoalCalendar from '../../components/GoalCalendar';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { styles as createStyles } from '../../assets/styles/create.styles';

const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

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
    // Tạo ma trận tuần, mỗi tuần là 1 mảng 7 ngày
    const matrix = [];
    let week = new Array(7).fill(null);
    let firstDay = days[0].getDay(); // 0: Chủ nhật, 1: Thứ 2, ...
    let startIdx = (firstDay + 6) % 7; // Đưa về 0: Thứ 2, 6: Chủ nhật
    let dayIdx = 0;
    // Tuần đầu tiên
    for (let i = 0; i < 7; i++) {
        if (i < startIdx) week[i] = null;
        else {
            week[i] = days[dayIdx++];
        }
    }
    matrix.push(week);
    // Các tuần tiếp theo
    while (dayIdx < days.length) {
        week = new Array(7).fill(null);
        for (let i = 0; i < 7 && dayIdx < days.length; i++) {
            week[i] = days[dayIdx++];
        }
        matrix.push(week);
    }
    return matrix;
}

const Schedule = () => {
    const [goal, setGoal] = useState('');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [dateType, setDateType] = useState<'start' | 'end' | null>(null);

    // Tính toán
    let days: Date[] = [];
    let calendar: Date[][] = [];
    let dailyAmount = 0;
    let accumAmounts: number[] = [];

    if (goal && startDate && endDate && endDate >= startDate) {
        days = getDaysArray(startDate, endDate);
        const totalDays = days.length;
        dailyAmount = Math.ceil(parseInt(goal) / totalDays / 1000) * 1000; // Làm tròn lên 1000đ
        let accum = 0;
        accumAmounts = days.map(() => (accum += dailyAmount));
        calendar = getCalendarMatrix(days);
    }

    return (
        <ScrollView style={[createStyles.container]}>
            <Text style={createStyles.sectionTitle}>Set your goal:</Text>
            <View style={createStyles.inputContainer}>
                <TextInput
                    style={createStyles.input}
                    keyboardType="numeric"
                    value={goal}
                    onChangeText={setGoal}
                    placeholder="Enter your saving goal (VND)"
                />
            </View>
            <Text style={createStyles.sectionTitle}>Set date:</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <TouchableOpacity
                    style={[createStyles.inputContainer, { flex: 1, marginRight: 8 }]}
                    onPress={() => { setDateType('start'); setDatePickerVisibility(true); }}
                >
                    <Text style={createStyles.input}>
                        {startDate ? startDate.toLocaleDateString() : 'Start date'}
                    </Text>
                </TouchableOpacity>
                <Text style={{ marginHorizontal: 4 }}>to</Text>
                <TouchableOpacity
                    style={[createStyles.inputContainer, { flex: 1, marginLeft: 8 }]}
                    onPress={() => { setDateType('end'); setDatePickerVisibility(true); }}
                >
                    <Text style={createStyles.input}>
                        {endDate ? endDate.toLocaleDateString() : 'End date'}
                    </Text>
                </TouchableOpacity>
            </View>
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                date={dateType === 'start' ? (startDate || new Date()) : (endDate || new Date())}
                onConfirm={(date) => {
                    if (dateType === 'start') setStartDate(date);
                    else setEndDate(date);
                    setDatePickerVisibility(false);
                }}
                onCancel={() => setDatePickerVisibility(false)}
            />
            {goal && startDate && endDate && endDate >= startDate && (
                <View style={{ marginTop: 20 }}>
                    <Text style={createStyles.sectionTitle}>
                        Goal: {parseInt(goal).toLocaleString()} VND {'\n'}
                        From: {startDate.toLocaleDateString()} To: {endDate.toLocaleDateString()} {'\n'}
                    </Text>
                    <GoalCalendar
                        goal={parseInt(goal)}
                        startDate={startDate}
                        endDate={endDate}
                    />
                </View>
            )}
        </ScrollView>
    );
};

export default Schedule;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 8,
        marginBottom: 12,
        fontSize: 16,
    },
    dateBtn: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 8,
        minWidth: 100,
        alignItems: 'center',
        backgroundColor: '#f9f6e7',
    },
    summary: {
        fontSize: 15,
        marginBottom: 8,
        color: '#6d4c00',
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
});