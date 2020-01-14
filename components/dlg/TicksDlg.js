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
  flex-wrap: wrap;
  alignItems: center;
  width: 90%;
`;

const NextImg = styled.Image`
  resize-mode: contain;
  height: 15px;
`;

const ListTick = React.memo(({ tick, onPress, showMore }) => {
  return (
    <TouchableOpacity disabled={!showMore} onPress={() => caller(onPress, tick)}>
      <TextRow>
        <TextCol>
          {tick.html}
        </TextCol>
        {
          showMore ? <NextImg source={getIcon('next')} /> : null
        }
      </TextRow>
     </TouchableOpacity>
  );
});

ListTick.propTypes = {
  tick: PropTypes.shape({
    createdAt: PropTypes.number.isRequired,
    html: PropTypes.object.isRequired,
    timeDesc: PropTypes.string.isRequired,
  }).isRequired,
  onPress: PropTypes.func,
  showMore: PropTypes.bool,
};

ListTick.defaultProps = {
  onPress: null,
  showMore: false,
};

export default class TicksDlg extends CommonModal {
  mapsDlg = React.createRef();

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
        <MapsDlg ref={this.mapsDlg} />
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
    this.mapsDlg.current.show(paths);
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
      <ListTick
        tick={item}
        onPress={showMore ? this.onItemPress : null}
        showMore={showMore}
      />
    );
  }
}
