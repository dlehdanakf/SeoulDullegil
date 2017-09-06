import React from 'react';
import { StyleSheet, Text, View, TouchableNativeFeedback } from 'react-native';
import { WebView } from 'react-native-webview-messaging/WebView';

import MapSource from 'map_webview/map.html';

export default class App extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <WebView
                    ref={ webview => { this.webview = webview; }}
                    source={MapSource}
                />
                <View style={{height: 60, backgroundColor: '#FFF', flexDirection: 'row'}}>
                    <TouchableNativeFeedback>
                        <View style={{flex: 2, backgroundColor: '#3ABF00', justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', color: '#FFF'}}>트래킹 시작하기</Text>
                        </View>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback
                        onPress={()=>{
                            this.webview.send('show');
                        }}
                    >
                        <View style={{flex: 1, backgroundColor: '#888', justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderRightColor: '#666'}}>
                            <Text style={{fontSize: 14, fontWeight: 'bold', color: '#FFF'}}>경로표시</Text>
                        </View>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback
                        onPress={()=>{
                            this.webview.send('hide');
                        }}
                    >
                        <View style={{flex: 1, backgroundColor: '#888', justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontSize: 14, fontWeight: 'bold', color: '#FFF'}}>경로숨김</Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
