import React, { PureComponent } from 'react';

import { Animated, TextInput } from 'react-native';

import ShakeAnimation from '../../../animation/ShakeAnimation';

import { propsStyles, trackerDef } from '../../styles/trackerStyles';

export default class TrackerTitle extends PureComponent {
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
    const { input } = this.props;
    input.onChange(value);
  }

  render() {
    const { input, meta: { error } } = this.props;
    const hintColor = error ?
      trackerDef.errorText.color : trackerDef.hintText.color;
    return (
      <Animated.View style={this.shakeAnim.style}>
        <TextInput
          placeholder="Add a title"
          placeholderTextColor={hintColor}
          style={propsStyles.titleInput}
          onChangeText={this.onChange}
          value={input.value}
          onBlur={input.onBlur}
          onFocus={input.onFocus}
        />
      </Animated.View>
    );
  }
}
