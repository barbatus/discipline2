import React, { PureComponent } from 'react';

import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  Animated,
  Switch,
} from 'react-native';

import { reduxForm, Form, Field } from 'redux-form';

import { getIcon } from '../../../../icons/icons';

import { propsStyles } from '../../styles/trackerStyles';

import { TrackerType } from '../../../../depot/consts';

import TrackerIcon from './TrackerIcon';

import TrackerTitle from './TrackerTitle';

const styles = StyleSheet.create({
  deleteText: {
    color: '#FF001F',
  },
  trackTypeText: {
    color: '#C4C4C4',
  },
  deleteRow: {
    marginTop: 50,
  },
});

class TrackerTypeSelect extends PureComponent {
  render() {
    const { meta: { initial }, onTypeSelect } = this.props;
    const typeEnum = TrackerType.fromValue(initial);
    return (
      <TouchableOpacity
        style={propsStyles.colRight}
        onPress={onTypeSelect}
      >
        <Text style={[propsStyles.colText, styles.trackTypeText]}>
          {typeEnum ? typeEnum.title : 'Select'}
        </Text>
        <Image
          source={getIcon('next')}
          style={propsStyles.nextIcon}
        />
      </TouchableOpacity>
    );
  }
}

export class TrackerEditView extends PureComponent {
  static defaultProps = {
    showType: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      sendNotif: false,
    };
  }

  renderDeleteRow() {
    return this.props.allowDelete ? (
      <View style={[propsStyles.group, styles.deleteRow]}>
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
    ) : null;
  }

  render() {
    return (
      <Animated.View style={[propsStyles.innerView, this.props.style]}>
        <View style={propsStyles.headerContainer}>
          <View style={propsStyles.changeIconContainer}>
            <Field
              name="iconId"
              component={TrackerIcon}
            />
          </View>
          <View style={propsStyles.titleContainer}>
            <Field
              name="title"
              component={TrackerTitle}
            />
          </View>
        </View>
        <View style={propsStyles.bodyContainer}>
          {
            this.props.showType ? (
              <View style={propsStyles.row}>
                <View style={propsStyles.colLeft}>
                  <Text style={propsStyles.colText}>
                    Tracker Type
                  </Text>
                </View>
                <Field
                  name="typeId"
                  onTypeSelect={this.props.onTypeSelect}
                  component={TrackerTypeSelect}
                />
              </View>
            ) : null
          }
          <View style={propsStyles.group}>
            <View style={propsStyles.row}>
              <View style={propsStyles.colLeftWide}>
                <Text style={propsStyles.colText}>
                  Send Notifications
                </Text>
              </View>
              <View style={propsStyles.colRight}>
                <Switch
                  onValueChange={(value) => this.setState({ sendNotif: value })}
                  value={this.state.sendNotif}
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

export default reduxForm({
  form: 'trackerForm',
  enableReinitialize: true,
  onSubmit: (tracker) => {
    return tracker;
  },
})(TrackerEditView);
