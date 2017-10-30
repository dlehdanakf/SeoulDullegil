import React, { Component } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';


export default class PopUpNotification extends Component {
  constructor(props){
    super(props)
    state = {
      isVisible: false,
    };
  }

  _renderButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.button}>
        <Text>{text}</Text>
      </View>
    </TouchableOpacity>
  );

  _renderModalContent = () => (
    <View style={styles.modalContent}>
      <Text style={{fontSize:17}}>체크 포인트 발견</Text>
      <Text>{this.props.body}</Text>
      {this._renderButton('Close',
        () => {
          this.setState({ isVisible: false });
          this.props.parentSetStateHandler();
        }
      )}
    </View>
  );

  componentWillMount(){
    this.setState({
      isVisible: this.props.visible
    })
  }

  render() {
    return (
      <Modal isVisible={this.state.isVisible} style={styles.bottomModal}
        animationIn={'slideInDown'}
        animationOut={'slideOutUp'}
        backdropOpacity={0}>
        {this._renderModalContent()}
      </Modal>
    );
  }
}

styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'lightblue',
    padding: 12,
    margin: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  bottomModal: {
    justifyContent: 'flex-start',
    margin: 0,
  },
});
