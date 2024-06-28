import {StyleSheet, Text, View, TextInput, Button, Alert} from 'react-native';
import React, {useState} from 'react';
import {useStripe} from '@stripe/stripe-react-native';

export default function Payment() {
  const [name, setName] = useState('');
  const stripe = useStripe();
  //const name = 'Ali';
  const buy = async () => {
    try {
      const response = await fetch('http://192.168.2.137:8080/pay', {
        method: 'POST',
        body: JSON.stringify({name}),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (!response.ok) return Alert.alert(data.message);
      const clientSecret = data.clientSecret;
      const initSheet = await stripe.initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: 'Salim Merchant',
      });
      if (initSheet.error) return Alert.alert(initSheet.error.message);
      const presentSheet = await stripe.presentPaymentSheet({
        clientSecret,
      });
      if (presentSheet.error) return Alert.alert(presentSheet.error.message);
      Alert.alert('Payment complete, thank you!');
    } catch (err) {
      console.error(err);
      Alert.alert('Something went wrong!');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={text => setName(text)}
        placeholder="Name"
        placeholderTextColor="gray"
      />
      <View style={styles.buttonContainer}>
        <Button title="Buy me a coffee" onPress={buy} color="black" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    color: 'black',
    width: '80%',
  },
  buttonContainer: {
    marginTop: 20,
  },
});
