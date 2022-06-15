// get all users

// firebase
//   .firestore()
//   .collection("users")
//   .get((querySnapshot) => {
//     const user = querySnapshot.data();
//   });

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    var uid = user.uid;
    // ...
  } else {
    window.location.href = "/views/register.html";
  }
});
