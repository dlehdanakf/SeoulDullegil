import React, {Component} from 'React'
import {
    Animated,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Platform,
    TouchableNativeFeedback,
    Dimensions,
    ToastAndroid
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavBar, {NavButton, NavButtonText, NavTitle, NavGroup} from 'react-native-nav'
import {Actions} from 'react-native-router-flux';
import {WebView} from 'react-native-webview-messaging/WebView';

import MapSource from './webview/map.html';
import navBarStylesModule from './assets/navbar.styles';
import trakingStyles from './assets/TrackingComponent.styles';

import {Constants, Location, Permissions, Notifications} from 'expo';
import Geolib from 'geolib';

import Timer from 'react-native-timer';
import TrackingInfo from './components/trackingInfo';
import Drawer from 'react-native-drawer'

import CourseData from './datasets/course.list';
import MapData from './datasets/courseinfo.list';

const navBarStyles = navBarStylesModule("#558F4A");
const COURSE_INDEX = 0;

export default class Tracking extends React.Component {
    constructor(props) {
        super(props);

        this.majorPinData = MapData[COURSE_INDEX].STAMP_DATA;

        this.onWebViewLoaded = this.onWebViewLoaded.bind(this);
        this.getMapCenter = this.getMapCenter.bind(this);
        this.onPressMapButton = this.onPressMapButton.bind(this);

        this.state = {
            location: {
                latitude: null,
                longitude: null
            },
            errorMessage: null,
            isStartTracking: null,
            notificationKey: null,
            trackingFunc: null,
            trackingButtonMsg: "",
            walkingTime: 0,
            walkingDistance: 0,
            nearSpot: {
                distance: 0,
                name: '트래킹을 시작해주세요'
            },
            courseData: CourseData[COURSE_INDEX],
            mapData: MapData[COURSE_INDEX],

            drawerOpen: false,
            drawerDisabled: false,
            activeMapPinIndex: -1,
            pinTitle: '',
            pinDesc: ''
        }
    }

    componentWillMount() {
        if (Platform.OS === 'android' && !Constants.isDevice) {
            this.setState({errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!'});
        } else {
            this._getLocationAsync();
        }
        this.setState({trackingFunc: this.startTracking.bind(this), trackingButtonMsg: '트래킹 시작하기', isStartTracking: false})
    }

    componentWillUnMount() {
        Timer.clearTimeout(this);
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
            console.log('gps : true');
            const location = await Location.watchPositionAsync({
                enableHighAccuracy: true,
                distanceInterval: 1
            }, (location) => {
                this.setState({
                    location: {
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude
                    }
                });
                this.webview.emit('setMyLocationPin', {
                    y: location.coords.latitude,
                    x: location.coords.longitude
                });
                if (this.state.isStartTracking) {
                    this.setState({
                        walkingDistance: this.state.walkingDistance + 1
                    });
                    this.searchStamp(this.majorPinData);
                }
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
                Notifications.presentLocalNotificationAsync({title: '스템프 발견', body: this.majorPinData[pin].COT_CONTS_NAME});
            }
        }
        this.setState({
            nearSpot: {
                name: this.majorPinData[nearSpotIdx].COT_CONTS_NAME,
                distance: nearSpotDist
            }
        });
        console.log('가까운 지점 : ' + this.state.nearSpot.name);
        console.log('Distance : ' + this.state.nearSpot.distance);
    }

    async startTracking() {
        if(!(await this.isGpsAvailable()).gpsAvailable)
            ToastAndroid.show("GPS를 켜주세요", ToastAndroid.SHORT);
        else{
            Notifications.presentLocalNotificationAsync({
                title: '트래킹 시작',
                body: this.state.mapData.NAME + ' 트래킹 진행중~.',
                sticky: true
            });
            this.setState({isStartTracking: true, trackingFunc: this.stopTracking.bind(this), trackingButtonMsg: '트래킹 그만하기', walkingTime: 0, walkingDistance: 0});
            this.setWalkingTime();
        }
    }

    stopTracking() {
        Notifications.dismissAllNotificationsAsync();
        this.setState({isStartTracking: false, trackingFunc: this.startTracking.bind(this), trackingButtonMsg: '트래킹 시작하기'});
        Timer.clearInterval('walkingTime');
    }

    async setWalkingTime() {
        Timer.setInterval('walkingTime', () => this.setState({
            walkingTime: this.state.walkingTime + 1
        }), 1000);
    }

    getMapCenter() {
        this.webview.emit('center');
    }

    closeControlPanel = () => {
        this._drawer.close()
    };
    openControlPanel = () => {
        this._drawer.open()
    };

    render() {
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
                            <Icon name="arrow-back" onPress={Actions.pop} size={24} style={navBarStyles.backIcon}/>
                        </NavButton>
                        <NavTitle style={navBarStyles.title}>
                            {this.state.mapData.NAME}
                        </NavTitle>
                        <View style={{
                            flex: 1,
                            alignItems: 'flex-end'
                        }}>
                            <NavButton onPress={this.state.trackingFunc}>
                                <Text style={{
                                    color: 'white',
                                    fontSize: 17
                                }}>{this.state.trackingButtonMsg}</Text>
                            </NavButton>
                        </View>
                    </View>

                </NavBar>

                <Drawer ref={(ref) => this._drawer = ref}
                    type="overlay"
                    content={
                        <TrackingInfo
                            courseName = {this.state.mapData.NAME}
                            walkingTime = {this.state.walkingTime}
                            walkingDistance = {this.state.walkingDistance}
                            nearSpot = {this.state.nearSpot}
                        />
                    }
                    openDrawerOffset={(viewport) => viewport.height - 270} /* 사이드바 크기 조절 */
                    closedDrawerOffset={40} styles={{
                        main: {
                            shadowColor: "#000000",
                            shadowOpacity: 1,
                            shadowRadius: 0
                        }
                    }}
                    captureGestures={false}
                    acceptTap={true}
                    tapToClose={true}
                    tweenDuration={250} //열고 닫는 시간
                    panOpenMask={-20}
                    panCloseMask={1000}
                    onPress={this.open}
                    onOpen={() => { this.setState({drawerOpen: true}) }}
                    onClose={() => { this.setState({drawerOpen: false}) }}
                    disabled={this.state.drawerDisabled} side="bottom">
                    <WebView ref={webview => {
                        this.webview = webview;
                    }} source={MapSource} onLoadEnd={this.onWebViewLoaded}/>
                    <View style={{
                        position: 'absolute',
                        top: 14,
                        right: 14
                    }}>
                        <TouchableHighlight underlayColor={this.state.activeMapButton === 'stamp'
                            ? '#4388ff'
                            : '#F1F1F1'} onPress={() => this.onPressMapButton('stamp')} style={[
                            styles.mapButton, this.state.activeMapButton === 'stamp'
                                ? styles.mapButtonActive
                                : {}
                        ]}>
                            <Icon name="nature" color={this.state.activeMapButton === 'stamp'
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
                </Drawer>

                <View style={{
                    position: 'absolute',
                    zIndex: -1,
                    bottom: 0,
                    height: 100,
                    width: Dimensions.get('window').width,
                    backgroundColor: '#0C181C'
                }}/>
                <View style={{
                    height: 60
                }}>
                    <TouchableNativeFeedback onPress={this.state.trackingFunc}>
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
                            }}>{this.state.trackingButtonMsg}</Text>
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
