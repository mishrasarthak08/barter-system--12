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

export default class SettingScreen extends React.Component{
    constructor(){
        super();
        this.state={
        emailId:'',
        address:'',
        firstName:'',
        lastName:'',
        contact:'',
        docId:''
    }
    }

getuserdetail=()=>{
    var email = firebase.auth().currentUser.email;
    db.collection('users').where('email_Id','==',email).get()
    .then((snapshot)=>{
        snapshot.forEach((doc)=>{
            this.setState({
                emailId: doc.data().email_Id,
                firstName:doc.data().first_name,
                lastName:doc.data().last_name,
                address:doc.data().address,                
                contact:doc.data().contact,
                docId:doc.id
            })
        })
    })
}

componentDidMount(){
    this.getuserdetail();
}

updateUserDetails=()=>{
    db.collection("users").doc(this.state.docId).update({
        'first_name':this.state.firstName,
        "last_name":this.state.lastName,
        "address":this.state.address,
        'contact':this.state.contact,
    })
    Alert.alert('Profile Updated Successfully');
}

    render(){
        return(
            <View style = {styles.container}>
                <MyHeader title = "settings"/>
                <View style = {styles.profilecontainer}>
                <TextInput
                    style={styles.formtextinput}
                    placeholder={"First Name"}
                    maxLength ={8}
                    onChangeText={(text)=>{
                        this.setState({
                        firstName: text 
                        })
                    }}
                    value = {this.state.firstName}/>
                     <TextInput
                    style={styles.formtextinput}
                    placeholder={"Last Name"}
                    maxLength ={8}
                    onChangeText={(text)=>{
                        this.setState({
                        lastName: text
                        })
                    }}
                    value = {this.state.lastName}/>
                   
                 <TextInput
                    style={styles.formtextinput}
                    placeholder={"Contact"}
                    maxLength ={10}
                    keyboardType = {"numeric"}
                    onChangeText={(text)=>{
                        this.setState({
                        contact: text
                        })
                    }}
                    value = {this.state.contact}/>
                     <TextInput
                    style={styles.formtextinput}
                    placeholder={" Address"}
                    multiline ={true}
                    onChangeText={(text)=>{
                        this.setState({
                        address: text
                        })
                    }}
                     value = {this.state.address}/>
                    <TouchableOpacity style = {styles.button} onPress = {()=>{
                        this.updateUserDetails();
                    }}>
                        <Text style = {styles.buttontext}>save</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"lightblue",
        alignItems:"center",
        justifyContent: 'center'
    },
    profilecontainer:{
        flex:1,
        justifyContent:"center",
        alignItems:"center"
    },
    button:{
        width:300,
        height:50,
        justifyContent:"center",
        alignItems:"center",
        borderRadius:25,
        backgroundColor:"blue",
    },
    buttontext:{
        fontSize:20,
        fontWeight:"200",
        color:"white"     
    },
    formtextinput:{
        width:"75%",
        height:35,
        alignSelf:"center",
        borderColor:"yellow",
        borderRadius:10,
        borderWidth:1,
        marginTop:20,
        padding:10
      }
})