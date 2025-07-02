import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.View}>
      <Text>this is the final year project</Text>
      <Text>We will start after tommorrow InshaAllah</Text>
  
    </View>
  );
}


const styles = StyleSheet.create({
  View: {
    flex: 1,
    justifyContent: 'center',
    alignItems:'center'
  },
  Text: {
    backgroundColor: 'red',
    color:'green',
  }
})