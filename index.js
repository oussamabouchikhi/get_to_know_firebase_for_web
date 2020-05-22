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
      // Show guestbook to logged-in users
      guestbookContainer.style.display = "block";
      // Subscribe to the guestbook collection
      subscribeGuestbook();
    } else { // No user is signed in
      ui.start("#firebaseui-auth-container", uiConfig); // allows user to sign in
      // Hide guestbook for non-logged-in users
      guestbookContainer.style.display = "none";
      // Unsubscribe from the guestbook collection
      unsubscribeGuestbook();
    }
});

// Listen to the discussion form submission
form.addEventListener("submit", (e) => {
 // Prevent the default form redirect
 e.preventDefault();
 // Write a new message to the database collection "guestbook"
 firebase.firestore().collection("guestbook").add({
   text: input.value,
   timestamp: Date.now(),
   name: firebase.auth().currentUser.displayName,
   userId: firebase.auth().currentUser.uid
 })
 // clear message input field
 input.value = "";
 // Return false to avoid redirect
 return false;
});

// Create query for messages
firebase.firestore().collection("guestbook")
.orderBy("timestamp","asc")
.onSnapshot((snaps) => {
 // Reset page
 guestbook.innerHTML = "";
 // Loop through documents in database
 snaps.forEach((doc) => {
   // Create an HTML entry for each document and add it to the chat
   const entry = document.createElement("p");
   entry.textContent = doc.data().name + ": " + doc.data().text;
   guestbook.appendChild(entry);
 });
});

// Listen to guestbook updates
function subscribeGuestbook(){
   // Create query for messages
 guestbookListener = firebase.firestore().collection("guestbook")
 .orderBy("timestamp","desc")
 .onSnapshot((snaps) => {
   // Reset page
   guestbook.innerHTML = "";
   // Loop through documents in database
   snaps.forEach((doc) => {
     // Create an HTML entry for each document and add it to the chat
     const entry = document.createElement("p");
     entry.textContent = doc.data().name + ": " + doc.data().text;
     guestbook.appendChild(entry);
   });
 });
};

// Unsubscribe from guestbook updates
function unsubscribeGuestbook(){
 if (guestbookListener != null)
 {
   guestbookListener();
   guestbookListener = null;
 }
};

// Listen to RSVP responses
rsvpYes.onclick = () => {
 // Get a reference to the user's document in the attendees collection
 const userDoc = firebase.firestore().collection('attendees').doc(firebase.auth().currentUser.uid);

 // If they RSVP'd yes, save a document with attending: true
 userDoc.set({
   attending: true
 }).catch(console.error)
}

rsvpNo.onclick = () => {
 // Get a reference to the user's document in the attendees collection
 const userDoc = firebase.firestore().collection('attendees').doc(firebase.auth().currentUser.uid);

 // If they RSVP'd no, save a document with attending: false
 userDoc.set({
   attending: false
 }).catch(console.error)
}
