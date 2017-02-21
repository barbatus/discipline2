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
  Vibration,
} from 'react-native';

import {
  trackerDef,
  trackerStyles,
} from '../styles/trackerStyles';

import {slideWidth} from '../styles/slideStyles';

import {isPhone5} from '../../styles/common';

import TrackerSlide from './TrackerSlide';

import Keyboard from '../../../utils/keyboard';

import {caller} from '../../../utils/lang';

export default class SumTrackerSlide extends TrackerSlide {
  shouldComponentUpdate(props, state) {
    const should = super.shouldComponentUpdate(props, state);
    return should || this.state.added !== state.added;
  }

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
    caller(this.props.onUndo);
  }

  onTap() {
    super.onTap();
    Keyboard.dismiss();
  }

  get bodyControls() {
    const { tracker, responsive } = this.props;
    return (
      <View style={[
        trackerStyles.controls,
        styles.controlsContainer
      ]}>
        <View style={styles.controls}>
          <View style={styles.inputContainer}>
             <TextInput
              ref='added'
              editable={responsive}
              placeholder='Enter value'
              placeholderTextColor={trackerDef.hintText.color}
              style={styles.sumInput}
              onChangeText={added => this._onChangeText(added)}
              value={this.state.added}
              onSubmitEditing={::this._onPlus}
            />
            <TouchableOpacity
              disabled={!responsive}
              onPress={::this._onPlus}>
              <Image
                source={getIcon('plus_sm')}
                style={[trackerStyles.circleBtnSm, styles.circleBtnSm]}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.sumText}>=</Text>
            <Text style={styles.sumText}>
              $ {tracker.value}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  get footerControls() {
    return (
      <Text style={trackerStyles.footerText}>
        Shake to undo
      </Text>
    );
  }

  _onPlus() {
    Keyboard.dismiss();
    const { tracker, onTick } = this.props;
    const added = parseFloat(this.state.added);
    if (added) {
      caller(onTick, added);
      this.setState({added: ''});
    }
  }

  _onChangeText(sumAdded) {
    this.setState({added: sumAdded});
  }
};

const WIDGET_WIDTH = slideWidth - 40;

const FONT_SIZE = isPhone5() ? 32 : 42;

const INPUT_WIDTH = WIDGET_WIDTH - 40;

const styles = StyleSheet.create({
  controlsContainer: {
    flex: 1,
    alignItems: 'flex-start',
    paddingTop: 25,
  },
  controls: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    width: WIDGET_WIDTH,
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#DADADA',
    paddingBottom: 10,
    marginBottom: 10,
  },
  textContainer: {
    width: WIDGET_WIDTH,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sumInput: {
    height: 50,
    width: INPUT_WIDTH,
    paddingRight: 20,
    fontSize: FONT_SIZE,
    color: '#4A4A4A',
    textAlign: 'center',
    fontWeight: '100',
  },
  circleBtnSm: {
    width: 40,
  },
  sumText: {
    fontSize: 35,
    color: '#9B9B9B',
    fontWeight: '200',
  },
});
