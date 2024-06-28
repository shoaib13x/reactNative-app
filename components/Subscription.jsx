import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {useStripe, CardField} from '@stripe/stripe-react-native';

export default function Subscription() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cardDetails, setCardDetails] = useState(null);
  const [subscriptionType, setSubscriptionType] = useState('monthly'); // 'monthly' or 'yearly'
  const [priceId, setPriceId] = useState(''); // Selected price ID
  const stripe = useStripe();

  const createSubscription = async () => {
    try {
      const paymentMethod = await stripe.createPaymentMethod({
        paymentMethodType: 'Card',
        card: cardDetails,
      });

      const response = await fetch('http://192.168.2.137:8080/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          paymentMethod: paymentMethod.paymentMethod.id,
          priceId,
        }),
      });

      if (!response.ok) {
        return Alert.alert('Subscription creation failed!');
      }

      const data = await response.json();
      console.log('Client Secret: ', data.clientSecret);

      if (data.clientSecret) {
        const paymentIntent = await stripe.retrievePaymentIntent(
          data.clientSecret,
        );
        console.log('payment intent : ', paymentIntent);

        if (
          paymentIntent.paymentIntent.status === 'requires_action' ||
          paymentIntent.paymentIntent.status === 'requires_confirmation'
        ) {
          // Confirm the payment
          const confirm = await stripe.confirmPayment(data.clientSecret);
          console.log('Confirm: ', confirm);

          if (confirm.error) {
            return Alert.alert('Payment unsuccessful! Failed to Authenticate');
          }

          Alert.alert('Payment Successful! Subscription active.');
        } else {
          Alert.alert('Payment Successful! Subscription active.');
        }
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Payment failed!', err.message);
    }
  };

  const renderSubscriptionOptions = () => {
    if (subscriptionType === 'monthly') {
      return (
        <View>
          <Button
            title="Basic Plan - $5/month"
            onPress={() => setPriceId('price_12345')}
          />
          <Button
            title="Pro Plan - $10/month"
            onPress={() => setPriceId('price_67890')}
          />
          <Button
            title="Enterprise Plan - $20/month"
            onPress={() => setPriceId('price_abcde')}
          />
        </View>
      );
    } else {
      return (
        <View>
          <Button
            title="Basic Plan - $50/year"
            onPress={() => setPriceId('price_54321')}
          />
          <Button
            title="Pro Plan - $100/year"
            onPress={() => setPriceId('price_09876')}
          />
          <Button
            title="Enterprise Plan - $200/year"
            onPress={() => setPriceId('price_edcba')}
          />
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* <TextInput
        style={styles.input}
        value={name}
        onChangeText={text => setName(text)}
        placeholder="Name"
        placeholderTextColor="gray"
      />
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={text => setEmail(text)}
        placeholder="Email"
        placeholderTextColor="gray"
        keyboardType="email-address"
      /> */}

      <View style={styles.subscriptionTypeContainer}>
        <TouchableOpacity
          style={[
            styles.subscriptionTypeButton,
            subscriptionType === 'monthly' && styles.selectedSubscriptionType,
          ]}
          onPress={() => setSubscriptionType('monthly')}>
          <Text style={styles.subscriptionTypeText}>Monthly</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.subscriptionTypeButton,
            subscriptionType === 'yearly' && styles.selectedSubscriptionType,
          ]}
          onPress={() => setSubscriptionType('yearly')}>
          <Text style={styles.subscriptionTypeText}>Yearly</Text>
        </TouchableOpacity>
      </View>

      {renderSubscriptionOptions()}

      {/* <CardField
        postalCodeEnabled={false}
        placeholders={{
          number: '4242 4242 4242 4242',
        }}
        cardStyle={styles.card}
        style={styles.cardContainer}
        onCardChange={cardDetails => {
          console.log('cardDetails', cardDetails);
          setCardDetails(cardDetails);
        }}
        onFocus={focusedField => {
          console.log('focusField', focusedField);
        }}
      />
      <View style={styles.buttonContainer}>
        <Button title="Subscribe" onPress={createSubscription} color="black" />
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    color: 'black',
    width: '80%',
    marginBottom: 20,
  },
  subscriptionTypeContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  subscriptionTypeButton: {
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  selectedSubscriptionType: {
    backgroundColor: 'lightgray',
  },
  subscriptionTypeText: {
    color: 'black',
  },
  buttonContainer: {
    marginTop: 20,
  },
  cardContainer: {
    height: 50,
    width: '80%',
    marginBottom: 20,
  },
  card: {
    backgroundColor: 'black',
  },
});
