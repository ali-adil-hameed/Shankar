function home(){
    const uid = sessionStorage.getItem('uid');
    const email = sessionStorage.getItem('email');
    if (!uid || !email) {
        window.location.href = "index.html";
    }

    function redirectToTable(tableType) {
        // Define the URL for the respective table page
        let tablePage;
        if (tableType === 'StatementOfAccount') {
            tablePage = 'StatementOfAccount.html';
        } else if (tableType === 'expense') {
            tablePage = 'homeCategory.html?homeCategory=Expense';
        } else if (tableType === 'Income') {
            tablePage = 'homeCategory.html?homeCategory=Income';
        } else if (tableType === 'Project') {
            tablePage = 'project.html';
        }
        window.location.href = `${tablePage}`;
    }
    
    // Add click event listeners to the buttons
    document.getElementById('Expense').addEventListener('click', () => {
        redirectToTable('expense');
    });
    
    document.getElementById('Income').addEventListener('click', () => {
        redirectToTable('Income');
    });
    
    document.getElementById('Project').addEventListener('click', () => {
        redirectToTable('Project');
    });
    
    document.getElementById('StatementOfAccount').addEventListener('click', () => {
        redirectToTable('StatementOfAccount');
    });
    
    document.getElementById('signOut').addEventListener('click', e => {
        firebase.auth().signOut()
          .then(() => {
            sessionStorage.removeItem('uid');
            sessionStorage.removeItem('email');
            window.location.href = "index.html";
          })
          .catch((error) => {
            // An error happened.
            console.error(error);
          });
        });
}
