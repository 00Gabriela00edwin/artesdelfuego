// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCt7TF-iOC1XC9CA_G0H71XShWI95ou12Q",
  authDomain: "artes-del-fuego.firebaseapp.com",
  projectId: "artes-del-fuego",
  storageBucket: "artes-del-fuego.firebasestorage.app",
  messagingSenderId: "280723241412",
  appId: "1:280723241412:web:c614d302eded59094dcc91",
  measurementId: "G-7W5NK97SZB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;