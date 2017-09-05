import React, { PureComponent } from 'react';

import { TextInput } from 'react-native';

import { propsStyles, trackerDef } from '../../styles/trackerStyles';

export default class TrackerTitle extends PureComponent {
  constructor(props) {
    super(props);
    this.onChange = ::this.onChange;
  }

  onChange(value) {
    const { input } = this.props;
    input.onChange(value);
  }

  render() {
    const { input } = this.props;
    return (
      <TextInput
        placeholder="Add a title"
        placeholderTextColor={trackerDef.hintText.color}
        style={propsStyles.titleInput}
        onChangeText={this.onChange}
        value={input.value}
        onBlur={input.onBlur}
        onFocus={input.onFocus}
      />
    );
  }
}
