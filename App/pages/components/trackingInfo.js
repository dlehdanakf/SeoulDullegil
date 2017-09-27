import React, { Component } from 'React'
import {
    Animated, Image, ScrollView,
    StyleSheet, Text, View, TouchableHighlight,
    Platform, TouchableNativeFeedback, StatusBar
} from 'react-native';

import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import IconIonicons from 'react-native-vector-icons/Ionicons';
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default class TrackingInfo extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <View style={{flex:1, height:80}}>
                <View style={{height:40, flexDirection: 'row', backgroundColor:'#0C181C', alignItems:'center',paddingLeft: 15, paddingRight: 15}}>
                    <Text style={{flex: 1, fontSize:20, color:'white'}}>{this.props.courseName}</Text>
                    <View style={{flex: 1, alignItems:'center', flexDirection: 'row'}}>
                        <IconMaterialCommunityIcons name="timer" size={20} color="white" style={{flex:1, textAlign: 'right'}}>
                            <Text style={{flex: 1, fontSize:20, color:'white', textAlign:'right'}}>  {parseInt(this.props.walkingTime / 60)} : {this.props.walkingTime % 60}</Text>
                        </IconMaterialCommunityIcons>
                    </View>
                </View>
                <View style={{flexDirection: 'row', flex: 1, backgroundColor: 'rgba(20,39,46,0.7)', padding:10}}>
                    <View style={{flex:1}}>
                        <View style={{height: 40, justifyContent:'center', flexDirection: 'row'}}>
                            <IconIonicons name="md-walk" size={20} color="white" />
                            <Text style={{color:"white", fontSize: 20}}> 걸은 거리 (M)</Text>
                        </View>
                        <View style={{flex:1, paddingLeft:10, paddingTop: 20}}>
                            <Text style={{flex:3, fontSize:40, color:'white'}}>{this.props.walkingDistance} m</Text>
                            <Text style={{flex:2, fontSize:20, color:'white'}}>칼로리 소모량: 45 kcal</Text>
                        </View>
                    </View>
                    <View style={{flex: 1}}>
                        <View style={{height: 40, justifyContent:'center', flexDirection: 'row'}}>
                            <IconMaterialCommunityIcons name="map-marker" size={20} color="white" />
                            <Text style={{fontSize:20, color:'white'}}>가까운 지점</Text>
                        </View>
                        <View style={{flex:1, paddingLeft:10, paddingTop: 20, borderLeftWidth:2, borderStyle: 'dotted', borderColor: 'white'}}>
                            <Text style={{flex:3, fontSize:30, color:'white'}}>{this.props.nearSpot.name}</Text>
                            <Text style={{flex:2, fontSize:20, color:'white'}}>지점까지 거리: {this.props.nearSpot.distance} m</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}
