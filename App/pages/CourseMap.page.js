import React, { Component } from 'React'
import {
    Animated, Image, ScrollView,
    StyleSheet, Text, View, TouchableHighlight
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavBar, { NavButton, NavButtonText, NavTitle, NavGroup } from 'react-native-nav'
import { Actions } from 'react-native-router-flux';
import { WebView } from 'react-native-webview-messaging/WebView';

import MapSource from './webview/map.html';
import navBarStylesModule from './assets/navbar.styles';

import MapData from './datasets/courseinfo.list';

const navBarStyles = navBarStylesModule("#564339");
const mapData = MapData[0];

export default class CourseMap extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            activeMapButton: '',
        };

        this.onWebViewLoaded = this.onWebViewLoaded.bind(this);
        this.getMapCenter = this.getMapCenter.bind(this);
        this.onPressMapButton = this.onPressMapButton.bind(this);
    }

    getMapCenter(){
        this.webview.emit('center');
    }

    onPressMapButton(e){
        if(e === this.state.activeMapButton) this.setState({activeMapButton: ''});
        else this.setState({activeMapButton: e});

        this.webview.emit('removeAllPinAndPath');
        if(e === this.state.activeMapButton) return;

        switch(e){
            case 'stamp':
                this.webview.emit('setCourseStampPin', mapData.STAMP_DATA);
                break;
            case 'safety':
                this.webview.emit('setCourseSafetyPin', mapData.SAFETY_DATA);
                break;
            case 'major':
                this.webview.emit('setCourseMajorPin', mapData.POINT_DATA);
                break;
            case 'enterance':
                this.webview.emit('setCourseEnterancePin', mapData.COORD_ENTERANCE_DATA);
                this.webview.emit('setCourseEnterancePath', mapData.COORD_ENTERANCE_DATA);
                break;
        }
    }
    onWebViewLoaded(){
        this.webview.emit('moveMapCenter', mapData.COORD_CENTER);
        this.webview.emit('setCoursePath', mapData.COORD_DATA);
    }
    render(){
        return (
            <View style={styles.fill}>
                <NavBar style={navBarStyles}>
                    <View style={{flexDirection: 'row', marginLeft: -16}}>
                        <NavButton style={{marginHorizontal: 14}} onPress={this.getMapCenter}>
                            <Icon name="arrow-back" size={24} style={navBarStyles.backIcon} />
                        </NavButton>
                        <NavTitle style={navBarStyles.title}>
                            수락·불암산코스
                        </NavTitle>
                    </View>
                </NavBar>
                <View style={styles.fill}>
                    <WebView
                        ref={ webview => { this.webview = webview; }}
                        source={MapSource}
                        onLoadEnd={this.onWebViewLoaded}
                    />
                    <View style={{position: 'absolute', top: 14, right: 14}}>
                        <TouchableHighlight
                            underlayColor={this.state.activeMapButton === 'stamp' ? '#4388ff' : '#F1F1F1'}
                            onPress={()=>this.onPressMapButton('stamp')}
                            style={[
                                styles.mapButton,
                                this.state.activeMapButton === 'stamp' ? styles.mapButtonActive : {},
                            ]}
                        >
                            <Icon name="nature" color={this.state.activeMapButton === 'stamp' ? '#FFF' : '#565c75'} size={20} />
                        </TouchableHighlight>
                        <TouchableHighlight
                            underlayColor={this.state.activeMapButton === 'enterance' ? '#4388ff' : '#F1F1F1'}
                            onPress={()=>this.onPressMapButton('enterance')}
                            style={[
                                styles.mapButton,
                                this.state.activeMapButton === 'enterance' ? styles.mapButtonActive : {},
                                {marginTop: 6}
                            ]}
                        >
                            <View>
                                <Text style={[styles.mapButtonText, {color: this.state.activeMapButton === 'enterance' ? '#FFF' : '#565c75'}]}>진입</Text>
                                <Text style={[styles.mapButtonText, {marginTop: -3, color: this.state.activeMapButton === 'enterance' ? '#FFF' : '#565c75'}]}>경로</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight
                            underlayColor={this.state.activeMapButton === 'major' ? '#4388ff' : '#F1F1F1'}
                            onPress={()=>this.onPressMapButton('major')}
                            style={[
                                styles.mapButton,
                                this.state.activeMapButton === 'major' ? styles.mapButtonActive : {},
                                {marginTop: 6}
                            ]}
                        >
                            <View>
                                <Text style={[styles.mapButtonText, {color: this.state.activeMapButton === 'major' ? '#FFF' : '#565c75'}]}>주요</Text>
                                <Text style={[styles.mapButtonText, {marginTop: -3, color: this.state.activeMapButton === 'major' ? '#FFF' : '#565c75'}]}>지점</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight
                            underlayColor={this.state.activeMapButton === 'safety' ? '#4388ff' : '#F1F1F1'}
                            onPress={()=>this.onPressMapButton('safety')}
                            style={[
                                styles.mapButton,
                                this.state.activeMapButton === 'safety' ? styles.mapButtonActive : {},
                                {marginTop: 6}
                            ]}
                        >
                            <View>
                                <Text style={[styles.mapButtonText, {color: this.state.activeMapButton === 'safety' ? '#FFF' : '#565c75'}]}>안전</Text>
                                <Text style={[styles.mapButtonText, {marginTop: -3, color: this.state.activeMapButton === 'safety' ? '#FFF' : '#565c75'}]}>지점</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>
                <View style={{height: 90, borderTopWidth: 1, borderTopColor: '#D1D1D1', padding: 20, justifyContent: 'center'}}>
                    <Text style={{fontSize: 18, color: '#222'}}>수락.불암산 코스</Text>
                    <View style={{marginTop: 4, flexDirection: 'row', alignItems: 'center'}}>
                        <Icon name="near-me" size={16} style={{marginRight: 2}} color='#999' />
                        <Text style={{color: '#515151', fontSize: 13}}>노원구,도봉구(14.3km)</Text>
                        <Icon name="timer" size={16} style={{marginRight: 2, marginLeft: 6,}} color='#999' />
                        <Text style={{color: '#515151', fontSize: 13}}>6시간 30분</Text>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    fill: {
        flex: 1,
        backgroundColor: '#FFF',
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
        backgroundColor: '#4388ff',
    },
});