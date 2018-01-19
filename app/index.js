import React, { Component } from 'react';
import { Provider } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import store from './config/store';
import IntroNav from './config/routes';
import Backendless from 'backendless';
import { AlertProvider } from './components/alert';

EStyleSheet.build({
  // Background Primary
  $backgroundPrimary: '#2c2929',
  $backgroundLight: '#f2f2f2',
  // Background Secondary
  $rowColor: '#313131',
  $rowColorLight: '#fff',
  // Accents
  $red: '#ef5350',
  $blue: '#40c4ff',
  // Text
  $black: '#000',
  $white: '#fff',
  // Gradients
  $redGradient: '#FF6D6A',
  $blueGradient: '#73F7FF',
});

const appId = 'C8ED266C-7855-CA99-FFE0-7C92B95E7700';
const secretKey = 'C2F20ACA-8B7D-3E53-FF03-F9E1CC847C00';

export default class Main extends Component {

  componentWillMount() {
    Backendless.initApp(appId, secretKey);
  }

  render() {
    return (
      <Provider store={store}>
        <AlertProvider>
          <IntroNav />
        </AlertProvider>
      </Provider>
    )
  }

}
