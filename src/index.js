import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import './index.css';
import App from './App';

firebase.initializeApp({
    apiKey: "AIzaSyBuKmnYx9HtS18JMBGPXI7gmDlnNGdeYKI",
    authDomain: "pseudogram-87b88.firebaseapp.com",
    databaseURL: "https://pseudogram-87b88.firebaseio.com",
    projectId: "pseudogram-87b88",
    storageBucket: "pseudogram-87b88.appspot.com",
    messagingSenderId: "105341650867"
})

ReactDOM.render(
    <App />,
    document.getElementById('root')
);

