/* eslint react/no-multi-comp: 0 */

import React, { PureComponent } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  Switch,
} from 'react-native';
import { connect } from 'react-redux'
import { Field, reduxForm, SubmissionError, formValueSelector } from 'redux-form';
import PropTypes from 'prop-types';

import { propsStyles } from '../../styles/trackerStyles';

import TrackerIcon from './TrackerIcon';
import TrackerTitle from './TrackerTitle';
import TrackerTypeSelect from './TrackerTypeSelect';
import FreqProp from './FreqProp';

const styles = StyleSheet.create({
  mainGroup: {
    marginBottom: 50,
  },
});

const BooleanProp = React.memo(({ input }) => (
  <Switch
    onValueChange={(value) => input.onChange(value)}
    value={!!input.value}
  />
));

BooleanProp.propTypes = {
  input: PropTypes.shape({
    value: (props, propName) => {
      if (typeof props[propName] === 'boolean' || props[propName] === '') {
        return null;
      }
      return new Error('Invalid property input.value: ' + propName);
    },
  }).isRequired,
};

const PropToC = {
  alerts: BooleanProp,
  showSpeed: BooleanProp,
  showBuck: BooleanProp,
  freq: FreqProp,
};

const TrackerPropFn = ({ prop, onChange }) => {
  const onChange_ = React.useCallback((event, newVal) => {
    onChange(newVal, prop.propId);
  }, [onChange, prop]);
  return (
    <View style={propsStyles.row}>
      <View style={[propsStyles.colLeftWide, propsStyles[`leftCol${prop.propId}`]]}>
        <Text style={propsStyles.colText}>
          { prop.name }
        </Text>
      </View>
      <View style={propsStyles.colRight}>
        <Field
          name={`props.${prop.propId}`}
          component={PropToC[prop.propId]}
          onChange={onChange_}
        />
      </View>
    </View>
  );
};

TrackerPropFn.propTypes = {
  prop: PropTypes.shape({
    name: PropTypes.string,
    propId: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func,
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
    alerts: PropTypes.bool,
  };

  static defaultProps = {
    allowDelete: true,
    allowType: false,
    props: [],
    onTypeSelect: null,
    style: null,
    onRemove: null,
  };

  constructor(props) {
    super(props);
    this.onChange = ::this.onChange;
  }

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
    const { props, alerts } = this.props;
    const renderProps = props.filter((prop) => prop.propId == 'freq' ? alerts : true);
    return (
      <View style={[propsStyles.group, styles.mainGroup]}>
        {
          renderProps.map((prop) => (
            <TrackerProp key={prop.propId} prop={prop} onChange={this.onChange} />
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
            <Text numberOfLines={1} style={propsStyles.colText}>
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

  onChange(newValue, name) {
    this.setState({
      [name]: newValue,
    });
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

export default connect((state, props) => {
  const selector = formValueSelector(props.form);
  return {
    alerts: selector(state, 'props.alerts')
  };
})(reduxForm({
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
    if (tracker.props.alerts && !tracker.title) {
      throw new SubmissionError({
        title: 'Title should be defined when alerts are on',
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
})(TrackerEditView));
