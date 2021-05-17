import React from 'react';
import { Image } from 'react-native';
import {createBottomTabNavigator} from 'react-navigation-tabs'
import ExchangeScreen from '../screens/exchangescreen'
import HomeScreen from '../screens/homescreen'

export const AppTabNavigator=createBottomTabNavigator({
Donateitems:{screen:HomeScreen,
navigationOptions:{
    tabBarIcon: <Image source={require('../assets/icon.png')} style={{width:20,height:20}}/>,
    tabBarLabel: "Donate Item"
}},
itemRequest:{screen:ExchangeScreen,
    navigationOptions:{
        tabBarIcon: <Image source={require('../assets/icon.png')} style={{width:20,height:20}}/>,
        tabBarLabel: "Item Request"
    }}
})