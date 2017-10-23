import React, {Component} from 'React';
import {
    Image, StyleSheet, Text, View, ListView,
    TouchableHighlight, ToastAndroid, TouchableNativeFeedback, Dimensions
} from 'react-native';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import IconOcticons from 'react-native-vector-icons/Octicons';
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import NavBar, {NavButton, NavButtonText, NavTitle, NavGroup} from 'react-native-nav';
import {Actions} from 'react-native-router-flux';
import ScrollableTabView from 'react-native-scrollable-tab-view'

import navBarStylesModule from './assets/navbar.styles';
import DefaultTabBar from './components/tabbar.component';

import greenColors from './datasets/green.colors';
import courseListData from './datasets/course.list';

import StampList from './StampList.page';
import MyRecord from './MyRecord.page';

const navBarStyles = navBarStylesModule("white");

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
        });

        this.state = {
            list: this.ds.cloneWithRows(courseListData),
            activeCourseNum: 2,
        };

        this.renderCourseRowItem = this.renderCourseRowItem.bind(this);
    }

    renderCourseRowItem(rowData){
        const green = greenColors[parseInt(rowData.COURSE_NO) - 1];
        const level = ['', '초급', '중급', '상급'];
        const levelColor = ['', '#398b88', '#fe6d02', '#fb535c'];
        const isActiveCourse = this.state.activeCourseNum.toString() === rowData.COURSE_NO;

        return (
            <TouchableHighlight onPress={()=>{}} underlayColor="#FAFAFA">
                <View key={rowData.COURSE_NO} style={{flex: 1, flexDirection: 'row', paddingVertical: 12, paddingHorizontal: 8}}>
                    <View style={{width: 60, justifyContent: 'center', alignItems: 'center'}}>
                        <View style={{width: 50, height: 50, borderWidth: 3, borderColor: green, backgroundColor: green, borderRadius: 60, alignItems: 'center', justifyContent: 'center',}}>
                            <Text style={{color: '#FFF', fontSize: 26, fontWeight: 'normal'}}>{rowData.COURSE_NO}</Text>
                        </View>
                    </View>
                    <View style={{flex: 1, paddingLeft: 8}}>
                        <Text style={{fontSize: 18}}>{rowData.COURSE_NM}</Text>
                        <Text style={{fontSize: 13, color: '#999'}}>{rowData.LOCATION}</Text>
                        <View style={{flex: 1, flexDirection: 'row', marginTop: 5, alignItems: 'center'}}>
                            <View style={{borderColor: levelColor[parseInt(rowData.COURSE_LEVEL)], borderWidth: 1, paddingBottom: 1, paddingHorizontal: 4, borderRadius: 2}}>
                                <Text style={{color: levelColor[parseInt(rowData.COURSE_LEVEL)], fontSize: 11}}>{level[parseInt(rowData.COURSE_LEVEL)]}</Text>
                            </View>
                            <Text style={{fontSize: 13, color: '#999', paddingLeft: 6}}>{rowData.DISTANCE} ({rowData.WALK_TIME})</Text>
                        </View>
                    </View>
                    {isActiveCourse ?
                        <View style={{width: 50, justifyContent: 'center', alignItems: 'center', paddingRight: 8}}>
                            <IconMaterialIcons name="directions-run" size={28} style={{color: '#f49805'}} />
                            <Text style={{color: '#f49805', fontSize: 13, marginTop: 2}}>주행중</Text>
                        </View>
                        : null
                    }
                </View>
            </TouchableHighlight>
        );
    }

    render() {
        return (
            <View style={styles.fill}>
                <NavBar style={navBarStyles}>
                    <View style={{flex:1, flexDirection: 'row'}}>
                        <View style={{alignItems:'center', flexDirection:'row'}}>
                            <Image source={require('./assets/bird_logo.png')} style={{height:24, width:30, marginTop: 2}} />
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
                    initialPage={2}
                >
                    <MyRecord tabLabel="내 기록" />
                    <ListView
                        tabLabel="둘레길"
                        style={{flex: 1}}
                        dataSource={this.state.list}
                        enableEmptySections={true}
                        renderRow={this.renderCourseRowItem}
                        renderSeparator={()=><View style={{borderBottomWidth: 1, borderBottomColor: '#EFEFEF'}} />}
                    />
                    <StampList tabLabel="스탬프 북" />
                </ScrollableTabView>

            </View>
        );
    }
}

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
