'use strict';

const React = require('react-native');
const {
  View,
  Image,
  Text,
  TextInput,
  StyleSheet,
  Animated,
  Component
} = React;

const {
  trackerStyles
} = require('./trackerStyles');

const TrackerEditView = require('./TrackerEditView');

const consts = require('../../depot/consts');

class NewTrackerCell extends Component {
  constructor(props) {
    super(props);
  }

  get tracker() {
    return {
      title: 'test',
      type: consts.COUNTER,
      iconId: 'sneakers'
    };
  }

  render() {
    return (
      <View style={trackerStyles.cell}>
        <View style={trackerStyles.container}>
          <TrackerEditView
            ref='editView'
            trackerType={this.props.trackerType}
            onIconEdit={this.props.onIconEdit}
            onTypeClick={this.props.onTypeClick}
            style={styles.editView} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  editView: {
    opacity: 1,
    transform: [{rotateY: '0deg'}]
  }
});

module.exports = NewTrackerCell;
