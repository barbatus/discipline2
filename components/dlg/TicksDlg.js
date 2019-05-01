import React from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import moment from 'moment';
import PropTypes from 'prop-types';

import { getIcon } from 'app/icons/icons';
import { TrackerType } from 'app/depot/consts';
import { caller } from 'app/utils/lang';

import MapsDlg from './MapsDlg';
import CommonModal from './CommonModal';

const TextRow = styled.View`
  padding: 15px;
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
  padding-right: 5px;
`;

const NextImg = styled.Image`
  resize-mode: contain;
  height: 15px;
`;

const ListItem = React.memo(({ item, onPress, showMore }) => {
  const timeStr = moment(item.createdAt).format('LT');
  return (
    <TouchableOpacity disabled={!showMore} onPress={() => caller(onPress, item)}>
      <TextRow>
        <TextCol>
          <TimeText>
            {timeStr}
            {':'}
          </TimeText>
          <Text>{item.desc}</Text>
        </TextCol>
        {
          showMore ? <NextImg source={getIcon('next')} /> : null
        }
      </TextRow>
     </TouchableOpacity>
  );
});

ListItem.propTypes = {
  item: PropTypes.shape({
    createdAt: PropTypes.number,
    desc: PropTypes.string,
  }).isRequired,
  onPress: PropTypes.func,
  showMore: PropTypes.bool,
};

ListItem.defaultProps = {
  onPress: null,
  showMore: false,
};

export default class TicksDlg extends CommonModal {
  constructor(props) {
    super(props);
    this.onItemPress = ::this.onItemPress;
    this.renderItem = ::this.renderItem;
  }

  get content() {
    const { ticks } = this.state;
    return ticks ? (
      <View>
        <FlatList
          data={ticks}
          keyExtractor={(item, index) => index.toString()}
          renderItem={this.renderItem}
        />
        <MapsDlg ref={(el) => (this.mapsDlg = el)} />
      </View>
    ) : null;
  }

  showMap(item) {
    const paths = item.paths.map((path) => (
      path.map(({ lat, lon }) => ({
        latitude: lat,
        longitude: lon,
      }))),
    );
    this.mapsDlg.show(paths);
  }

  onBeforeShown(ticks, trackType) {
    if (ticks) {
      this.setState({
        trackType,
        ticks: ticks.sort((a, b) => b.createdAt - a.createdAt),
      });
    }
  }

  onItemPress(item) {
    const { trackType } = this.state;
    if (trackType === TrackerType.DISTANCE) {
      this.showMap(item);
    }
  }

  renderItem({ item }) {
    const { trackType } = this.state;
    const showMore = trackType === TrackerType.DISTANCE;
    return (
      <ListItem
        item={item}
        onPress={showMore ? this.onItemPress : null}
        showMore={showMore}
      />
    );
  }
}
