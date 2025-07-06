import { View, StyleSheet } from 'react-native';
import React from 'react'
// import Signup from '@/components/Signup';

const signup = () => {
  return (
    <View style={styles.container}>
      <Signup />
      </View>
  )
}

export default signup;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    }); 