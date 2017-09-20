import React, { Component } from 'React'
import {
    Animated, Image, ScrollView,
    StyleSheet, Text, View, TouchableHighlight,
    Platform, TouchableNativeFeedback, StatusBar
} from 'react-native';

export default class TrackingInfo extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <View style={{flex:1, height:100}}>
                <View style={{height:40, flexDirection: 'row', backgroundColor:'#0C181C', alignItems:'center',paddingLeft: 10, paddingRight: 10}}>
                    <Text style={{flex: 1, fontSize:20, color:'white'}}>수락·불암산코스</Text>
                    <Text style={{flex: 1, fontSize:20, color:'white', textAlign: 'right'}}>{parseInt(this.props.walkingTime / 60)} : {this.props.walkingTime % 60}</Text>
                </View>
                <View style={{flexDirection: 'row', flex: 1, backgroundColor: 'rgba(20,39,46,0.7)'}}>
                    <View style={{flex:1}}>
                        <Text style={{fontSize:20}}>12002 걸음</Text>
                    </View>
                    <View style={{flex: 1}}>
                        <Text style={{fontSize:20}}> M</Text>
                    </View>
                </View>
            </View>
        );
    }
}
