import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '@/assets/styles/home.styles';
import { COLORS } from '@/constants/Colors';
import { formatDate } from '@/lib/utils';
import { useAppTheme } from './ThemeProvider';

const CATEGORY_ICONS = {
    'Food & Drinks': 'fast-food',
    Shopping: 'cart',
    Transportation: 'car',
    Entertainment: 'film',
    Bills: 'receipt',
    Income: 'cash',
    Other: 'ellipsis-horizontal',
};

export const TransactionItem = ({ item, onDelete }) => {
    const isIncome = parseFloat(item.amount) > 0;
    const iconName = CATEGORY_ICONS[item.category] || 'pricetag-outline';
    const { theme } = useAppTheme();

    return (
        <View style={[styles.transactionCard, { backgroundColor: theme.card }]} key={item.id}>
            <TouchableOpacity style={styles.transactionContent}>
                <View style={[styles.categoryIconContainer, { backgroundColor: theme.primary }]}>
                    <Ionicons name={iconName} size={22} color={isIncome ? theme.income : theme.expense} />
                </View>
                <View style={styles.transactionLeft}>
                    <Text style={[styles.transactionTitle, { color: theme.text }]}>{item.title}</Text>
                    <Text style={[styles.transactionCategory, { color: theme.textLight }]}>{item.category}</Text>
                </View>
                <View style={styles.transactionRight}>
                    <Text
                        style={[styles.transactionAmount, { color: isIncome ? theme.income : theme.expense }]}
                    >
                        {isIncome ? '+' : '-'}${Math.abs(parseFloat(item.amount)).toFixed(2)}
                    </Text>
                    <Text style={[styles.transactionDate, { color: theme.textLight }]}>
                        {formatDate(item.created_at)}
                    </Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(item.id)}>
                <Ionicons name="trash-outline" size={20} color={theme.expense} />
            </TouchableOpacity>
        </View>
    );
};
