import React from 'react';
import { FlatList, Text } from 'react-native';
import styled from 'styled-components/native';
import moment from 'moment';
import PropTypes from 'prop-types';

import { getIcon } from 'app/icons/icons';
import { combineTicksDaily } from 'app/model/utils';

import CommonModal from './CommonModal';

const TextRow = styled.View`
  padding: 10px;
  flex-direction: row;
  border-color: rgba(0, 0, 0, 0.1);
  border-bottom-width: 1px;
  justify-content: space-between;
  align-items: center;
`;

const TextCol = styled.View`
  flex-direction: row;
`;

const TimeText = styled.Text`
  padding-right: 10px;
`;

const NextImg = styled.Image`
  resize-mode: contain;
  height: 15px;
`;

const listItemFn = ({ item }) => {
  const timeStr = moment(item.dateTimeMs).format('LT');
  return (
    <TextRow>
      <TextCol>
        <TimeText>{timeStr}</TimeText>
        <Text>{item.desc}</Text>;
      </TextCol>
      <NextImg source={getIcon('next')} />
    </TextRow>
  );
};

listItemFn.propTypes = {
  item: PropTypes.shape({
    dateTimeMs: PropTypes.number,
    desc: PropTypes.string,
  }).isRequired,
};

export default class TicksDlg extends CommonModal {
  get content() {
    const { items } = this.state;
    return items ?
      <FlatList
        data={items}
        keyExtractor={(item, index) => `${index}`}
        renderItem={listItemFn}
      /> : null;
  }

  onBeforeShown(ticks, trackType) {
    const dailyMap = combineTicksDaily(ticks, trackType);
    this.setState({ items: Object.values(dailyMap) });
  }
}
