document.getElementById("submit").onclick = function () {
  // login user

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // login user login

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      localStorage.setItem("user", JSON.stringify(userCredential));
      // // Signed in
      // var user = userCredential.user;
      // console.log("user signed in");
      window.location = "/index.html";
    })
    .catch(
      (err) => (document.getElementById("infomessage").innerText = err.message)
    );
};
