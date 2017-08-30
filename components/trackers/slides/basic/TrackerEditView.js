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
  Animated,
  Switch,
  TouchableWithoutFeedback,
} from 'react-native';

import { getIcon } from '../../../../icons/icons';

import {
  trackerStyles,
  propsStyles,
  trackerDef,
} from '../../styles/trackerStyles';

import { TrackerType } from '../../../../depot/consts';

import registry, { DlgType } from '../../../dlg/registry';

import BaseTrackerView from './BaseTrackerView';

import Trackers from '../../../../model/Trackers';

import { caller } from '../../../../utils/lang';

const styles = StyleSheet.create({
  barContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  changeIconBox: {
    borderWidth: 1,
    borderColor: '#d4d4d4',
    padding: 3,
    paddingRight: 10,
    paddingLeft: 10,
    borderRadius: 15,
  },
  changeIconText: {
    fontSize: 16,
    color: '#c4c4c4',
    fontWeight: '300',
  },
  deleteText: {
    color: '#ff001f',
  },
  trackTypeText: {
    color: '#c4c4c4',
  },
});

export default class TrackerEditView extends BaseTrackerView {
  static defaultProps = {
    showType: true,
    title: '',
  };

  constructor(props) {
    super(props);

    const tracker = props.tracker;
    this.state = {
      tracker,
      sendNotif: false,
      saveGoog: false,
    };
    this.onIconEdit = ::this.onIconEdit;
  }

  componentWillReceiveProps({ tracker }) {
    if (this.props.tracker !== tracker) {
      this.state.tracker = tracker;
    }
  }

  onIconEdit() {
    const dlg = registry.get(DlgType.ICONS);
    dlg.show((iconId) => {
      let tracker = this.state.tracker;
      tracker = Trackers.create(tracker);
      tracker.iconId = iconId;
      this.setState({ tracker }, ::dlg.hide);
      caller(this.props.onTrackerChange, tracker);
    });
  }

  onTitleEdit(title: string) {
    let tracker = this.state.tracker;
    tracker = Trackers.create(tracker);
    tracker.title = title;
    this.setState({ tracker });
    caller(this.props.onTrackerChange, tracker);
  }

  renderDeleteRow() {
    return this.props.allowDelete
      ? <View style={propsStyles.group}>
          <View style={[propsStyles.row]}>
            <TouchableOpacity
              style={propsStyles.colLeft}
              onPress={this.props.onRemove}
            >
              <Text style={[propsStyles.text, styles.deleteText]}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      : null;
  }

  render() {
    const { tracker } = this.state;
    const { typeId, iconId, title } = tracker;
    const typeEnum = TrackerType.fromValue(typeId);
    return (
      <Animated.View style={[propsStyles.innerView, this.props.style]}>
        <View style={propsStyles.headerContainer}>
          <View style={[trackerStyles.barContainer, styles.barContainer]}>
            <TouchableOpacity
              style={styles.changeIconBox}
              onPress={this.onIconEdit}
            >
              <Text style={styles.changeIconText}>Change Icon</Text>
            </TouchableOpacity>
          </View>
          <View style={propsStyles.iconContainer}>
            <Image
              source={this.getMainIcon(iconId)}
              style={trackerStyles.mainIcon}
            />
          </View>
          <View style={propsStyles.titleContainer}>
            <TextInput
              ref="title"
              placeholder="Add a title"
              placeholderTextColor={trackerDef.hintText.color}
              style={propsStyles.titleInput}
              onChangeText={title => this.onTitleEdit(title)}
              value={title}
            />
          </View>
        </View>
        <View style={propsStyles.bodyContainer}>
          {this.props.showType
            ? <View style={propsStyles.row}>
                <View style={propsStyles.colLeft}>
                  <Text style={propsStyles.colText}>Tracker Type</Text>
                </View>
                <TouchableOpacity
                  style={propsStyles.colRight}
                  onPress={this.props.onTypeSelect}
                >
                  <Text style={[propsStyles.colText, styles.trackTypeText]}>
                    {typeEnum ? typeEnum.title : 'Select'}
                  </Text>
                  <Image
                    source={getIcon('next')}
                    style={propsStyles.nextIcon}
                  />
                </TouchableOpacity>
              </View>
            : null}
          <View style={propsStyles.group}>
            <View style={propsStyles.firstGroupRow}>
              <View style={propsStyles.colLeftWide}>
                <Text style={propsStyles.colText}>Send Notifications</Text>
              </View>
              <View style={propsStyles.colRight}>
                <Switch
                  onValueChange={value => this.setState({ sendNotif: value })}
                  value={this.state.sendNotif}
                />
              </View>
            </View>
            <View style={propsStyles.row}>
              <View style={propsStyles.colLeftWide}>
                <Text style={propsStyles.colText}>Save in Google Cal</Text>
              </View>
              <View style={propsStyles.colRight}>
                <Switch
                  onValueChange={value => this.setState({ saveGoog: value })}
                  value={this.state.saveGoog}
                />
              </View>
            </View>
          </View>
          {this.renderDeleteRow()}
        </View>
      </Animated.View>
    );
  }
}
