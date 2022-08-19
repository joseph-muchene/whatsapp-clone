// // check if there is a user authenticated
// firebase.auth().onAuthStateChanged((user) => {
//   // variable name//description//participants
//   let name = document.getElementById("name").value;
//   let userId = user.uid;

//   firebase
//     .firestore()
//     .collection("groups")
//     .doc(userId)
//     .set({
//       groupId: userId,
//       description: "",
//       nameOfGroup: "",
//     })
//     .then(() => {
//       console.log("document was created");
//     })
//     .catch((err) => console.log(err.message));
// });
