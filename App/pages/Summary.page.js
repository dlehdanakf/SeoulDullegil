import React, {PropTypes} from 'React'
import {
    Image, StyleSheet, Text, View, ScrollView
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/MaterialIcons';

import StampIconFunc from './components/stamp.function';
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
            <View style={styles.componentWrap}>
                <View style={[styles.currentCourseWrap, {backgroundColor: greenColors[this.state.activeCourseNum]}]}>
                    <View style={{padding: 10}}>
                        <Text style={{color: 'rgba(255,255,255,.8)'}}>현재 주행중인 코스</Text>
                    </View>
                    <View style={{alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10}}>
                        <Text style={{color: '#FFF', fontSize: 22, fontWeight: 'bold', marginTop: 4}}>{courseListData[this.state.activeCourseNum].COURSE_NM}</Text>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{fontSize: 12, color: 'rgba(255,255,255,.4)'}}>코스길이 : {courseListData[this.state.activeCourseNum].DISTANCE}</Text>
                            <Text style={{fontSize: 12, color: 'rgba(255,255,255,.4)', marginLeft: 10}}>소요시간 : {courseListData[this.state.activeCourseNum].WALK_TIME}</Text>
                        </View>
                    </View>
                    <View style={{alignItems: 'center'}}>
                        <ScrollView
                            contentContainerStyle={styles.stampList}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                        >
                            {courseInfoData[this.state.activeCourseNum].STAMP_DATA.map((v, i)=>{
                                // const isActive = v.COT_CONTS_NAME === '창포원 관리사무소 앞';
                                const isActive = i === 0;
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
    }
});