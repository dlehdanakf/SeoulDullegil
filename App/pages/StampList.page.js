import React, {Component} from 'React'
import {
    Image,
    StyleSheet,
    Text,
    View,
    TouchableNativeFeedback,
    TouchableHighlight,
    ListView,
    Dimensions
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
            if(isVisited === false){
                return(
                    <View style={{flex:1, alignItems:'center'}}>
                        <IconFontAwesome name='close' size={100} style={{color:'#FF6244'}}/>
                        <Text style={{fontSize:15, fontWeight:'bold'}}>아직 발견하지 못한 도장입니다</Text>
                    </View>
                );
            }
            else {
                return(
                    <View style={{flex:1, flexDirection:'row'}}>
                        <View style={{width:101, marginHorizontal:15, justifyContent:'center'}}>
                            <View style={[styles.stampIconWrap, {width:101, height:101, borderRadius:101, borderColor: v.coursecolor}]}>
                                <Image source={StampIconFunc(stamp.COT_STAMP_ICON)} size={100} style={{width:100, height:100, tintColor: v.coursecolor}} />
                            </View>
                        </View>
                        <View style={{flex:1, margin:10, flexDirection:'column'}}>
                            <View style={{marginTop:10, borderLeftWidth:3, borderColor: v.color, paddingLeft: 5}}>
                                <Text style={modalStyles.title}>{v.COT_CONTS_NAME}</Text>
                            </View>
                            <View style={{flex:1, flexDirection:'row', padding:8}}>
                                <View style={{flex:3, justifyContent:'center', alignItems:'center'}}>
                                    <Text style={{fontWeight:'bold', fontSize:14}}>획득 날짜</Text>
                                    <Text>2017-04-11</Text>
                                </View>
                                <View style={{flex:1, flexDirection:'row', paddingVertical:15}}>
                                    <View style={{flex:1, borderRightWidth:1, borderColor:'#d1d1d1'}}/>
                                    <View style={{flex:1}}/>
                                </View>
                                <View style={{flex:3, justifyContent:'center', alignItems:'center'}}>
                                    <Text style={{fontWeight:'bold', fontSize:15}}>방문 횟수</Text>
                                    <Text>4</Text>
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
            <View style={{height: cardViewWidth, flex:1, flexDirection:'row', marginHorizontal:cardInterval, marginTop:cardInterval, marginBottom:cardInterval}}>
                <TouchableNativeFeedback onPress={()=>{this.showStampRecord(row[0]);}}>
                    <View style={[styles.stampViewContainer, {backgroundColor: row[0].coursecolor, opacity:0.7}]}>
                        <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                            <View style={styles.stampIconWrap}>
                                <Image source={StampIconFunc(row[0].COT_STAMP_ICON)} style={[styles.stampIcon, {tintColor: '#E1E1E1'}]}/>
                            </View>
                        </View>
                        <View style={styles.stampNameView}>
                            <Text style={styles.stampNameText}>{row[0].NAME}</Text>
                        </View>
                    </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={()=>{this.showStampRecord(row[1]);}}>
                    <View style={[styles.stampViewContainer, {backgroundColor: row[1].coursecolor, opacity: row[1].INDEX === 2 || row[1].INDEX == 5 ? 0.7 : 1}]}>
                        <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                            <View style={styles.stampIconWrap}>
                                <Image source={StampIconFunc(row[1].COT_STAMP_ICON)} style={[styles.stampIcon, {tintColor: '#E1E1E1'}]}/>
                            </View>
                        </View>
                        <View style={styles.stampNameView}>
                            <Text style={styles.stampNameText}>{row[1].NAME}</Text>
                        </View>
                    </View>
                </TouchableNativeFeedback>
            </View>
        );
    }

    render() {

        return (
            <View style={{flex:1, paddingVertical:cardInterval}}>
                <ListView
                    style={{flex: 1}}
                    dataSource={this.state.stampdata}
                    enableEmptySections={true}
                    renderRow={this.renderStampRowItem}
                />
                <Modal
                    isVisible={this.state.isModalVisible}
                    animationIn="slideInUp"
                    animationOut="slideOutDown"
                    animationInTiming={300}
                    animationOutTiming={150}
                    backdropOpacity={0.5}
                    onBackButtonPress={()=>this.setState({isModalVisible: false})}
                    onBackdropPress={()=>this.setState({isModalVisible: false})}
                    style={{marginHorizontal: 0, marginBottom: -10}}
                >
                    <View style={modalStyles.modalWrap}>
                        <View style={modalStyles.modal}>
                            <View style={[modalStyles.header, {backgroundColor: this.state.modalHeaderColor}]}>
                                <TouchableHighlight onPress={()=>this.setState({isModalVisible: false})} style={modalStyles.titleWrap} underlayColor="#F1F1F1">
                                    <View style={{flex: 1, flexDirection: 'row'}}>
                                        <View style={{flex: 1, paddingHorizontal: 12, justifyContent: 'center',}}>
                                            <Text style={modalStyles.title}>{this.state.modalData.title}</Text>
                                            <Text style={[modalStyles.subTitle, {color:'white'}]}>{this.state.modalData.subTitle}</Text>
                                        </View>
                                        <View style={modalStyles.icon}>
                                            <IconMaterialIcons name="keyboard-arrow-down" size={32} />
                                        </View>
                                    </View>
                                </TouchableHighlight>
                            </View>
                            <View style={{flex:1}}>
                                {this.state.modalData.content}
                            </View>
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
        flex:1,
        marginHorizontal: cardInterval,
        elevation:2,
        borderWidth:0,
        backgroundColor:'white',
        borderRadius:cardViewRadius,
    },
    stampIconWrap: {
        justifyContent:'center',
        alignItems:'center',
        height: stampRadius+1,
        width:stampRadius+1,
        borderColor:'#E1E1E1',
        borderRadius:stampRadius+1,
        borderWidth:1,
        borderStyle: 'dashed',
    },
    stampIcon:{
        width:stampRadius,
        height:stampRadius,
    },
    stampNameView:{
        height:50,
        backgroundColor:'black',
        opacity:0.5,
        justifyContent:'center',
        alignItems:'center',
        borderBottomLeftRadius:cardViewRadius,
        borderBottomRightRadius:cardViewRadius
    },
    stampNameText:{
        fontSize:17,
        fontWeight:'bold',
        color:'white'
    }
});

const modalStyles = StyleSheet.create({
    modalWrap: {
        padding:10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
    },
    modal: {
        justifyContent:'center',
        backgroundColor: '#FFF',
        borderRadius: 6,
        elevation: 2,
        height: 200,
        width: 320,
    },
    header: {
        height: 70,
        padding: 5,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#AAA',
    },
    titleWrap: {
        flex: 1,
        borderRadius: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    subTitle: {
        fontSize: 13,
        color: '#AAA'
    },
    icon: {
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
