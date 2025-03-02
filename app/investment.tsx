import React, { useState } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Investment } from '@/src/models/Investment';
import { useInvestmentStore } from '@/src/viewModels/InvestmentViewModel';
import InvestmentForm from '@/src/components/InvestmentModal';

const InvestmentScreen = () => {
  const { investments, addInvestment, updateInvestment, removeInvestment } =
    useInvestmentStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedInvestment, setSelectedInvestment] =
    useState<Investment | null>(null);

  const handleSaveInvestment = (investment: Investment) => {
    if (selectedInvestment) {
      updateInvestment(investment);
    } else {
      addInvestment(investment);
    }
    setModalVisible(false);
    setSelectedInvestment(null);
  };

  const handleEdit = (investment: Investment) => {
    setSelectedInvestment(investment);
    setModalVisible(true);
  };

  const handleDelete = (investmentId: string) => {
    Alert.alert('Confirm', 'Are you sure you want to delete this investment?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => removeInvestment(investmentId),
      },
    ]);
  };

  const renderHeader = () => (
    <View style={styles.headerRow}>
      <Text style={[styles.headerText, styles.dateColumn]}>Date</Text>
      <Text style={[styles.headerText, styles.stockNameColumn]}>
        Stock Name
      </Text>
      <Text style={[styles.headerText, styles.stockPriceColumn]}>Price</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>My Investments</Text>

        <FlatList
          data={investments}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          stickyHeaderIndices={[0]} // Keeps header visible while scrolling
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleEdit(item)}
              onLongPress={() => handleDelete(item.id)}
            >
              <View style={styles.itemRow}>
                <Text style={[styles.cell, styles.dateColumn]}>
                  {new Date(item.date).toLocaleDateString()}
                </Text>
                <Text style={[styles.cell, styles.stockNameColumn]}>
                  {item.stockName}
                </Text>
                <Text style={[styles.cell, styles.stockPriceColumn]}>
                  ${item.stockPrice.toFixed(2)}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />

        {/* Floating Add Button */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>

        {/* Investment Form Modal */}
        <InvestmentForm
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false);
            setSelectedInvestment(null);
          }}
          onSave={handleSaveInvestment}
          existingInvestment={selectedInvestment}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'white' },
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  headerText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dateColumn: { flex: 1 },
  stockNameColumn: { flex: 2 },
  stockPriceColumn: { flex: 1 },

  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  cell: {
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 30,
    padding: 16,
    elevation: 5,
  },
});

export default InvestmentScreen;
