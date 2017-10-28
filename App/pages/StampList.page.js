import React, {Component} from 'React'
import {
    Image, StyleSheet, Text, View, TouchableNativeFeedback,
    RefreshControl, ListView, Dimensions
} from 'react-native';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modal';

import StampIconFunc from './components/stamp.function';
import StampCheckFunc from './components/stamp.check.function';
import stampColor from './datasets/green.colors';

const cardInterval = 4;
const stampRadius = 120;
const cardViewRadius = 3;

export default class StampList extends React.Component {
    constructor(props) {
        super(props);
        this.mapdata = props.mapData;

        this.ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
        });

        this.state = {
            activeStampList: props.activeStampList,
            rawStampData: [],
            stampdata: this.ds.cloneWithRows([]),
            isModalVisible: false,
            showRefreshControl: false,
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
            rawStampData: stampdata,
            stampdata: this.ds.cloneWithRows(stampdata)
        });
        this.renderStampRowItem = this.renderStampRowItem.bind(this);
        this.showStampRecord = this.showStampRecord.bind(this);
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            activeStampList: nextProps.activeStampList,
            stampdata: this.ds.cloneWithRows(this.state.rawStampData)
        });
    }


    showStampRecord(stamp){
        function modalContent(v, list){
            const isChecked = StampCheckFunc(v.COT_STAMP_ICON, list);

            if(isChecked === null){
                return(
                    <View style={{flex:1}}>
                        <View style={{flex:1}}>
                            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                                <View style={[styles.stampIconWrap, {height: 115, width:115, borderColor:'#FF6244'}]}>
                                    <IconFontAwesome name='close' size={54} style={{color:'#FF6244'}}/>
                                </View>
                            </View>
                            <View style={{paddingVertical: 20, paddingHorizontal: 10, justifyContent:'center', alignItems:'center'}}>
                                <Text style={{color: '#5F6364', fontSize:16, textAlign: 'center'}}>{v.COT_CONTS_NAME}</Text>
                                <Text style={{color: '#BBC0C4', fontSize:13}}>{v.NAME}</Text>
                            </View>
                        </View>
                        <View style={{backgroundColor: '#323638', borderBottomLeftRadius: 3, borderBottomRightRadius:3, flexDirection:'row', paddingVertical: 20}}>
                            <View style={{flex:1, justifyContent:'center', flexDirection:'row'}}>
                                <View style={{flexDirection:'row', alignItems:'center', justifyContent:'flex-end', paddingHorizontal: 14}}>
                                    <Text style={{fontSize:14, color:'white', fontWeight:'bold'}}>아직 도장을 획득하지 못했습니다.</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                );
            } else {
                return(
                    <View style={{flex:1}}>
                        <View style={{flex:1}}>
                            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                                <View style={[styles.stampIconWrap, {height: 115, width:115, borderColor:'#f49805', borderStyle: 'solid'}]}>
                                    <Image source={StampIconFunc(v.COT_STAMP_ICON)} style={{height: 115, width:115, tintColor:'#f49805'}} />
                                </View>
                            </View>
                            <View style={{paddingVertical: 20, paddingHorizontal: 10, justifyContent:'center', alignItems:'center'}}>
                                <Text style={{color: '#5F6364', fontSize:16, textAlign: 'center'}}>{v.COT_CONTS_NAME}</Text>
                                <Text style={{color: '#BBC0C4', fontSize:13}}>{v.NAME}</Text>
                            </View>
                        </View>
                        <View style={{backgroundColor: '#323638', borderBottomLeftRadius: 3, borderBottomRightRadius:3, flexDirection:'row', paddingVertical: 20}}>
                            <View style={{flex:1, justifyContent:'center', flexDirection:'row'}}>
                                <View style={{flexDirection:'row', marginRight: 20}}>
                                    <IconMaterialIcons name="map" size={16} style={{color:'#51585C', marginBottom:-1, marginRight: 2}} />
                                    <Text style={{fontSize:15, color:'white', paddingLeft:3}}>{v.COT_GU_NAME}</Text>
                                </View>
                                <View style={{flexDirection:'row'}}>
                                    <IconMaterialIcons name="access-time" size={16} style={{color:'#626B70', marginBottom:-1, marginRight: 2}} />
                                    <Text style={{fontSize:15, color:'white', paddingLeft:3}}>{isChecked.substring(0, 10)}</Text>
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
                content: modalContent(stamp, this.state.activeStampList),
                title: stamp.NAME,
                subTitle: stamp.COT_GU_NAME,
            }
        });
    }

    renderStampRowItem(row){
        return (
            <View style={{flex:1, flexDirection:'row', marginHorizontal:cardInterval, marginTop:cardInterval, marginBottom:cardInterval}}>
                {row.map((v, i)=>{
                    const isActive = StampCheckFunc(v.COT_STAMP_ICON, this.state.activeStampList) !== null;
                    const stampColor = isActive ? '#f49805' : v.color;
                    const stampStyle = isActive ? { borderColor: '#f49805', borderStyle: 'solid' } : { borderColor: stampColor };

                    return (
                        <TouchableNativeFeedback key={i} onPress={()=>this.showStampRecord(v)}>
                            <View style={styles.stampViewContainer}>
                                <Text style={{paddingTop: 10, paddingLeft: 10, color: '#A3A3A3', fontSize: 13}}>{v.NAME}</Text>
                                <View style={{flex:1, alignItems:'center', justifyContent:'center', paddingTop: 14, paddingBottom: 20}}>
                                    <View style={[styles.stampIconWrap, stampStyle]}>
                                        <Image source={StampIconFunc(v.COT_STAMP_ICON)} style={[styles.stampIcon, {tintColor: stampColor}]}/>
                                    </View>
                                </View>
                                <View style={styles.stampNameView}>
                                    <Text style={[styles.stampNameText, { color: v.color, borderColor: v.color }]}>{v.COT_CONTS_NAME}</Text>
                                </View>
                            </View>
                        </TouchableNativeFeedback>
                    );
                })}
            </View>
        );
    }

    render() {

        return (
            <View style={{flex:1, backgroundColor: '#efefef'}}>
                <ListView
                    style={{flex: 1, paddingVertical:cardInterval}}
                    dataSource={this.state.stampdata}
                    enableEmptySections={true}
                    renderHeader={()=><View style={{height: 7, backgroundColor: '#efefef'}} />}
                    renderFooter={()=><View style={{height: 7, backgroundColor: '#efefef'}} />}
                    renderRow={this.renderStampRowItem}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.showRefreshControl}
                            onRefresh={()=>{
                                this.setState({showRefreshControl: true});

                                setTimeout(()=>this.setState({
                                    stampdata: this.ds.cloneWithRows(this.state.rawStampData),
                                    showRefreshControl: false
                                }), 400)
                            }}
                            colors={['#f49805']}
                        />
                    }
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
        backgroundColor:'#FFF',
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
