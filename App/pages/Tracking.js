import React, {Component} from 'React'
import {
    Image, StyleSheet, Text, View,
    TouchableHighlight, TouchableNativeFeedback,
    ToastAndroid, Alert, BackHandler,
} from 'react-native';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import NavBar, {NavButton, NavButtonText, NavTitle, NavGroup} from 'react-native-nav'
import {Actions} from 'react-native-router-flux';
import {WebView} from 'react-native-webview-messaging/WebView';

import IconIonicons from 'react-native-vector-icons/Ionicons';
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {Location, Permissions, Notifications} from 'expo';
import Geolib from 'geolib';

import Timer from 'react-native-timer';

import navBarStylesModule from './assets/navbar.styles';
import trakingStyles from './assets/TrackingComponent.styles';

import TrackingInfo from './components/trackingInfo';
import StampIconFunc from './components/stamp.function';
import StampCheckFunc from './components/stamp.check.function';
import CourseData from './datasets/course.list';
import MapData from './datasets/courseinfo.list';

import ThisWeek from './components/thisWeek.component';

const navBarStyles = navBarStylesModule("#568f4a");

export default class Tracking extends React.Component {
    constructor(props) {
        super(props);

        this.majorPinData = MapData[props.COURSE_INDEX].STAMP_DATA;

        this.onWebViewLoaded = this.onWebViewLoaded.bind(this);
        this.getMapCenter = this.getMapCenter.bind(this);
        this.onPressMapButton = this.onPressMapButton.bind(this);

        this.onPressBackButton = this.onPressBackButton.bind(this);

        BackHandler.addEventListener('hardwareBackPress', this.onPressBackButton);

        this.state = {
            location: {
                latitude: 0,
                longitude: 0,
            },
            isTracking: false,
            walkingTime: 0,
            walkingDistance: 0.0,
            nearSpot: {
                distance: 0,
                name: '트래킹을 시작해주세요',
                stamp: '',
            },
            courseData: CourseData[props.COURSE_INDEX],
            mapData: MapData[props.COURSE_INDEX],

            activeMapButton: '',
            activeMapPinIndex: -1,
            pinTitle: '',
            pinDesc: '',

            retValueWatchPosition: null,
            burnKcal: 0,
            activeStampList: props.activeStampList,
            trackingButtonMsg: '트래킹 시작하기',

            lastTimeStamp: null,
        }


    }

    componentWillMount() {
    }

    componentWillUnMount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onPressBackButton);
        Timer.clearTimeout(this);
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            activeStampList: nextProps.activeStampList,
        });
    }

    componentDidMount() {
        this.webview.messagesChannel.on('onPressPin', (e) => {
            let idx = parseInt(e.index),
                cng = idx,
                mapData = null,
                mapPinTitle = null,
                mapPinDesc;
            if (this.state.activeMapPinIndex === idx)
                cng = -1;

            switch (this.state.activeMapButton) {
                case 'stamp':
                    mapData = this.state.mapData.STAMP_DATA[idx - 1];
                    mapPinTitle = mapData.COT_CONTS_NAME;
                    break;
                case 'safety':
                    mapData = this.state.mapData.SAFETY_DATA[idx - 1];
                    mapPinTitle = mapData.COT_CONTS_NAME;
                    break;
                case 'major':
                    mapData = this.state.mapData.POINT_DATA[idx - 1];
                    mapPinTitle = mapData.COT_CONTS_NAME;
                    break;
                case 'enterance':
                    mapData = this.state.mapData.COORD_ENTERANCE_DATA[idx - 1];
                    mapPinTitle = mapData.NAME;
                    break;
            }
            mapPinDesc = mapData.COT_NATION_POINT_NUMBER + ' | ' + mapData.COT_GU_NAME + ' ' + mapData.COT_ADDR_FULL_NEW;

            this.setState({pinTitle: mapPinTitle, pinDesc: mapPinDesc, activeMapPinIndex: cng});
        });
    }

    onPressMapButton(e) {
        if (e === this.state.activeMapButton)
            this.setState({activeMapPinIndex: -1, activeMapButton: ''});
        else
            this.setState({activeMapPinIndex: -1, activeMapButton: e});

        this.webview.emit('removeAllPinAndPath');
        if (e === this.state.activeMapButton)
            return;

        switch (e) {
            case 'stamp':
                this.webview.emit('setCourseStampPin', this.state.mapData.STAMP_DATA);
                break;
            case 'safety':
                this.webview.emit('setCourseSafetyPin', this.state.mapData.SAFETY_DATA);
                break;
            case 'major':
                this.webview.emit('setCourseMajorPin', this.state.mapData.POINT_DATA);
                break;
            case 'enterance':
                this.webview.emit('setCourseEnterancePin', this.state.mapData.COORD_ENTERANCE_DATA);
                this.webview.emit('setCourseEnterancePath', this.state.mapData.COORD_ENTERANCE_DATA);
                break;
        }
    }
    onWebViewLoaded() {
        this.webview.emit('moveMapCenter', this.state.mapData.COORD_CENTER);
        this.webview.emit('setCoursePath', this.state.mapData.COORD_DATA);
    }

    async isGpsAvailable() {
        return Location.getProviderStatusAsync();
    }

    async _getLocationAsync() {
        let {status} = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({errorMessage: 'Permission to access location was denied'});
        }
        if (!(await this.isGpsAvailable()).gpsAvailable) {
            ToastAndroid.show("GPS를 켜주세요", ToastAndroid.SHORT);
        } else {
            const location = await Location.watchPositionAsync({
                enableHighAccuracy: true,
                distanceInterval: 1,
                timeInterval: 1,
            }, (location) => {
                let walkingForMin = 0;

                if(this.state.location.latitude != 0 && this.state.location.longitude != 0)
                {
                    walkingForMin = Geolib.getDistance({
                        latitude: this.state.location.latitude,
                        longitude: this.state.location.longitude
                    }, {
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                    });
                }

                this.setState({
                    location: {
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                    },
                    walkingDistance: this.state.walkingDistance + walkingForMin,
                    burnKcal: this.state.burnKcal + 0.0476 * walkingForMin,
                });

                this.webview.emit('setMyLocationPin', {
                    y: location.coords.latitude,
                    x: location.coords.longitude
                });

                this.searchStamp(this.majorPinData);
            });

            this.setState({
                retValueWatchPosition: location,
            });
        }
    }

    searchStamp(pinPoint) {
        const errorRange = 10; //10m
        let nearSpotIdx = 0;
        let nearSpotDist = 999999999;

        for (var pin in this.majorPinData) {
            pointDist = Geolib.getDistance({
                latitude: this.state.location.latitude,
                longitude: this.state.location.longitude
            }, {
                latitude: this.majorPinData[pin].COT_COORD_Y,
                longitude: this.majorPinData[pin].COT_COORD_X
            });
            if (nearSpotDist > pointDist) {
                nearSpotIdx = pin;
                nearSpotDist = pointDist;
            }
            if (pointDist <= errorRange) {
                this.props.funcUpdateStampState({
                    name: this.majorPinData[pin].COT_STAMP_ICON,
                    reg_date: new Date().toISOString().slice(0,10),
                });
                this.props.funcInsertStamp(this.majorPinData[pin].COT_STAMP_ICON);
                Notifications.presentLocalNotificationAsync({title: '스탬프 발견', body: this.majorPinData[pin].COT_CONTS_NAME});
            }
        }
        this.setState({
            nearSpot: {
                name: this.majorPinData[nearSpotIdx].COT_CONTS_NAME,
                distance: nearSpotDist,
                stamp: this.majorPinData[nearSpotIdx].COT_STAMP_ICON,
            }
        });
    }

    async startTracking() {
        if(!(await this.isGpsAvailable()).gpsAvailable)
            ToastAndroid.show("GPS를 켜주세요", ToastAndroid.SHORT);
        else{
            if(this.state.retValueWatchPosition === null)
                this._getLocationAsync();

            this.props.funcChangeActiveCourse(this.props.COURSE_INDEX + 1);

            Notifications.presentLocalNotificationAsync({
                title: '트래킹 시작',
                body: this.state.mapData.NAME + ' 트래킹 진행중~.',
                sticky: true
            });
            this.setState({
                isTracking: true,
                trackingButtonMsg: '트래킹 그만하기',
                walkingTime: 0,
                walkingDistance: 0,
                burnKcal: 0,
                nearSpot: {
                    distance: 0,
                    stamp: '',
                },
            });
            this.setWalkingTime();
        }
    }

    stopTracking() {
        Notifications.dismissAllNotificationsAsync();
        this.state.retValueWatchPosition && this.state.retValueWatchPosition.remove();

        this.props.funcInsertRecord(this.state.mapData.INDEX, ThisWeek(), parseFloat(this.state.walkingDistance), this.state.walkingTime);

        this.setState({
            isTracking: false,
            trackingButtonMsg: '트래킹 시작하기',
            retValueWatchPosition: null,
            location: {
                latitude: 0,
                longitude: 0,
            },
            lastTimeStamp: null,
        });
        Timer.clearInterval('walkingTime');
    }

    async setWalkingTime() {
        Timer.setInterval('walkingTime', () =>
        {
            let time = (new Date()).getTime();
            let lastTimeStamp = this.state.lastTimeStamp;
            if(lastTimeStamp === null){
                lastTimeStamp = (new Date()).getTime();
            }

            this.setState({
                walkingTime: this.state.walkingTime + parseInt((time - lastTimeStamp) / 1000),
                lastTimeStamp: time
            })
        }, 1000);
    }

    getMapCenter() {
        this.webview.emit('center');
    }

    onPressBackButton(){
        if(this.state.isTracking){
            Alert.alert("트래킹", "트래킹을 중단하시겠습니까?",
            [
                {
                    text: '네',
                    onPress: () => {
                        this.setState({isTracking: false});
                        this.stopTracking();
                        Actions.pop();
                    }
                },
                {text: '아니요'},
            ],
            )
        }else{
            Actions.pop();
        }
        return true;
    }

    render() {
        const buttonMsg = this.state.isTracking ? "트래킹 그만하기" : "트래킹 시작하기";
        return (
            <View style={styles.fill}>
                <NavBar style={navBarStyles}>
                    <View style={{
                        flexDirection: 'row',
                        marginLeft: -16
                    }}>
                        <NavButton style={{
                            marginHorizontal: 14
                        }}>
                            <IconMaterialIcons name="arrow-back"
                                onPress={this.onPressBackButton} size={24} style={navBarStyles.backIcon}/>
                        </NavButton>
                        <NavTitle style={navBarStyles.title}>
                            {this.state.mapData.NAME}
                        </NavTitle>
                        <View style={{
                            flex: 1,
                            alignItems: 'flex-end'
                        }}>
                        </View>
                    </View>
                </NavBar>

                <View style={{flex:1, backgroundColor: 'rgba(20,39,46,0.9)'}}>
                    <View style={{flex: 1}}>
                        <WebView
                            ref={webview => {this.webview = webview;}}
                            source={{uri: 'http://kung.kr/seoulapp/map.html'}}
                            onLoadEnd={this.onWebViewLoaded}
                        />
                        <View style={{position: 'absolute',top: 14,right: 14}}>
                            <TouchableHighlight underlayColor={this.state.activeMapButton === 'stamp'
                                ? '#4388ff'
                                : '#F1F1F1'} onPress={() => this.onPressMapButton('stamp')} style={[
                                styles.mapButton, this.state.activeMapButton === 'stamp'
                                    ? styles.mapButtonActive
                                    : {}
                            ]}>
                                <IconMaterialIcons name="nature" color={this.state.activeMapButton === 'stamp'
                                    ? '#FFF'
                                    : '#565c75'} size={20}/>
                            </TouchableHighlight>
                            <TouchableHighlight underlayColor={this.state.activeMapButton === 'enterance'
                                ? '#4388ff'
                                : '#F1F1F1'} onPress={() => this.onPressMapButton('enterance')} style={[
                                styles.mapButton, this.state.activeMapButton === 'enterance'
                                    ? styles.mapButtonActive
                                    : {}, {
                                    marginTop: 6
                                }
                            ]}>
                                <View>
                                    <Text style={[
                                        styles.mapButtonText, {
                                            color: this.state.activeMapButton === 'enterance'
                                                ? '#FFF'
                                                : '#565c75'
                                        }
                                    ]}>진입</Text>
                                    <Text style={[
                                        styles.mapButtonText, {
                                            marginTop: -3,
                                            color: this.state.activeMapButton === 'enterance'
                                                ? '#FFF'
                                                : '#565c75'
                                        }
                                    ]}>경로</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight underlayColor={this.state.activeMapButton === 'major'
                                ? '#4388ff'
                                : '#F1F1F1'} onPress={() => this.onPressMapButton('major')} style={[
                                styles.mapButton, this.state.activeMapButton === 'major'
                                    ? styles.mapButtonActive
                                    : {}, {
                                    marginTop: 6
                                }
                            ]}>
                                <View>
                                    <Text style={[
                                        styles.mapButtonText, {
                                            color: this.state.activeMapButton === 'major'
                                                ? '#FFF'
                                                : '#565c75'
                                        }
                                    ]}>주요</Text>
                                    <Text style={[
                                        styles.mapButtonText, {
                                            marginTop: -3,
                                            color: this.state.activeMapButton === 'major'
                                                ? '#FFF'
                                                : '#565c75'
                                        }
                                    ]}>지점</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight underlayColor={this.state.activeMapButton === 'safety'
                                ? '#4388ff'
                                : '#F1F1F1'} onPress={() => this.onPressMapButton('safety')} style={[
                                styles.mapButton, this.state.activeMapButton === 'safety'
                                    ? styles.mapButtonActive
                                    : {}, {
                                    marginTop: 6
                                }
                            ]}>
                                <View>
                                    <Text style={[
                                        styles.mapButtonText, {
                                            color: this.state.activeMapButton === 'safety'
                                                ? '#FFF'
                                                : '#565c75'
                                        }
                                    ]}>안전</Text>
                                    <Text style={[
                                        styles.mapButtonText, {
                                            marginTop: -3,
                                            color: this.state.activeMapButton === 'safety'
                                                ? '#FFF'
                                                : '#565c75'
                                        }
                                    ]}>지점</Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                    </View>
                    <View style={{height:250, paddingLeft: 15, paddingRight: 15, paddingBottom: 15}}>
                        <View style={{height: 40, flexDirection: 'row', marginBottom:5}}>
                            <View style={{flex:1, borderColor: 'white', borderBottomWidth: 1, flexDirection:'row'}}>
                                <Text style={{flex:1, fontSize:20, color:'white', alignSelf:'center'}}>{this.state.mapData.NAME}</Text>
                                <View style={{flex:1, alignItems: 'flex-end', justifyContent:'center'}}>
                                    <IconMaterialCommunityIcons name="timer" size={20} color="white">
                                        <Text style={{color:'white', fontSize:20}}> {parseInt(this.state.walkingTime / 60)} : {this.state.walkingTime % 60}</Text>
                                    </IconMaterialCommunityIcons>
                                </View>
                            </View>
                        </View>
                        <View style={{flex:1, flexDirection: 'row'}}>
                            <View style={{flex:1, flexDirection: 'column'}}>
                                <View style={{alignItems:'center', height: 40, justifyContent:'center', flexDirection: 'row'}}>
                                    <IconIonicons name="md-walk" size={20} color="white" />
                                    <Text style={contentStyles.smallTitle}> 걸은 거리 (M)</Text>
                                </View>
                                <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                                    <Text style={{fontSize:40, color:'white'}}>{parseInt(this.state.walkingDistance)} m</Text>
                                </View>
                                <View style={{alignItems: 'center', height:40, flexDirection:'row', justifyContent:'center'}}>
                                    <Text style={{fontSize:20, color:'white'}}>운동량 {(this.state.burnKcal).toFixed(2)}</Text>
                                    <Text style={{fontSize:15, color:'white'}}> kcal</Text>
                                </View>
                            </View>

                            <View style={{flex:1, flexDirection:'column'}}>
                                <View style={{alignItems:'center', height: 40, justifyContent:'center', flexDirection: 'row'}}>
                                    <IconMaterialCommunityIcons name="map-marker" size={20} color="white" />
                                    <Text style={contentStyles.smallTitle}>가까운 지점</Text>
                                </View>
                                <View style={{flex:1, borderLeftWidth:2, borderColor: 'white'}}>
                                    <View style={{alignItems:'center', marginTop: 5, marginBottom:5}}>
                                        <View style={contentStyles.stampIconWrap}>
                                            <Image
                                                style={contentStyles.stampIcon}
                                                source={StampIconFunc(this.state.nearSpot.stamp)}
                                            />
                                        </View>
                                    </View>
                                    <Text style={contentStyles.smallTitle}>남은 거리</Text>
                                </View>
                                <View style={{height:40, flexDirection:'row'}}>
                                    <View style={{flex:1}} />
                                    <View style={{flex:5, justifyContent:'center', alignItems:'center', flexDirection:'row'}}>
                                        <Text style={contentStyles.text}>{(this.state.nearSpot.distance / 1000).toFixed(2)}</Text>
                                        <Text style={contentStyles.smallTitle}> km</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={{ height: 60 }}>
                    <TouchableNativeFeedback onPress={() => {
                            if(this.state.isTracking)
                                this.stopTracking();
                            else
                                this.startTracking();
                        }}>
                        <View style={{
                            flex: 1,
                            backgroundColor: '#57C968',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Text style={{
                                fontSize: 18,
                                fontWeight: 'bold',
                                color: '#FFF'
                            }}>{buttonMsg}</Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    fill: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    mapButton: {
        width: 36,
        height: 36,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: '#9c9c9c',
        backgroundColor: '#FCFCFC',
        alignItems: 'center',
        justifyContent: 'center'
    },
    mapButtonText: {
        color: '#565c75',
        fontSize: 12
    },
    mapButtonActive: {
        borderColor: '#4a6fa1',
        backgroundColor: '#4388ff'
    }
});

const contentStyles = StyleSheet.create({
    smallTitle:{
        color: 'white',
        fontSize: 20,
        fontWeight:'bold'
    },
    text:{
        color: 'white',
        fontSize: 35
    },
    stampIconWrap: {
        width: 101,
        height: 101,
        borderColor: '#D1D1D1',
        borderWidth: 1,
        borderRadius: 101,
        borderStyle: 'dashed'
    },
    stampIcon: {
        width: 100,
        height: 100,
        tintColor:'#D1D1D1'
    },
})
