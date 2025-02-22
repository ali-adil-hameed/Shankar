function index() {
  const uid = sessionStorage.getItem('uid');
  const email = sessionStorage.getItem('email');
  if (uid && email || uid != 'undefined' && email != 'undefined' || uid != '' && email != '' || uid != 'null' && email != 'null') {
      // window.location.href = "project.html";
  }

  signIn.addEventListener('click', e => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    firebase.auth().signInWithEmailAndPassword(email, password).then((userCredential) => {
      sessionStorage.setItem('uid', userCredential.user.uid);
      sessionStorage.setItem('email', userCredential.email);
      window.location.href = "StatementOfAccount.html";
    })
    .catch((error) => {
      // Handle Errors here.
      const errorMessage = error.message;
      document.getElementById('message').innerText = errorMessage;
    });
});
}
    

  
