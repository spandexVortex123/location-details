import axios from 'axios';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CONSTANTS from './constants';

function handlePress(setMessageElement: any) {
  // clear previous message
  setMessageElement(null);

  setTimeout(() => {
    
  }, 1000);

  axios.get(CONSTANTS['server_url'], {timeout: 5000})
    .then(response => {
      setMessageElement(successConnectionMessage(response.data.message))
    })
    .catch(err => {
      setMessageElement(failureConnectionMessage())
    })
}

function incrementCount(count: any, setCount: any) {
  let newCount = count + 1
  setCount(newCount)
}

function decrementCount(count: any, setCount: any) {
  let newCount = count - 1
  setCount(newCount)
}

function successConnectionMessage(message: string) {
  return (
    <Text style={styles.successConnectionMessage}>{message}</Text>
  )
}

function failureConnectionMessage() {
  return (
    <Text style={styles.failureConnectionMessage}>Connection failed after 5 seconds timeout</Text>
  )
}

function testMessageElement() {
  return (
    <Text style={styles.successConnectionMessage}>Successful</Text>
  )
}

export default function TestConnection() {

  const [count, setCount] = useState(0);
  const [messageElement, setMessageElement] = useState();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Test Connection screen</Text>
      <Text style={styles.test}>{count}</Text>
      <TouchableOpacity style={styles.button} onPress={() => handlePress(setMessageElement)}>
        <Text style={styles.buttonText}>Test Connection</Text>
      </TouchableOpacity>
      <View style={styles.view2}>
        <TouchableOpacity style={styles.button} onPress={() => incrementCount(count, setCount)}>
          <Text style={styles.buttonText}>Increment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => decrementCount(count, setCount)}>
          <Text style={styles.buttonText}>Decrement</Text>
        </TouchableOpacity>
      </View>
      {messageElement}
    </View>
  );
}

const styles = StyleSheet.create({
  view2: {
    padding: 20
  },
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    padding: 20
  },
  button: {
    // borderWidth: 2,
    // borderColor: '#007AFF', // blue border
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#54cbcd'
  },
  buttonText: {
    color: 'black',
    fontSize: 16
  },
  test: {
    color: 'white',
    padding: 20
  },
  button2: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#54cbcd',
  },
  successConnectionMessage: {
    color: '#00fc22',
    padding: 10,
    fontSize: 20
  },
  failureConnectionMessage: {
    color: '#fc3838',
    padding: 10,
    fontSize: 20
  }
});
