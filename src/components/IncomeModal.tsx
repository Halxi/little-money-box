import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  TextInput,
  Button,
  Text,
  Alert,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useIncomeStore } from '../viewModels/IncomeViewModel';
import { Category, Income } from '../models/Income';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface IncomeModalProps {
  visible: boolean;
  onClose: () => void;
  initialData?: Income | null;
}

export default function IncomeModal({
  visible,
  onClose,
  initialData,
}: IncomeModalProps) {
  const [profit, setProfit] = useState('');
  const [category, setCategory] = useState<Category>('Second-hand Sell');
  const [date, setDate] = useState(new Date());
  const [owner, setOwner] = useState('DD');
  const [comments, setComments] = useState(' ');
  const [error, setError] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showOwnerPicker, setShowOwnerPicker] = useState(false);

  const { addIncome, editIncome, totalIncome } = useIncomeStore();

  useEffect(() => {
    if (initialData) {
      setProfit(initialData.profit.toString());
      setCategory(initialData.category);
      setDate(initialData.date);
      setOwner(initialData.owner);
      setComments(initialData.comments || ' ');
    }
  }, [initialData]);

  const resetForm = () => {
    setProfit('');
    setCategory('Second-hand Sell');
    setDate(new Date());
    setOwner('DD');
    setComments(' ');
  };

  const saveIncome = () => {
    if (!profit.trim() || isNaN(parseFloat(profit))) {
      setError('Profit is required and must be a valid number.');
      return;
    }
    setError('');
    const newIncome: Income = {
      id: initialData ? initialData.id : Date.now().toString(),
      date,
      category,
      profit: Number(profit),
      owner,
      comments,
      totalIncomeAtTime: totalIncome + Number(profit),
    };
    initialData ? editIncome(newIncome) : addIncome(newIncome);

    resetForm();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Enter Income Details</Text>
          <Text>Profit:</Text>
          <TextInput
            placeholder="Enter profit"
            keyboardType="numeric"
            value={profit}
            onChangeText={setProfit}
            style={styles.input}
            maxLength={10}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Category Picker */}
          <Text>Category:</Text>
          <TouchableOpacity
            onPress={() => setShowCategoryPicker(true)}
            style={{
              borderBottomWidth: 1,
              paddingVertical: 8,
              marginBottom: 10,
            }}
          >
            <Text>{category}</Text>
          </TouchableOpacity>
          {showCategoryPicker && (
            <Modal transparent={true} animationType="slide">
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                }}
              >
                <View
                  style={{
                    backgroundColor: 'white',
                    padding: 20,
                    borderRadius: 10,
                  }}
                >
                  <Picker
                    selectedValue={category}
                    onValueChange={(itemValue) => {
                      setCategory(itemValue);
                      setShowCategoryPicker(false);
                    }}
                  >
                    <Picker.Item
                      label="Second-hand Sell"
                      value="Second-hand Sell"
                    />
                    <Picker.Item label="Fruit Sell" value="Fruit Sell" />
                    <Picker.Item label="Cashback" value="Cashback" />
                  </Picker>
                  <Button
                    title="Cancel"
                    onPress={() => setShowCategoryPicker(false)}
                  />
                </View>
              </View>
            </Modal>
          )}

          {/* Owner Picker */}
          <Text>Owner:</Text>
          <TouchableOpacity
            onPress={() => setShowOwnerPicker(true)}
            style={{
              borderBottomWidth: 1,
              paddingVertical: 8,
              marginBottom: 10,
            }}
          >
            <Text>{owner}</Text>
          </TouchableOpacity>
          {showOwnerPicker && (
            <Modal transparent={true} animationType="slide">
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                }}
              >
                <View
                  style={{
                    backgroundColor: 'white',
                    padding: 20,
                    borderRadius: 10,
                  }}
                >
                  <Picker
                    selectedValue={owner}
                    onValueChange={(itemValue) => {
                      setOwner(itemValue);
                      setShowOwnerPicker(false);
                    }}
                  >
                    <Picker.Item label="DD" value="DD" />
                    <Picker.Item label="RR" value="RR" />
                  </Picker>
                  <Button
                    title="Cancel"
                    onPress={() => setShowOwnerPicker(false)}
                  />
                </View>
              </View>
            </Modal>
          )}

          {/* Date Picker */}
          <Text style={styles.label}>Date</Text>
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

          <Text>Comments:</Text>
          <TextInput
            placeholder="Enter comments"
            value={comments}
            onChangeText={setComments}
            style={styles.input}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button]} onPress={saveIncome}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 10,
    padding: 5,
  },
  picker: {
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
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
  label: { fontSize: 16, marginTop: 10 },

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
});
