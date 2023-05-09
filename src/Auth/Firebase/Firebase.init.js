import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAEfPW9TPvmIPEgsUAoNuQjMtmHleAcozw",
  authDomain: "job-onboard-client.firebaseapp.com",
  projectId: "job-onboard-client",
  storageBucket: "job-onboard-client.appspot.com",
  messagingSenderId: "843588075785",
  appId: "1:843588075785:web:cd6d46453bbfb88045d3d8",
  measurementId: "G-3DBT0N41CD"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export default auth;
