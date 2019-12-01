import React from 'react';
import { StyleSheet, Switch, View, Text } from 'react-native';
import styled from 'styled-components/native';
import { connect } from 'react-redux';

import { GEO_DEBUG } from 'app/env';
import { changeDay } from 'app/model/actions';
import { noop } from 'app/utils/lang';
import { configureBackgroundGeolocation } from 'app/geo/BGGeoLocationWatcher';
import { notify } from 'app/notifications/alerts';

import { MENU_TEXT_COLOR } from './styles';
import { styles as menuStyles } from './Menu';

export const styles = StyleSheet.create({
  group: {
    marginBottom: 40
  },
});

const Line = styled.View`
  flex-direction: row;
  align-items: center;
  line-height: 12px;
  margin-bottom: 10px;
`;

const Separator = styled.View`
  flex-grow: 1;
  height: 1px;
  border-top-width: 1px;
  border-top-color: rgba(0, 0, 0, 0.3);
`;

const Label = styled.Text`
  flex-grow: 0;
  color: rgba(0, 0, 0, 0.3);
  font-size: 12px;
  font-weight: 300;
  padding: 0 5px;
`;

const Button = styled.TouchableOpacity`
  width: 50px;
  padding: 5px;
  border-radius: 5px;
  border-width: 1px;
  font-weight: 100;
  border-color: ${() => MENU_TEXT_COLOR};
  align-items: center;
`;

const BtnLabel = styled.Text`
  color: ${() => MENU_TEXT_COLOR};
`;

const Debug = React.memo(({ onDayChange }) => {
  const [isGeoDebug, setGeoDebug] = React.useState(GEO_DEBUG);

  const onGeoSwitch = React.useCallback((value: boolean) => {
    configureBackgroundGeolocation(noop, value);
    setGeoDebug(value);
  }, []);

  const onAlerts = React.useCallback(notify, []);

  return (
    <View style={styles.group}>
      <Line>
        <Separator />
        <Label>Debug</Label>
        <Separator />
      </Line>
      <View style={menuStyles.prop}>
        <Text style={menuStyles.label}>
          Geo Debug
        </Text>
        <Switch value={isGeoDebug} onValueChange={onGeoSwitch} />
      </View>
      <View style={menuStyles.prop}>
        <Text style={menuStyles.label}>
          Alerts
        </Text>
        <Button onPress={onAlerts}>
          <BtnLabel>Run</BtnLabel>
        </Button>
      </View>
      <View style={menuStyles.prop}>
        <Text style={menuStyles.label}>
          Day Change
        </Text>
        <Button onPress={onDayChange}>
          <BtnLabel>Run</BtnLabel>
        </Button>
      </View>
    </View>
  );
});

export default connect(null, (dispatch, props) => ({
  onDayChange: () => {
    dispatch(changeDay());
  },
}))(Debug);
