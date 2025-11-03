import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getFirestore, Firestore } from 'firebase/firestore'
import { getAuth, Auth } from 'firebase/auth'

let app: FirebaseApp | undefined
let firestore: Firestore | undefined
let auth: Auth | undefined

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
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
}

export { firestore, auth }
export default app
