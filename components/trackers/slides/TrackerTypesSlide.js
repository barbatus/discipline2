/* eslint react/no-multi-comp: 0 */
import check from 'check-types';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  TouchableWithoutFeedback,
  View,
  Image,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { ViewPropTypes } from 'deprecated-react-native-prop-types';
import styled from 'styled-components/native';
import first from 'lodash/first';
import last from 'lodash/last';

import { getTrackerIcon } from 'app/icons/icons';
import { TrackerType } from 'app/depot/consts';
import { caller } from 'app/utils/lang';

import { LINK_COLOR, MAIN_TEXT } from 'app/components/styles';

import { BACK_COLOR } from '../styles/trackerStyles';
import { slideStyles, slideDef } from '../styles/slideStyles';

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
    paddingLeft: 10,
    paddingRight: 10,
    flex: 0.65,
    borderBottomColor: 'rgba(185, 185, 185, 0.4)',
    borderBottomWidth: 1,
  },
  footerContainer: {
    flex: 0.2,
  },
  title: {
    fontSize: 28,
    color: MAIN_TEXT,
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
    backgroundColor: BACK_COLOR,
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
  display: flex;
  flex-direction: column;
  shadow-color: rgba(185, 185, 185, 0.4);
  shadow-opacity: 1;
  shadow-radius: 0;
  shadow-offset: 0px -1px;
  border-top-width: 4px;
  border-top-color: ${({ isSelected }) => isSelected ? LINK_COLOR : BACK_COLOR};
  background-color: ${({ isSelected }) => isSelected ? '#E6E6E6' : BACK_COLOR};
`;

const SlideType = React.memo(({ type, selected, onTypeChosen }) => (
  <TouchableWithoutFeedback onPress={() => onTypeChosen(type)}>
    <TypeView isSelected={selected}>
      <View style={styles.typeIconContainer}>
        <Image source={getTrackerIcon(type.valueOf())} style={styles.typeIcon} />
      </View>
      <View style={styles.typeTitleContainer}>
        <Text style={styles.typeTitle}>
          {type.title}
        </Text>
      </View>
    </TypeView>
  </TouchableWithoutFeedback>
));

SlideType.propTypes = {
  type: PropTypes.object.isRequired,
  selected: PropTypes.bool.isRequired,
  onTypeChosen: PropTypes.func.isRequired,
};

export default class TrackerTypesSlide extends PureComponent {
  static propTypes = {
    typeId: PropTypes.string.isRequired,
    onTypeChosen: PropTypes.func,
    style: ViewPropTypes.style,
  };

  static defaultProps = {
    onTypeChosen: null,
    style: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      type: TrackerType.fromValue(props.typeId),
    };
    this.onTypeChosen = ::this.onTypeChosen;
  }

  static getDerivedStateFromProps({ typeId }, prevState) {
    if (typeId !== prevState.typeId) {
      return { type: TrackerType.fromValue(typeId) };
    }
    return null;
  }

  onTypeChosen(type) {
    this.setState({ type });
    caller(this.props.onTypeChosen, type.valueOf());
  }

  renderTypes() {
    const selected = this.state.type;
    const lastType = last(TYPES);
    const firstType = first(TYPES);

    const types = TYPES.map((type) => (
      <SlideType
        key={type.valueOf()}
        type={type}
        selected={selected === type}
        onTypeChosen={this.onTypeChosen}
      />
    ));

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
