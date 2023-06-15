const userDetails = document.querySelector('.userDetails');
const editProfile = document.querySelector('#editProfile');

function createUserCollection(user) {
  firebase.firestore().collection('users')
    .doc(user.email)
    .set({
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      ambientT: "",
      bodyT: "",
      file_name: "",
      file_url: "",
      hr: "",
      spo2: ""
    });
}

async function getuserInfo(user) {
  if (user) {
    const userInfoSnap = await firebase.firestore()
      .collection('users')
      .doc(userID.email)
      .get();

    const userInfo = userInfoSnap.data();
    if (userInfo) {
      userDetails.innerHTML = `
        <h3>${userInfo.name}</h3>
        <h3>${userInfo.email}</h3>
        <h3>${userInfo.ambientT}</h3>
      `;
    }
  } else {
    userDetails.innerHTML = `
      <h3>Please login</h3>
    `;
  }
}

async function getuserInfoRealtime(user) {
  if (user) {
    const userdocRef = await firebase.firestore().collection('users').doc(user.email);
    userdocRef.onSnapshot((doc) => {
      if (doc.exists) {
        const userInfo = doc.data();
        if (userInfo) {
          userDetails.innerHTML = `
            <ul class="collection">
              <li class="collection-item">Ambient T - ${userInfo.ambientT}</li>
              <li class="collection-item">Body T - ${userInfo.bodyT}</li>
              <li class="collection-item">File Name - ${userInfo.file_name}</li>
              <li class="collection-item">File URL - ${userInfo.file_url}</li>
              <li class="collection-item">HR - ${userInfo.hr}</li>
              <li class="collection-item">SPO2 - ${userInfo.spo2}</li>
              <li class="collection-item">User ID - ${userInfo.user_id}</li>
            </ul>
            
          `;
        }
      }
    });
  } else {
    userDetails.innerHTML = `
      <h3>Please login</h3>
    `;
  }
}

function updateUserProfile(e) {
  e.preventDefault();
  const userDocRef = firebase.firestore()
    .collection('users')
    .doc(firebase.auth().currentUser.uid.email);

  userDocRef.update({
    name: editProfile["name"].value,
    email: editProfile["profileEmail"].value,
    phone: editProfile["phoneno"].value,
    specialty: editProfile["specialty"].value,
    portfolioUrl: editProfile["prorfolioUrl"].value,
    experience: editProfile["experience"].value
  });

  M.Modal.getInstance(myModel[2]).close();
}

function uploadImage(e) {
  console.log(e.target.files[0]);
  const uid = firebase.auth().currentUser.uid;
  const fileRef = firebase.storage().ref().child(`/users/${uid}/profile`);
  const uploadTask = fileRef.put(e.target.files[0]);
  uploadTask.on('state_changed',
    (snapshot) => {
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      if (progress == '100') alert('uploaded');
    },
    (error) => {
      console.log(error);
    },
    () => {
      uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
        console.log('File available at', downloadURL);
        document.querySelector('#proimg').src = downloadURL;
        firebase.auth().currentUser.updateProfile({
          photoURL: downloadURL
        });
      });
    }
  );
}

async function allUserDetails() {
  document.getElementById('table').style.display = 'table';
  const userRef = await firebase.firestore().collection('users').get();
  userRef.docs.forEach((doc) => {
    const info = doc.data();
    const downloadButton = `<a href="${info.file_url}" download>Download</a>`;
    document.getElementById('tbody').innerHTML += `
      <tr>
        <td>${info.name}</td>
        <td>${info.email}</td>
        <td>${info.ambientT}</td>
        <td>${info.bodyT}</td>
        <td>${info.file_name}</td>
        <td>${info.file_url}</td>
        <td>${info.hr}</td>
        <td>${info.spo2}</td>
        
      </tr>
    `;
  });
}
