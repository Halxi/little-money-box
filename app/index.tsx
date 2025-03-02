import {
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  View,
} from 'react-native';
import { useIncomeStore } from '@/src/viewModels/IncomeViewModel';
import { useState } from 'react';
import IncomeModal from '@/src/components/IncomeModal';
import { IncomeList } from '@/src/components/IncomeList';
import { Income } from '@/src/models/Income';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState<Income | null>(null);

  const { isHydrated, incomes } = useIncomeStore();

  const openEditModal = (income: Income) => {
    setSelectedIncome(income);
    setModalVisible(true);
  };

  if (isHydrated) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.title}>Welcome to Little Money Box!</Text>

          {incomes.length > 0 && <IncomeList onEdit={openEditModal} />}

          {/* Floating Action Button */}
          <TouchableOpacity
            style={styles.fab}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="add" size={32} color="white" />
          </TouchableOpacity>

          <IncomeModal
            visible={modalVisible}
            onClose={() => {
              setModalVisible(false);
              setSelectedIncome(null);
            }}
            initialData={selectedIncome}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'white' },
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  fab: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#6200ee',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
  },

  header: {
    backgroundColor: '#007bff',
  },
});
