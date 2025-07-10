import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDr76b3LzyoI0DX01lON2gIdiUInbyIbMo",
  authDomain: "miniblog-3666c.firebaseapp.com",
  projectId: "miniblog-3666c",
  storageBucket: "miniblog-3666c.firebasestorage.app",
  messagingSenderId: "930484875687",
  appId: "1:930484875687:web:79b4850c2903b2eabf4682"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const auth = getAuth(app);

export { db, auth }

// lembrar que aqui é uma conf padrao 
// eu poderia ter chamado o getAuth aqui tbm mas n houve necessidade