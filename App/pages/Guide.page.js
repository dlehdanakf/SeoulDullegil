import React, { Component } from 'React'
import {
    StyleSheet, Text, View, TouchableHighlight,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import DefaultTabBar from './components/tabbar2.component';
import NavBar, { NavButton, NavButtonText, NavTitle, NavGroup } from 'react-native-nav'
import { Actions } from 'react-native-router-flux';
import { WebView } from 'react-native-webview-messaging/WebView';

import gilIntro from './webview/gil.introduce.html';
import roadIntro from './webview/tour.introduce.html';
import safetyIntro from './webview/safety.introduce.html';

import navBarStylesModule from './assets/navbar.styles';
const navBarStyles = navBarStylesModule("#568f4a");

export default class Guide extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render(){
        return (
            <View style={styles.fill}>
                <NavBar style={navBarStyles}>
                    <View style={{flexDirection: 'row', marginLeft: -16}}>
                        <NavButton style={{marginHorizontal: 14}} onPress={()=>Actions.pop()}>
                            <Icon name="arrow-back" size={24} style={navBarStyles.backIcon}/>
                        </NavButton>
                        <NavTitle style={navBarStyles.title}>
                            이용 가이드
                        </NavTitle>
                    </View>
                </NavBar>
                <ScrollableTabView
                    tabBarActiveTextColor='#568f4a'
                    renderTabBar={()=> <DefaultTabBar />}
                >
                    <View tabLabel="소개" style={styles.fill}>
                        <WebView source={gilIntro} />
                    </View>
                    <View tabLabel="둘레길" style={styles.fill}>
                        <WebView source={roadIntro} />
                    </View>
                    <View tabLabel="안전수칙" style={styles.fill}>
                        <WebView source={safetyIntro} />
                    </View>
                </ScrollableTabView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    fill: {
        flex: 1,
        backgroundColor: '#FFF',
    }
});
