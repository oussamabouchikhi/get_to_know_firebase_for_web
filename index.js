// Import stylesheets
import './style.css';
// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";

import * as firebaseui from 'firebaseui';

// Document elements
const startRsvpButton = document.getElementById('startRsvp');
const guestbookContainer = document.getElementById('guestbook-container');

const form = document.getElementById('leave-message');
const input = document.getElementById('message');
const guestbook = document.getElementById('guestbook');
const numberAttending = document.getElementById('number-attending');
const rsvpYes = document.getElementById('rsvp-yes');
const rsvpNo = document.getElementById('rsvp-no');

var rsvpListener = null;
var guestbookListener = null;

// Add Firebase project configuration object here
var firebaseConfig = {
  apiKey: "AIzaSyDaIYXvntFVdL9l3EsAxQpx2HbvtEMP9KM",
  authDomain: "fir-meetup-234eb.firebaseapp.com",
  databaseURL: "https://fir-meetup-234eb.firebaseio.com",
  projectId: "fir-meetup-234eb",
  storageBucket: "fir-meetup-234eb.appspot.com",
  messagingSenderId: "984786288824",
  appId: "1:984786288824:web:1c4fcd80d7cec8f914344d"
};
// Initiallize firebase
firebase.initializeApp(firebaseConfig);

// FirebaseUI config
const uiConfig = {
  credentialHelper: firebaseui.auth.CredentialHelper.NONE,
  signInOptions: [
    // Email / Password Provider.
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    signInSuccessWithAuthResult: function(authResult, redirectUrl){
      // Handle sign-in.
      // Return false to avoid redirect.
      return false;
    }
  }
};

// Initialize the FirebaseUI widget using Firebase
const ui = new firebaseui.auth.AuthUI(firebase.auth());

// Listen to the current Auth state
firebase.auth().onAuthStateChanged((user)=> {
  if (user) { // If user is authenticated
    startRsvpButton.textContent = "LOGOUT"; // set button text to LOGOUT
  }
  else {
    startRsvpButton.textContent = "RSVP"; // set button text to RSPV
  }
});

// Listen to RSVP button clicks
startRsvpButton.addEventListener("click", () => {
      // show sign-in with email form
      ui.start("#firebaseui-auth-container", uiConfig);
});

// Called when the user clicks the RSVP button
startRsvpButton.addEventListener("click", () => {
    if (firebase.auth().currentUser) { // If user is signed in
      firebase.auth().signOut(); // allows user to sign out
    } else { // No user is signed in
      ui.start("#firebaseui-auth-container", uiConfig); // allows user to sign in
    }
});
