import React, { PureComponent } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  Animated,
  Switch,
  ViewPropTypes,
} from 'react-native';
import { pure } from 'recompose';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import PropTypes from 'prop-types';

import { getIcon } from 'app/icons/icons';
import { TrackerType } from 'app/depot/consts';
import ShakeAnimation from 'app/components/animation/ShakeAnimation';

import { trackerStyles, propsStyles } from '../../styles/trackerStyles';

import TrackerIcon from './TrackerIcon';
import TrackerTitle from './TrackerTitle';
import TrackerTypeSelect from './TrackerTypeSelect'; 

const styles = StyleSheet.create({
  mainGroup: {
    marginBottom: 50,
  },
});

const BooleanPropFn = ({ input }) => (
  <Switch
    onValueChange={(value) => input.onChange(value)}
    value={!!input.value}
  />
);

const BooleanProp = pure(BooleanPropFn);

const TrackerPropFn = ({ prop }) => (
  <View style={propsStyles.row}>
    <View style={propsStyles.colLeftWide}>
      <Text style={propsStyles.colText}>
        { prop.name }
      </Text>
    </View>
    <View style={propsStyles.colRight}>
      <Field
        name={`props.${prop.propId}`}
        component={BooleanProp}
      />
    </View>
  </View>
);

const TrackerProp = pure(TrackerPropFn);

export class TrackerEditView extends PureComponent {
  static propTypes = {
    allowDelete: PropTypes.bool,
    allowType: PropTypes.bool,
    onRemove: PropTypes.func,
    onTypeSelect: PropTypes.func,
    style: PropTypes.arrayOf(PropTypes.object),
  };

  static defaultProps = {
    allowDelete: true,
    showType: true,
    onTypeSelect: null,
    style: null,
    onRemove: null,
  };

  renderDeleteGroup() {
    return this.props.allowDelete ? (
      <View style={propsStyles.group}>
        <View style={propsStyles.row}>
          <TouchableOpacity
            style={propsStyles.colLeft}
            onPress={this.props.onRemove}
          >
            <Text style={propsStyles.deleteText}>
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    ) : null;
  }

  renderPropsGroup() {
    const { props } = this.props;
    return (
      <View style={[propsStyles.group, styles.mainGroup]}>
        {
          props.map((prop) => (
            <TrackerProp key={prop.propId} prop={prop} />
          ))
        }
      </View>
    );
  }

  renderTypeGroup() {
    return this.props.allowType ? (
      <View style={propsStyles.group}>
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
          {this.renderTypeGroup()}
          {this.renderPropsGroup()}
          {this.renderDeleteGroup()}
        </View>
      </Animated.View>
    );
  }
}

// TODO: some weird issue with onSubmit,
// which is called with same initial values.
let onChange = {};
export default reduxForm({
  enableReinitialize: true,
  onChange: (values) => {
    onChange = values;
  },
  onSubmit: (values) => {
    const tracker = { ...values, ...onChange };
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
      props: {
        ...tracker.props,
        ...values.props,
      },
    };
  },
})(TrackerEditView);
