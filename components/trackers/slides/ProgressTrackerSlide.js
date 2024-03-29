import PropTypes from 'prop-types';

import { caller } from 'app/utils/lang';

import TrackerSlide from './TrackerSlide';

export default class ProgressTrackerSlide extends TrackerSlide {
  static propTypes = {
    onProgress: PropTypes.func,
  };

  onEdit() {
    const { tracker } = this.props;
    if (tracker.active) {
      return;
    }
    super.onEdit();
  }

  onStop(value?: number, data?: any) {
    caller(this.props.onStop, value, data);
  }

  onStart(value: number, data?: any) {
    caller(this.props.onStart, value, data);
  }

  onProgress(value: number, data?: any, progress?: any) {
    const { tracker } = this.props;
    if (tracker.active) {
      caller(this.props.onProgress, value, data, progress);
    }
  }
}
