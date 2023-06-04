function getOnlineStatus() {
  firebase.auth().onAuthStateChanged((user) => {
    const currentUser = user.uid;

    const userStatusDatabaseReference = firebase
      .database()
      .ref("/status/" + currentUser);

    const isOfflineForDatabase = {
      state: "offline",
      lastChanged: firebase.database.ServerValue.TIMESTAMP,
    };

    const isOnlineForDatabase = {
      state: "online",
      lastChanged: firebase.database.ServerValue.TIMESTAMP,
    };

    firebase
      .database()
      .ref(".info/connected")
      .on("value", function (snapshot) {
        if (snapshot.val() === false) {
          return;
        }

        userStatusDatabaseReference
          .onDisconnect()
          .set(isOfflineForDatabase)
          .then(function () {
            userStatusDatabaseReference.set(isOnlineForDatabase);
          });
      });
  });
}

getOnlineStatus();
