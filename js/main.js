// get all users

firebase
  .firestore()
  .collection("users")
  .get((querySnapshot) => {
    const user = querySnapshot.data();
  });
