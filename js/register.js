// register user

document.getElementById("submit").onclick = function () {
  // register user login
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      console.log(userCredential);
      localStorage.setItem("user", JSON.stringify(userCredential));
      const userId = userCredential.user.uid;
      // add user to the firestore
      firebase
        .firestore()
        .collection("users")
        .doc(userId)
        .set({
          name,
          email,
          userId,
        })
        .then((user) => {
          // redirect user to the homepage
          // console.log(user);
          window.location = "/index.html";
        });
    })
    .catch(
      (err) => (document.getElementById("infomessage").innerText = err.message)
    );

  // add the user to the users collection

  // firebase.firestore().collection("users").add({
  //   name,
  //   email,
  // });
};
