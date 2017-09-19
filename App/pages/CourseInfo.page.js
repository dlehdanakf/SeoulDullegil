import React, { Component } from 'React'
import {
    Animated, Image, ScrollView,
    StyleSheet, Text, View, TouchableHighlight
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavBar, { NavButton, NavButtonText, NavTitle, NavGroup } from 'react-native-nav'
import { Actions } from 'react-native-router-flux';

import Button from './components/button.component';
import navBarStylesModule from './assets/navbar.styles';

import CourseData from './datasets/course.list';
import MapData from './datasets/courseinfo.list';
import SubwayColors from './datasets/subway.colors';

import StampIconFunc from './components/stamp.function';

const COURSE_INDEX = 0;

const HEADER_MAX_HEIGHT = 160;
const HEADER_MIN_HEIGHT = 0;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const navBarStyles = navBarStylesModule("#a8c99e");

export default class CourseInfo extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            courseData: CourseData[COURSE_INDEX],
            mapData: MapData[COURSE_INDEX],
            scrollY: new Animated.Value(0),
        };
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

        const courseDifficulty = ['초급', '초급', '중급', '고급'];

        return (
            <View style={styles.fill}>
                <NavBar style={navBarStyles}>
                    <View style={{flexDirection: 'row', marginLeft: -16}}>
                        <NavButton style={{marginHorizontal: 14}}>
                            <Icon name="arrow-back" size={24} style={navBarStyles.backIcon} />
                        </NavButton>
                        <Animated.Text accessibilityTraits="header" style={[navBarStyles.title, {opacity: actionBarOpacity}]}>
                            {this.state.courseData.COURSE_NM}
                        </Animated.Text>
                    </View>
                    <Animated.View style={{opacity: actionBarOpacity}}>
                        <NavGroup>
                            <NavButton onPress={() => {alert('AAA')}}>
                                <View style={styles.actionBarButtons}>
                                    <Icon name="map" size={24} color="#FFF" style={{marginRight: 4,}} />
                                    <Text style={{color: '#FFF', fontSize: 13}}>지도</Text>
                                </View>
                            </NavButton>
                            <NavButton onPress={() => {}}>
                                <View style={styles.actionBarButtons}>
                                    <Icon name="transfer-within-a-station" size={24} color="#FFF" style={{marginRight: 4,}} />
                                    <Text style={{color: '#FFF', fontSize: 13}}>코스지정</Text>
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
                                    {/*<View style={{width: 140, height: 170, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E3E3E3', borderRadius: 4, marginRight: 14, padding: 14}}>*/}
                                        {/*<View style={[contentStyles.stampIconWrap, {borderColor: '#f9931f', borderStyle: 'solid'}]}>*/}
                                            {/*<Image*/}
                                                {/*style={[contentStyles.stampIcon, {tintColor: '#f9931f'}]}*/}
                                                {/*source={require('./assets/stamps/stamp01.png')}*/}
                                            {/*/>*/}
                                        {/*</View>*/}
                                        {/*<View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center'}}>*/}
                                            {/*<Text style={{fontSize: 13, color: '#444'}}>2017년 09월 12일</Text>*/}
                                        {/*</View>*/}
                                    {/*</View>*/}
                                    {this.state.mapData.STAMP_DATA.map((v, i) => {
                                        const iconPath = './assets/stamps/stamp01.png';

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
                                            <Text style={{width: 70, fontSize: 13, color: '#444'}}>{v.NAME}</Text>
                                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                {v.NUMBER.map((b, j)=>{
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
                                                                width: 16,
                                                                height: 16,
                                                                alignItems: 'center',
                                                                textAlign: 'center',
                                                                fontSize: 11
                                                            }]}
                                                        >
                                                            {b}
                                                        </Text>
                                                    );
                                                })}

                                                <Text style={{marginLeft: 4, color: '#444'}}>{v.STATION}</Text>
                                            </View>
                                        </View>
                                    );
                                })}
                            </View>
                            <View style={contentStyles.section}>
                                <Text style={contentStyles.sectionTitle}>코스정보</Text>
                            </View>
                            <View style={contentStyles.sectionRoad}>
                                <TouchableHighlight onPress={()=>{}} underlayColor="#F0F0F0">
                                    <View style={contentStyles.roadItemWrap}>
                                        <View style={contentStyles.roadItemIconWrap}>
                                            <View style={{flex: 1}} />
                                            <View style={contentStyles.roadItemLine}>
                                                <View style={{flex: 1, backgroundColor: 'transparent'}} />
                                                <View style={{flex: 1, backgroundColor: '#888'}} />
                                            </View>
                                            <View style={contentStyles.roadItemIcon}>
                                                <Icon name="expand-more" size={12} color="#888" />
                                            </View>
                                            <View style={{width: 20}} />
                                        </View>
                                        <View style={contentStyles.roadItemInfoWrap}>
                                            <Text style={{fontSize: 15, fontWeight: '400', color: '#222'}}>태릉</Text>
                                        </View>
                                    </View>
                                </TouchableHighlight>
                                <TouchableHighlight onPress={()=>{}} underlayColor="#F0F0F0">
                                    <View style={contentStyles.roadItemWrap}>
                                        <View style={contentStyles.roadItemIconWrap}>
                                            <View style={{flex: 1}} />
                                            <View style={contentStyles.roadItemLine}>
                                                <View style={{flex: 1, backgroundColor: '#888'}} />
                                                <View style={{flex: 1, backgroundColor: '#888'}} />
                                            </View>
                                            <View style={[contentStyles.roadItemIcon, contentStyles.bigIcon, {borderColor: '#4D8000'}]}>
                                                <Icon name="directions-subway" size={20} color="#4D8000" />
                                            </View>
                                            <View style={{width: 20}} />
                                        </View>
                                        <View style={contentStyles.roadItemInfoWrap}>
                                            <Text style={{fontSize: 15, fontWeight: '400', color: '#222'}}>도봉산역</Text>
                                            <Text style={{fontSize: 12, color: '#999'}}>지하철 7호선 도봉산역 2번출구</Text>
                                        </View>
                                    </View>
                                </TouchableHighlight>
                                <TouchableHighlight onPress={()=>{}} underlayColor="#F0F0F0">
                                    <View style={contentStyles.roadItemWrap}>
                                        <View style={contentStyles.roadItemIconWrap}>
                                            <View style={{flex: 1}} />
                                            <View style={contentStyles.roadItemLine}>
                                                <View style={{flex: 1, backgroundColor: '#888'}} />
                                                <View style={{flex: 1, backgroundColor: '#888'}} />
                                            </View>
                                            <View style={contentStyles.roadItemIcon}>
                                                <Icon name="expand-more" size={12} color="#888" />
                                            </View>
                                            <View style={{width: 20}} />
                                        </View>
                                        <View style={contentStyles.roadItemInfoWrap}>
                                            <Text style={{fontSize: 15, fontWeight: '400', color: '#222'}}>넓쩍바위</Text>
                                        </View>
                                    </View>
                                </TouchableHighlight>
                                <TouchableHighlight onPress={()=>{}} underlayColor="#F0F0F0">
                                    <View style={contentStyles.roadItemWrap}>
                                        <View style={contentStyles.roadItemIconWrap}>
                                            <View style={{flex: 1}} />
                                            <View style={contentStyles.roadItemLine}>
                                                <View style={{flex: 1, backgroundColor: '#888'}} />
                                                <View style={{flex: 1, backgroundColor: '#888'}} />
                                            </View>
                                            <View style={[contentStyles.roadItemIcon, contentStyles.bigIcon, {borderColor: '#f7941f'}]}>
                                                <Icon name="nature" size={20} color="#f7941f" />
                                            </View>
                                            <View style={{width: 20}} />
                                        </View>
                                        <View style={contentStyles.roadItemInfoWrap}>
                                            <Text style={{fontSize: 15, fontWeight: '400', color: '#222'}}>창포원.관리사무소 앞</Text>
                                            <Text style={{fontSize: 12, color: '#999'}}>스탬프 획득지점</Text>
                                        </View>
                                    </View>
                                </TouchableHighlight>
                                <TouchableHighlight onPress={()=>{}} underlayColor="#F0F0F0">
                                    <View style={contentStyles.roadItemWrap}>
                                        <View style={contentStyles.roadItemIconWrap}>
                                            <View style={{flex: 1}} />
                                            <View style={contentStyles.roadItemLine}>
                                                <View style={{flex: 1, backgroundColor: '#888'}} />
                                                <View style={{flex: 1, backgroundColor: 'transparent'}} />
                                            </View>
                                            <View style={contentStyles.roadItemIcon}>
                                                <Icon name="expand-more" size={12} color="#888" />
                                            </View>
                                            <View style={{width: 20}} />
                                        </View>
                                        <View style={contentStyles.roadItemInfoWrap}>
                                            <Text style={{fontSize: 15, fontWeight: '400', color: '#222'}}>학도암</Text>
                                        </View>
                                    </View>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </ScrollView>
                    <Animated.View style={[headerStyles.container, {height: headerHeight}]}>
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
                                    <Button title="지도" icon="map" btnStyle={headerStyles.mapButton} borderRadius={24} />
                                </View>
                                <Button title="코스지정" icon="transfer-within-a-station" btnStyle={headerStyles.mapButton} borderRadius={24} />
                            </View>
                        </Animated.View>
                    </Animated.View>
                </View>
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
        backgroundColor: '#a8c99e',
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
        fontSize: 16,
        color: '#999',
        marginBottom: 2,
    },
    infoText: {
        fontSize: 14,
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