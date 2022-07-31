import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';

import { getIcon } from 'app/icons/icons';
import { FreqType } from 'app/depot/consts';

import { propsStyles } from '../../styles/trackerStyles';

const styles = StyleSheet.create({
  circleBtn: {
    resizeMode: 'contain',
    backgroundColor: 'white',
    height: 30,
    width: 30,
  },
  controls: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  countText: {
    width: 40,
    fontSize: 18,
    fontWeight: '200',
    textAlign: 'center',
  },
  perText: {
    paddingLeft: 10,
    paddingRight: 10,
  },
});

const BtnGroupContainer = styled.View`
  flex: 1;
  height: 30px;
  flex-direction: row;
  align-items: center;
  border-color: 'rgba(0, 0, 0, 0.1)';
  border-width: 1px;
  border-radius: 5px;
`;

const BtnInGroup = styled.TouchableOpacity`
  flex: 1;
  display: flex;
  borderRightWidth: 0.25px;
  borderColor: 'rgba(0, 0, 0, 0.1)';
  alignSelf: stretch;
  justifyContent: center;
  background-color: ${({ isSelected }) => isSelected ? '#F5F5F5' : 'transparent'};
`;

const BtnText = styled.Text`
  text-align: center;
  font-size: 14px;
`;

const BtnGroup = React.memo(({ style, value, onChange }) => {
  const enumVal = FreqType.fromValue(value);
  return (
    <BtnGroupContainer style={style}>
      <BtnInGroup
        isSelected={enumVal === FreqType.DAILY}
        onPress={() => onChange(FreqType.DAILY.valueOf())}
      >
        <BtnText style={[styles.btnText]}>Day</BtnText>
      </BtnInGroup>
      <BtnInGroup
        isSelected={enumVal === FreqType.WEEKLY}
        onPress={() => onChange(FreqType.WEEKLY.valueOf())}
      >
        <BtnText style={[styles.btnText]}>Week</BtnText>
      </BtnInGroup>
      <BtnInGroup
        isSelected={enumVal === FreqType.MONTHLY}
        onPress={() => onChange(FreqType.MONTHLY.valueOf())}
      >
        <BtnText style={[styles.btnText]}>Month</BtnText>
      </BtnInGroup>
    </BtnGroupContainer>
  );
});

const FreqPropFn = React.memo(({ input }) => {
  const [_, c, p] = /^(\d+)(d|w|m)$/.exec(input.value || '2d');
  const [count, setCount] = React.useState(parseInt(c));
  const [period, setPeriod] = React.useState(p);
  const onInc = React.useCallback(() => {
    if (count < 7) {
      setCount(count + 1);
    }
  }, [count]);
  const onDec = React.useCallback(() => {
    if (count > 1) {
      setCount(count - 1);
    }
  }, [count]);
  const onPeriod = React.useCallback((value) => {
    setPeriod(value);
  }, []);

  React.useEffect(() => input.onChange(count + period), [input, count, period]);
  return (
    <View style={styles.controls}>
      <TouchableOpacity onPress={onDec}>
        <Image source={getIcon('minus')} style={styles.circleBtn} />
      </TouchableOpacity>
      <Text style={styles.countText} numberOfLines={1}>
        {count}
      </Text>
      <TouchableOpacity onPress={onInc}>
        <Image source={getIcon('plus')} style={styles.circleBtn} />
      </TouchableOpacity>
      <Text style={styles.perText}>per</Text>
      <BtnGroup value={period} onChange={onPeriod} />
    </View>
  );
});

FreqPropFn.propTypes = {
  input: PropTypes.shape({
    value: (props, propName) => {
      if (/^(\d+)(d|w|m)$/.test(props[propName])) {
        return null;
      }
      return new Error('Invalid property input.value ' + propName);
    },
  }).isRequired,
};

export default React.memo(FreqPropFn);
