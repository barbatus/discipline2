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

const { TrackerType } = require('../../depot/consts');

const TrackerEditView = React.createClass({
  getInitialState() {
    return {
      sendNotif: false,
      saveGoog: false
    };
  },

  getDefaultProps() {
    return {
      showType: true
    }
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
    let typeEnum = TrackerType.fromValue(this.props.trackerType);

    return (
      <Animated.View style={[propsStyles.innerView, this.props.style]}>
        <View style={propsStyles.headerContainer}>
          <View style={[trackerStyles.barContainer, styles.barContainer]}>
            <TouchableOpacity
              style={styles.textBox}
              onPress={this.props.onIconEdit}>
              <Text style={styles.text}>
                Change Icon
              </Text>
            </TouchableOpacity>
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
          {
            this.props.showType ? (
              <View style={propsStyles.row}>
                <View style={propsStyles.colLeft}>
                  <Text style={propsStyles.colText}>
                    Tracker Type
                  </Text>
                </View>
                <TouchableOpacity
                    style={propsStyles.colRight}
                    onPress={this.props.onTypeClick}>
                  <Text style={[propsStyles.colText, styles.trackTypeText]}>
                    {typeEnum ? typeEnum.title : 'Select'}
                  </Text>
                  <Image source={getIcon('next')}
                    style={propsStyles.nextIcon} />
                </TouchableOpacity>
              </View>
            ) : null
          }
          <View style={propsStyles.group}>
            <View style={propsStyles.firstGroupRow}>
              <View style={propsStyles.colLeftWide}>
                <Text style={propsStyles.colText}>
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
              <View style={propsStyles.colLeftWide}>
                <Text style={propsStyles.colText}>
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
    paddingRight: 10,
    paddingLeft: 10,
    borderRadius: 15
  },
  text: {
    fontSize: 16,
    color: '#C4C4C4',
    fontWeight: '300'
  },
  inputTitle: {
    fontSize: 27
  },
  deleteText: {
    color: '#FF001F'
  },
  trackTypeText: {
    color: '#C4C4C4'
  }
});

module.exports = TrackerEditView;
