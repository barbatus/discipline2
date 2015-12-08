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

const UserIconsStore = require('../../icons/UserIconsStore');

const IconsDlg = require('../screens/IconsDlg');

const TrackerEditView = React.createClass({
  getInitialState() {
    let opacity = this.props.shown ? 1 : 0; 
    return {
      opacity: new Animated.Value(opacity),
      title: this.props.title,
      iconId: this.props.iconId,
      sendNotif: false,
      saveGoog: false
    };
  },

  getDefaultProps() {
    return {
      showType: true
    }
  },

  reset() {
    this.refs.title.blur();
    this.setState({
      iconId: this.props.iconId,
      title: this.props.title
    });
  },

  toggleView() {
    this.refs.title.blur();
    this.state.opacity.setValue(
      this.state.opacity._value ? 0 : 1);
  },

  getIconId() {
    return this.state.iconId;
  },

  getTypeId() {
    return this.props.typeId;
  },

  getTitle() {
    return this.state.title;
  },

  _onIconEdit() {
    this.refs.iconDlg.show();
  },

  _onIconChosen(iconId) {
    this.setState({
      iconId: iconId
    }, () => {
      this.refs.iconDlg.hide();
    });
  },

  _getMainIcon(iconId) {
    let userIcon = UserIconsStore.get(iconId);
    if (userIcon) {
      return userIcon.pngLarge;
    }
    return getIcon('oval');
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
    let typeEnum = TrackerType.fromValue(this.props.typeId);

    return (
      <Animated.View style={[
          propsStyles.innerView,
          {opacity: this.state.opacity},
          this.props.style
        ]}>
        <View style={propsStyles.headerContainer}>
          <View style={[trackerStyles.barContainer, styles.barContainer]}>
            <TouchableOpacity
              style={styles.textBox}
              onPress={this._onIconEdit}>
              <Text style={styles.text}>
                Change Icon
              </Text>
            </TouchableOpacity>
          </View>
          <View style={propsStyles.iconContainer}>
            <Image
              source={this._getMainIcon(this.state.iconId)}
              style={trackerStyles.mainIcon}
            />
          </View>
          <View style={propsStyles.textContainer}>
            <TextInput
              ref='title'
              placeholder='Add a title'
              style={[propsStyles.inputTitle, styles.inputTitle]}
              onChangeText={title => this.setState({title})}
              value={this.state.title}
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
                    onPress={this.props.onTypeChange}>
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

        <IconsDlg
          ref='iconDlg' 
          onIconChosen={this._onIconChosen} />
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
