import React, {Component} from 'React'
import {
    Image,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    TouchableNativeFeedback,
} from 'react-native';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import IconEntypo from 'react-native-vector-icons/Entypo';
import NavBar, {NavButton, NavButtonText, NavTitle, NavGroup} from 'react-native-nav';
import {Actions} from 'react-native-router-flux';
import navBarStylesModule from './assets/navbar.styles';

const navBarStyles = navBarStylesModule("#558F4A");

export default class CourseList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.fill}>
                <NavBar style={navBarStyles}>
                    <View style={{flex:1, flexDirection: 'row', marginLeft: -16}}>
                        <NavButton style={{marginHorizontal: 14}}>
                            <IconMaterialIcons name="arrow-back" onPress={Actions.pop} size={24} style={navBarStyles.backIcon}/>
                        </NavButton>
                    </View>
                    <NavTitle style={styles.title}>
                        둘레길 코스
                    </NavTitle>
                    <View style={{flex:1, flexDirection: 'row', marginRight: -16}} />
                </NavBar>

                <View style={{margin:15, padding:15, borderRadius: 15, flexDirection:'row', height: 110, backgroundColor:'#a8c99e'}}>
                    <View style={{borderRightWidth: 1, borderColor: '#D1FAC4', height:80, width: 80, justifyContent:'center', alignItems:'center'}}>
                        <View style={{height:60, width:60, backgroundColor:'#F8931F', borderRadius:30, alignItems:'center', justifyContent:'center'}}>
                            <Text style={{color:'white', fontSize:40}}>1</Text>
                        </View>
                    </View>
                    <View style={{flex:1, justifyContent:'center', paddingLeft: 15, flexDirection:'row'}}>
                        <View style={{flex:1}}>
                            <View style={{flex:1, justifyContent:'center'}}>
                                <Text style={{fontSize:20, color:'white'}}>수락·불암산 코스</Text>
                                <IconEntypo name='location' size={12} style={{color:'white'}}>
                                    <Text style={{fontSize:12, color:'white'}}> 노원구, 도봉구(14.3km)</Text>
                                </IconEntypo>
                            </View>
                            <View style={{flexDirection:'row', alignItems:'center'}}>
                                <View style={{width:60, height:12, backgroundColor:'gray', borderRadius:10, flexDirection: 'row', marginRight:10}}>
                                    <View style={{height:12,width:20, backgroundColor:'orange', borderRadius:10}} />
                                </View>
                                <Text style={{color:'gray', fontSize:12, fontWeight:'bold'}}>상급</Text>
                            </View>
                        </View>
                        <View style={{width:45, alignItems:'center', justifyContent:'center'}}>
                            <IconEntypo name="chevron-right" size={45} style={{color:'white'}} />
                        </View>
                    </View>
                </View>
            </View>
        );
    }r
}

const styles = StyleSheet.create({
    fill: {
        flex: 1,
        backgroundColor:'white'
    },
    title: {
        flex:1,
        fontSize: 22,
        letterSpacing: 1,
        fontWeight: "bold",
        textAlign: "center",
        color: '#FFF',
    },

});
