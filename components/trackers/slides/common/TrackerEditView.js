import React, { PureComponent } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  Switch,
} from 'react-native';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import PropTypes from 'prop-types';

import { propsStyles } from '../../styles/trackerStyles';

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

// BooleanPropFn.propTypes = {
//   input: PropTypes.shape({
//     value: PropTypes.bool,
//   }).isRequired,
// };

const BooleanProp = React.memo(BooleanPropFn);

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

TrackerPropFn.propTypes = {
  prop: PropTypes.shape({
    name: PropTypes.string,
    propId: PropTypes.string,
  }).isRequired,
};

const TrackerProp = React.memo(TrackerPropFn);

export class TrackerEditView extends PureComponent {
  static propTypes = {
    allowDelete: PropTypes.bool,
    allowType: PropTypes.bool,
    onRemove: PropTypes.func,
    onTypeSelect: PropTypes.func,
    props: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        propId: PropTypes.string,
      }),
    ),
    style: PropTypes.arrayOf(PropTypes.object),
  };

  static defaultProps = {
    allowDelete: true,
    allowType: false,
    props: [],
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

export default reduxForm({
  enableReinitialize: true,
  onSubmit: (values) => {
    const tracker = values;
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
