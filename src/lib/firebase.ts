import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getFirestore, Firestore } from 'firebase/firestore'
import { getAuth, Auth } from 'firebase/auth'
import { getStorage, FirebaseStorage } from 'firebase/storage'

let app: FirebaseApp | undefined
let firestore: Firestore | undefined
let auth: Auth | undefined
let storage: FirebaseStorage | undefined

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
}

if (typeof window !== 'undefined' && firebaseConfig.apiKey && firebaseConfig.projectId) {
  // Client-side initialization
  if (!getApps().length) {
    app = initializeApp(firebaseConfig)
  } else {
    app = getApps()[0]
  }
  firestore = getFirestore(app)
  auth = getAuth(app)
  
  // Initialize Storage if storageBucket is provided
  if (firebaseConfig.storageBucket) {
    storage = getStorage(app)
  }
}

export { firestore, auth, storage }
export default app
