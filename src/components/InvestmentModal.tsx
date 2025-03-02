import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { Investment } from '../models/Investment';

interface InvestmentFormProps {
  visible: boolean;
  onClose: () => void;
  onSave: (investment: Investment) => void;
  existingInvestment?: Investment | null;
}

const InvestmentForm: React.FC<InvestmentFormProps> = ({
  visible,
  onClose,
  onSave,
  existingInvestment,
}) => {
  const [stockName, setStockName] = useState(
    existingInvestment?.stockName || '',
  );
  const [stockPrice, setStockPrice] = useState(
    existingInvestment?.stockPrice.toString() || '',
  );
  const [date, setDate] = useState(
    existingInvestment?.date ? new Date(existingInvestment.date) : new Date(),
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSave = () => {
    if (!stockName.trim() || !stockPrice) {
      return alert('Please enter stock name and price.');
    }

    const newInvestment: Investment = {
      id: existingInvestment?.id || Date.now().toString(),
      stockName,
      stockPrice: parseFloat(stockPrice),
      date: date, // Save as ISO string
    };

    onSave(newInvestment);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>
            {existingInvestment ? 'Edit Investment' : 'Add Investment'}
          </Text>

          {/* Stock Name Input */}
          <Text style={styles.label}>Stock Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter stock name"
            value={stockName}
            onChangeText={setStockName}
          />

          {/* Stock Price Input */}
          <Text style={styles.label}>Stock Price</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter stock price"
            value={stockPrice}
            onChangeText={setStockPrice}
            keyboardType="numeric"
          />

          {/* Date Picker */}
          <Text style={styles.label}>Investment Date</Text>
          <TouchableOpacity
            style={styles.datePicker}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>{date.toDateString()}</Text>
            <Ionicons name="calendar" size={20} color="black" />
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowDatePicker(Platform.OS === 'ios');
                if (selectedDate) setDate(selectedDate);
              }}
            />
          )}

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button]} onPress={handleSave}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  label: { fontSize: 16, marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginTop: 5,
  },
  dateText: { fontSize: 16 },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
    backgroundColor: '#007AFF',
  },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});

export default InvestmentForm;
