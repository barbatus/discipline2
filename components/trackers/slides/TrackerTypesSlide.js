'use strict';

import React, {Component} from 'react';

import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Image,
  Text,
  TextInput,
  StyleSheet,
  ScrollView
} from 'react-native';

import {slideStyles, slideDef} from '../styles/slideStyles';

import {commonStyles} from '../../styles/common';

import {TrackerType} from '../../../depot/consts';

const clean = str => {
  check.assert.string(str);

  return str.replace(/\n/g, '').replace(/\s+/g, ' ');
}

export default class TrackerTypesSlide extends Component {
  constructor(props) {
    super(props);

    this.state = {
      type: this.types[0]
    };
  }

  get types() {
    return TrackerType.symbols();
  }

  reset() {
    this.setState({
      type: this.types[0]
    });
  }

  get typeId() {
    return this.state.type.valueOf();
  }

  _onTypeChosen(type) {
    this.setState({ type });
  }

  _renderTypes() {
    let selected = this.state.type;
    let last = _.last(this.types);
    let first = _.first(this.types);

    let types = this.types.map(type => {
      return (
        <TouchableWithoutFeedback
          key={type.valueOf()}
          onPress={this._onTypeChosen.bind(this, type)}>
          <View
            style={selected === type ?
              [styles.type, styles.selected] : styles.type}>
              <View style={styles.typeIconContainer}>
                <Image source={getIcon(type.valueOf())}
                  style={styles.typeIcon} />
              </View>
              <View style={styles.typeTitleContainer}>
                <Text style={styles.typeTitle}>
                  {type.title}
                </Text>
              </View>
          </View>
        </TouchableWithoutFeedback>
      );
    });

    let borderColor = (selected == last || selected == first) ?
      styles.selectedBorder : null;
    return (
      <ScrollView
        style={[styles.types, borderColor]}
        horizontal={true}
        pagingEnabled={false}
        bounces={false}>
        {types}
      </ScrollView>
    );
  }

  render() {
    return (
      <View style={slideStyles.slide}>
        <View style={slideStyles.innerView}>
          <View style={[
              slideStyles.headerContainer,
              styles.headerContainer
            ]}>
            <Text style={styles.title}>
              {this.state.type.title}
            </Text>
          </View>
          <View style={[
              slideStyles.bodyContainer,
              styles.bodyContainer
            ]}>
            <Text style={styles.desc}>
              {clean(this.state.type.desc)}
            </Text>
          </View>
          <View style={[
              slideStyles.footerContainer,
              styles.footerContainer
            ]}>
            {
              this._renderTypes()
            }
          </View>
        </View>
      </View>
    );
  }
}

const styleDef = {
  centered: {
    justifyContent: 'center',
    alignItems: 'center'
  }
};

const styles = StyleSheet.create({
  headerContainer: {
    ...styleDef.centered,
    flex: 0.3,
    justifyContent: 'flex-start'
  },
  bodyContainer: {
    ...styleDef.centered,
    justifyContent: 'flex-start'
  },
  footerContainer: {
    flex: 0.20
  },
  title: {
    fontSize: 28,
    color: '#4A4A4A',
    paddingTop: 20,
    fontWeight: '200'
  },
  desc: {
    fontSize: 17,
    color: '#9B9B9B',
    textAlign: 'center',
    paddingLeft: 10,
    paddingRight: 10
  },
  types: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    ...slideDef.borderRadius,
    ...slideDef.borderBottomRadius,
    borderWidth: 1,
    borderColor: '#F5F5F5'
  },
  type: {
    width: 80,
    borderTopWidth: 4,
    borderTopColor: 'transparent',
    flexDirection: 'column',
    shadowColor: 'rgba(185, 185, 185, 0.4)',
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: {
      height: -1,
      width: 0
    }
  },
  typeIconContainer: {
    ...styleDef.centered,
    flex: 0.75,
  },
  typeTitleContainer: {
    ...styleDef.centered,
    justifyContent: 'flex-start',
    flex: 0.25,
  },
  typeTitle: {
    fontSize: 12
  },
  typeIcon: {
    resizeMode: 'contain',
    height: 40
  },
  selected: {
    borderTopWidth: 4,
    borderTopColor: '#1A7CF9',
    backgroundColor: '#E6E6E6'
  },
  selectedBorder: {
    borderColor: '#E6E6E6'
  }
});
