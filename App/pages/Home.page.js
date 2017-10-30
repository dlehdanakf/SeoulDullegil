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
import courseInfoData from './datasets/courseinfo.list';

import StampList from './StampList.page';
import MyRecord from './MyRecord.page';
import Summary from './Summary.page';

const navBarStyles = navBarStylesModule("white");

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
        });

        this.state = {
            rawList: courseListData,
            list: this.ds.cloneWithRows(courseListData),
            activeCourseNum: props.activeCourseNum,
            activeStampList: props.stampList,
            thisWeekRecord: props.thisWeekRecord,
            thisYearRecord: props.thisYearRecord,

            pageNum: 0,
        };

        this.renderCourseRowItem = this.renderCourseRowItem.bind(this);
        this.changeActiveCourse = this.changeActiveCourse.bind(this);
        this.changeTabBarPage = this.changeTabBarPage.bind(this);
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            activeCourseNum: nextProps.activeCourseNum,
            activeStampList: nextProps.stampList,
            thisWeekRecord: nextProps.thisWeekRecord,
            thisYearRecord: nextProps.thisYearRecord,
        });
    }

    renderCourseRowItem(rowData){
        const green = greenColors[parseInt(rowData.COURSE_NO) - 1];
        const level = ['', '초급', '중급', '고급'];
        const levelColor = ['', '#398b88', '#fe6d02', '#fb535c'];
        const isActiveCourse = this.state.activeCourseNum.toString() === rowData.COURSE_NO;

        return (
            <TouchableHighlight
                onPress={()=>Actions.course_info({
                    COURSE_INDEX: rowData.COURSE_NO,
                    mapData: courseInfoData[parseInt(rowData.COURSE_NO) - 1],
                    stampList: this.state.activeStampList,
                    funcInsertStamp: this.props.funcInsertStamp,
                    funcInsertRecord: this.props.funcInsertRecord,
                    funcChangeActiveCourse: this.changeActiveCourse,
                })}
                underlayColor="#FAFAFA"
            >
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
                            <Text style={{color: '#f49805', fontSize: 13, marginTop: 2}}>선택됨</Text>
                        </View>
                        : null
                    }
                </View>
            </TouchableHighlight>
        );
    }
    changeActiveCourse(num){
        this.props.funcSetActiveCourse(num).then(()=>{
            this.setState({
                list: this.ds.cloneWithRows(this.state.rawList)
            });
        });
    }
    changeTabBarPage(n){
        this.tabView.goToPage(n);
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
                            <NavButton style={{marginLeft: 1,}} onPress={()=>Actions.notice()}>
                                <NavButtonText style={[navBarStyles.navBarButtons, {marginRight: 13}]}>
                                    <IconOcticons name="megaphone" size={25} style={menuStyles.iconStyle}/>
                                </NavButtonText>
                            </NavButton>
                            <NavButton style={{marginLeft: 1,}} onPress={()=>Actions.event()}>
                                <NavButtonText style={[navBarStyles.navBarButtons, {marginRight: 13}]}>
                                    <IconMaterialIcons name="dvr" size={25} style={menuStyles.iconStyle}/>
                                </NavButtonText>
                            </NavButton>
                            <NavButton style={{marginLeft: 1,}} onPress={()=>Actions.guide()}>
                                <NavButtonText style={[navBarStyles.navBarButtons, {marginRight: 16}]}>
                                    <IconMaterialCommunityIcons name="information-outline" size={25} style={menuStyles.iconStyle}/>
                                </NavButtonText>
                            </NavButton>
                        </NavGroup>
                    </View>
                </NavBar>
                <ScrollableTabView
                    ref={ tabView => { this.tabView = tabView; }}
                    style={{backgroundColor:'white'}}
                    tabBarActiveTextColor='#F8931F'
                    tabBarUnderlineStyle={{backgroundColor:'#F8931F'}}
                    renderTabBar={()=> <DefaultTabBar />}
                    prerenderingSiblingsNumber={Infinity}
                    initialPage={0}
                >
                    <Summary
                        tabLabel="내 기록"
                        activeCourseNum={this.state.activeCourseNum}
                        stampList={this.state.activeStampList}
                        changeTabBar={this.changeTabBarPage}
                        thisWeekRecord={this.state.thisWeekRecord}
                        thisYearRecord={this.state.thisYearRecord}

                        funcInsertStamp={this.props.funcInsertStamp}
                        funcInsertRecord={this.props.funcInsertRecord}
                        funcChangeActiveCourse={this.changeActiveCourse}
                    />
                    <ListView
                        tabLabel="둘레길"
                        style={{flex: 1, borderLeftWidth: 1, borderLeftColor: '#EFEFEF'}}
                        dataSource={this.state.list}
                        enableEmptySections={true}
                        renderRow={this.renderCourseRowItem}
                        renderHeader={()=><View style={{height: 11, backgroundColor: '#efefef', borderBottomWidth: 1, borderBottomColor: '#E6E6E6'}} />}
                        renderFooter={()=><View style={{height: 11, backgroundColor: '#efefef', borderTopWidth: 1, borderTopColor: '#E6E6E6'}} />}
                        renderSeparator={()=><View style={{borderBottomWidth: 1, borderBottomColor: '#EFEFEF'}} />}

                    />
                    <StampList
                        tabLabel="스탬프 북"
                        activeStampList={this.state.activeStampList}
                        mapData={courseInfoData}
                    />
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
