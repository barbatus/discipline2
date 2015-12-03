'use strict';

const React = require('react-native');
const {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Component,
  Modal
} = React;

const IconsGrid = require('../icons/IconsGrid');

let IconsDlg = React.createClass({
  getInitialState() {
    return {
      modalVisible: false
    };
  },

  show() {
    this.setState({
      modalVisible: true
    });
  },

  hide() {
    this.setState({
      modalVisible: false
    });
  },

  _onIconChosen(iconId) {
    if (this.props.onIconChosen) {
      this.props.onIconChosen(iconId);
    }
  },

  render() {
    return (
      <View>
        <Modal
          animated={true}
          transparent={false}
          visible={this.state.modalVisible}>
          <View style={styles.innerView}>
            <View style={styles.headerContainer}>
              <TouchableOpacity onPress={() => this.hide()}>
                <Text style={styles.cancelText}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.bodyContainer}>
              <IconsGrid
                ref='iconsGrid'
                onIconChosen={this._onIconChosen} />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
});

const styles = StyleSheet.create({
  innerView: {
    flex: 1,
    backgroundColor: '#FFF'
  },
  headerContainer: {
    height: 64,
    paddingTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderBottomColor: 'rgba(185, 185, 185, 0.5)',
    borderBottomWidth: 1
  },
  bodyContainer: {
    flex: 1
  },
  cancelText: {
    fontSize: 17,
    color: '#1A7CF9'
  }
});

module.exports = IconsDlg;
