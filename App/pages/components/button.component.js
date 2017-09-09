import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class Button extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            backgroundColor: this.props.backgroundColor || '#f8931f',
            textColor: this.props.color || '#FFF',
            fontSize: this.props.fontSize || 14,
            disabled: this.props.disabled || false,

            btnStyle: this.props.btnStyle || {},
            textStyle: this.props.textStyle || {},

            onPress: this.props.onPress || function(){},
        }
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            disabled: nextProps.disabled
        });
    }
    render(){
        let btnRadius = this.props.borderRadius ? this.props.borderRadius : 4;
        if(this.state.disabled){
            return (
                <View style={[btn.view, {backgroundColor: this.state.backgroundColor}, this.state.btnStyle]}>
                    {this.props.icon ? <Icon name={this.props.icon} size={this.state.fontSize + 4} style={{marginRight: 6, marginLeft: -2, opacity: 0.8}} color={this.state.textColor} /> : null }
                    <Text style={[btn.text,  {color: this.state.textColor, opacity: 0.8, fontSize: this.state.fontSize}, this.state.textStyle]}>{this.props.title}</Text>
                </View>
            );
        }

        return (
            <TouchableHighlight onPress={this.state.onPress} underlayColor="rgba(132,132,132,.1)" style={{borderRadius: btnRadius}}>
                <View style={[btn.view, {backgroundColor: this.state.backgroundColor}, this.state.btnStyle]}>
                    {this.props.icon ? <Icon name={this.props.icon} size={this.state.fontSize + 4} style={{marginRight: 6, marginLeft: -2}} color={this.state.textColor} /> : null }
                    <Text style={[btn.text,  {color: this.state.textColor, fontSize: this.state.fontSize}, this.state.textStyle]}>{this.props.title}</Text>
                </View>
            </TouchableHighlight>
        );
    }
}
const btn = StyleSheet.create({
    view: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 2,
        alignItems: 'center',
        flexDirection: 'row',
    },
    text: {
        fontWeight: '400',
    }
});