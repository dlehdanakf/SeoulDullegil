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
import IconOcticons from 'react-native-vector-icons/Octicons';
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import NavBar, {NavButton, NavButtonText, NavTitle, NavGroup} from 'react-native-nav';
import {Actions} from 'react-native-router-flux';
import ScrollableTabView from 'react-native-scrollable-tab-view'

import navBarStylesModule from './assets/navbar.styles';
import DefaultTabBar from './components/tabbar.component';

const navBarStyles = navBarStylesModule("white");

export default class Home extends React.Component {
    constructor(props) {
        super(props);
    }

    renderNavBarBtn(icon, press, marginLeft, marginRight, key){
        return (
            <NavButton onPress={press} key={key} style={{marginLeft: marginLeft,}}>
                <NavButtonText style={[navBarStyles.navBarButtons, {marginRight: marginRight}]}>
                    <IconMaterialIcons name={icon} size={24} color="#FFF" />
                </NavButtonText>
            </NavButton>
        );
    }

    //#F8931F
    render() {
        return (
            <View style={styles.fill}>
                <NavBar style={navBarStyles}>
                    <View style={{flex:1, flexDirection: 'row'}}>
                        <View style={{alignItems:'center', flexDirection:'row'}}>
                            <Image source={require('./assets/bird_logo.png')} style={{height:26, width:33}} />
                        </View>
                    </View>

                    <View style={{flex:1, flexDirection: 'row', justifyContent:'flex-end'}}>
                        <NavGroup style={{marginRight: -20,}}>
                            <NavButton style={{marginLeft: 1,}}>
                                <NavButtonText style={[navBarStyles.navBarButtons, {marginRight: 13}]}>
                                    <IconOcticons name="megaphone" size={26} style={menuStyles.iconStyle}/>
                                </NavButtonText>
                            </NavButton>
                            <NavButton style={{marginLeft: 1,}}>
                                <NavButtonText style={[navBarStyles.navBarButtons, {marginRight: 13}]}>
                                    <IconMaterialCommunityIcons name="information-outline" size={26} style={menuStyles.iconStyle}/>
                                </NavButtonText>
                            </NavButton>
                            <NavButton style={{marginLeft: 1,}}>
                                <NavButtonText style={[navBarStyles.navBarButtons, {marginRight: 16}]}>
                                    <IconMaterialIcons name="more-vert" size={26} style={menuStyles.iconStyle}/>
                                </NavButtonText>
                            </NavButton>
                        </NavGroup>
                    </View>
                </NavBar>



                <ScrollableTabView
                    style={{backgroundColor:'white'}}
                    tabBarActiveTextColor='#F8931F'
                    tabBarUnderlineStyle={{backgroundColor:'#F8931F'}}
                    renderTabBar={()=> <DefaultTabBar />}
                    >
                    <View tabLabel="내 기록">
                        <View >
                            <Text>그래프</Text>
                        </View>
                    </View>
                    <Text tabLabel="둘레길" />
                    <Text tabLabel="스탬프 북" />
                </ScrollableTabView>

            </View>
        );
    }
}

const data = [[
	[0, 1],
	[1, 3],
	[3, 7],
	[4, 9],
]];

const styles = StyleSheet.create({
    fill: {
        flex: 1,
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
        /*color:'#558F4A',*/
        color:'#F8931F',
        paddingHorizontal: 5,
    },
})
