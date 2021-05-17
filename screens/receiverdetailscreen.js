import React,{Component} from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  Alert} from 'react-native';
  import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader'
import { Header } from 'react-native/Libraries/NewAppScreen';
import {Card} from 'react-native-elements'

export default class ReceiverDetailScreen extends React.Component{
    constructor(){
super();
this.state={
    userId:firebase.auth().currentUser.email,
    userName:"",
    receiverId:this.props.navigation.getParam('details')["user_id"],
    requestId:this.props.navigation.getParam('details')["request_id"],
    itemName:this.props.navigation.getParam('details')["item_name"],
    reasonToRequest:this.props.navigation.getParam('details')["reason_to_request"],
    receiverName:'',
    receiverRequestDocId:'',
    receiverContact:'',
    receiverAddress:''
}
    }

    getreceiverdetail=()=>{
        db.collection('users').where('email_Id','==',this.state.receiverId).get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                this.setState({
                    receiverName: doc.data().first_name,
                    receiverAddress:doc.data().address,                
                    receiverContact:doc.data().contact,
                })
            })
        })
        db.collection('requested_items').where('request_id','==',this.state.requestId).get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                this.setState({
                    receiverRequestDocId: doc.data().doc.id,
                    
                })
            })
        }) 
    }
    updateitemstatus=()=>{
        db.collection("alldonations").add({
            "item_name":this.state.itemName,
            "request_id":this.state.requestId,
            "requested_by":this.state.receiverName,
            "donor_id":this.state.userId,
            "request_status":"donor interested"
        })
    }
    getuserdetail=(userId)=>{
        db.collection('users').where('email_Id','==',userId).get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                this.setState({
                    userName:doc.data().first_name+" "+doc.data().last_name
                })
            })
        })
    }
addnotification=()=>{
    var message = this.state.userName+" has shown interest in donating the item"
    db.collection("allnotifications").add({
        "target_user_id":this.state.receiverId,
        "donor_id":this.state.userId,
        "request_id":this.state.requestId,
        "item_name":this.state.itemName,
        "date":firebase.firestore.FieldValue.serverTimestamp() ,
        "notification_status":"unread",
        "message":message
    })
}

    componentDidMount(){
        this.getreceiverdetail()
        this.getuserdetail(this.state.userId)
    }

    render(){
        return(
            <View style = {styles.container}>
                <View style = {{flex:0.1}}>
                <Header title ="Donate items"></Header>
                </View>
                <View style = {{flex:0.3}}>
                <Card title = 'iteminformation' titleStyle = {{fontSize:20}}>
                    <Card style = {{fontWeight:"bold"}}>Name:{this.state.itemName}</Card>
                    <Card style = {{fontWeight:"bold"}}>Reason:{this.state.reasonToRequest}</Card>
                </Card>
                </View>
                <View style = {{flex:0.3}}>
                <Card title = 'Receiverinformation' titleStyle = {{fontSize:20}}>
                    <Card style = {{fontWeight:"bold"}}>Name:{this.state.receiverName}</Card>
                    <Card style = {{fontWeight:"bold"}}>Contact:{this.state.receiverContact}</Card>
                    <Card style = {{fontWeight:"bold"}}>Address:{this.state.receiverAddress}</Card>
                </Card>
                </View>
                <View style = {styles.buttoncontainer}>
                    {this.state.receiverId!== this.state.userId ?
                    (<TouchableOpacity onPress = {()=>{
                        this.updateitemstatus()
                        this.addnotification()
                         
                        this.props.navigation.navigate("HomeScreen")
                    }} style = {styles.button}>
                        <Text>I Want To Donate</Text>
                        </TouchableOpacity>)
                    :null}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    buttoncontainer:{
        justifyContent:"center",
        alignItems:"center",
        flex:0.3
    },
    button:{
        width:200,
        height:50,
        justifyContent:"center",
        alignItems:"center",
        borderRadius:10,
        backgroundColor:"orange"
    },
    
})