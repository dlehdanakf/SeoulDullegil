import React, {Component} from 'React';
import {
    Image, StyleSheet, Text, View, ListView,
    TouchableHighlight, ToastAndroid, TouchableNativeFeedback, Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavBar, {NavButton, NavButtonText, NavTitle, NavGroup} from 'react-native-nav';

import navBarStylesModule from './assets/navbar.styles';
const navBarStyles = navBarStylesModule("#a0b145");

export default class Notice extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            noticeList: [],
        };

        this.fetchNoticeListFromServer = this.fetchNoticeListFromServer.bind(this);
    }

    fetchNoticeListFromServer(){

    }

    render(){
        return (
            <View style={styles.fill}>
                <NavBar style={navBarStyles}>
                    <View style={{flexDirection: 'row', marginLeft: -16}}>
                        <NavButton style={{marginHorizontal: 14}} onPress={()=>{}}>
                            <Icon name="arrow-back" size={24} style={navBarStyles.backIcon} />
                        </NavButton>
                        <NavTitle style={navBarStyles.title}>공지사항</NavTitle>
                    </View>
                </NavBar>
                <View style={{flex: 1}}>

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
    title: {
        flex:1,
        fontSize: 22,
        letterSpacing: 1,
        fontWeight: "bold",
        textAlign: "center",
        color: 'black',
    },
    container:{
        justifyContent:'center',
        alignItems:'center',
    }

});