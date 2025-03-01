import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useIncomeStore } from '@/src/viewModels/IncomeViewModel';
import { useState } from 'react';
import IncomeModal from '@/src/components/IncomeModal';
import { IncomeList } from '@/src/components/IncomeList';
import { Income } from '@/src/models/Income';

export default function HomeScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState<Income | null>(null);

  const { isHydrated } = useIncomeStore();

  const openEditModal = (income: Income) => {
    setSelectedIncome(income);
    setModalVisible(true);
  };

  if (isHydrated) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to Little Money Box!</Text>
        <Button title="Add Income" onPress={() => setModalVisible(true)} />
        <Button
          title="View Investment"
          onPress={() => router.push('/InvestmentScreen')}
        />
        <IncomeList onEdit={openEditModal} />

        <IncomeModal
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false);
            setSelectedIncome(null);
          }}
          initialData={selectedIncome}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },

  header: {
    backgroundColor: '#007bff',
  },
});
