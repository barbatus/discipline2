'use strict';

const React = require('react-native');
const {
  View,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  Text,
  TextInput,
  StyleSheet,
  Animated,
  SwitchIOS
} = React;

const {
  trackerStyles,
  propsStyles
} = require('./trackerStyles');

const TrackerEditView = React.createClass({
  getInitialState() {
    return {
      sendNotif: false,
      saveGoog: false
    };
  },

  _getMainIcon() {
    return this.props.icon ?
      this.props.icon : getIcon('oval');
  },

  _renderDeleteRow() {
    return this.props.delete ? (
      <View style={propsStyles.group}>
        <View style={[propsStyles.row]}>
          <View style={propsStyles.colLeft}>
            <Text style={[propsStyles.text, styles.deleteText]}>
              Delete
            </Text>
          </View>
        </View>
      </View>
    ) : null;
  },

  render() {
    return (
      <Animated.View style={[propsStyles.innerView, this.props.style]}>
        <View style={propsStyles.headerContainer}>
          <View style={[trackerStyles.barContainer, styles.barContainer]}>
            <View style={styles.textBox}>
              <Text style={styles.text}>
                Choose an Icon
              </Text>
            </View>
          </View>
          <View style={propsStyles.iconContainer}>
            <Image
              source={this._getMainIcon()}
              style={trackerStyles.mainIcon}
            />
          </View>
          <View style={propsStyles.textContainer}>
            <TextInput
              placeholder='Add a title'
              style={[propsStyles.inputTitle, styles.inputTitle]}
              defaultValue={this.props.title}
            />
          </View>
        </View>
        <View style={propsStyles.bodyContainer}>
          <View style={propsStyles.row}>
            <View style={propsStyles.colLeft}>
              <Text style={propsStyles.text}>
                Tracker Type
              </Text>
            </View>
            <View style={propsStyles.colRight}>
              <Text style={propsStyles.text}>
                Goal >
              </Text>
            </View>
          </View>
          <View style={propsStyles.group}>
            <View style={propsStyles.firstGroupRow}>
              <View style={propsStyles.colLeft}>
                <Text style={propsStyles.text}>
                  Send Notifications
                </Text>
              </View>
              <View style={propsStyles.colRight}>
                <SwitchIOS
                  onValueChange={value => this.setState({sendNotif: value})}
                  value={this.state.sendNotif} />
              </View>
            </View>
            <View style={propsStyles.row}>
              <View style={propsStyles.colLeft}>
                <Text style={propsStyles.text}>
                  Save in Google Cal
                </Text>
              </View>
              <View style={propsStyles.colRight}>
                <SwitchIOS 
                  onValueChange={value => this.setState({saveGoog: value})}
                  value={this.state.saveGoog} />
              </View>
            </View>
          </View>
          {this._renderDeleteRow()}
        </View>
      </Animated.View>
    );
  }
});

 const styles = StyleSheet.create({
  barContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  textBox: {
    borderWidth: 1,
    borderColor: '#D4D4D4',
    padding: 3,
    paddingRight: 7,
    paddingLeft: 7,
    borderRadius: 13,
  },
  text: {
    fontSize: 16,
    color: '#C4C4C4'
  },
  inputTitle: {
    fontSize: 27
  },
  deleteText: {
    color: '#FF001F'
  }
 });

module.exports = TrackerEditView;
