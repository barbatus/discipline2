import React, { PureComponent } from 'react';
import {
  Animated,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';

import { getIcon } from 'app/icons/icons';
import { TrackerType } from 'app/depot/consts';
import ShakeAnimation from 'app/components/animation/ShakeAnimation';

import { trackerStyles, propsStyles } from '../../styles/trackerStyles';

export default class TrackerTypeSelect extends PureComponent {
  static propTypes = {
    meta: PropTypes.shape({
      error: PropTypes.string,
    }).isRequired,
    onTypeSelect: PropTypes.func.isRequired,
  };

  shakeAnim = new ShakeAnimation();
  error = null;

  componentDidUpdate() {
    if (this.props.meta.error &&
        this.props.meta.error !== this.error) {
      this.shakeAnim.animate();
    }
    this.error = this.props.meta.error;
  }

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
