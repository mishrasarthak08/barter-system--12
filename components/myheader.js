import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {Header,Icon,Badge} from 'react-native-elements'


export default class MyHeader extends React.Component{
    constructor(){
        super();
        this.state={
            value:'',
        }
    }
    getNumberOfUnreadNotification=()=>{
db.collection("allnotifications").where("notification_status","==","unread").onSnapshot((snapshot)=>{
    var unreadnotifications = snapshot.docs.map((doc)=>doc.data())
    this.setState({
        value:unreadnotifications.length
    })
})
    }
    componentDidMount(){
        this.getNumberOfUnreadNotification()
    }
    BellIconWithBadge=()=>{
        return(
            <View>
                <Icon name = "bell" type = "font-awesome" color = "gray" size = {25} onPress = {()=>{
                    this.props.navigatino.navigate("Notification")
                }} />
                <Badge value = {this.state.value} containerStyle = {{position:"absolute",top:-4,right:-4}}/>
            </View>
        )
    }
    render(){
        return(
            <Header centerComponent = {{text:this.props.title,style :{color:"yellow",fontSize:20,fontWeight:"bold"}}} 
            leftComponent = {<Icon name = "bars" type = "font-awesome" color = "black" onPress = {()=>{
                this.props.navigation.toggleDrawer()
            }}></Icon>} rightComponent = {<this.BellIconWithBadge {...this.props}/>} />
        )
    }
}