import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SignUpLoginScreen from './screens/signuploginscreen';
import { createAppContainer,createSwitchNavigator} from 'react-navigation'
import {AppTabNavigator} from './components/AppTabNavigator'
import {createBottomTabNavigator} from 'react-navigation-tabs'
import {AppDrawerNavigator} from './components/appdrawernavigator'
export default function App() {
  return (
    <AppContainer/>
  );
}
SignUpLoginScreen
const SwitchNavigator = createSwitchNavigator({
  SignUpLoginScreen:{screen:SignUpLoginScreen},
  Drawer:{screen:AppDrawerNavigator},
  BottomTab:{screen:AppTabNavigator}
})
const AppContainer = createAppContainer(SwitchNavigator)

