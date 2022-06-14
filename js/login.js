document.getElementById("submit").onclick = function () {
  // login user

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // login user login

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      console.log("user signed in");
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;

      console.log(errorCode);
      console.log(errorMessage);
    });
};
