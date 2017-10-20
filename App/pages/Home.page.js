import React, {Component} from 'React'
import {
    Image,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    ToastAndroid,
    TouchableNativeFeedback,
    Dimensions
} from 'react-native';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import IconMaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import IconEntypo from 'react-native-vector-icons/Entypo';
import IconIonicons from 'react-native-vector-icons/Ionicons';
import NavBar, {NavButton, NavButtonText, NavTitle, NavGroup} from 'react-native-nav';
import {Actions} from 'react-native-router-flux';
import ProgressCircle from 'react-native-progress-circle';

import navBarStylesModule from './assets/navbar.styles';

const navBarStyles = navBarStylesModule("#558F4A");

export default class Home extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.fill}>
                <NavBar style={navBarStyles}>
                    <View style={{flex:1, flexDirection: 'row', marginLeft: -16}}>
                        <NavButton style={{marginHorizontal: 14}}>
                            <IconMaterialIcons name="polymer" size={24} style={{color:'white'}}/>
                        </NavButton>
                    </View>
                    <NavTitle style={styles.title}>
                        둘레둘레
                    </NavTitle>
                    <View style={{flex:1, flexDirection: 'row', marginRight: -16}} />
                </NavBar>
                <View style={{height:30, backgroundColor:'#C7D8DE'}}>

                </View>


                <View style={{flex:1, padding:15,}}>
                    <View style={{flex:4, borderRadius:15}}>
                        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                            <ProgressCircle percent={40} radius={130} borderWidth={25} color="#57C968" bgColor='white' shadowColor="#F2F4EF">
                                <View style={{flex:1, flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                                    <Text style={{fontSize:100, color:'#57C968'}}>40
                                        <Text style={{fontSize:40, color:'#57C968'}}>%</Text>
                                    </Text>
                                    <Text style={{fontSize:20, color:'#BFC1BD'}}>둘레길 달성률</Text>
                                </View>
                            </ProgressCircle>
                            <View style={{marginTop:50, justifyContent:'center', alignItems:'center'}}>
                                <TouchableNativeFeedback onPress={Actions.course_list}>
                                    <View style={{backgroundColor: '#57C968', justifyContent: 'center',
                                        alignItems: 'center', borderRadius: 20, width: Dimensions.get('window').width * 2/3, height:60}}>
                                        <Text style={{
                                            fontSize: 25,
                                            fontWeight: 'bold',
                                            color: '#FFF',
                                        }}>트레킹 하기</Text>
                                    </View>
                                </TouchableNativeFeedback>
                            </View>
                        </View>
                    </View>
                    {/*
                    <View style={{flex:1, borderRadius:15, backgroundColor: '#6F9CB8', marginTop: 15, paddingLeft: 30, paddingRight:30, justifyContent:'center'}}>
                        <View style={{borderLeftWidth:6, borderColor: "#57C5A6", paddingLeft: 10, flexDirection:'row'}}>
                            <View style={{flex:4, justifyContent:'center'}}><Text style={{fontSize:20, color:'white'}}>둘레길 초보 탐험가</Text></View>
                            <View style={{flex:1, justifyContent:'center', alignItems:'flex-end'}}>
                                <IconMaterialCommunity name="baby-buggy" size={40} style={{color:'white'}} />
                            </View>
                        </View>
                    </View>
                    */}
                </View>
                <View style={{height:100, flexDirection:'row', paddingVertical: 15, borderTopWidth:1, borderColor:'white', backgroundColor:'#f2f2f2'}}>
                    <View style={{flex:1, borderColor:'white', borderRightWidth:1, paddingHorizontal: 15}}>
                        <View style={{height:15}}>
                            <Text style={{fontSize:15, color:'gray'}}>이번주 목표</Text>
                        </View>
                        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                            <IconMaterialCommunity name='bike' size={23}>
                                <Text style={{fontSize: 23}}> 4.3km 걷기</Text>
                            </IconMaterialCommunity>
                        </View>
                    </View>
                    <View style={{flex:1,paddingHorizontal: 15}}>
                        <View style={{height:15}}>
                            <Text style={{fontSize:15, color:'gray'}}>이번주 목표</Text>
                        </View>
                        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                            <IconIonicons name='ios-egg-outline' size={23}>
                                <Text style={{fontSize: 23}}> 초보 탐험가</Text>
                            </IconIonicons>
                        </View>
                    </View>
                </View>

                <View style={{backgroundColor:'#34572D'}}>
                    <View style={{paddingTop: 10, paddingBottom: 10, flexDirection:'row', height: 70}}>
                        <View style={{flex:1}}>
                            <View style={menuStyles.contentView}>
                                <IconMaterialCommunity name="account" size={35} style={menuStyles.iconStyle}/>
                            </View>
                            <View style={{height: 15, justifyContent:'center', alignItems:'center'}}>
                                <Text style={{color:'white', fontSize: 13}}>내 정보</Text>
                            </View>
                        </View>
                        <View style={{flex:1}}>
                            <View style={menuStyles.contentView}>
                                <IconMaterialCommunity name="book-open-page-variant" size={35} style={menuStyles.iconStyle}/>
                            </View>
                            <View style={{height: 15, justifyContent:'center', alignItems:'center'}}>
                                <Text style={{color:'white', fontSize: 13}}>둘레 도감</Text>
                            </View>
                        </View>
                        <View style={{flex:1}}>
                            <View style={menuStyles.contentView}>
                                <IconMaterialCommunity name="information-outline" size={35} style={menuStyles.iconStyle}/>
                            </View>
                            <View style={{height: 15, justifyContent:'center', alignItems:'center'}}>
                                <Text style={{color:'white', fontSize: 13}}>둘레길 소개</Text>
                            </View>
                        </View>
                        <View style={{flex:1}}>
                            <View style={menuStyles.contentView}>
                                <IconMaterialIcons name="settings" size={35} style={menuStyles.iconStyle}/>
                            </View>
                            <View style={{height: 15, justifyContent:'center', alignItems:'center'}}>
                                <Text style={{color:'white', fontSize: 13}}>설정</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    fill: {
        flex: 1,
        backgroundColor:'white'
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
    },
    title: {
        flex:1,
        fontSize: 22,
        letterSpacing: 1,
        fontWeight: "bold",
        textAlign: "center",
        color: '#FFF',
    },

});

const menuStyles = StyleSheet.create({
    titleMsgView:{
        height:20,
        justifyContent:'center',
        alignItems:'center'
    },
    titleMsg:{
        fontSize: 15,
        fontWeight: 'bold',
        color: 'white',
    },
    contentView:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    iconStyle:{
        color:'white'
    },
})
