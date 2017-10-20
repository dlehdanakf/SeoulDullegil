import React, {Component, PropTypes} from 'React';
import {
    ViewPropTypes, StyleSheet, Text,
    View, Animated, TouchableNativeFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

class Button extends React.Component {
    render(){
        return (
            <TouchableNativeFeedback
                delayPressIn={0}
                background={TouchableNativeFeedback.SelectableBackground()} // eslint-disable-line new-cap
                {...this.props}
            >
                {this.props.children}
            </TouchableNativeFeedback>
        );
    }
}

export default class DefaultTabBar extends React.Component {
    static defaultProps = {
        activeTextColor: '#3ABF00',
        inactiveTextColor: 'rgba(0, 0, 0, .4)',
    }
    static propTypes = {
        goToPage: React.PropTypes.func,
        activeTab: React.PropTypes.number,
        tabs: React.PropTypes.array,
        activeTextColor: React.PropTypes.string,
        inactiveTextColor: React.PropTypes.string,
        textStyle: Text.propTypes.style,
        tabStyle: ViewPropTypes.style,
        renderTab: React.PropTypes.func,
        underlineStyle: ViewPropTypes.style,
    }
    constructor(props){
        super(props);

        this.renderTab = this.renderTab.bind(this);
    }

    renderTab(name, page, isTabActive, onPressHandler) {
        const { activeTextColor, inactiveTextColor, textStyle, } = this.props;
        const textColor = isTabActive ? activeTextColor : inactiveTextColor;
        let iconSize = 24;
        if(name === 'more-horiz') iconSize = 40;

        return (
            <Button
                style={{flex: 1, }}
                key={name}
                accessible={true}
                accessibilityLabel={name}
                accessibilityTraits='button'
                onPress={() => onPressHandler(page)}
            >
                <View style={[styles.tab, this.props.tabStyle, ]}>
                    <Text style={{fontSize:16}}>{name}</Text>
                </View>
            </Button>
        );
    }
    render(){
        const containerWidth = this.props.containerWidth;
        const numberOfTabs = this.props.tabs.length;
        const tabUnderlineStyle = {
            position: 'absolute',
            width: containerWidth / numberOfTabs,
            height: 2,
            backgroundColor: this.props.activeTextColor,
            bottom: -1,
        };
        const translateX = this.props.scrollValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0,  containerWidth / numberOfTabs],
        });

        return (
            <View style={[styles.tabs, this.props.style, ]}>
                {this.props.tabs.map((name, page) => {
                    const isTabActive = this.props.activeTab === page;
                    const renderTab = this.props.renderTab || this.renderTab;

                    return renderTab(name, page, isTabActive, this.props.goToPage);
                })}
                <Animated.View
                    style={[
                        tabUnderlineStyle, {
                            transform: [
                                { translateX },
                            ]
                        }, this.props.underlineStyle,
                    ]}
                />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabs: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderWidth: 1,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderColor: '#E1E1E1',
        backgroundColor: 'white',
    },
});
