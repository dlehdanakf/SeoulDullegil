import React from 'React';
import {
    View, StyleSheet, ActivityIndicator, Text, Linking,
    ListView, TouchableNativeFeedback, ToastAndroid, WebView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import fetch from 'react-native-cancelable-fetch';
import NavBar, {NavButton, NavTitle} from 'react-native-nav';
import {Actions} from 'react-native-router-flux';

import navBarStylesModule from './assets/navbar.styles';
const navBarStyles = navBarStylesModule("#568f4a");

export default class Event extends React.Component {
    constructor(props){
        super(props);
        this.ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
        });

        this.state = {
            isFetching: false,
            pageNum: 1,
            hasMore: true,
            noticeList: [],
            noticeListDataSource: this.ds.cloneWithRows([]),
            showInitialLoading: true,
        };

        this.fetchNoticeListFromServer = this.fetchNoticeListFromServer.bind(this);
        this.renderNoticeItem = this.renderNoticeItem.bind(this);
        this.onPressNoticeItem = this.onPressNoticeItem.bind(this);
    }
    componentWillMount(){
        this.fetchNoticeListFromServer(this.state.pageNum);
    }
    componentWillUnmount(){
        fetch.abort(1);
    }

    fetchNoticeListFromServer(page){
        page = parseInt(page) > 0 ? parseInt(page) : 1;
        this.setState({isFetching: true});
        fetch('https://mplatform.seoul.go.kr/api/dule/eventList.do?pagenum=' + page, {
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

                const list = this.state.noticeList.concat(data.list);
                this.setState({
                    isFetching: false,
                    noticeList: list,
                    noticeListDataSource: this.ds.cloneWithRows(list),
                    showInitialLoading: false,
                    pageNum: parseInt(this.state.pageNum) + 1,
                    hasMore: data.list.length > 0
                });
            });
    }
    renderNoticeItem(rowData){
        const myRegex = /<img[^>]*src=[\"']?([^>\"']+)[\"']?[^>]*>/i;
        const imgSrc = myRegex.exec(rowData.IMG)[1];
        const html =
            "<html style='margin: 0; padding: 0;'>" +
                "<body style='margin: 0; padding: 0;'>" +
                    "<div style='width: 100%; height: 100%; background: #AAA no-repeat center; background-size: cover; background-image: url(" + imgSrc + ");'></div>" +
                "</body>" +
            "</html>";

        return (
            <TouchableNativeFeedback onPress={() => this.onPressNoticeItem(rowData.LINK)} key={rowData.IDX}>
                <View style={styles.noticeItemWrap}>
                    <View style={{width: 100, height: 60, margin: 10}}>
                        <WebView
                            source={{html: html}}
                            style={{width: 100, height: 60}}
                        />
                    </View>
                    <View style={styles.noticeItem}>
                        <Text style={styles.noticeTitle}>{rowData.TITLE}</Text>
                        <View style={styles.noticeItemWrap}>
                            <Text style={styles.noticeDate}>기간 : {rowData.REG_DATE}</Text>
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

    render(){
        return (
            <View style={styles.fill}>
                <NavBar style={navBarStyles}>
                    <View style={{flexDirection: 'row', marginLeft: -16}}>
                        <NavButton style={{marginHorizontal: 14}} onPress={()=>Actions.pop()}>
                            <Icon name="arrow-back" size={24} style={navBarStyles.backIcon}/>
                        </NavButton>
                        <NavTitle style={navBarStyles.title}>행사안내</NavTitle>
                    </View>
                </NavBar>
                <View style={{flex: 1, backgroundColor: '#efefef'}}>
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
                            initialListSize={20}
                            pageSize={10}
                            dataSource={this.state.noticeListDataSource}
                            enableEmptySections={true}
                            renderRow={this.renderNoticeItem}
                            renderSeparator={()=><View style={{borderBottomWidth: 1, borderBottomColor: '#e2e2e2'}} />}
                            // onEndReached={()=>this.fetchNoticeListFromServer(this.state.pageNum)}
                            renderFooter={()=>{
                                if(!this.state.hasMore) return null;

                                return (
                                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', height: 54}}>
                                        {this.state.isFetching ?
                                            <ActivityIndicator
                                                animating={true}
                                                size="large"
                                                color="#a0b145"
                                            />
                                            :
                                            <TouchableNativeFeedback onPress={()=>this.fetchNoticeListFromServer(this.state.pageNum)}>
                                                <Text style={{fontSize: 14, color: '#999'}}>더보기</Text>
                                            </TouchableNativeFeedback>
                                        }
                                    </View>
                                );
                            }}
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
        backgroundColor: '#FFF'
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
        padding: 12,
        paddingLeft: 2,
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
