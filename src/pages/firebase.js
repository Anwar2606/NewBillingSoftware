// // src/firebase.js
// import { initializeApp } from 'firebase/app';
// import { getFirestore } from 'firebase/firestore';

// const firebaseConfig = {
//     apiKey: "AIzaSyBz3rRV2KgjBLgrv8AbT1lwj76xM6URf10",
//     authDomain: "billing-de6fa.firebaseapp.com",
//     projectId: "billing-de6fa",
//     storageBucket: "billing-de6fa.appspot.com",
//     messagingSenderId: "210563287208",
//     appId: "1:210563287208:web:c7ddace8e3187c53421a9d"
// };

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// export { db };
// firebase.js or firebase/index.js

// import { initializeApp } from 'firebase/app';
// import { getFirestore } from 'firebase/firestore';
// import { getStorage } from 'firebase/storage';

// const firebaseConfig = {
//     apiKey: "AIzaSyBz3rRV2KgjBLgrv8AbT1lwj76xM6URf10",
//     authDomain: "billing-de6fa.firebaseapp.com",
//     projectId: "billing-de6fa",
//     storageBucket: "billing-de6fa.appspot.com",
//     messagingSenderId: "210563287208",
//     appId: "1:210563287208:web:c7ddace8e3187c53421a9d"

// };

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app); // Firestore instance
// const storage = getStorage(app); // Storage instance

// export { db, storage }; // Export Firestore and Storage instances
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth'; // Import Firebase Authentication

const firebaseConfig = {
    apiKey: "AIzaSyDYGUnlMaVfzLggn-iRF3EVulbOo4qivvo",
    authDomain: "tssbilling-8e7b5.firebaseapp.com",
    projectId: "tssbilling-8e7b5",
    storageBucket: "tssbilling-8e7b5.appspot.com",
    messagingSenderId: "993422185891",
    appId: "1:993422185891:web:055fc6f1b229c1b9e57616"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Firestore instance
const storage = getStorage(app); // Storage instance
const auth = getAuth(app); // Authentication instance

export { db, storage, auth }; // Export Firestore, Storage, and Authentication instances
