import React, {PropTypes} from 'React'
import {
    Image, StyleSheet, Text, View, ScrollView, Linking,
    TouchableNativeFeedback, ActivityIndicator, Dimensions
} from 'react-native';
import { WebView } from 'react-native-webview-messaging/WebView';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import { Actions } from 'react-native-router-flux';

import StampIconFunc from './components/stamp.function';
import StampCheckFunc from './components/stamp.check.function';

import greenColors from './datasets/green.colors';
import courseListData from './datasets/course.list';
import courseInfoData from './datasets/courseinfo.list';
import BillboardHtml from './webview/billboard.html';

const windowWidth = Dimensions.get('window').width;

export default class Summary extends React.Component {
    static propTypes = {
    };
    static defaultProps = {
    };
    constructor(props){
        super(props);
        this.state = {
            activeCourseNum: props.activeCourseNum -1,
            isFetchingWeather: true,
            weatherModifyCode: null,
            weatherStatusCode: null,
            weatherStatusDescription: null
        };

        this.fetchWeather = this.fetchWeather.bind(this);
        this.getWeatherIcon = this.getWeatherIcon.bind(this);
        this.getWeatherDescription = this.getWeatherDescription.bind(this);
        this.drawGraph = this.drawGraph.bind(this);
    }
    drawGraph(){
        this.webview.emit('setGraphData', this.props.thisYearRecord);
    }
    componentWillMount(){
        if(this.state.activeCourseNum > -1){
            const center = courseInfoData[this.state.activeCourseNum].COORD_CENTER;
            this.fetchWeather(center[1], center[0]);
        }
    }
    componentWillReceiveProps(nextProps){
        if(this.state.activeCourseNum > -1){
            const center = courseInfoData[this.state.activeCourseNum].COORD_CENTER;
            this.fetchWeather(center[1], center[0]);
        }
        this.drawGraph();
        this.setState({
            activeCourseNum: nextProps.activeCourseNum - 1,
        });
    }

    fetchWeather(latitude, longitude){
        fetch('https://apis.sktelecom.com/v1/weather/status?latitude=' + latitude + '&longitude=' + longitude, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'TDCProjectKey': '1e209d9a-c86b-4887-9e30-89de4afa4b15'
            }
        })
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    isFetchingWeather: false,
                    weatherModifyCode: data.weatherModifyCode,
                    weatherStatusCode: data.weatherStatusCode,
                    weatherStatusDescription: data.weatherStatusDescription
                });
            });
    }
    getWeatherIcon(){
        switch(this.state.weatherStatusCode){
            case 0: return 'earth-off';
            case 1: return 'weather-sunny';
            case 2: return 'weather-cloudy';
            case 3: return 'weather-fog';
            case 4: return 'weather-partlycloudy';
            case 5: return 'weather-pouring';
            case 6: return 'weather-snowy';
            case 7: return 'weather-snowy-rainy';
            case 8: return 'weather-lightning';
            case 9: return 'weather-hail';
            case 10: return 'weather-snowy-rainy';
        }
    }
    getWeatherDescription(){
        switch(this.state.weatherModifyCode){
            case 0: return '서버로부터 날씨정보를 받아오는데 오류가 발생했습니다.';                 // 오류
            case 1: return '강추위 (한파)가 예상됩니다. 노약자 및 어린이는 야외활동을 삼가주세요.';   // 한파
            case 2: return '운동 전 스트래칭을 통해 추위에 움츠렸던 몸을 펴주세요.';
            case 3: return '기온이 쌀쌀하오니 둘레길 트래킹시 옷 따뜻하게 챙기시기 바랍니다.';        // 쌀쌀
            case 4:
            case 5:
            case 6: return '기온이 포근하거나 따뜻하여 트래킹하기 좋은 기온입니다.';                // 포근, 따뜻, 선선
            case 7: return '더운 여름에 트래킹 시 똑 물을 챙겨 자주 음용하시기 바랍니다.';           // 더위
            case 8: return '무더위 (폭염)이 예상됩니다. 노약자 및 어린이는 야외활동을 삼가주세요.';    // 폭염
        }
    }

    render(){
        const distance = this.props.thisWeekRecord ? (this.props.thisWeekRecord.distance / 1000).toFixed(1) : 0;
        const kcal = this.props.thisWeekRecord ?  (0.0476 * this.props.thisWeekRecord.distance).toFixed(0) : 0;
        const walkingTime = this.props.thisWeekRecord ? this.props.thisWeekRecord.time : 0;
        let buttonMsg = this.state.activeCourseNum > -1 ? "트래킹 하러가기" : "둘레길 선택하기";
        let buttonColor = this.state.activeCourseNum > -1 ? "#57C968" : "#F8931F";

        return (
            <View style={{flex:1, paddingBottom: 60, backgroundColor: '#efefef',}}>
                <ScrollView style={styles.componentWrap}>
                    {this.state.activeCourseNum > -1 ?
                        <View style={[styles.currentCourseWrap, {backgroundColor: greenColors[this.state.activeCourseNum]}]}>
                            <View style={{padding: 10}}>
                                <Text style={{color: 'rgba(255,255,255,.8)'}}>현재 트래킹중인 코스</Text>
                            </View>
                            <View style={{alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10}}>
                                <Text style={{color: '#FFF', fontSize: 24, fontWeight: 'bold', marginTop: 4}}>{courseListData[this.state.activeCourseNum].COURSE_NM}</Text>
                                <View style={{flexDirection: 'row', marginTop: 2}}>
                                    <Text style={{fontSize: 13, color: 'rgba(255,255,255,.6)'}}>코스길이 : {courseListData[this.state.activeCourseNum].DISTANCE}</Text>
                                    <Text style={{fontSize: 13, color: 'rgba(255,255,255,.6)', marginLeft: 10}}>소요시간 : {courseListData[this.state.activeCourseNum].WALK_TIME}</Text>
                                </View>
                            </View>
                            <View style={{alignItems: 'center'}}>
                                <ScrollView
                                    contentContainerStyle={styles.stampList}
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                >
                                    {courseInfoData[this.state.activeCourseNum].STAMP_DATA.map((v, i)=>{
                                        const isActive = StampCheckFunc(v.COT_STAMP_ICON, this.props.stampList);
                                        const stampColor = isActive ? '#FFF' : 'rgba(255,255,255,.4)';
                                        const stampStyle = isActive ? { borderColor: stampColor, borderStyle: 'solid' } : { borderColor: 'rgba(255,255,255,.4)' };

                                        return (
                                            <View style={[styles.stampIconWrap, stampStyle]} key={v.COT_STAMP_ICON}>
                                                <Image source={StampIconFunc(v.COT_STAMP_ICON)} style={[styles.stampIcon, {tintColor: stampColor}]}/>
                                            </View>
                                        );
                                    })}
                                </ScrollView>
                            </View>
                        </View>
                        :
                        <View style={styles.sectionCard}>
                            <View style={{padding: 10}}>
                                <Text style={{color: 'rgba(0,0,0,.2)'}}>현재 트래킹중인 코스</Text>
                            </View>
                            <View style={{alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20}}>
                                <Text style={{color: '#333', fontSize: 24, fontWeight: 'bold', marginTop: 4}}>환영합니다!</Text>
                                <View style={{flexDirection: 'row', marginTop: 2}}>
                                    <Text style={{fontSize: 13, color: 'rgba(0,0,0,.4)'}}>둘레길 코스를 선택해주세요</Text>
                                </View>
                            </View>
                            <View style={{alignItems: 'center', paddingBottom: 40}}>
                                <View style={{width: 90}}>
                                    <TouchableNativeFeedback
                                        onPress={()=>Actions.guide()}
                                        background={TouchableNativeFeedback.SelectableBackground()}
                                    >
                                        <View
                                            style={{
                                                backgroundColor: '#568f4a',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                paddingVertical: 8,
                                                borderRadius: 3
                                            }}
                                        >
                                            <Text style={{color: '#FFF'}}>둘레길 소개</Text>
                                        </View>
                                    </TouchableNativeFeedback>
                                </View>
                            </View>
                        </View>
                    }
                    <View style={[styles.sectionCard, {marginTop: 8}]}>
                        <View style={{padding: 10}}>
                            <Text style={{color: '#333'}}>이번 주 활동량</Text>
                        </View>
                        <View style={{flexDirection: 'row', paddingBottom: 20}}>
                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                <Icon name="transfer-within-a-station" size={38} style={{marginVertical: 10, color: '#568f4a'}} />
                                <Text style={{color: '#9d9d9d', fontSize: 13}}>이동거리</Text>
                                <Text style={{color: '#333', fontSize: 20, fontWeight: 'bold'}}>{distance}km</Text>
                            </View>
                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                <Icon name="whatshot" size={38} style={{marginVertical: 10, color: '#fd556e'}} />
                                <Text style={{color: '#9d9d9d', fontSize: 13}}>소모 칼로리</Text>
                                <Text style={{color: '#333', fontSize: 20, fontWeight: 'bold'}}>{kcal}kcal</Text>
                            </View>
                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                <Icon name="timer" size={38} style={{marginVertical: 10, color: '#03a5ef'}} />
                                <Text style={{color: '#9d9d9d', fontSize: 13}}>러닝시간</Text>
                                <Text style={{color: '#333', fontSize: 20, fontWeight: 'bold'}}>{parseInt(walkingTime / 3600)}시간 {parseInt((walkingTime % 3600) / 60)}분</Text>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.sectionCard, {marginTop: 8}]}>
                        <View style={{padding: 10}}>
                            <Text style={{color: '#333'}}>{(new Date()).getFullYear()}년 월별 둘레길 이용현황</Text>
                        </View>
                        <View style={{height: 140}}>
                            <WebView
                                ref={ webview => { this.webview = webview; }}
                                source={{uri: 'http://kung.kr/seoulapp/billboard.html'}}
                                onLoadEnd={this.drawGraph}
                            />
                        </View>
                    </View>
                    <View style={[styles.sectionCard, {marginTop: 8}]}>
                        {this.state.activeCourseNum.toString() !== '-1' ?
                            <View>
                                <View style={{padding: 10}}>
                                    <Text style={{color: '#333'}}>{courseInfoData[this.state.activeCourseNum].COT_GU_NAME.split(',')[0].trim()} 날씨</Text>
                                </View>
                                {this.state.isFetchingWeather ?
                                    <View>
                                        <View style={{justifyContent: 'center', alignItems: 'center', padding: 40}}>
                                            <ActivityIndicator
                                                animating={true}
                                                size="large"
                                                color="#a0b145"
                                            />
                                        </View>
                                    </View>
                                    :
                                    <View style={{flexDirection: 'row', paddingTop: 10, paddingBottom: 20, paddingHorizontal: 30}}>
                                        <View style={{width: 80, justifyContent: 'center', alignItems: 'flex-start'}}>
                                            <IconCommunity name={this.getWeatherIcon()} size={52} style={{color: '#333'}}/>
                                        </View>
                                        <View style={{flex: 1}}>
                                            <Text style={{fontSize: 22, color: '#333', fontWeight: 'bold'}}>{this.state.weatherStatusDescription}</Text>
                                            <Text style={{fontSize: 13, color: '#AAA', marginTop: 4}}>{this.getWeatherDescription()}</Text>
                                        </View>
                                    </View>
                                }
                            </View>
                        :
                            <View>
                                <View style={{padding: 10}}>
                                    <Text style={{color: 'rgba(0,0,0,.2)'}}>둘레길 날씨</Text>
                                </View>
                                <View style={{alignItems: 'center', padding: 20, paddingTop: 10}}>
                                    <Text>코스를 선택하시면 해당 지역 날씨가 표시됩니다.</Text>
                                </View>
                            </View>
                        }
                    </View>
                    <View style={{flexDirection: 'row', padding: 6, height: 130}}>
                        <View style={{flex: 1, padding: 2}}>
                            <TouchableNativeFeedback onPress={()=>Linking.openURL('tel:119')}>
                                <View style={{backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E9E9E9', borderRadius: 3, alignItems: 'center', paddingVertical: 20}}>
                                    <Icon name="local-hospital" size={38} style={{marginBottom: 6, color: '#ed1c23'}} />
                                    <Text style={{color: '#9d9d9d', fontSize: 13}}>119 구조대</Text>
                                </View>
                            </TouchableNativeFeedback>
                        </View>
                        <View style={{flex: 1, padding: 2}}>
                            <TouchableNativeFeedback onPress={()=>Linking.openURL('tel:112')}>
                                <View style={{backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E9E9E9', borderRadius: 3, alignItems: 'center', paddingVertical: 20}}>
                                    <Icon name="local-taxi" size={38} style={{marginBottom: 6, color: '#202e8c'}} />
                                    <Text style={{color: '#9d9d9d', fontSize: 13}}>112 경찰</Text>
                                </View>
                            </TouchableNativeFeedback>
                        </View>
                        <View style={{flex: 1, padding: 2}}>
                            <TouchableNativeFeedback onPress={()=>Linking.openURL('tel:070-4465-7905')}>
                                <View style={{backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E9E9E9', borderRadius: 3, alignItems: 'center', paddingVertical: 20}}>
                                    <Icon name="account-box" size={38} style={{marginBottom: 6, color: '#568f4a'}} />
                                    <Text style={{color: '#9d9d9d', fontSize: 13}}>안내소</Text>
                                </View>
                            </TouchableNativeFeedback>
                        </View>
                    </View>
                </ScrollView>
                <View style={{ height: 60,  position:'absolute', bottom:0, zIndex:1, width: windowWidth}}>
                    <TouchableNativeFeedback onPress={() => {
                            if(this.state.activeCourseNum > 0){
                                Actions.tracking({
                                    COURSE_INDEX: this.state.activeCourseNum,
                                    funcInsertStamp: this.props.funcInsertStamp,
                                    funcInsertRecord: this.props.funcInsertRecord,
                                    activeStampList: this.state.activeStampList,
                                    funcChangeActiveCourse: this.props.funcChangeActiveCourse,
                                    funcUpdateStampState: ()=>{},
                                })
                            }
                            else
                                this.props.changeTabBar(1);
                        }}>
                        <View style={{
                            flex: 1,
                            backgroundColor: buttonColor,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Text style={{
                                fontSize: 18,
                                fontWeight: 'bold',
                                color: '#FFF'
                            }}>{buttonMsg}</Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    componentWrap: {
        flex: 1,
        backgroundColor: '#efefef',
        paddingVertical: 10,
    },
    currentCourseWrap: {
        backgroundColor: '#DDD',
    },
    stampList: {
        flexDirection: 'row',
        padding: 20,
        paddingBottom: 30,
        justifyContent: 'center'
    },
    stampIconWrap: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 66,
        width: 66,
        borderColor: 'rgba(255,255,255,.4)',
        borderRadius: 66,
        borderWidth: 1,
        borderStyle: 'dashed',
        marginHorizontal: 5,
    },
    stampIcon:{
        width: 60,
        height: 60,
    },
    sectionCard: {
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#E9E9E9',
        borderBottomWidth: 1,
        borderBottomColor: '#E9E9E9'
    }
});
