import React, { Component } from 'react';
import firebase from 'firebase';
import './App.css';
import FileUpload from './FileUpload';

class App extends Component {
  constructor () {
    super();
    this.state = {
      user: null,
      pictures: []
    };

    this.handleAuth = this.handleAuth.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount () {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({
        user: user
      });
    });

    firebase.database().ref('pictures').on('child_added', snapshot => {
      
      this.setState({
        pictures: this.state.pictures.concat(snapshot.val())
      })
      console.log("stateeeepicture", this.state.pictures);
    })
  }

  handleAuth () {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider)
      .then(result => console.log(`${result.user.email} ha iniciado sesión`))
      .catch(error => console.log(`Error ${error.code}: ${error.message}`));
  }

  handleLogout () {
    firebase.auth().signOut()
    .then(result => console.log(`${result.user.email} ha cerrado sesión`))
    .catch(error => console.log(`Error ${error.code}: ${error.message}`));
  }

  handleUpload (event) {
    const file = event.target.files[0];
    const storageRef = firebase.storage().ref(`/fotos/${file.name}`);
    const task = storageRef.put(file);
  
    task.on('state_changed', snapshot => {
            let percentage = (snapshot.bytesTransferred/snapshot.totalBytes) * 100;
            this.setState({
                uploadValue: percentage
            })
        }, error => {
            console.log(error.message);
        }, () => {
          storageRef.getDownloadURL().then(url => {
            const record = {
              photoURL: this.state.user.photoURL,
              displayName: this.state.user.displayName,
              image: url
            }
            const dbRef = firebase.database().ref('pictures');
            const newPicture = dbRef.push();
            newPicture.set(record);
            console.log("URL", url);
            
          });
          
        
    });              
  }

  handleDelete () {
    
      firebase.database().ref('pictures').set(null)
      .then(response => {
        console.log("All good: ", response);
        this.setState({
          pictures: []
        })
      })
      .catch(error => console.log("die mtf: ", error));
    
  }

  renderLoginButton() {
    //if user is logged in
    
    if (this.state.user) {
      console.log("statepicture", this.state.pictures);
      return (
        <div>
          <img src={this.state.user.photoURL} alt={this.state.user.displayName}/>
          <p>Hola {this.state.user.displayName}</p>
          <button onClick={this.handleLogout}>Logout</button>
          <button onClick={this.handleDelete}>Delete all photos</button>
          <FileUpload onUpload={this.handleUpload}/>

          {
            this.state.pictures.map(picture => (
              <div>
                <img width="600px" alt="" src={picture.image}></img>
                <br/>
                <img width="40px" src={picture.photoURL} alt={picture.displayName}></img>
                <br/>
                <span>{picture.displayName}</span>
              </div>
            )).reverse()
          }

        </div>
      );
    } else {
      //if user is logged out
      return ( 
        <button onClick={this.handleAuth}>Login</button>
      );
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h2 className="App-title">Pseudogram</h2>
        </header>
        <div className="App-intro">
         { this.renderLoginButton() }
        </div>
      </div>
    );
  }
}

export default App;

