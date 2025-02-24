import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { useIncomeStore } from '@/src/viewModels/IncomeViewModel';

export default function HomeScreen() {
  const { incomes, addIncome } = useIncomeStore();
  const router = useRouter();

  return (
    <View>
      <Text>Welcome to Little Money Box!</Text>
      <Button
        title="Add Income"
        onPress={() =>
          addIncome({
            id: Date.now().toString(),
            category: 'Salary',
            date: new Date().toISOString(),
            profit: 300,
            owner: 'User',
          })
        }
      />
      <Button
        title="View Investment"
        onPress={() => router.push('/InvestmentScreen')}
      />
      {incomes.map((income) => (
        <Text key={income.id}>
          {income.category} - ${income.profit}
        </Text>
      ))}
    </View>
  );
}
