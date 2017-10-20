import React, {Component} from 'React'
import {
    Image,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    ToastAndroid,
    TouchableNativeFeedback,
} from 'react-native';

import {Actions} from 'react-native-router-flux';

class ExerciseChart extends React.Component{
    render(){
        return(
            <View style={{height:200, backgroundColor:'red'}}>

            </View>
        );
    }
}

export default class Main extends React.Component {
    constructor(props) {
        super(props);
    }
    //#F8931F
    render() {
        return (
            <View style={styles.fill}>
                <ExerciseChart />
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
    container:{
        justifyContent:'center',
        alignItems:'center',
    }

});
