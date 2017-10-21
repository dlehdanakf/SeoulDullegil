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
        const textColor = isTabActive ? '#f49805' : '#999';
        const textWeight = isTabActive ? 'bold' : 'normal';

        return (
            <Button
                style={{flex: 1, }}
                key={name}
                accessible={true}
                accessibilityLabel={name}
                accessibilityTraits='button'
                onPress={() => onPressHandler(page)}
            >
                <View style={[styles.tab, this.props.tabStyle]}>
                    <Text style={{fontSize:15, color: textColor, fontWeight: textWeight}}>{name}</Text>
                </View>
            </Button>
        );
    }
    render(){
        const containerWidth = this.props.containerWidth - 28;
        const numberOfTabs = this.props.tabs.length;
        const tabUnderlineStyle = {
            position: 'absolute',
            width: containerWidth / numberOfTabs,
            height: 3,
            backgroundColor: this.props.activeTextColor,
            bottom: -1,
        };
        const translateX = this.props.scrollValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0,  containerWidth / numberOfTabs],
        });

        return (
            <View style={styles.tabsWrap}>
                <View style={[styles.tabs, this.props.style]}>
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
        height: 40,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    tabsWrap: {
        height: 40,
        paddingHorizontal: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#E9E9E9',
        backgroundColor: '#FFF',
    }
});
