import React, { Component } from 'React'
import {
    StyleSheet, Text, View,
} from 'react-native';

import {MessageBar, MessageBarManager} from 'react-native-message-bar';

export default Home extends React.Component{
    constructor(props){
        super(props)

    }


    render(){
        return(
            <View>
                
                <MessageBar ref="alert" />
            </View>
        );
    }
}
