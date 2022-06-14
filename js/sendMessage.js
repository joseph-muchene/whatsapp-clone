// display all users
let allUsers = [];

firebase
  .firestore()
  .collection("users")
  .get()
  .then((querySnapshot) => {
    let content = "";
    querySnapshot.forEach((doc) => {
      // push all users to the array
      allUsers.push(doc.data());

      content += '<ul class="list-group">';

      content +=
        '<li class="list-group-item" id="user-item" onclick="handleUser(\'' +
        doc.data().userId +
        "')\">";
      content +=
        ' <img src="./avatar.jpg" alt="" srcset="" class="img-thumbnail" />';
      content += ' <p class="text-center">' + doc.data().name + "</p>";
      content += "</li>";
      content += "</ul>";
    });
    $("#users-info").append(content);
  })
  .catch((err) => console.log(err.message));

// handle click on user item

window.handleUser = function (id) {
  // find the user that matches the id

  const user = allUsers.find((user) => user.userId === id);

  document.getElementById("user-item").innerHTML = `
<img src="./avatar.jpg" alt="" srcset="" class="mx-3 user img-fluid" />
<h3 class="text-primary">${user.name}</h3>
`;

  // get current user

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const userId = user.uid;

      // send message

      document.getElementById("sendMessage").onclick = function () {
        const msg = document.getElementById("message").value;

        let sendMessage = firebase.firestore().collection("messages").doc();
        sendMessage
          .set({
            message: msg,
            docId: sendMessage.id,
            isRead: "false",
            messageFrom: userId,
            messageTo: id,
            timeStamp: new Date(),
          })
          .then(() => console.log("sent"));
      };
    }
  });
};
