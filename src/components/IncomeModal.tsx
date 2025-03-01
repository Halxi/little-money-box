import React, { useEffect, useState } from 'react';
import { Modal, View, TextInput, Button, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useIncomeStore } from '../viewModels/IncomeViewModel';
import { Income } from '../models/Income';

interface IncomeModalProps {
  visible: boolean;
  onClose: () => void;
  initialData?: Income | null; // If editing, pass existing income data
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

  const { addIncome, editIncome } = useIncomeStore();

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

    setError(''); // Clear error if validation passes
    const newIncome: Income = {
      id: initialData ? initialData.id : Date.now().toString(), // Reuse ID for editing
      date,
      category,
      profit: Number(profit),
      owner,
      comments,
    };
    initialData ? editIncome(newIncome) : addIncome(newIncome);
    resetForm();
    onClose();
  };
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}
      >
        <View
          style={{
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 10,
            width: '80%',
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
            Enter Income Details
          </Text>
          <Text>Profit:</Text>
          <TextInput
            placeholder="Enter profit"
            keyboardType="numeric"
            value={profit}
            onChangeText={setProfit}
            style={{ borderBottomWidth: 1, marginBottom: 10 }}
            maxLength={10}
          />
          {error ? (
            <Text style={{ color: 'red', marginBottom: 5 }}>{error}</Text>
          ) : null}
          <Text>Category:</Text>
          <Picker
            selectedValue={category}
            onValueChange={setCategory}
            style={{ marginBottom: 10 }}
          >
            <Picker.Item label="Second-hand Sell" value="Second-hand Sell" />
            <Picker.Item label="Fruit Sell" value="Fruit Sell" />
            <Picker.Item label="Cashback" value="Cashback" />
          </Picker>
          <Text>Owner:</Text>
          <Picker
            selectedValue={owner}
            onValueChange={setOwner}
            style={{ marginBottom: 10 }}
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
            style={{ borderBottomWidth: 1, marginBottom: 10 }}
          />
          <Button title="Save" onPress={saveIncome} />
          <Button title="Cancel" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}
