function getOnlineStatus(userId) {
  return new Promise((resolve, reject) => {
    const userStatusDatabaseReference = firebase
      .database()
      .ref("/status/" + userId);

    userStatusDatabaseReference.on("value", (snapshot) => {
      const onlineStatus = snapshot.val()?.state || "offline";

      resolve(onlineStatus);
      // You can do further processing with the online status data here
    });
  });
}

const authUser = JSON.parse(localStorage.getItem("user"));

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
      if (authUser !== null) {
        if (authUser.uid !== doc.data().userId) {
          content += '<ul class="list-group">';
          content +=
            '<li class="list-group-item mb-3 bg-light text-dark shadow-lg" id="user-item" onclick="handleUser(\'' +
            doc.data().userId +
            "')\">";

          content += ' <h1 class="">' + doc.data().name + "</h1>";
          content += `<p class="text-primary " id="onlineStatus-${
            doc.data().userId
          }"></p>`;
          content +=
            ' <img src="./avatar.jpg" alt="" srcset="" class="avatar img-thumbnail" />';
          content += "</li>";

          content += "</ul>";

          const userId = doc.data().userId;
          getOnlineStatus(userId)
            .then((onlineStatus) => {
              const onlineStatusElement = document.getElementById(
                "onlineStatus-" + userId
              );
              if (onlineStatusElement) {
                onlineStatusElement.textContent = onlineStatus;
              }
            })
            .catch((error) => {
              console.log("Error getting online status:", error);
            });
        }
      }
    });
    $("#users-info").append(content);
  })
  .catch((err) => console.log(err.message));

// handle click on user item

window.handleUser = function (id) {
  // togglebox
  if (document.querySelector(".msgbox").classList.contains("hidebox")) {
    document.querySelector(".msgbox").classList.remove("hidebox");
  }

  // find the user that matches the id

  const user = allUsers.find((user) => user.userId === id);
  console.log(user);
  document.getElementById("user-item").innerHTML = `
<img src="./avatar.jpg" alt="" srcset="" class="mx-3 user img-fluid" onclick=${scrollToTop()} />
<h3 class="text-primary">${user.name}</h3>

`;

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
  // get current user

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));

      let userId = user.uid;

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
            timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
          })
          .then(() => {
            console.log("message sent");
            document.getElementById("message").value = "";
            window.scrollTo({ top: 0, behavior: "smooth" });
            document.getElementById("infomessage").innerText = "message sent";
            setTimeout(() => {
              document.getElementById("infomessage").innerText = "";
            }, 3000);

            // reset info after 5s
            setTimeout(() => {
              document.getElementById("infomsg").innerText = "";
            }, 5000);
          });
      };

      // handle all messages
      // get all messages

      firebase
        .firestore()
        .collection("messages")
        .orderBy("timeStamp", "desc")
        .onSnapshot((messageSnapshot) => {
          let content = "";
          messageSnapshot.forEach((message) => {
            // send the message
            let currentUser = JSON.parse(localStorage.getItem("user"));

            if (
              message.data().messageFrom == userId &&
              message.data().messageTo == id
            ) {
           
              content += "<br>";
              content += `<p class="text-danger lead me"> ${
                message.data().message
              }</p>`;
            }
            if (
              message.data().messageTo == userId &&
              message.data().messageFrom == id
            ) {
            
              content += "<br>";
              content += `<p class="text-info lead">
              ${message.data().message}</p>`;
            }
          });
          document.getElementById("boxMessage").innerHTML = content;
        });
    }
  });
};
