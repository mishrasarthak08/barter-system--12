import React, { Component} from 'react';
import {StyleSheet, View, Text,TouchableOpacity} from 'react-native';
import { DrawerItems} from 'react-navigation-drawer'
import {Avatar} from 'react-native-elements'
import firebase from 'firebase';
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'
import db from '../config'

export default class CustomCustomSideBarMenu extends Component{
  constructor(){
    super();
    this.state={
image:'',
name:'',
userId:firebase.auth().currentUser.email,
docId:'',
    }
  }
selectpicture=async()=>{
const {cancelled,uri} = await ImagePicker.launchImageLibraryAsync({
  mediaTypes:ImagePicker.MediaTypeOptions.All,
  allowsEditing:true,
  aspect:[4,3],
  quality:1,
})
if(!cancelled){
this.uploadImage(uri,this.state.userId)
}
}
uploadImage=async(uri,imagename)=>{
var response = await fetch(uri)
var blob = response.blob()
var ref = firebase.storage().ref().child("user_profiles/"+imagename)
return ref.put(blob).then((response)=>{
  this.fetchimage(imagename)
})
}
fetchimage=(imagename)=>{
var storageref = firebase.storage().ref().child("user_profiles/"+imagename)
storageref.getDownloadURL().then((url)=>{
  this.setState({
    image:url
  })
})
}
getuserprofile=()=>{
  db.collection("users").where("email_id","==",this.state.userId)
  .onSnapshot((querySnapshot)=>{
    querySnapshot.forEach((doc)=>{
this.setState({
  name:doc.data().first_name+" "+doc.data().last_name,
  docId:doc.id,
  image:doc.data().image
})
    })
  })
}
componentDidMount(){
   this.fetchimage(this.state.userId)
  this.getuserprofile()
}

  render(){
    return(
      <View style={styles.container}>
      <View style = {{flex:0.5,alignItems:"center",backgroundColor:"orange"}}>
      <Avatar 
      rounded source = {{uri:this.state.image}} 
      size="medium"
      onPress = {()=>{
        this.selectpicture()
      }} containerStyle = {styles.imagecontainer} showEditButton/>
      <Text style = {{fontSize:20,fontWeight:"100",paddingTop:10}}>{this.state.name}</Text>
      </View>
        <View style={styles.drawerItemsContainer}>
          <DrawerItems {...this.props}/>
        </View>
        <View style={styles.logOutContainer}>
          <TouchableOpacity style={styles.logOutButton}
          onPress = {() => {
              this.props.navigation.navigate('WelcomeScreen')
              firebase.auth().signOut()
          }}>
            <Text style = {styles.logOutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container : {
    flex:1
  },
  drawerItemsContainer:{
    flex:0.8
  },
  logOutContainer : {
    flex:0.2,
    justifyContent:'flex-end',
    paddingBottom:30
  },
  logOutButton : {
    height:30,
    width:'100%',
    justifyContent:'center',
    padding:10
  },
  logOutText:{
    fontSize: 30,
    fontWeight:'bold'
  },
  imagecontainer:{
flex:0.75,
width:"40%",
height:"20%",
marginTop:30,
borderRadius:40
  }
})
