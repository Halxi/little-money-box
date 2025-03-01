import { View, Text, Button } from 'react-native';
import { useInvestmentStore } from '@/src/viewModels/InvestmentViewModel';

export default function InvestmentScreen() {
  const { investments, addInvestment } = useInvestmentStore();

  return (
    <View>
      <Button
        title="Add Investment"
        onPress={() =>
          addInvestment({
            id: Date.now().toString(),
            date: new Date().toISOString(),
            stockName: 'AAPL',
            stockPrice: 150,
            relatedIncomes: [],
          })
        }
      />
      {investments.map((investment) => (
        <Text key={investment.id}>
          {investment.stockName} - ${investment.stockPrice}
        </Text>
      ))}
    </View>
  );
}
