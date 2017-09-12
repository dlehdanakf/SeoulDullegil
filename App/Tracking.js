import React from 'react';
import { StyleSheet, Text, View, TouchableNativeFeedback, Platform, StatusBar, Button, Vibration } from 'react-native';
import { WebView } from 'react-native-webview-messaging/WebView';

import {Constants, Location, Permissions, Notifications} from 'expo';
import MapSource from './map_webview/map.html';

import Geolib from 'geolib';

export default class App extends React.Component {
  state = {
    location: null,
    errorMessage: null,
  };

  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }
  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let stampPoint = {
      stamp:[
        {
          latitude: 37.5509398, longitude: 127.0739944
        },
        {
          latitude: 37.5500122, longitude: 127.0746378
        }
      ]
    };

    console.log(stampPoint.stamp[0].latitude);

    const location = await Location.watchPositionAsync({
      enableHighAccuracy: true,
      distanceInterval: 1,
    }, (location) => {
      this.setState({location:{
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }});
      console.log('yo: '+location.coords.latitude + ', ' + location.coords.longitude);
      this.webview.emit('location', {latitude: location.coords.latitude, longitude: location.coords.longitude});

      this.searchStamp(stampPoint);
    });
  };

  searchStamp(stampPoint){
    const errorRange = 10;  //10m

    let tx = stampPoint.stamp[0].latitude;
    let ty = stampPoint.stamp[0].longitude;

    let point = Geolib.getDistance(
      {latitude: this.state.location.latitude, longitude: this.state.location.longitude},
      {latitude: tx, longitude: ty}
    );
    console.log(point);
    if(point <= 10){
      Notifications.presentLocalNotificationAsync({title: '도장 발견', body: '***도장을 찾았습니다.'});
    }
  }

  startTracking() {
    Notifications.presentLocalNotificationAsync({title: '트래킹 시작', body: '*번 코스 트래킹 진행중~.', sticky: true});
  }

  render() {
    let text = 'Waiting...';
    if(this.state.errorMessage){
      text = this.state.errorMessage;
    }
    else if (this.state.location){
      text = JSON.stringify(this.state.location);
    }
    return (
        <View style={styles.container}>
          <View>
            <Text>Location: {text}</Text>
          </View>
          <WebView
                    ref={ webview => { this.webview = webview; }}
                    source={MapSource}
                />
          <View style={{height: 60, backgroundColor: '#FFF', flexDirection: 'row'}}>
                    <TouchableNativeFeedback
                      onPress={this.startTracking}>
                        <View style={{flex: 2, backgroundColor: '#3ABF00', justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', color: '#FFF'}}>트래킹 시작하기</Text>
                        </View>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback
                        onPress={()=>{
                            this.webview.send('show');
                        }}
                    >
                        <View style={{flex: 1, backgroundColor: '#888', justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderRightColor: '#666'}}>
                            <Text style={{fontSize: 14, fontWeight: 'bold', color: '#FFF'}}>경로표시</Text>
                        </View>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback
                        onPress={()=>{
                            this.webview.send('hide');
                        }}
                    >
                        <View style={{flex: 1, backgroundColor: '#888', justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontSize: 14, fontWeight: 'bold', color: '#FFF'}}>경로숨김</Text>
                        </View>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback
                        onPress={()=>{
                            Vibration.vibrate();
                            console.log('진동~~~~')
                        }}
                    >
                        <View style={{flex: 1, backgroundColor: '#888', justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontSize: 14, fontWeight: 'bold', color: '#FFF'}}>경로숨김</Text>
                        </View>
                    </TouchableNativeFeedback>
            </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop:24,
    },
});
