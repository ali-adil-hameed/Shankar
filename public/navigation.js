function navigation(){
    const uid = sessionStorage.getItem('uid');
    const email = sessionStorage.getItem('email');
    if (!uid || !email) {
        window.location.href = "index.html";
    }

    function redirectToTable(tableType) {
        // Define the URL for the respective table page
        let tablePage;
        if (tableType === 'expense') {
            tablePage = 'subCategory.html?subCategory=Expense';
        } else if (tableType === 'invoice') {
            tablePage = 'subCategory.html?subCategory=Invoice';
        } else if (tableType === 'price') {
            tablePage = 'subCategory.html?subCategory=Price';
        }
        window.location.href = `${tablePage}&&projectId=${projectId}`;
    }
    
    // Add click event listeners to the buttons
    document.getElementById('expenseBtn').addEventListener('click', () => {
        redirectToTable('expense');
    });
    
    document.getElementById('invoiceBtn').addEventListener('click', () => {
        redirectToTable('invoice');
    });
    
    document.getElementById('priceBtn').addEventListener('click', () => {
        redirectToTable('price');
    });
}
