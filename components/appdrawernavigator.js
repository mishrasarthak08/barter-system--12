import React,{Component} from 'react';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {AppTabNavigator} from './AppTabNavigator'
import CustomSideBarMenu from './CustomSideBarMenu'
import SettingScreen from '../screens/settingscreen'
import NotificationScreen from '../screens/notificationscreen';
import HomeScreen from "../screens/HomeScreen"

export const AppDrawerNavigator=createDrawerNavigator({
  Home:{
      screen:AppTabNavigator
  },
  HomeScreen:{
screen:HomeScreen
  },
  Notification:{
    screen:NotificationScreen
},
  Setting:{
    screen:SettingScreen
  }
  },
  {
    contentComponent:CustomSideBarMenu
  },
  {
      initialRouteName:'Home'
  }
  
  )
