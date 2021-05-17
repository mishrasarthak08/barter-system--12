import firebase from 'firebase'
 require("@firebase/firestore")
 
 var firebaseConfig = {
    apiKey: "AIzaSyDsMm8v_Ge4xDHIY7nm98OCrC7Zi8wB_PY",
    authDomain: "barter-system-app-2aa8f.firebaseapp.com",
    projectId: "barter-system-app-2aa8f",
    storageBucket: "barter-system-app-2aa8f.appspot.com",
    messagingSenderId: "246554621907",
    appId: "1:246554621907:web:9481d4542fa6ee5a402126"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore()