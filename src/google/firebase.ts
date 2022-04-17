import * as firebase from 'firebase-admin/app'

const firebaseInit = () => {
  const firebaseAdmin = firebase.initializeApp({
    credential: firebase.applicationDefault(),
  })
  console.log(firebaseAdmin)
}

export default firebaseInit
