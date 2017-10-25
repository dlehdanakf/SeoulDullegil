import React, {Component} from 'React'
import {
    Image, StyleSheet, Text, View, TouchableNativeFeedback,
    TouchableHighlight, ListView, Dimensions
} from 'react-native';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import {Actions} from 'react-native-router-flux';
import Modal from 'react-native-modal';

import MapData from './datasets/courseinfo.list';
import StampIconFunc from './components/stamp.function';
import stampColor from './datasets/green.colors';

const isVisited = true;
const cardInterval = 4;
const screenWidth = Dimensions.get('window').width;
const cardViewWidth = (screenWidth - cardInterval*6)/2;
const stampRadius = 120;
const cardViewRadius = 3;

export default class StampList extends React.Component {
    constructor(props) {
        super(props);
        this.mapdata = MapData;

        this.ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
        });

        this.state = {
            stampdata: this.ds.cloneWithRows([]),
            isModalVisible: false,
            modalHeaderColor: 'white',
            modalData: {
                title: null,
                subTitle: null,
                content: null,
            },
        };
    }

    componentDidMount(){
        let tmp_stamp = [];
        let stampdata = [];
        this.mapdata.map((v, i)=>{
            v.STAMP_DATA.map((val, idx)=>{
                let tmp = val;
                tmp.color = stampColor[v.INDEX-1];
                tmp.INDEX = v.INDEX;
                tmp.NAME = v.NAME;
                tmp.COT_GU_NAME = v.COT_GU_NAME;
                tmp.coursecolor = v.COLOR;
                tmp_stamp.push(tmp);
            })
        });
        tmp_stamp.map((v, i)=>{
            if(i % 2 === 0){
                let tmp = [];
                tmp.push(v);

                if(tmp_stamp.length === i + 1)
                    tmp.push({});
                else
                    tmp.push(tmp_stamp[i + 1]);

                stampdata.push(tmp);
            }
        });

        this.setState({
            stampdata: this.ds.cloneWithRows(stampdata)
        });
        this.renderStampRowItem = this.renderStampRowItem.bind(this);
        this.showStampRecord = this.showStampRecord.bind(this);
    }


    showStampRecord(stamp){

        function modalContent(v){
            //나중에 바꿔야 할부분
            if(v.INDEX % 2 == 1){
                return(
                    <View style={{flex:1}}>
                        <View style={{flex:1}}>
                            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                                <IconFontAwesome name='close' size={115} style={{color:'#FF6244'}}/>
                            </View>
                            <View style={{height:50, justifyContent:'center', alignItems:'center'}}>
                                <Text style={{color: '#5F6364', fontSize:20}}>{v.NAME}</Text>
                                <Text style={{color: '#BBC0C4', fontSize:15}}>{v.COT_CONTS_NAME}</Text>
                            </View>
                        </View>
                        <View style={{height: 80, backgroundColor: '#323638', borderBottomLeftRadius: 6, borderBottomRightRadius:6, flexDirection:'row'}}>
                            <View style={{flex:1, justifyContent:'center', flexDirection:'row'}}>
                                <View style={{flexDirection:'row', alignItems:'center', justifyContent:'flex-end', padding:10}}>
                                    <Text style={{fontSize:18, color:'white', fontWeight:'bold'}}>아직 발견하지 못한 도장입니다</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                );
            }
            else {
                return(
                    <View style={{flex:1}}>
                        <View style={{flex:1}}>
                            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                                <View style={[styles.stampIconWrap, {height: 115, width:115, borderColor:'#778086'}]}>
                                    <Image source={StampIconFunc(v.COT_STAMP_ICON)} style={{height: 115, width:115, tintColor:'#778086'}} />
                                </View>
                            </View>
                            <View style={{height:50, justifyContent:'center', alignItems:'center'}}>
                                <Text style={{color: '#5F6364', fontSize:20}}>{v.NAME}</Text>
                                <Text style={{color: '#BBC0C4', fontSize:15}}>{v.COT_CONTS_NAME}</Text>
                            </View>
                        </View>
                        <View style={{height: 80, backgroundColor: '#323638', borderBottomLeftRadius: 6, borderBottomRightRadius:6, flexDirection:'row'}}>
                            <View style={{flex:1, justifyContent:'center', flexDirection:'row'}}>
                                <View style={{flex:1, flexDirection:'row', alignItems:'center', justifyContent:'center', paddingLeft:17}}>
                                    <IconMaterialIcons name="map" size={16} style={{color:'#51585C', marginBottom:-1}} />
                                    <Text style={{fontSize:15, color:'white', paddingLeft:3}}>{v.COT_GU_NAME}</Text>
                                </View>
                                <View style={{flex:1, flexDirection:'row', alignItems:'center', justifyContent:'flex-start', padding:0}}>
                                    <IconMaterialIcons name="access-time" size={16} style={{color:'#626B70', marginBottom:-1}} />
                                    <Text style={{fontSize:15, color:'white', paddingLeft:3}}>2017-04-11</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                );
            }
        }

        this.setState({
            isModalVisible: true,
            modalHeaderColor: stamp.color,
            modalData:{
                content: modalContent(stamp),
                title: stamp.NAME,
                subTitle: stamp.COT_GU_NAME,
            }
        });
    }

    renderStampRowItem(row){
        return(
            <View style={{flex:1, flexDirection:'row', marginHorizontal:cardInterval, marginTop:cardInterval, marginBottom:cardInterval}}>
                <TouchableNativeFeedback onPress={()=>{this.showStampRecord(row[0]);}}>
                    <View style={styles.stampViewContainer}>
                        <Text style={{paddingTop: 10, paddingLeft: 10, color: '#bebebe', fontSize: 13}}>{row[0].NAME}</Text>
                        <View style={{flex:1, alignItems:'center', justifyContent:'center', paddingTop: 14, paddingBottom: 20}}>
                            <View style={styles.stampIconWrap}>
                                <Image source={StampIconFunc(row[0].COT_STAMP_ICON)} style={[styles.stampIcon, {tintColor: '#bebebe'}]}/>
                            </View>
                        </View>
                        <View style={styles.stampNameView}>
                            <Text style={[styles.stampNameText, { color: row[0].color, borderColor: row[0].color }]}>{row[0].COT_CONTS_NAME}</Text>
                        </View>
                    </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={()=>{this.showStampRecord(row[1]);}}>
                    <View style={styles.stampViewContainer}>
                        <Text style={{paddingTop: 10, paddingLeft: 10, color: '#bebebe', fontSize: 13}}>{row[1].NAME}</Text>
                        <View style={{flex:1, alignItems:'center', justifyContent:'center', paddingTop: 14, paddingBottom: 20}}>
                            <View style={styles.stampIconWrap}>
                                <Image source={StampIconFunc(row[1].COT_STAMP_ICON)} style={[styles.stampIcon, {tintColor: '#bebebe'}]}/>
                            </View>
                        </View>
                        <View style={styles.stampNameView}>
                            <Text style={[styles.stampNameText, { color: row[1].color, borderColor: row[1].color }]}>{row[1].COT_CONTS_NAME}</Text>
                        </View>
                    </View>
                </TouchableNativeFeedback>
            </View>
        );
    }

    render() {

        return (
            <View style={{flex:1, paddingVertical:cardInterval, backgroundColor: '#efefef'}}>
                <ListView
                    style={{flex: 1}}
                    dataSource={this.state.stampdata}
                    enableEmptySections={true}
                    renderRow={this.renderStampRowItem}
                />
                <Modal
                    isVisible={this.state.isModalVisible}
                    animationIn="fadeIn"
                    animationOut="fadeOut"
                    animationInTiming={100}
                    animationOutTiming={100}
                    backdropOpacity={0.5}
                    onBackButtonPress={()=>this.setState({isModalVisible: false})}
                    onBackdropPress={()=>this.setState({isModalVisible: false})}
                    style={{marginHorizontal: 0, marginBottom: -10}}
                >
                    <View style={modalStyles.modalWrap}>
                        <View style={modalStyles.modal}>
                            <TouchableNativeFeedback onPress={()=>this.setState({isModalVisible: false})}>
                                <View style={modalStyles.icon}>
                                    <IconMaterialIcons name="close" size={24} />
                                </View>
                            </TouchableNativeFeedback>
                            {this.state.modalData.content}
                        </View>
                    </View>
                </Modal>
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
    stampViewContainer: {
        flex: 1,
        marginHorizontal: cardInterval,
        elevation: 1,
        borderWidth: 0,
        backgroundColor: 'white',
        borderRadius: cardViewRadius,
    },
    stampIconWrap: {
        justifyContent: 'center',
        alignItems: 'center',
        height: stampRadius+1,
        width: stampRadius+1,
        borderColor: '#E1E1E1',
        borderRadius: stampRadius+1,
        borderWidth: 1,
        borderStyle: 'dashed',
    },
    stampIcon:{
        width:stampRadius,
        height:stampRadius,
    },
    stampNameView:{
        justifyContent:'center',
        alignItems:'center',
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius:cardViewRadius,
        borderBottomRightRadius:cardViewRadius
    },
    stampNameText:{
        fontSize:13,
        fontWeight:'normal',
        color:'#CCC',
        borderColor: '#CCC',
        borderWidth: 1,
        borderRadius: 2,
        paddingTop: 3,
        paddingBottom: 2,
        paddingHorizontal: 8,
        textAlign: 'center',
    }
});

const modalStyles = StyleSheet.create({
    modalWrap: {
        padding:10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6
    },
    modal: {
        justifyContent:'center',
        backgroundColor:'#F0F8F9',
        elevation: 3,
        height: 280,
        width: 230,
        borderRadius: 6
    },
    header: {
        height: 60,
        padding: 5,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#AAA',
        flexDirection: 'row'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    subTitle: {
        fontSize: 13,
        color: '#AAA'
    },
    icon: {
        height: 30,
        alignItems: 'flex-end',
        paddingRight: 5,
        paddingTop: 5,
    },
});
