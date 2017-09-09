import React, { Component } from 'React'
import { StyleSheet, Text, View, Button } from 'react-native';
import { Actions } from 'react-native-router-flux';

export default class CourseInfo extends React.Component{

  render() {
    return (
      <View style={styles.container}>
        <Button onPress={Actions.courseInfo} title="GO to 코스 정보" />
        <Button onPress={Actions.tracking} title="GO to 길찾기" />
      </View>
    );
  }
}

styles = StyleSheet.create({
  container: {
    marginTop:24,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
