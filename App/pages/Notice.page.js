import React, {Component} from 'React';
import {
    View, StyleSheet, ActivityIndicator, Text, Linking,
    ListView, TouchableNativeFeedback, ToastAndroid
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavBar, {NavButton, NavButtonText, NavTitle, NavGroup} from 'react-native-nav';

import navBarStylesModule from './assets/navbar.styles';
const navBarStyles = navBarStylesModule("#a0b145");

export default class Notice extends React.Component {
    constructor(props){
        super(props);
        this.ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
        });

        this.state = {
            pageNum: 1,
            noticeList: [],
            noticeListDataSource: this.ds.cloneWithRows([]),
            showInitialLoading: true,
        };

        this.fetchNoticeListFromServer = this.fetchNoticeListFromServer.bind(this);
        this.renderNoticeItem = this.renderNoticeItem.bind(this);
        this.onPressNoticeItem = this.onPressNoticeItem.bind(this);
    }

    fetchNoticeListFromServer(page, clear){
        page = parseInt(page) > 0 ? parseInt(page) : 1;
        clear = !!clear;

        fetch('https://mplatform.seoul.go.kr/api/dule/noticeList.do?pagenum=' + page, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then((response) => response.json())
            .then((data) => {
                if(data.result !== 'success'){
                    ToastAndroid.show('서버로부터 데이터를 받아오는데 오류가 발생했습니다.', ToastAndroid.SHORT);
                    return;

                }

                let list = this.state.noticeList;
                if(clear) list = [];

                list = list.concat(data.list);
                this.setState({
                    noticeList: list,
                    noticeListDataSource: this.ds.cloneWithRows(list),
                    showInitialLoading: false,
                    pageNum: this.state.pageNum + 1,
                });
            });
    }
    renderNoticeItem(rowData){
        return (
            <TouchableNativeFeedback onPress={() => this.onPressNoticeItem(rowData.ORGN_LINK)} key={rowData.IDX}>
                <View style={styles.noticeItemWrap}>
                    <View style={styles.noticeItem}>
                        <Text style={styles.noticeTitle}>{rowData.TITLE}</Text>
                        <View style={styles.noticeItemWrap}>
                            <Text style={styles.noticeDate}>게시일 : {rowData.REG_DATE}</Text>
                            <Text style={[styles.noticeDate, {marginLeft: 6}]}>조회수 : {rowData.HIT_CNT}</Text>
                        </View>
                    </View>
                    <View style={styles.noticeItemAngle}>
                        <Icon name="keyboard-arrow-right" size={30} style={{color: '#AAA'}} />
                    </View>
                </View>
            </TouchableNativeFeedback>
        );
    }
    onPressNoticeItem(link){
        let d = this.state.pageNum;
        Linking.openURL(link);
    }


    componentDidMount(){
        this.fetchNoticeListFromServer(this.state.pageNum, false);
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
                    {this.state.showInitialLoading ?
                        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                            <ActivityIndicator
                                animating={this.state.showInitialLoading}
                                size="large"
                                color="#a0b145"
                            />
                        </View>
                        :
                        <ListView
                            style={{flex: 1}}
                            dataSource={this.state.noticeListDataSource}
                            enableEmptySections={true}
                            renderRow={this.renderNoticeItem}
                            renderSeparator={()=><View style={{borderBottomWidth: 1, borderBottomColor: '#e2e2e2'}} />}
                        />
                    }
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
    },
    noticeItemWrap: {
        flexDirection: 'row',
    },
    noticeItemAngle: {
        width: 50,
        backgroundColor: '#f9f9fa',
        borderLeftWidth: 1,
        borderLeftColor: '#e2e2e2',
        justifyContent:'center',
        alignItems:'center',
    },
    noticeItem: {
        flex: 1,
        padding: 10,
    },
    noticeTitle: {
        fontSize: 15,
        fontWeight: 'normal',
        color: '#333'
    },
    noticeDate: {
        fontSize: 12,
        color: '#B1B1B1',
    }
});