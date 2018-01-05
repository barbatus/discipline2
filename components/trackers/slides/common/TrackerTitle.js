import React, { PureComponent } from 'react';

import { Animated, TextInput } from 'react-native';

import PropTypes from 'prop-types';

import ShakeAnimation from '../../../animation/ShakeAnimation';

import { propsStyles, trackerDef } from '../../styles/trackerStyles';

export default class TrackerTitle extends PureComponent {
  static propTypes = {
    input: PropTypes.shape({
      value: PropTypes.string,
      onBlur: PropTypes.func,
      onFocus: PropTypes.func,
      onChange: PropTypes.func,
    }).isRequired,
    meta: PropTypes.shape({
      error: PropTypes.string,
    }).isRequired,
  };

  shakeAnim = new ShakeAnimation();

  error = null;

  constructor(props) {
    super(props);
    this.onChange = ::this.onChange;
  }

  componentDidUpdate() {
    if (this.props.meta.error &&
        this.props.meta.error !== this.error) {
      this.shakeAnim.animate();
    }
    this.error = this.props.meta.error;
  }

  onChange(value) {
    this.props.input.onChange(value);
  }

  render() {
    const { meta } = this.props;
    const hintColor = meta.error ?
      trackerDef.errorText.color : trackerDef.hintText.color;
    return (
      <Animated.View style={this.shakeAnim.style}>
        <TextInput
          placeholder="Add a title"
          placeholderTextColor={hintColor}
          style={propsStyles.titleInput}
          onChangeText={this.onChange}
          value={this.props.input.value}
          onBlur={this.props.input.onBlur}
          onFocus={this.props.input.onFocus}
        />
      </Animated.View>
    );
  }
}
