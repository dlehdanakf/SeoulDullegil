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

class Emergency extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        return(
            <View style={{flex:1, backgroundColor:'white'}}>
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
        return(
            <View style={{flex:1, backgroundColor:'white'}}>
                <View style={{height:30, borderBottomWidth:1, borderColor:'#d1d1d1', paddingLeft:5}}>
                    <Text style={{color:'black', fontWeight:'bold', fontSize:20}}>날씨</Text>
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
            <View style={{flex:1, backgroundColor:'white'}}>
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
            <View style={{flex:1, backgroundColor:'white'}}>
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
            <View style={{flex:1, backgroundColor:'white'}}>
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
            <View style={{height: 200, backgroundColor: 'white', marginHorizontal:5, marginTop:5, paddingHorizontal:10, paddingVertical:5}}>
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
        justifyContent: 'center',
        alignItems: 'center'
    }

});
