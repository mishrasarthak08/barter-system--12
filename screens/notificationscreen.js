import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList,TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements'
import firebase from 'firebase';
import db from '../config'
import MyHeader from '../components/MyHeader';
import SwipeableFlatList from '../components/swipeableflatList'


export default class NotificationScreen extends Component{
  constructor(){
    super()
    this.state = {
      allNotifications : [],
      donorId:firebase.auth().currentUser.email,
    }
  this.requestRef= null
  }

  getnotification =()=>{
    this.requestRef = db.collection("allnotifications").where("notification_status","==","unread").where("target_user_id","==",this.state.userId)
    .onSnapshot((snapshot)=>{
      var allNotifications = snapshot.docs.map(document => document.data());
      this.setState({
        allNotifications : allNotifications
      });
    })
  }

  componentDidMount(){
    this.getnotification()
  }

  componentWillUnmount(){
    this.requestRef();
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ( {item, i} ) =>{
    return (
      <ListItem
        key={i}
        title={item.item_name}
        subtitle={item.message}
        titleStyle={{ color: 'black', fontWeight: 'bold' }}
        bottomDivider
      />
    )
  }

  render(){
    return(
      <View style={{flex:1}}>
        <MyHeader title="Notifications" navigation ={this.props.navigation}/>
        <View style={{flex:1}}>
          {
            this.state.allNotifications.length === 0
            ?(
              <View style={styles.subContainer}>
                <Text style={{ fontSize: 20}}>You Have No Notifications</Text>
              </View>
            )
            :(
              <FlatList
              allNotifications = {this.state.allNotifications}
              />
            )
          }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  subContainer:{
    flex:1,
    fontSize: 20,
    justifyContent:'center',
    alignItems:'center'
  },
  button:{
    width:100,
    height:30,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8
     }
  }
})