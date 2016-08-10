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
  Vibration
} from 'react-native';

import {
  trackerDef,
  trackerStyles
} from '../styles/trackerStyles';

import {slideWidth} from '../styles/slideStyles';

import {isPhone5} from '../../styles/common';

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

  shake() {
    let { tracker } = this.props;
    tracker.undo();
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

  onTick() {
    Vibration.vibrate();

    let { tracker } = this.props;
    this.setState({
      sum: tracker.value
    });
  }

  onUndo() {
    let { tracker } = this.props;
    this.setState({
      sum: tracker.value
    });
  }

  onTap() {
    super.onTap();
    Keyboard.dismiss();
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
              onSubmitEditing={::this._onPlus}
            />
            <TouchableOpacity
              disabled={!editable}
              onPress={::this._onPlus}>
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

  _onPlus() {
    Keyboard.dismiss();
    let { tracker } = this.props;
    let added = parseFloat(this.state.added);
    if (added) {
      tracker.tick(added);
      this.setState({ added: '' });
    }
  }

  _onChangeText(sumAdded) {
    this.setState({ added: sumAdded });
  }
};

const width = slideWidth - 40;

const inFontSize = isPhone5() ? 32 : 42;

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
    flexDirection: 'row',
    width: width,
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#DADADA',
    paddingBottom: 10,
    marginBottom: 10
  },
  textContainer: {
    width: width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sumInput: {
    height: 50,
    width: width - 40,
    paddingRight: 20,
    fontSize: inFontSize,
    color: '#4A4A4A',
    textAlign: 'center',
    fontWeight: '100'
  },
  circleBtnSm: {
    width: 40
  },
  sumText: {
    fontSize: 35,
    color: '#9B9B9B',
    fontWeight: '200'
  }
});
