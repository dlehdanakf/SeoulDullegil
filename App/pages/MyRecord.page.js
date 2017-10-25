import React, {Component} from 'React'
import {
    Image,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    ToastAndroid,
    TouchableNativeFeedback,
    ListView
} from 'react-native';

import {Actions} from 'react-native-router-flux';
import {Bar, SmoothLine} from 'react-native-pathjs-charts';
import IconIonicons from 'react-native-vector-icons/Ionicons';
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import IconEntypo from 'react-native-vector-icons/Entypo';

class Emergency extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        return(
            <View style={styles.innerContainer}>
                <View style={{height:30, borderBottomWidth:1, borderColor:'#d1d1d1', paddingLeft:5}}>
                    <Text style={{color:'black', fontWeight:'bold', fontSize:20}}>응급전화</Text>
                </View>
            </View>
        );
    }
}

class WeatherInfo extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        //#614FD4
        return(
            <View style={[styles.innerContainer, {flexDirection:'row', paddingHorizontal:12}]}>
                <View style={{flex:1, paddingHorizontal:20, paddingVertical:10}}>
                    <View style={{flex:1, flexDirection:'row'}}>
                        <Text style={{fontSize:70, color:'black'}}>25</Text>
                        <IconFontAwesome name="circle-o" size={14} style={{color:'black', marginTop:12, marginLeft:5}} />
                        <View style={{alignItems:'flex-end', justifyContent:'center', marginLeft:10}}>
                            <View style={{flexDirection:'row'}}>
                                <Text style={{fontSize:25, color:'black'}}>30</Text>
                                <IconFontAwesome name="circle-o" size={7} style={{color:'black', marginTop:4}} />
                            </View>
                            <View style={{flexDirection:'row'}}>
                                <Text style={{fontSize:25, color:'black'}}>19</Text>
                                <IconFontAwesome name="circle-o" size={7} style={{color:'black', marginTop:4}} />
                            </View>
                        </View>
                    </View>
                    <View style={{flex:1, justifyContent:'center'}}>
                        <View style={{flex:1}}>
                            <View style={{flex:1, alignItems:'center', flexDirection:'row'}}>
                                <Text style={{fontSize:18, color:'black', marginRight:10}}>미세 먼지</Text>
                                <View style={{borderWidth:2, borderColor:'orange', borderRadius: 4, width: 40, height: 25, justifyContent:'center', alignItems:'center'}}>
                                    <Text style={{fontSize:18, color:'orange', fontWeight:'bold'}}>나쁨</Text>
                                </View>
                            </View>
                            <View style={{flex:1, alignItems:'center', flexDirection:'row'}}>
                                <Text style={{fontSize:18, color:'black', marginRight:10}}>강수 확률</Text>
                                <View style={{width: 40, height: 25, justifyContent:'center', alignItems:'center'}}>
                                    <Text style={{fontSize:18, color:'black', fontWeight:'bold'}}>30%</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{width:170, alignItems:'center'}}>
                    <IconIonicons name="ios-partly-sunny-outline" size={150} style={{color:'black'}} />
                    <View style={{flexDirection:'row'}}>
                        <IconEntypo name="location-pin" size={24} />
                        <Text style={{fontSize:20, color:'black', fontWeight:'bold'}}>광진구</Text>
                    </View>
                </View>
            </View>
        );
    }
}

class CurrnetTrackingInfo extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        return(
            <View style={styles.innerContainer}>
                <View style={{height:30, borderBottomWidth:1, borderColor:'#d1d1d1', paddingLeft:5}}>
                    <Text style={{color:'black', fontWeight:'bold', fontSize:20}}>트래킹 정보</Text>
                </View>
            </View>
        );
    }
}

class StatusView extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        return(
            <View style={styles.innerContainer}>
                <View style={{height:30, borderBottomWidth:1, borderColor:'#d1d1d1', paddingLeft:5}}>
                    <Text style={{color:'black', fontWeight:'bold', fontSize:20}}>상태창</Text>
                </View>
            </View>
        );
    }
}

class ExerciseChart extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let data = [
            [{ "v": 7000, "name": "14" }],
            [{ "v": 10000, "name": "15" }],
            [{ "v": 5000, "name": "16" }],
            [{ "v": 4000, "name": "17" }],
        ]

        let options = {
            height: 100,
            margin: {
                top: 20,
                left: 25,
                bottom: 50,
                right: 20
            },
            color: '#ffffff',
            gutter: 20,
            animate: {
                type: 'oneByOne',
                duration: 200,
                fillTransition: 3
            },
            axisX: {
                showAxis: true,
                showLines: true,
                showLabels: true,
                showTicks: true,
                zeroAxis: false,
                orient: 'bottom',
                label: {
                    fontFamily: 'Arial',
                    fontSize: 14,
                    fontWeight: 'bold',
                    fill: 'black',
                }
            },
            axisY: {
                showAxis: true,
                showLines: true,
                showLabels: true,
                showTicks: true,
                zeroAxis: false,
                orient: 'left',
                label: {
                    fontFamily: 'Arial',
                    fontSize: 8,
                    fontWeight: true,
                    fill: '#34495E'
                }
            }
        }

        return (
            <View style={styles.innerContainer}>
                <View style={{height:30}}>
                    <View style={{height:30, paddingLeft:5}}>
                        <Text style={{color:'black', fontWeight:'bold', fontSize:20}}>주간 정보</Text>
                    </View>
                </View>
                <Bar data={data} options={options} accessorKey='v'/>
            </View>
        );
    }
}

export default class MyRecord extends React.Component {
    constructor(props) {
        super(props);CurrnetTrackingInfo

        this.ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
        });

        this.state = {
            viewComponents: this.ds.cloneWithRows([<ExerciseChart />, <StatusView />, <CurrnetTrackingInfo />, <WeatherInfo />, <Emergency />]),
        };
    }


    renderViewRowItem(row){
        return (
            <View style={styles.container}>
                {row}
            </View>
        );
    }

    //#F8931F
    render() {
        return (
            <View style={styles.fill}>
                <ListView
                    style={{flex: 1}}
                    dataSource={this.state.viewComponents}
                    enableEmptySections={true}
                    renderRow={this.renderViewRowItem}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    fill: {
        flex: 1,
        backgroundColor:'#f1f1f1',
    },
    title: {
        flex: 1,
        fontSize: 22,
        letterSpacing: 1,
        fontWeight: "bold",
        textAlign: "center",
        color: 'black'
    },
    container: {
        height: 200,
        marginHorizontal:5,
        marginTop:5,
        borderRadius:6,
        borderWidth:0,
        elevation:1
    },
    innerContainer:{
        flex:1,
        backgroundColor:'white',
        borderRadius:6,
        padding:5
    }

});
