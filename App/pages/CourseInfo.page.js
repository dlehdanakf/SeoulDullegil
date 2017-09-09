import React, { Component } from 'React'
import {
    Animated, Image, ScrollView,
    StyleSheet, Text, View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavBar, { NavButton, NavButtonText, NavTitle, NavGroup } from 'react-native-nav'
import { Actions } from 'react-native-router-flux';

import Button from './components/button.component';
import navBarStylesModule from './assets/navbar.styles';

const HEADER_MAX_HEIGHT = 160;
const HEADER_MIN_HEIGHT = 0;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const navBarStyles = navBarStylesModule("#a8c99e");

export default class CourseInfo extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            scrollY: new Animated.Value(0),
        };
    }
    _renderScrollViewContent() {
        const data = Array.from({length: 30});
        return (
            <View style={styles.scrollViewContent}>
                {data.map((_, i) =>
                    <View key={i} style={styles.row}>
                        <Text>{i}</Text>
                    </View>
                )}
            </View>
        );
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

        return (
            <View style={styles.fill}>
                <NavBar style={navBarStyles}>
                    <View style={{flexDirection: 'row', marginLeft: -16}}>
                        <NavButton style={{marginHorizontal: 14}}>
                            <Icon name="arrow-back" size={24} style={navBarStyles.backIcon} />
                        </NavButton>
                        <Animated.Text accessibilityTraits="header" style={[navBarStyles.title, {opacity: actionBarOpacity}]}>
                            수락·불암산코스
                        </Animated.Text>
                    </View>
                    <Animated.View style={{opacity: actionBarOpacity}}>
                        <NavGroup>
                            <NavButton onPress={() => {}}>
                                <View style={styles.actionBarButtons}>
                                    <Icon name="map" size={24} color="#FFF" style={{marginRight: 4,}} />
                                    <Text style={{color: '#FFF', fontSize: 13}}>지도</Text>
                                </View>
                            </NavButton>
                            <NavButton onPress={() => {}}>
                                <View style={styles.actionBarButtons}>
                                    <Icon name="transfer-within-a-station" size={24} color="#FFF" style={{marginRight: 4,}} />
                                    <Text style={{color: '#FFF', fontSize: 13}}>경로지정</Text>
                                </View>
                            </NavButton>
                        </NavGroup>
                    </Animated.View>
                </NavBar>
                <View style={styles.fill}>
                    <ScrollView
                        style={styles.fill}
                        scrollEventThrottle={16}
                        onScroll={Animated.event(
                            [{nativeEvent: {contentOffset: {y: this.state.scrollY}}}]
                        )}
                    >
                        {this._renderScrollViewContent()}
                    </ScrollView>
                    <Animated.View style={[headerStyles.container, {height: headerHeight}]}>
                        <Animated.View style={[headerStyles.content, {opacity: headerOpacity}]}>
                            <Text style={headerStyles.difficulty}>초급자용 코스</Text>
                            <Text style={headerStyles.title}>수락·불암산코스</Text>
                            <View style={headerStyles.distance}>
                                <Icon name="near-me" size={16} style={{marginRight: 2}} color='rgba(255, 255, 255, .4)' />
                                <Text style={headerStyles.distanceText}>노원구,도봉구(14.3km)</Text>
                                <Icon name="timer" size={16} style={{marginRight: 2, marginLeft: 6,}} color='rgba(255, 255, 255, .4)' />
                                <Text style={headerStyles.distanceText}>6시간 30분</Text>
                            </View>
                            <View style={headerStyles.buttons}>
                                <View style={{marginRight: 12}}>
                                    <Button title="지도" icon="map" btnStyle={headerStyles.mapButton} borderRadius={24} />
                                </View>
                                <Button title="경로지정" icon="transfer-within-a-station" btnStyle={headerStyles.mapButton} borderRadius={24} />
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
    row: {
        height: 40,
        margin: 16,
        backgroundColor: '#D3D3D3',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollViewContent: {
        paddingTop: HEADER_MAX_HEIGHT,
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