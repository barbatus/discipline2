/* @flow */

import React, { PureComponent } from 'react';

import { Provider } from 'react-redux';

import { StackNavigator as stack } from 'react-navigation';

import MainScreen from '../components/screens/MainScreen';

import DayUpdateEvent from './DayUpdateEvent';

import { changeDay } from '../model/actions';

export default function CreateApp(store) {
  return stack(
    {
      Home: { screen: (props) => <Home {...props} store={store} /> },
    },
    { headerMode: 'none' },
  );
}

class Home extends PureComponent {
  constructor(props: any) {
    super(props);
    this.dayUpdate = new DayUpdateEvent();
  }

  componentDidMount() {
    const { store } = this.props;
    this.dayUpdate.on(() => {
      store.dispatch(changeDay());
    });
  }

  componentWillUnmount() {
    this.dayUpdate.destroy();
  }

  render() {
    const { store, navigation } = this.props;
    return (
      <Provider store={store}>
        <MainScreen
          navigator={navigation}
          onMenu={this.onMenu}
        />
      </Provider>
    );
  }
}
