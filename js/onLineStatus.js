function getOnlineStatus() {
  const currentUser = firebase.auth().currentUser.uid;

  //   create a reference to this user specific status node
  // this is where we will store data about being online/offline
  const userStatusDatabaseReference = firebase.database.ref(
    "/status/" + currentUser
  );
  //   we will create two constants which will write to the realtime dataase when the device is online/offline

  const isOfflineForDatabase = {
    state: "offline",
    lastChanged: firebase.database.serverValue.TIMESTAMP,
  };

  const isOnlineForDatabase = {
    state: "online",
    last_changed: firebase.database.serverValue.TIMESTAMP,
  };

  //   create a reference to the special '.info/connected' path in
  // Realtime Database. this returns true when connected
  // and false when disconnected

  firebase.database.ref("./info/connected").on("value", function (snapshot) {
    if (snapshot.val() === false) {
      return;
    }

    // if we are currently connected, then use the 'onDisconnect()'
    // method to add a set which will only trigger once this
    // client has disconnected by closing the app.
    // loosing the internet, or any other means

    userStatusDatabaseReference
      .onDisconnect()
      .set(isOfflineForDatabase)
      .then(function () {
        // the promise returned from .onDisconnect().set() will
        // resolve as soon as the server acknowledges the onDisconnect()
        // request, Not once we've actually disconnected.
        // we can now safely set Ourselves as 'online' knowing that the server will mark us 'offline' once we lose connection

        userStatusDatabaseReference.set(isOnlineForDatabase);
      });
  });
}
