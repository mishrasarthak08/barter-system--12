import React,{Component} from 'react';
import {createStackNavigator} from 'react-navigation-stack'
import ExchangeScreen from '../screens/ExchangeScreen'
import ReceiverDetailScreen from '../screens/recieverdetailscreen'

export const AppStackNavigator  = createStackNavigator({
    ItemDonateList:{
        screen:ExchangeScreen,
        navigationOptions:{headerShown:false}
    },
    ReceiverDetails:{
        screen:ReceiverDetailScreen,
        navigationOptions:{headerShown:false}
    }
},
{
    initialRouteName:"ItemDonateList"
}
)