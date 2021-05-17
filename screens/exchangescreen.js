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

export default class itemRequestScreen extends Component{
  constructor(){
    super();
    this.state ={
      userId : firebase.auth().currentUser.email,
      itemName:"",
      reasonToRequest:"",
      requestId:'',
      requesteditemName:'',
      isitemRequestActive:'',
      itemStatus:'',
      userDocId:'',
      docId:''
    }
  }

  createUniqueId(){
    return Math.random().toString(36).substring(7);
  }



  addRequest =async (itemName,reasonToRequest)=>{
    var userId = this.state.userId
    var randomRequestId = this.createUniqueId()
    db.collection('requested_items').add({
        "user_id": userId,
        "item_name":itemName,
        "reason_to_request":reasonToRequest,
        "request_id"  : randomRequestId,
        "item_status":"requested",
        "data":firebase.firestore.FieldValue.serverTimestamp()
    })
    await this.getitemRequest();
    db.collection("users").where("email_id","==",userId).get().then()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        db.collection("users").doc(doc.id).update({
          isitemRequestActive:true
        })
      })
    })

    this.setState({
        itemName :'',
        reasonToRequest : ''
    })

    return Alert.alert("item Requested Successfully")
  }
getitemRequest=()=>{
  var itemrequest = db.collection("requested_items").where("user_id","==",this.state.userId).get()
   .then((snapshot)=>{
      snapshot.forEach((doc)=>{
       if(doc.data().item_status!=="received"){
        this.setState({
          requestId:doc.data().request_id,
          requesteditemName:doc.data().item_name,
          itemStatus:doc.data().item_status,
          docId:doc.id
        })
       }
      })
    })
}
getIsitemRequestActive=()=>{
  db.collection("users").where("email_id","==",this.state.userId).onSnapshot((querySnapshot)=>{
    querySnapshot.forEach((doc)=>{
this.setState({
  isitemRequestActive:doc.data().isitemRequestActive,
  userDocId:doc.id
})
    })
  })
}

componentDidMount(){
  this.getitemRequest()
  this.getIsitemRequestActive()
}
receiveditems=(itemName)=>{
  db.collection("received_items").add({
    "user_id":this.state.userId,
    "item_name":itemName,
"request_id":this.state.requestId,
"item_status":"received"
  })
}

updateitemRequestStatus=()=>{
  db.collection("requested_items").doc(this.state.docId).update({
    item_status:"received"
  })
   db.collection("users").where("email_id","==",this.state.userId).get()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        db.collection("users").doc(doc.id).update({
          isitemRequestActive:true
        })
      })
    })
}
sendNotification=()=>{
  db.collection("users").where("email_id","==",this.state.userId).get()
  .then((snapshot)=>{
    snapshot.forEach((doc)=>{
      var name = doc.data().first_name
      var lastname = doc.data().last_name
       db.collection("all_notifications").where("request_id","==",this.state.requestId).get()
  .then((snapshot)=>{
    snapshot.forEach((doc)=>{
      var donorid = doc.data().donor_id
      var itemname = doc.data().item_name
      
      db.collection("all_notifications").add({
        "targeted_user_id":donorid,
        "message":name + " "+lastname+" received the item "+itemname,
        "notification_status":"unread",
        "item_name":itemname
      })
    })
  })
    })
  })
}

  render(){
    if(this.state.isitemRequestActive===true){
       return(
         <View style = {{flex:1,justifyContent:"center"}}>
         <View style = {{alignItems:"center",justifyContent:"center",borderColor:"orange",borderWidth:2,padding:10,margin:10}}>
         <Text>item Name</Text>
         <Text>{this.state.requesteditemName}</Text>
         </View>
         <View style = {{alignItems:"center",justifyContent:"center",borderColor:"orange",borderWidth:2,padding:10,margin:10}}>
         <Text>item Status</Text>
         <Text>{this.state.itemStatus}</Text>
         </View>
         <TouchableOpacity style = {{alignItems:"center",justifyContent:"center",borderColor:"orange",borderWidth:1,marginTop:30,width:300,height:30,alignSelf:"center",backgroundColor:"orange"}} onPress = {()=>{
           this.updateitemRequestStatus()
           this.receiveditems(this.state.requesteditemName)
           this.sendNotification()
         }}>
         <Text>I Recieved The item</Text>
         </TouchableOpacity>
         </View>
       ) 
      }
      else{
    return(
        <View style={{flex:1}}>
          <MyHeader title="Request item" navigation ={this.props.navigation}/>
            <KeyboardAvoidingView style={styles.keyBoardStyle}>
              <TextInput
                style ={styles.formTextInput}
                placeholder={"enter item name"}
                onChangeText={(text)=>{
                    this.setState({
                        itemName:text
                    })
                }}
                value={this.state.itemName}
              />
              <TextInput
                style ={[styles.formTextInput,{height:300}]}
                multiline
                numberOfLines ={8}
                placeholder={"Why do you need the item"}
                onChangeText ={(text)=>{
                    this.setState({
                        reasonToRequest:text
                    })
                }}
                value ={this.state.reasonToRequest}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={()=>{this.addRequest(this.state.itemName,this.state.reasonToRequest)}}
                >
                <Text>Request</Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
        </View>
    )}
  }
}

const styles = StyleSheet.create({
  keyBoardStyle : {
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  formTextInput:{
    width:"75%",
    height:35,
    alignSelf:'center',
    borderColor:'#ffab91',
    borderRadius:10,
    borderWidth:1,
    marginTop:20,
    padding:10,
  },
  button:{
    width:"75%",
    height:50,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop:20
    },
  }
)
