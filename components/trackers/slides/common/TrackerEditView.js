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

import PropTypes from 'prop-types';

import { reduxForm, Field, SubmissionError } from 'redux-form';

import { getIcon } from 'app/icons/icons';

import { TrackerType } from 'app/depot/consts';

import ShakeAnimation from 'app/components/animation/ShakeAnimation';

import { trackerStyles, propsStyles } from '../../styles/trackerStyles';

import TrackerIcon from './TrackerIcon';

import TrackerTitle from './TrackerTitle';

const styles = StyleSheet.create({
  deleteRow: {
    marginTop: 50,
  },
});

class TrackerTypeSelect extends PureComponent {
  static propTypes = {
    meta: PropTypes.shape({
      error: PropTypes.string,
    }).isRequired,
    onTypeSelect: PropTypes.func.isRequired,
  };

  componentDidUpdate() {
    if (this.props.meta.error &&
        this.props.meta.error !== this.error) {
      this.shakeAnim.animate();
    }
    this.error = this.props.meta.error;
  }

  shakeAnim = new ShakeAnimation();

  error = null;

  render() {
    const { meta: { initial, error }, onTypeSelect } = this.props;
    const typeEnum = TrackerType.fromValue(initial);
    const errorText = error ? trackerStyles.errorText : null;
    return (
      <TouchableOpacity
        style={propsStyles.colRight}
        onPress={onTypeSelect}
      >
        <Animated.View style={this.shakeAnim.style}>
          <Text style={[propsStyles.colHintText, errorText]}>
            {typeEnum ? typeEnum.title : 'Select'}
          </Text>
        </Animated.View>
        <Image
          source={getIcon('next')}
          style={propsStyles.nextIcon}
        />
      </TouchableOpacity>
    );
  }
}

export class TrackerEditView extends PureComponent {
  static propTypes = {
    allowDelete: PropTypes.bool,
    showType: PropTypes.bool,
    onRemove: PropTypes.func,
    onTypeSelect: PropTypes.func,
    // TODO: check animated styles
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
  };

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
            <Text style={[propsStyles.deleteText]}>
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
    if (!tracker.iconId && !tracker.title) {
      throw new SubmissionError({
        title: 'Either title or icon should be defined',
      });
    }
    if (!tracker.typeId) {
      throw new SubmissionError({
        typeId: 'Type should be defined',
      });
    }
    return {
      ...tracker,
      props: { ...tracker.props, alerts: false },
    };
  },
})(TrackerEditView);
