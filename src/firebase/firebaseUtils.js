import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
  apiKey: 'AIzaSyBNQ7cxUG7hGpW-Ue8WpSth_V2DHcCeU_o',
  authDomain: 'hoc-clothing-store.firebaseapp.com',
  databaseURL: 'https://hoc-clothing-store.firebaseio.com',
  projectId: 'hoc-clothing-store',
  storageBucket: 'hoc-clothing-store.appspot.com',
  messagingSenderId: '341087581268',
  appId: '1:341087581268:web:3041836edd253b789f69c1',
  measurementId: 'G-RWD13TPQJE',
};

firebase.initializeApp(config);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();

// Always use Google popup for Google Auth Provider usage (auth)
provider.setCustomParameters({
  prompt: 'select_account',
});

export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;
