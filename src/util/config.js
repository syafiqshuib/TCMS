import firebase from 'firebase';

let config = {
  apiKey: 'AIzaSyChzSEEDCUYoGt_17cRARWxilDLH5-_4gQ',
  authDomain: 'fyp2tcms.firebaseapp.com',
  databaseURL: 'https://fyp2tcms.firebaseio.com',
  projectId: 'fyp2tcms',
  storageBucket: 'fyp2tcms.appspot.com',
  messagingSenderId: '146338642729'
};
let app = firebase.initializeApp(config);
export const db = app.database();