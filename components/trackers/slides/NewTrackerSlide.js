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

const { trackerStyles } = require('../styles/trackerStyles');

const TrackerEditView = require('./basic/TrackerEditView');

const consts = require('../../../depot/consts');

class NewTrackerSlide extends Component {
  constructor(props) {
    super(props);
  }

  get tracker() {
    let editView = this.refs.editView;
    return {
      title: editView.getTitle(),
      typeId: editView.getTypeId(),
      iconId: editView.getIconId()
    };
  }

  reset() {
    this.refs.editView.reset();
  }

  render() {
    return (
      <View style={trackerStyles.slide}>
        <View style={trackerStyles.container}>
          <TrackerEditView
            ref='editView'
            typeId={this.props.typeId}
            onIconEdit={this.props.onIconEdit}
            onTypeChange={this.props.onTypeChange}
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

module.exports = NewTrackerSlide;
