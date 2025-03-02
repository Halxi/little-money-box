import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  TextInput,
  Button,
  Text,
  Alert,
  StyleSheet,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useIncomeStore } from '../viewModels/IncomeViewModel';
import { Income } from '../models/Income';
import { router } from 'expo-router';

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
  const [category, setCategory] = useState('Salary');
  const [date, setDate] = useState(new Date());
  const [owner, setOwner] = useState('RR');
  const [comments, setComments] = useState(' ');
  const [error, setError] = useState('');

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
    setCategory('Salary');
    setDate(new Date());
    setOwner('RR');
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
    };
    initialData ? editIncome(newIncome) : addIncome(newIncome);

    if (totalIncome >= 300) {
      Alert.alert(
        'Investment Opportunity',
        'Your total income has reached 300. Consider investing!',
        [
          { text: 'Invest Now', onPress: () => router.push('/investment') },
          { text: 'Cancel', style: 'cancel' },
        ],
      );
    }

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

          <Text>Category:</Text>
          <Picker
            selectedValue={category}
            onValueChange={setCategory}
            style={styles.picker}
          >
            <Picker.Item label="Second-hand Sell" value="Second-hand Sell" />
            <Picker.Item label="Fruit Sell" value="Fruit Sell" />
            <Picker.Item label="Cashback" value="Cashback" />
          </Picker>

          <Text>Owner:</Text>
          <Picker
            selectedValue={owner}
            onValueChange={setOwner}
            style={styles.picker}
          >
            <Picker.Item label="DD" value="DD" />
            <Picker.Item label="RR" value="RR" />
          </Picker>

          <Text>Date:</Text>
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => setDate(selectedDate || date)}
          />

          <Text>Comments:</Text>
          <TextInput
            placeholder="Enter comments"
            value={comments}
            onChangeText={setComments}
            style={styles.input}
          />

          <View style={styles.buttonContainer}>
            <Button title="Save" onPress={saveIncome} />
            <Button title="Cancel" onPress={onClose} color="red" />
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});
