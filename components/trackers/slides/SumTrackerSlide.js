'use strict';

import React from 'react';

import {
  View,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  Text,
  TextInput,
  StyleSheet,
  DeviceEventEmitter
} from 'react-native';

import {
  trackerDef,
  trackerStyles
} from '../styles/trackerStyles';

import TrackerSlide from './TrackerSlide';

import Keyboard from '../../../utils/keyboard';

export default class SumTrackerSlide extends TrackerSlide {
  cancelEdit(callback) {
    super.cancelEdit(callback);
    Keyboard.dismiss();
  }

  saveEdit(callback) {
    super.saveEdit(callback);
    Keyboard.dismiss();
  }

  showEdit(callback) {
    super.showEdit(callback);
    Keyboard.dismiss();
  }

  collapse(callback) {
    super.collapse(callback);
    Keyboard.dismiss();
  }

  onChange() {
    let { tracker } = this.props;
    this.setState({
      iconId: tracker.iconId,
      title: tracker.title,
      added: null,
      sum: tracker.value
    });
  }

  onTap() {
    Keyboard.dismiss();
    super.onTap();
  }

  get controls() {
    let { editable } = this.props;

    return (
      <View style={[
        trackerStyles.controls,
        styles.controlsContainer
      ]}>
        <View style={styles.controls}>
          <View style={styles.inputContainer}>
             <TextInput
              ref='added'
              editable={editable}
              placeholder='Enter value'
              placeholderTextColor={trackerDef.hintText.color}
              style={styles.sumInput}
              onChangeText={added => this._onChangeText(added)}
              value={this.state.added}
              onSubmitEditing={this._onPlus.bind(this)}
            />
            <TouchableOpacity
              disabled={editable}
              onPress={this._onPlus.bind(this)}>
              <Image
                source={getIcon('plus_sm')}
                style={[trackerStyles.circleBtnSm, styles.circleBtnSm]} />
            </TouchableOpacity>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.sumText}>=</Text>
            <Text style={styles.sumText}>
              $ {this.state.sum}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  get footer() {
    return (
      <Text style={trackerStyles.footerText}>
        Shake to undo
      </Text>
    );
  }

  _getCheckStyle() {
    return this.state.checked ?
      [trackerStyles.checkBtn, trackerStyles.filledBtn] :
        trackerStyles.checkBtn;
  }

  _onPlus() {
    Keyboard.dismiss();
    let tracker = this.props.tracker;
    let added = parseFloat(this.state.added);
    if (added) {
      tracker.click(added);
    }
  }

  _onChangeText(sumAdded) {
    this.setState({ added: sumAdded });
  }
};

const width = trackerDef.container.width - 40;

const styles = StyleSheet.create({
  controlsContainer: {
    flex: 1,
    alignItems: 'flex-start',
    paddingTop: 25
  },
  controls: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputContainer: {
    flex: 0.7,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#DADADA',
    paddingBottom: 20
  },
  sumInput: {
    height: 40,
    width: width - 40,
    paddingRight: 20,
    fontSize: 42,
    color: '#4A4A4A',
    textAlign: 'right',
    fontWeight: '100'
  },
  circleBtnSm: {
    width: 40
  },
  textContainer: {
    flex: 0.3,
    width: width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8
  },
  sumText: {
    fontSize: 34,
    color: '#9B9B9B',
    fontWeight: '300'
  }
});
