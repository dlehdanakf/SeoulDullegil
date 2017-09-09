import React, { Component } from 'React'
import { StyleSheet, Text, View, ScrollView } from 'react-native';



export default class CourseInfo extends React.Component{

  render() {
    let courseInfo = require('../JsonData/courseInfo.json').list.map(function(courseData, index){
      return(
        <View style={{margin:2, borderWidth:1, backgroundColor: '#3E464F'}} key={index}>
          <Text style={{color:'white'}}>코스 이름: {courseData.COURSE_NM}</Text>
          <Text style={{color:'white'}}>위치: {courseData.LOCATION}</Text>
          <Text style={{color:'white'}}>거리: {courseData.DISTANCE}</Text>
          <Text style={{color:'white'}}>걸리는 시간: {courseData.WALK_TIME}</Text>
          <Text style={{color:'white'}}>코스 난이도: {courseData.COURSE_LEVEL}</Text>
        </View>
      );
    });
    return (
      <View style={{marginTop:24}}>
        <ScrollView>
          {courseInfo}
        </ScrollView>
      </View>
    );
  }
}
