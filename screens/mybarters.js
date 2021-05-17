import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList,TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements'
import firebase from 'firebase';
import db from '../config'
import MyHeader from '../components/MyHeader';

export default class MyBartersScreen extends Component{
  constructor(){
    super()
    this.state = {
      allDonations : [],
      donorId:firebase.auth().currentUser.email,
      donorName:''
    }
  this.requestRef= null
  }

  getAllDonations =()=>{
    this.requestRef = db.collection("alldonations").where("donor_id","==",this.state.donorId)
    .onSnapshot((snapshot)=>{
      var allDonations = snapshot.docs.map(document => document.data());
      this.setState({
        allDonations : allDonations
      });
    })
  }
  getdonordetails=(donorId)=>{
    db.collection('users').where('email_Id','==',donorId).get()
    .then((snapshot)=>{
        snapshot.forEach((doc)=>{
            this.setState({
                userName:doc.data().first_name+" "+doc.data().last_name
            })
        })
    })
}
senditems=(item_details)=>{
    if(item_details.request_status==="donor interested"){
var requeststatus = "donor interested"
db.collection("alldonations").doc(item_details.doc_id).update({
    "request_status" : requeststatus 
})
    }
    else{
        var requeststatus = "item sent"
db.collection("alldonations").doc(item_details.doc_id).update({
    "request_status" : requeststatus 
})
    }
}
sendnotification=(item_details,requeststatus)=>{
    var requestid = item_details.request_id
    var donorid = item_details.donor_id
    db.collection("allnotification").where("request_id","==",requestid).where("donor_id","==",donorid).get()
    .then((snapshot)=>{
        snapshot.forEach((doc)=>{

            var message = ''
            if(requeststatus==="item sent"){
message = this.state.donorName+"sent you the item"
            }
            else{
                message = this.state.donorName+"has shown interest in donating the item"
            }
            db.collection("allnotification").doc(doc.id).update({
                "message":message
            })
        })
    })
}

  componentDidMount(){
    this.getAllDonations()
    this.getdonordetails(this.state.donorId)
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
        subtitle={"requested by :"+item.requested_by +"\nstatus :"+item.request_status}
        titleStyle={{ color: 'black', fontWeight: 'bold' }}
        rightElement={
            <TouchableOpacity style={styles.button} >
              <Text style={{color:'#ffff'}}>Send item</Text>
            </TouchableOpacity>
          }
        bottomDivider
      />
    )
  }

  render(){
    return(
      <View style={{flex:1}}>
        <MyHeader title="My Donations" navigation ={this.props.navigation}/>
        <View style={{flex:1}}>
          {
            this.state.allDonations.length === 0
            ?(
              <View style={styles.subContainer}>
                <Text style={{ fontSize: 20}}>List Of All My Donations</Text>
              </View>
            )
            :(
              <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.allDonations}
                renderItem={this.renderItem}
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