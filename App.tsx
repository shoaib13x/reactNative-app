import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignIn from "./screens/SignIn";
import HomeScreen from './screens/HomeScreen';
import SignUp from './screens/SignUp';
import Payment from './components/Payment';
import Subscription from './components/Subscription';
import { StripeProvider } from '@stripe/stripe-react-native';

const Stack = createStackNavigator();

function App() {
  return (
    <StripeProvider publishableKey="pk_test_51PWM5z08n9jbgKgw6DQm517zeiVsAgeXf2HxtYzsi6kU5uPjx3TmMU586pEKMLOwuLxG65JKWSlcYpuz1u662dUu006Ul0vbwU">
      <NavigationContainer>
        <Stack.Navigator initialRouteName="SignIn">
          <Stack.Screen name="Payment" component={Payment}/>
          <Stack.Screen name="SignIn" component={SignIn} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="Subscription" component={Subscription}/>

        </Stack.Navigator>
      </NavigationContainer>
    </StripeProvider>
  );
}

export default App;
