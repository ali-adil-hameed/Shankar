function index() {
  const loader = document.getElementById('loader');
  const content = document.getElementById('content');
  const messageElement = document.getElementById('message');

  function showLoader() {
    if (loader) loader.style.display = 'block';
    if (content) content.style.display = 'none';
  }

  function hideLoader() {
    if (loader) loader.style.display = 'none';
    if (content) content.style.display = 'block';
  }

  function showMessage(message, isError = true) {
    if (messageElement) {
      messageElement.innerText = message;
      messageElement.className = isError ? 'w3-text-red' : 'w3-text-green';
    }
  }

  async function checkExistingSession() {
    const uid = sessionStorage.getItem('uid');
    const email = sessionStorage.getItem('email');
    
    if (uid && email && uid !== 'undefined' && uid !== 'null') {
      try {
        const user = await firebase.auth().currentUser;
        if (user) {
          window.location.href = "home.html";
          return true;
        }
      } catch (error) {
        console.error("Session verification failed:", error);
        sessionStorage.clear();
      }
    }
    return false;
  }

  function validateInput(email, password) {
    if (!email || !password) {
      showMessage("Please enter both email and password");
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showMessage("Please enter a valid email address");
      return false;
    }
    
    if (password.length < 6) {
      showMessage("Password must be at least 6 characters long");
      return false;
    }
    
    return true;
  }

  async function handleSignIn(email, password) {
    showLoader();
    try {
      const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
      sessionStorage.setItem('uid', userCredential.user.uid);
      sessionStorage.setItem('email', userCredential.user.email);
      showMessage("Login successful! Redirecting...", false);
      window.location.href = "home.html";
    } catch (error) {
      showMessage(error.message);
    } finally {
      hideLoader();
    }
  }

  async function initialize() {
    if (await checkExistingSession()) return;

    document.getElementById('signIn').addEventListener('click', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      
      if (validateInput(email, password)) {
        await handleSignIn(email, password);
      }
    });

    // Add enter key support
    document.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        document.getElementById('signIn').click();
      }
    });
  }

  // Start initialization
  initialize().catch(error => {
    console.error("Initialization failed:", error);
    showMessage("An error occurred. Please try again later.");
  });
}
    

  
