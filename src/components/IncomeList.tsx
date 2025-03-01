import {
  View,
  FlatList,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useIncomeStore } from '../viewModels/IncomeViewModel';
import { Income } from '../models/Income';

interface IncomeListProps {
  onEdit: (income: Income) => void;
}

export const IncomeList = ({ onEdit }: IncomeListProps) => {
  const { incomes, sortBy, sortOrder, setSorting, deleteIncome } =
    useIncomeStore();

  const handleDelete = (id: string) => {
    Alert.alert('Confirm', 'Are you sure you want to delete this income?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteIncome(id) },
    ]);
  };

  // Sort function
  const sortedIncomes = [...incomes].sort((a, b) => {
    if (sortBy === 'date') {
      return sortOrder === 'asc'
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    if (sortBy === 'profit') {
      return sortOrder === 'asc' ? a.profit - b.profit : b.profit - a.profit;
    }
    if (sortBy === 'category') {
      return sortOrder === 'asc'
        ? a.category.localeCompare(b.category)
        : b.category.localeCompare(a.category);
    }
    return 0;
  });

  return (
    <View style={styles.tableContainer}>
      <View style={[styles.row, styles.header]}>
        <Text style={styles.cellHeader} onPress={() => setSorting('date')}>
          Date
        </Text>
        <Text style={styles.cellHeader} onPress={() => setSorting('category')}>
          Category
        </Text>
        <Text style={styles.cellHeader} onPress={() => setSorting('profit')}>
          Profit
        </Text>
        <Text style={styles.cellHeader}>Owner</Text>
        <Text style={styles.cellHeader}>Comments</Text>
      </View>

      <FlatList
        data={sortedIncomes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => onEdit(item)}
            onLongPress={() => handleDelete(item.id)}
          >
            <View style={styles.row}>
              <Text style={styles.cell}>{item.date.toLocaleDateString()}</Text>
              <Text style={styles.cell}>{item.category}</Text>
              <Text style={styles.cell}>${item.profit.toFixed(2)}</Text>
              <Text style={styles.cell}>{item.owner}</Text>
              <Text style={styles.cell}>{item.comments || 'N/A'}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  tableContainer: {
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3, // Shadow for Android
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 1,
  },
  header: {
    backgroundColor: '#007bff',
  },
  headerRow: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cellHeader: {
    flex: 1,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    paddingVertical: 5,
  },
});
