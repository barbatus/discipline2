import React, { PureComponent } from 'react';

import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Image,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
} from 'react-native';

import styled from 'styled-components/native';

import { first, last } from 'lodash';

import { getIcon } from '../../../icons/icons';

import { slideStyles, slideDef } from '../styles/slideStyles';

import { commonStyles } from '../../styles/common';

import { TrackerType } from '../../../depot/consts';

import { caller } from '../../../utils/lang';

const clean = (str) => {
  check.assert.string(str);
  return str.replace(/\n/g, '').replace(/\s+/g, ' ');
};

const TYPES = TrackerType.symbols();

const styleDef = {
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
};

const styles = StyleSheet.create({
  headerContainer: {
    ...styleDef.centered,
    flex: 0.15,
    justifyContent: 'flex-start',
  },
  bodyContainer: {
    ...styleDef.centered,
    flex: 0.65,
    borderBottomColor: 'rgba(185, 185, 185, 0.4)',
    borderBottomWidth: 1,
  },
  footerContainer: {
    flex: 0.2,
  },
  title: {
    fontSize: 28,
    color: '#4A4A4A',
    paddingTop: 20,
    fontWeight: '200',
  },
  desc: {
    fontSize: 18,
    lineHeight: 25,
    color: '#9B9B9B',
    textAlign: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
  types: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    ...slideDef.borderRadius,
    ...slideDef.borderBottomRadius,
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
    fontSize: 12,
  },
  typeIcon: {
    resizeMode: 'contain',
    height: 40,
  },
  selectedBorder: {
    borderColor: '#E6E6E6',
  },
});

const TypeView = styled.View`
  width: 75px;
  flex-direction: column;
  shadow-color: rgba(185, 185, 185, 0.4);
  shadow-opacity: 1;
  shadow-radius: 0;
  shadow-offset: 0px -1px;
  border-top-width: 4px;
  border-top-color: ${({ isSelected }) =>
    isSelected ? '#1A7CF9' : 'transparent'};
  background-color: ${({ isSelected }) =>
    isSelected ? '#E6E6E6' : 'transparent'};
`;

export default class TrackerTypesSlide extends PureComponent {
  static propTypes = {
    typeId: React.PropTypes.string.isRequired,
    onTypeChosen: React.PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      type: TrackerType.fromValue(props.typeId),
    };
  }

  componentWillReceiveProps(props) {
    if (this.props.typeId !== props.typeId) {
      this.state.type = TrackerType.fromValue(props.typeId);
    }
  }

  onTypeChosen(type) {
    this.setState({ type });
    caller(this.props.onTypeChosen, type.valueOf());
  }

  renderTypes() {
    const selected = this.state.type;
    const lastType = last(TYPES);
    const firstType = first(TYPES);

    const types = TYPES.map((type) => {
      return (
        <TouchableWithoutFeedback
          key={type.valueOf()}
          onPress={this.onTypeChosen.bind(this, type)}
        >
          <TypeView isSelected={selected === type}>
            <View style={styles.typeIconContainer}>
              <Image source={getIcon(type.valueOf())} style={styles.typeIcon} />
            </View>
            <View style={styles.typeTitleContainer}>
              <Text style={styles.typeTitle}>
                {type.title}
              </Text>
            </View>
          </TypeView>
        </TouchableWithoutFeedback>
      );
    });

    const borderColor = (selected === lastType || selected === firstType) ?
      styles.selectedBorder : null;
    return (
      <ScrollView
        style={[styles.types, borderColor]}
        horizontal
        pagingEnabled={false}
        bounces={false}
      >
        {types}
      </ScrollView>
    );
  }

  render() {
    const { style } = this.props;
    const { type } = this.state;

    const title = type ? type.title : '';
    const desc = type ? type.desc : '';
    return (
      <View style={[slideStyles.slide, style]}>
        <View style={slideStyles.innerView}>
          <View style={[slideStyles.headerContainer, styles.headerContainer]}>
            <Text style={styles.title}>
              {title}
            </Text>
          </View>
          <View style={[slideStyles.bodyContainer, styles.bodyContainer]}>
            <Text style={styles.desc}>
              {clean(desc)}
            </Text>
          </View>
          <View style={[slideStyles.footerContainer, styles.footerContainer]}>
            {this.renderTypes()}
          </View>
        </View>
      </View>
    );
  }
}
