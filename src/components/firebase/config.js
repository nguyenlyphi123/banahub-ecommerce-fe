import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCj6PQE56DKrngWVKX4YrMX3vpbt4eiXyM',
  authDomain: 'banahub.firebaseapp.com',
  projectId: 'banahub',
  storageBucket: 'banahub.appspot.com',
  messagingSenderId: '765986547556',
  appId: '1:765986547556:web:b83bd7a786e86ad9e2bc71',
  measurementId: 'G-LTQYYH8KTT',
};

export const firebase = initializeApp(firebaseConfig);
export const storage = getStorage(firebase);

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDSqBEkQEN61ZxQBZ4Y50ICk_awAlXr-E8",
//   authDomain: "salemanager-11c9a.firebaseapp.com",
//   projectId: "salemanager-11c9a",
//   storageBucket: "salemanager-11c9a.appspot.com",
//   messagingSenderId: "149072716963",
//   appId: "1:149072716963:web:d7eb2015ae38baaea08b16",
//   measurementId: "G-P5FQQY215F"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
