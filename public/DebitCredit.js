
const loadProject = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('projectId');

    if (projectId) {
        displayData(projectId);
    } else {
        console.error("No project ID found in the URL.");
    }

    const uid = sessionStorage.getItem('uid');
    const email = sessionStorage.getItem('email');
    if (!uid || !email) {
        window.location.href = "index.html";
    }

    // displayData(projectId)
    const Credit = document.getElementById('Credit');
    const Debit = document.getElementById('Debit');
    const Note = document.getElementById('Note');
    
    function displayData(projectId) {
        const database = firebase.firestore();
        const tableBody = document.getElementById('Body');
        let totalCredit = 0;
        let totalDebit = 0;
        tableBody.innerHTML = '';
        database.collection('StatementOfAccount').doc(projectId).collection('DebitCredit')
        .orderBy('StartDate', 'desc')
        .get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                const projectData = doc.data();
                const row = document.createElement('tr');
                var Credit = parseFloat(projectData.Credit);
                var Debit = parseFloat(projectData.Debit);

                row.innerHTML = `
                <td> <div align="center">${projectData.Credit}</div></td>
                <td> <div align="center">${projectData.Debit}</div></td>
                <td> <div align="center">${projectData.Note}</div></td>
                <td><div align="center">${projectData.StartDate.toDate().toLocaleDateString()}</div></td>
                    <td class="hideInfo">
                    <div style="display: flex;">
                    <div style="width: 40%; margin-right: 20px; " class="w3-border w3-hover-light-green w3-round-large w3-center editBtn" data-id="${doc.id}">Edit</div>
                    <div style="width: 40%; margin-right: 20px; " class="w3-border w3-hover-light-green w3-round-large w3-center deleteBtn" data-id="${doc.id}">Delete</div>
                    </div>
                    </td>
                    `;
                    tableBody.appendChild(row);
                    totalCredit += Credit;
                    totalDebit += Debit;
            });

            const footerRow = document.createElement('tr');
            footerRow.innerHTML = `
                <td><div align="center">${new Intl.NumberFormat().format(totalCredit)}</div></td>
                <td><div align="center">${new Intl.NumberFormat().format(totalDebit)}</div></td>
                <td colspan="2"></td>
                <td><div align="center">Total</div></td>
            `;
            tableBody.appendChild(footerRow);

            const footerRow1 = document.createElement('tr');
            footerRow1.innerHTML = `
                <td><div align="center">${new Intl.NumberFormat().format(totalDebit - totalCredit)}</div></td>
                <td colspan="3"></td>
                <td><div align="center">Statement of Account</div></td>
            `;
            tableBody.appendChild(footerRow1);
            
            tableBody.addEventListener('click', event => {
                   
                const target = event.target;
                
                const dataId = target.getAttribute('data-id');
                // const projectId = target.getAttribute('data-id');
                if (target.classList.contains('editBtn')) {
                    populateEditModal(projectId, dataId);
                } else if (target.classList.contains('deleteBtn')) {
                    deleteProject(projectId, dataId);
                }
            });
        })
        .catch(error => {
            console.error("Error fetching projects: ", error);
        });
    }

    document.getElementById('filterBtn').disabled = true;

    // Add event listener for start date input
    document.getElementById('startDate').addEventListener('change', () => {
        // Check if both start and end dates are set
        validateDateInputs();
    });

    // Add event listener for end date input
    document.getElementById('endDate').addEventListener('change', () => {
        // Check if both start and end dates are set
        validateDateInputs();
    });

    // Add event listener for filter button
    filterBtn.addEventListener('click', () => {
        // Call displayData function with filtered date range
        displayDataWithFilter(projectId);
        });
    
    function displayDataWithFilter(projectId) {
        const database = firebase.firestore();
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const tableBody = document.getElementById('Body');
        tableBody.innerHTML = ''; 
    
        const startTimestamp = firebase.firestore.Timestamp.fromDate(new Date(startDate + 'T00:00:00'));
        const endTimestamp = firebase.firestore.Timestamp.fromDate(new Date(endDate + 'T23:59:59'));
        let totalCredit = 0;
        let totalDebit = 0;

        database.collection('StatementOfAccount').doc(projectId).collection('DebitCredit')
        .where('StartDate', '>=', startTimestamp)
        .where('StartDate', '<=', endTimestamp)
        .orderBy('StartDate', 'desc').get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                const projectData = doc.data();
                const row = document.createElement('tr');
                var Credit = parseFloat(projectData.Credit);
                var Debit = parseFloat(projectData.Debit);
                row.innerHTML = `
                <td> <div align="center">${projectData.Credit}</div></td>
                <td> <div align="center">${projectData.Debit}</div></td>
                <td> <div align="center">${projectData.Note}</div></td>
                <td><div align="center">${projectData.StartDate.toDate().toLocaleDateString()}</div></td>
                    <td class="hideInfo">
                    <div style="display: flex;">
                    <div style="width: 40%; margin-right: 20px; " class="w3-border w3-hover-light-green w3-round-large w3-center editBtn" data-id="${doc.id}">Edit</div>
                    <div style="width: 40%; margin-right: 20px; " class="w3-border w3-hover-light-green w3-round-large w3-center deleteBtn" data-id="${doc.id}">Delete</div>
                    </div>
                    </td>
                    `;
                    tableBody.appendChild(row);
                    totalCredit += Credit;
                    totalDebit += Debit;
            });

            const footerRow = document.createElement('tr');
            footerRow.innerHTML = `
                <td><div align="center">${new Intl.NumberFormat().format(totalCredit)}</div></td>
                <td><div align="center">${new Intl.NumberFormat().format(totalDebit)}</div></td>
                <td colspan="2"></td>
                <td><div align="center">Total</div></td>
            `;
            tableBody.appendChild(footerRow);

            const footerRow1 = document.createElement('tr');
            footerRow1.innerHTML = `
                <td><div align="center">${new Intl.NumberFormat().format(totalDebit - totalCredit)}</div></td>
                <td colspan="3"></td>
                <td><div align="center">Statement of Account</div></td>
            `;
            tableBody.appendChild(footerRow1);
            tableBody.addEventListener('click', event => {               
                const target = event.target;
                
                const dataId = target.getAttribute('data-id');
                // const projectId = target.getAttribute('data-id');
                if (target.classList.contains('editBtn')) {
                    // console.log('projectId= '+ projectId + 'dataId=' + dataId);
                    populateEditModal(projectId, dataId);
                } else if (target.classList.contains('deleteBtn')) {
                    // console.log('projectId= '+ projectId + 'dataId=' + dataId);
                    deleteProject(projectId, dataId);
                }
            });
        })
        .catch(error => {
            console.error("Error fetching projects: ", error);
        });
    }
    
    function validateDateInputs() {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;

        // Enable filter button if both start and end dates are set
        if (startDate && endDate) {
            document.getElementById('filterBtn').disabled = false;
        } else {
            document.getElementById('filterBtn').disabled = true;
        }
    }

    downloadBtn.addEventListener('click', () => {
        const table = document.getElementById('dataTable');
        const rows = table.getElementsByTagName('tr');
        const data = [];
    
        // Get header row and add to data array
        const headerRow = table.querySelector('thead tr');
        const headerCols = headerRow.querySelectorAll('th:not(.hideInfo)');
        const headerRowData = [];
        for (let i = 0; i < headerCols.length; i++) {
            headerRowData.push(headerCols[i].innerText);
        }
        data.push(headerRowData);
    
        // Add data rows to data array
        for (let i = 1; i < rows.length; i++) { // Start from the second row
            const row = [];
            const cols = rows[i].querySelectorAll('td:not(.hideInfo)'); // Exclude action column
    
            for (let j = 0; j < cols.length; j++) {
                row.push(cols[j].innerText);
            }
    
            data.push(row);
        }
    
        // Convert data array to worksheet
        const worksheet = XLSX.utils.aoa_to_sheet(data);
    
        // Create a workbook with the worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    
        // Write the workbook to a file
        XLSX.writeFile(workbook, `StatementOfAccount.xlsx`);
    });
    
    
    function populateEditModal(projectId, dataId) {
        const database = firebase.firestore();
        const projectRef = database.collection('StatementOfAccount').doc(projectId).collection('DebitCredit').doc(dataId);
        const UpdatetCredit = document.getElementById('UpdatetCredit');
        const UpdateDebit = document.getElementById('UpdateDebit');
        const UpdateNote = document.getElementById('UpdateNote');
        const updateCreatedDate = document.getElementById('updateCreatedDate');
    
        projectRef.get().then(doc => {
            if (doc.exists) {
                const projectData = doc.data();
                UpdatetCredit.value = projectData.Credit;
                UpdateDebit.value = projectData.Debit;
                UpdateNote.value = projectData.Note;
    
                document.getElementById('id02').style.display = 'block';
                const createdDate = projectData.StartDate.toDate();
                const year = createdDate.getFullYear();
                const month = String(createdDate.getMonth() + 1).padStart(2, '0');
                const day = String(createdDate.getDate()).padStart(2, '0');
                updateCreatedDate.value = `${year}-${month}-${day}`;
    
                const updateBtn = document.getElementById('UpdateBtn');
                updateBtn.onclick = function() {
                    projectRef.update({
                        Credit: UpdatetCredit.value,
                        Debit: UpdateDebit.value,
                        Note: UpdateNote.value,
                        StartDate: firebase.firestore.Timestamp.fromDate(new Date(document.getElementById('updateCreatedDate').value + 'T00:00:00')),
                    }).then(() => {
                        let totalCredit = 0;
                        let totalDebit = 0;
                        const database = firebase.firestore();
                        database.collection('StatementOfAccount').doc(projectId).collection('DebitCredit')
                        .orderBy('StartDate', 'desc')
                        .get().then(querySnapshot => {
                            querySnapshot.forEach(doc => {
                                const projectData = doc.data();
                                var Credit = parseFloat(projectData.Credit);
                                var Debit = parseFloat(projectData.Debit);
                                    totalCredit += Credit;
                                    totalDebit += Debit;
                            });
                            database.collection('StatementOfAccount').doc(projectId)
                            .update({
                                'StatementOfAccount': totalDebit - totalCredit                                        
                            }).catch(error => {
                                console.error("Error updating price: ", error);
                            });
                            location.reload();
                        })
                        .catch(error => {
                            console.error("Error fetching projects: ", error);
                        });
                    }).catch(error => {
                        console.error("Error updating price: ", error);
                    });
                };
            } else {
                console.error("No such document!");
            }
        }).catch(error => {
            console.error("Error getting document:", error);
        });
    }
    
    
    function deleteProject(projectId, dataId) {
        const confirmDelete = confirm("Are you sure you want to delete this record?");
        if (confirmDelete) {
            const database = firebase.firestore();
            const priceRef = database.collection('StatementOfAccount').doc(projectId).collection('DebitCredit').doc(dataId);
            priceRef.delete().then(() => {
                let totalCredit = 0;
                let totalDebit = 0;
                const database = firebase.firestore();
                database.collection('StatementOfAccount').doc(projectId).collection('DebitCredit')
                .orderBy('StartDate', 'desc')
                .get().then(querySnapshot => {
                    querySnapshot.forEach(doc => {
                        const projectData = doc.data();
                        var Credit = parseFloat(projectData.Credit);
                        var Debit = parseFloat(projectData.Debit);
                            totalCredit += Credit;
                            totalDebit += Debit;
                    });
                    database.collection('StatementOfAccount').doc(projectId)
                    .update({
                        'StatementOfAccount': totalDebit - totalCredit                                        
                    }).catch(error => {
                        console.error("Error updating price: ", error);
                    });
                    location.reload();
                })
                .catch(error => {
                    console.error("Error fetching projects: ", error);
                });
            }).catch(error => {
                console.error("Error deleting price: ", error);
            });
        }
    }
    
    // add data to firsbase Database
    addBtn.addEventListener('click', e => {
        e.preventDefault();
        const database = firebase.firestore();
        const usercollection = database.collection('StatementOfAccount').doc(projectId).collection('DebitCredit').doc();      
        const dateValue = document.getElementById('createdDate').value;
        const createdDateTime = new Date(dateValue + 'T00:00:00');
        usercollection.set({
            Credit: Credit.value,
            Debit: Debit.value,
            Note: Note.value,
            StartDate: firebase.firestore.Timestamp.fromDate(createdDateTime),
        }).then(() => {
            // Data successfully uploaded, refresh the webpage
            let totalCredit = 0;
            let totalDebit = 0;
            const database = firebase.firestore();
            database.collection('StatementOfAccount').doc(projectId).collection('DebitCredit')
            .orderBy('StartDate', 'desc')
            .get().then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    const projectData = doc.data();
                    var Credit = parseFloat(projectData.Credit);
                    var Debit = parseFloat(projectData.Debit);
                        totalCredit += Credit;
                        totalDebit += Debit;
                });
                database.collection('StatementOfAccount').doc(projectId)
                .update({
                    'StatementOfAccount': totalDebit - totalCredit                                        
                }).catch(error => {
                    console.error("Error updating price: ", error);
                });
                location.reload();
            })
            .catch(error => {
                console.error("Error fetching projects: ", error);
            });
        }).catch(error => {
            console.error("Error adding document: ", error);
        }); 
    });

    expandBtn.addEventListener("click", e => {
        var expandableView = document.getElementById("expandableView");
        if (expandableView.classList.contains("hidden")) {
            expandableView.classList.remove("hidden");
        } else {
            expandableView.classList.add("hidden");
        }
    });

    }
    
