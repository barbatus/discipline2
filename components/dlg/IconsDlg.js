'use strict';

import React, {Component} from 'react';

import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Modal
} from 'react-native';

import IconsGrid from '../icons/IconsGrid';

import {caller} from '../../utils/lang';

export default class IconsDlg extends Component {
  _cb: Function = null;
  state: any = { modalVisible: false };

  show(cb: Function) {
    check.assert.null(this._cb,
      'Dlg already shown');

    this.setState({
      modalVisible: true
    });
    this._cb = cb;
  }

  hide() {
    this.setState({
      modalVisible: false
    });
    this._cb = null;
  }

  _onIconChosen(iconId) {
    caller(this._cb, iconId);
    caller(this.props.onIconChosen, iconId);
  }

  render() {
    return (
      <View>
        <Modal
          animationType={'slide'}
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
                onIconChosen={this._onIconChosen.bind(this)} />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
};

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
