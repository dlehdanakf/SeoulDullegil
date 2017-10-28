import React, {PropTypes} from 'React'
import {
    Image, StyleSheet, Text, View, ScrollView, Linking,
    TouchableNativeFeedback, ActivityIndicator
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/MaterialIcons';

import StampIconFunc from './components/stamp.function';
import StampCheckFunc from './components/stamp.check.function';

import greenColors from './datasets/green.colors';
import courseListData from './datasets/course.list';
import courseInfoData from './datasets/courseinfo.list';

export default class Summary extends React.Component {
    static propTypes = {
    };
    static defaultProps = {
    };
    constructor(props){
        super(props);
        this.state = {
            activeCourseNum: props.activeCourseNum - 1,
        };
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            activeCourseNum: nextProps.activeCourseNum - 1
        });
    }

    render(){
        return (
            <ScrollView style={styles.componentWrap}>
                {this.state.activeCourseNum > -1 ?
                    <View style={[styles.currentCourseWrap, {backgroundColor: greenColors[this.state.activeCourseNum]}]}>
                        <View style={{padding: 10}}>
                            <Text style={{color: 'rgba(255,255,255,.8)'}}>현재 주행중인 코스</Text>
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
                            <Text style={{color: 'rgba(0,0,0,.2)'}}>현재 주행중인 코스</Text>
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
                                    onPress={()=>this.props.changeTabBar(1)}
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
                                        <Text style={{color: '#FFF'}}>코스선택</Text>
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
                            <Icon name="transfer-within-a-station" size={34} style={{marginVertical: 10, color: '#568f4a'}} />
                            <Text style={{color: '#9d9d9d', fontSize: 13}}>이동거리</Text>
                            <Text style={{color: '#333', fontSize: 20, fontWeight: 'bold'}}>2km</Text>
                        </View>
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <Icon name="whatshot" size={34} style={{marginVertical: 10, color: '#fd556e'}} />
                            <Text style={{color: '#9d9d9d', fontSize: 13}}>소모 칼로리</Text>
                            <Text style={{color: '#333', fontSize: 20, fontWeight: 'bold'}}>1842kcal</Text>
                        </View>
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <Icon name="timer" size={34} style={{marginVertical: 10, color: '#03a5ef'}} />
                            <Text style={{color: '#9d9d9d', fontSize: 13}}>러닝시간</Text>
                            <Text style={{color: '#333', fontSize: 20, fontWeight: 'bold'}}>3시간 23분</Text>
                        </View>
                    </View>
                </View>
                <View style={[styles.sectionCard, {marginTop: 8}]}>
                    <View style={{padding: 10}}>
                        <Text style={{color: '#333'}}>2017년 둘레길 이용현황</Text>
                    </View>
                    <View style={{height: 120}} />
                </View>
                <View style={[styles.sectionCard, {marginTop: 8}]}>
                    <View style={{padding: 10}}>
                        <Text style={{color: '#333'}}>00구 날씨</Text>
                    </View>
                    <View style={{justifyContent: 'center', alignItems: 'center', padding: 40}}>
                        <ActivityIndicator
                            animating={true}
                            size="large"
                            color="#a0b145"
                        />
                    </View>
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