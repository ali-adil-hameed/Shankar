function home() {
    const loader = document.getElementById('loader');
    const content = document.getElementById('content');

    function showLoader() {
        loader.style.display = 'block';
        content.style.display = 'none';
    }

    function hideLoader() {
        loader.style.display = 'none';
        content.style.display = 'block';
    }

    function handleError(error) {
        console.error(error);
        alert('An error occurred. Please try again later.');
    }

    async function checkAuth() {
        showLoader();
        try {
            const uid = sessionStorage.getItem('uid');
            const email = sessionStorage.getItem('email');
            
            if (!uid || !email || uid === 'undefined' || uid === 'null') {
                window.location.href = "index.html";
                return false;
            }
            
            // Verify with Firebase
            const user = firebase.auth().currentUser;
            if (!user) {
                sessionStorage.clear();
                window.location.href = "index.html";
                return false;
            }
            
            return true;
        } catch (error) {
            handleError(error);
            return false;
        } finally {
            hideLoader();
        }
    }

    function redirectToTable(tableType) {
        showLoader();
        try {
            let tablePage;
            switch(tableType.toLowerCase()) {
                case 'statementofaccount':
                    tablePage = 'StatementOfAccount.html';
                    break;
                case 'expense':
                    tablePage = 'DebitCredit.html?type=expense';
                    break;
                case 'income':
                    tablePage = 'DebitCredit.html?type=income';
                    break;
                default:
                    throw new Error('Invalid table type');
            }
            window.location.href = tablePage;
        } catch (error) {
            handleError(error);
            hideLoader();
        }
    }

    async function initialize() {
        if (!await checkAuth()) return;

        // Add click event listeners to the buttons
        const buttons = ['StatementOfAccount', 'Expense', 'Income'];
        buttons.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('click', () => redirectToTable(id));
            }
        });
        
        // Sign out handler
        document.getElementById('signOut').addEventListener('click', async () => {
            showLoader();
            try {
                await firebase.auth().signOut();
                sessionStorage.clear();
                window.location.href = "index.html";
            } catch (error) {
                handleError(error);
                hideLoader();
            }
        });
    }

    // Start initialization
    initialize().catch(handleError);
}
