import { Link } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'black'
      }}
    >
      <TouchableOpacity style={styles.serverButton}>
        <Link href="/testConnection" style={styles.button}>
          Test Server Connection
        </Link>
      </TouchableOpacity>
      <View style={styles.serverButtonView}>
        <TouchableOpacity style={styles.serverButton}>
          <Link href="/server">
            <Text style={styles.serverButtonText}>Server</Text>
          </Link>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity style={styles.serverButton}>
          <Link href="/client">
            <Text style={styles.serverButtonText}>Client</Text>
          </Link>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#7a7a7a',
  },
  button: {
    fontSize: 20,
    color: '#fff',
  },
  serverButtonView: {
    padding: 30,
  },
  serverButtonText: {
    color: 'white',
    fontSize: 20
  },
  serverButton: {
    borderRadius: 8,
    backgroundColor: '#00b6df',
    paddingVertical: 12,
    paddingHorizontal: 24
  }
});
