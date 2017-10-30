import React, { Component } from 'React'
import {
    Animated, Image, ScrollView, ToastAndroid, ActivityIndicator,
    StyleSheet, Text, View, TouchableHighlight
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';
import NavBar, { NavButton, NavButtonText, NavTitle, NavGroup } from 'react-native-nav'
import { Actions } from 'react-native-router-flux';
import { WebView } from 'react-native-webview-messaging/WebView';
import RoadInfo from './webview/road.info.html';

import Button from './components/button.component';
import navBarStylesModule from './assets/navbar.styles';

import CourseData from './datasets/course.list';
import SubwayColors from './datasets/subway.colors';
import greenColors from './datasets/green.colors';

import StampIconFunc from './components/stamp.function';
import StampCheckFunc from './components/stamp.check.function';

const HEADER_MAX_HEIGHT = 160;
const HEADER_MIN_HEIGHT = 0;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default class CourseInfo extends React.Component{
    constructor(props) {
        super(props);

        const courseIndex = parseInt(props.COURSE_INDEX) - 1;
        this.state = {
            showCourseInfo: false,
            courseData: CourseData[courseIndex],
            courseIndex: courseIndex,
            mapData: props.mapData,
            scrollY: new Animated.Value(0),
            showModal: false,
            modalData: {
                title: null,
                subTitle: null
            },

            activeStampList: props.stampList,
        };

        this.renderCourseRoadItem = this.renderCourseRoadItem.bind(this);
        this.onPressRoadItem = this.onPressRoadItem.bind(this);
        this.updateStampState = this.updateStampState.bind(this);
    }
    componentDidMount(){
        setTimeout(() => this.setState({
            showCourseInfo: true
        }), 1);
    }

    updateStampState(stamp){
        this.state.activeStampList.push(stamp);

        this.setState({
            activeStampList: this.state.activeStampList
        });
    }


    renderCourseRoadItem(data, index){
        const length = this.state.mapData.ROAD_DATA.length;
        let topLine = '#888',
            bottomLine = '#888';

        if(index === 0) topLine = 'transparent';
        if(length === index + 1) bottomLine = 'transparent';

        let icon = null;
        switch(data.TYPE){
            case 'M':
                icon = (
                    <View style={[contentStyles.roadItemIcon, contentStyles.bigIcon, {borderColor: SubwayColors[data.COLOR - 1]}]}>
                        <Icon name="directions-subway" size={20} color={SubwayColors[data.COLOR - 1]} />
                    </View>
                );
                break;
            case 'S':
                icon = (
                    <View style={[contentStyles.roadItemIcon, contentStyles.bigIcon, {borderColor: '#f7941f'}]}>
                        <Icon name="nature" size={20} color="#f7941f" />
                    </View>
                );
                break;
            case 'T':
                icon = (
                    <View style={[contentStyles.roadItemIcon, contentStyles.bigIcon]}>
                        <Icon name="wc" size={18} color="#888" />
                    </View>
                );
                break;
            default:
                icon = (
                    <View style={contentStyles.roadItemIcon}>
                        <Icon name="expand-more" size={12} color="#888" />
                    </View>
                );
        }

        const item = (
            <View style={contentStyles.roadItemWrap}>
                <View style={contentStyles.roadItemIconWrap}>
                    <View style={{flex: 1}} />
                    <View style={contentStyles.roadItemLine}>
                        <View style={{flex: 1, backgroundColor: topLine}} />
                        <View style={{flex: 1, backgroundColor: bottomLine}} />
                    </View>
                    {icon}
                    <View style={{width: 20}} />
                </View>
                <View style={contentStyles.roadItemInfoWrap}>
                    <Text style={{fontSize: 15, fontWeight: '400', color: '#222'}}>{data.NAME}</Text>
                    {data.TYPE !== 'S' && data.DESCRIPTION !== null ? <Text style={{fontSize: 12, color: '#999'}}>{data.DESCRIPTION}</Text> : null}
                    {data.TYPE === 'S' ? <Text style={{fontSize: 12, color: '#999'}}>스탬프 획득지점</Text> : null}
                </View>
            </View>
        );

        return (
            <TouchableHighlight onPress={()=>{ this.onPressRoadItem(data); }} underlayColor="#F0F0F0" key={index}>{item}</TouchableHighlight>
        );
    }
    onPressRoadItem(data){
        function takeModalDataFromPoint(e, mapData){
            const data = e.TYPE === 'S' ? mapData.STAMP_DATA : mapData.POINT_DATA;
            for(let i = 0; i < data.length; i++){
                if(data[i].RNUM === e.RNUM){
                    return {
                        img: data[i].COT_IMG_MAIN_URL,
                        desc: e.TYPE === 'S' ? null : data[i].COT_VALUE_01,
                        title: data[i].COT_CONTS_NAME,
                        subTitle: e.TYPE === 'S' ? '스탬프 획득지점' : '주요지점'
                    };
                }
            }
        }

        let modal_data = {};
        switch(data.TYPE){
            case 'M':
            case 'T': ToastAndroid.show('해당 지점에 대한 상세정보가 없습니다.', ToastAndroid.SHORT); return; break;
            case 'S':
            case 'P': modal_data = takeModalDataFromPoint(data, this.state.mapData); break;
        }

        this.setState({
            modalData: modal_data,
            showModal: true
        });
    }

    render() {
        const actionBarOpacity = this.state.scrollY.interpolate({
            inputRange: [80, HEADER_SCROLL_DISTANCE],
            outputRange: [0, 1],
            extrapolate: 'clamp',
        });
        const headerOpacity = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE / 2],
            outputRange: [1, 0],
            extrapolate: 'clamp',
        });
        const headerHeight = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
            extrapolate: 'clamp',
        });

        const courseDifficulty = ['', '초급', '중급', '고급'];
        const navBarStyles = navBarStylesModule(greenColors[this.state.courseIndex]);

        return (
            <View style={styles.fill}>
                <NavBar style={navBarStyles}>
                    <View style={{flexDirection: 'row', marginLeft: -16}}>
                        <NavButton style={{marginHorizontal: 14}} onPress={()=>Actions.pop()}>
                            <Icon name="arrow-back" size={24} style={navBarStyles.backIcon}/>
                        </NavButton>
                        <Animated.Text accessibilityTraits="header" style={[navBarStyles.title, {opacity: actionBarOpacity}]}>
                            {this.state.courseData.COURSE_NM}
                        </Animated.Text>
                    </View>
                    <Animated.View style={{opacity: actionBarOpacity}}>
                        <NavGroup>
                            <NavButton onPress={()=>Actions.course_map({mapIndex: this.state.courseIndex})}>
                                <View style={styles.actionBarButtons}>
                                    <Icon name="map" size={24} color="#FFF" style={{marginRight: 4,}} />
                                    <Text style={{color: '#FFF', fontSize: 13}}>지도</Text>
                                </View>
                            </NavButton>
                            <NavButton
                                 onPress={() => {
                                     Actions.tracking({
                                         COURSE_INDEX: this.state.courseIndex,
                                         funcInsertStamp: this.props.funcInsertStamp,
                                         funcInsertRecord: this.props.funcInsertRecord,
                                         activeStampList: this.state.activeStampList,
                                         funcChangeActiveCourse: this.props.funcChangeActiveCourse,
                                         funcUpdateStampState: this.updateStampState,
                                     })
                                 }}
                            >
                                <View style={styles.actionBarButtons}>
                                    <Icon name="transfer-within-a-station" size={24} color="#FFF" style={{marginRight: 4,}} />
                                    <Text style={{color: '#FFF', fontSize: 13}}>트래킹 코스 지정</Text>
                                </View>
                            </NavButton>
                        </NavGroup>
                    </Animated.View>
                </NavBar>
                <View style={styles.fill}>
                    <ScrollView
                        style={[styles.fill, {backgroundColor: '#FFF'}]}
                        scrollEventThrottle={16}
                        onScroll={Animated.event([{nativeEvent: {contentOffset: {y: this.state.scrollY}}}])}
                    >
                        {this.state.showCourseInfo ?
                            <View style={styles.scrollViewContent}>
                                <View style={contentStyles.section}>
                                    <Text style={contentStyles.sectionTitle}>소개</Text>
                                    <Text style={contentStyles.infoText}>{this.state.mapData.DESCRIPTION}</Text>
                                </View>
                                <View style={contentStyles.section}>
                                    <Text style={contentStyles.sectionTitle}>스탬프</Text>
                                </View>
                                <View style={{marginTop: -14}}>
                                    <ScrollView
                                        contentContainerStyle={{padding: 14, paddingRight: 0, flexDirection: 'row'}}
                                        horizontal={true}
                                        showsHorizontalScrollIndicator={false}
                                    >
                                        {this.state.mapData.STAMP_DATA.map((v, i) => {
                                            const activeDate = StampCheckFunc(v.COT_STAMP_ICON, this.state.activeStampList)
                                            if(activeDate){
                                                return (
                                                    <View style={{width: 140, height: 170, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E3E3E3', borderRadius: 4, marginRight: 14, padding: 14}} key={i}>
                                                        <View style={[contentStyles.stampIconWrap, {borderColor: '#f9931f', borderStyle: 'solid'}]}>
                                                            <Image
                                                                style={[contentStyles.stampIcon, {tintColor: '#f9931f'}]}
                                                                source={StampIconFunc(v.COT_STAMP_ICON)}
                                                            />
                                                        </View>
                                                        <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center'}}>
                                                            <Text style={{fontSize: 13, color: '#444'}}>{activeDate.substring(0, 10)}</Text>
                                                        </View>
                                                    </View>
                                                );
                                            }

                                            return (
                                                <View style={contentStyles.stampItemWrap} key={i}>
                                                    <View style={contentStyles.stampIconWrap}>
                                                        <Image
                                                            style={contentStyles.stampIcon}
                                                            source={StampIconFunc(v.COT_STAMP_ICON)}
                                                        />
                                                    </View>
                                                    <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center'}}>
                                                        <Text style={{fontSize: 13, color: '#BBB'}}>미획득</Text>
                                                    </View>
                                                </View>
                                            );
                                        })}
                                    </ScrollView>
                                </View>
                                <View style={contentStyles.section}>
                                    <Text style={contentStyles.sectionTitle}>교통편</Text>
                                    {this.state.mapData.TRANSPORT.map((v, i)=>{
                                        return (
                                            <View style={{flexDirection: 'row', alignItems: 'center'}} key={v.NAME}>
                                                <Text style={{width: 70, fontSize: 15, color: '#444'}}>{v.NAME}</Text>
                                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                    {v.NUMBER.map((b, j)=>{
                                                        let num = b, w = 16;
                                                        switch(num){
                                                            case 10: num = '경의중앙'; w = 50; break;
                                                            case 11: num = '분당'; w = 30; break;
                                                            case 12: num = '신분당'; w = 40; break;
                                                        }

                                                        return (
                                                            <Text
                                                                key={j}
                                                                style={[{
                                                                    borderColor: SubwayColors[b - 1],
                                                                    color: SubwayColors[b - 1],
                                                                }, {
                                                                    fontWeight: 'bold',
                                                                    marginRight: 2,
                                                                    borderRadius: 16,
                                                                    borderWidth: 2,
                                                                    width: w,
                                                                    height: 16,
                                                                    alignItems: 'center',
                                                                    textAlign: 'center',
                                                                    fontSize: 11
                                                                }]}
                                                            >
                                                                {num}
                                                            </Text>
                                                        );
                                                    })}

                                                    <Text style={{marginLeft: 4, color: '#444', fontSize: 15}}>{v.STATION}</Text>
                                                </View>
                                            </View>
                                        );
                                    })}
                                </View>
                                <View style={contentStyles.section}>
                                    <Text style={contentStyles.sectionTitle}>코스정보</Text>
                                </View>
                                <View style={contentStyles.sectionRoad}>
                                    {this.state.mapData.ROAD_DATA.map((v, i) => {
                                        return this.renderCourseRoadItem(v, i)
                                    })}
                                </View>
                            </View>
                        :
                            <View style={[styles.scrollViewContent, {flex: 1, justifyContent: 'center', alignItems: 'center'}]}>
                                <ActivityIndicator
                                    animating={true}
                                    size="large"
                                    color="#a0b145"
                                    style={{marginVertical: 30}}
                                />
                            </View>
                        }
                    </ScrollView>
                    <Animated.View style={[headerStyles.container, {height: headerHeight, backgroundColor: greenColors[this.state.courseIndex]}]}>
                        <Animated.View style={[headerStyles.content, {opacity: headerOpacity}]}>
                            <Text style={headerStyles.difficulty}>{courseDifficulty[this.state.courseData.COURSE_LEVEL]}코스</Text>
                            <Text style={headerStyles.title}>{this.state.courseData.COURSE_NM}</Text>
                            <View style={headerStyles.distance}>
                                <Icon name="near-me" size={16} style={{marginRight: 2}} color='rgba(255, 255, 255, .4)' />
                                <Text style={headerStyles.distanceText}>{this.state.courseData.LOCATION}({this.state.courseData.DISTANCE})</Text>
                                <Icon name="timer" size={16} style={{marginRight: 2, marginLeft: 6,}} color='rgba(255, 255, 255, .4)' />
                                <Text style={headerStyles.distanceText}>{this.state.courseData.WALK_TIME}</Text>
                            </View>
                            <View style={headerStyles.buttons}>
                                <View style={{marginRight: 12}}>
                                    <Button title="지도" icon="map" btnStyle={headerStyles.mapButton} borderRadius={24} onPress={()=>Actions.course_map({mapIndex: this.state.courseIndex})}/>
                                </View>
                                <Button title="트래킹 코스 지정" icon="transfer-within-a-station" btnStyle={headerStyles.mapButton} borderRadius={24}
                                    onPress={()=>Actions.tracking({COURSE_INDEX: this.state.courseIndex, funcInsertStamp: this.props.funcInsertStamp,
                                    funcInsertRecord: this.props.funcInsertRecord, activeStampList: this.state.activeStampList,
                                    funcChangeActiveCourse: this.props.funcChangeActiveCourse, funcUpdateStampState: this.updateStampState})}/>
                            </View>
                        </Animated.View>
                    </Animated.View>
                </View>
                <Modal
                    isVisible={this.state.showModal}
                    animationIn="slideInUp"
                    animationOut="slideOutDown"
                    animationInTiming={300}
                    animationOutTiming={150}
                    backdropOpacity={0.5}
                    onBackButtonPress={()=>this.setState({showModal: false})}
                    onBackdropPress={()=>this.setState({showModal: false})}
                    style={{marginHorizontal: 0, marginBottom: -10}}
                >
                    <View style={modalStyles.modalWrap}>
                        <View style={modalStyles.modal}>
                            <View style={modalStyles.header}>
                                <TouchableHighlight onPress={()=>this.setState({showModal: false})} style={modalStyles.titleWrap} underlayColor="#F1F1F1">
                                    <View style={{flex: 1, flexDirection: 'row'}}>
                                        <View style={{flex: 1, paddingHorizontal: 12, justifyContent: 'center',}}>
                                            <Text style={modalStyles.title}>{this.state.modalData.title}</Text>
                                            <Text style={modalStyles.subTitle}>{this.state.modalData.subTitle}</Text>
                                        </View>
                                        <View style={modalStyles.icon}>
                                            <Icon name="keyboard-arrow-down" size={32} />
                                        </View>
                                    </View>
                                </TouchableHighlight>
                            </View>
                            <View style={{flex: 1}}>
                                <WebView
                                    ref={ webview => { this.webview = webview; }}
                                    source={RoadInfo}
                                    onLoadEnd={() => this.webview.emit('drawRoadInfo', this.state.modalData) }
                                />
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    fill: {
        flex: 1,
    },
    scrollViewContent: {
        paddingTop: HEADER_MAX_HEIGHT + 7,
    },
    actionBarButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    }
});
const headerStyles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        overflow: 'hidden',
    },
    content: {
        flex: 1,
        // backgroundColor: '#444',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    difficulty: {
        color: '#FFF',
        fontSize: 13,
    },
    title: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: '500',
    },
    distance: {
        marginTop: 4,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    distanceText: {
        color: 'rgba(255, 255, 255, .6)',
        fontSize: 13,
    },
    buttons: {
        flexDirection: 'row',
        marginTop: 12,
    },
    mapButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, .3)',
        paddingHorizontal: 20,
        paddingVertical: 6,
        borderRadius: 28,
    },
});
const contentStyles = StyleSheet.create({
    section: {
        paddingVertical: 7,
        paddingHorizontal: 14,
    },
    sectionRoad: {
        backgroundColor: '#F9F9F9',
        borderTopWidth: 1,
        borderTopColor: '#E6E6E6',
    },
    sectionTitle: {
        fontSize: 13,
        color: '#999',
        marginBottom: 2,
    },
    infoText: {
        fontSize: 15,
        lineHeight: 23,
        color: '#444',
    },
    stampItemWrap: {
        width: 140,
        height: 170,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E3E3E3',
        borderRadius: 4,
        marginRight: 14,
        padding: 14
    },
    stampIconWrap: {
        width: 111,
        height: 111,
        borderColor: '#D1D1D1',
        borderWidth: 1,
        borderRadius: 111,
        borderStyle: 'dashed'
    },
    stampIcon: {
        width: 110,
        height: 110,
        tintColor:'#D1D1D1'
    },
    roadItemWrap: {
        flexDirection: 'row',
    },
    roadItemIconWrap: {
        width: 60,
        height: 60,
        flexDirection: 'row',
    },
    roadItemIcon: {
        width: 16,
        height: 16,
        borderWidth: 1,
        borderColor: '#888',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
        position: 'absolute',
        right: 14,
        top: 22
    },
    bigIcon: {
        width: 28,
        height: 28,
        borderWidth: 2,
        top: 16,
        right: 8
    },
    roadItemLine: {
        width: 3,
    },
    roadItemDefaultIcon: {
        width: 16,
        height: 16,
        borderWidth: 1,
        borderColor: '#888',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
        position: 'absolute',
        right: 14,
        top: 32
    },
    roadItemInfoWrap: {
        flex: 1,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#E1E1E1',
        marginRight: 14,
        paddingLeft: 7,
        justifyContent: 'center',
    },
});
const modalStyles = StyleSheet.create({
    modalWrap: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingVertical: 10,
        paddingHorizontal: 0
    },
    modal: {
        backgroundColor: '#FFF',
        borderRadius: 6,
        elevation: 2,
        height: 400,
    },
    header: {
        height: 70,
        padding: 5,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#AAA'
    },
    titleWrap: {
        flex: 1,
        borderRadius: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    subTitle: {
        fontSize: 13,
        color: '#AAA'
    },
    icon: {
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
