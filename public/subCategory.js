
const loadSubCategory = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('projectId');
    const subCategory = urlParams.get('subCategory');
    const Price = document.getElementById('Price');
    const Note = document.getElementById('Note');
    const pageTitle = document.getElementById('pageTitle');
    pageTitle.innerHTML += subCategory;
    if (projectId) {
        displayData(projectId);
    } else {
        console.error("No project ID found in the URL.");
    }
        
    addBtn.addEventListener('click', e => {
        e.preventDefault();
        const database = firebase.firestore();
        const usercollection = database.collection('Project').doc(projectId).collection(subCategory).doc();        
        const dateValue = document.getElementById('createdDate').value;
        const createdDateTime = new Date(dateValue + 'T00:00:00');
        usercollection.set({
            Price: Price.value,
            Note: Note.value,
            CreatedDate: firebase.firestore.Timestamp.fromDate(createdDateTime),
        }).then(() => {
            location.reload();
        }).catch(error => {
            console.error("Error adding document: ", error);
        });
    });
    

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
        const bodyTable = document.getElementById('Body');
        bodyTable.innerHTML = ''; 
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        let totalPrice = 0;
    
        const startTimestamp = firebase.firestore.Timestamp.fromDate(new Date(startDate + 'T00:00:00'));
        const endTimestamp = firebase.firestore.Timestamp.fromDate(new Date(endDate + 'T23:59:59'));
    
        database.collection('Project').doc(projectId).collection(subCategory)
            .where('CreatedDate', '>=', startTimestamp)
            .where('CreatedDate', '<=', endTimestamp)
            .orderBy('CreatedDate', 'desc')
            .get()
            .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                const projectData = doc.data();
                projectData.projectId = doc.id;
                const row = document.createElement('tr');
                var price = parseFloat(projectData.Price);
                row.innerHTML = `
                <td> <div align="center">${Intl.NumberFormat().format(price)}</div></td>
                <td> <div align="center">${projectData.Note}</div></td>
                <td><div align="center">${projectData.CreatedDate.toDate().toLocaleDateString()}</div></td>
                <td class="hideInfo">
                <div style="display: flex;">
                <div style="width: 40%; margin-right: 20px; " class="w3-border w3-hover-light-green w3-round-large w3-center editBtn" data-id="${projectData.projectId}">Edit</div>
                <div style="width: 40%; margin-right: 20px; " class="w3-border w3-hover-light-green w3-round-large w3-center deleteBtn" data-id="${projectData.projectId}">Delete</div>
                </div>
                </td>
                `;
                bodyTable.appendChild(row);
                totalPrice += parseFloat(projectData.Price);
        });
    
                const footerRow = document.createElement('tr');
                footerRow.innerHTML = `
                    <td><div align="center">${new Intl.NumberFormat().format(totalPrice)}</div></td>
                    <td colspan="2"></td>
                    <td><div align="center">Total</div></td>
                `;
                bodyTable.appendChild(footerRow);
            
            bodyTable.addEventListener('click', event => {
                const target = event.target;
                const dataId = target.getAttribute('data-id');
    
                if (target.classList.contains('viewBtn')) {
                    window.location.href = `navigation.html?projectId=${projectId}`;
                } else if (target.classList.contains('editBtn')) {
                    populateEditModal(projectId, dataId);
                } else if (target.classList.contains('deleteBtn')) {
                    deleteData(projectId, dataId);
                }
            });
            }).catch(error => {
                console.error("Error fetching data: ", error);
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
        XLSX.writeFile(workbook, `${subCategory}.xlsx`);
    });
    
    
    
    function displayData(projectId) {
        const database = firebase.firestore();
        const bodyTable = document.getElementById('Body');
        bodyTable.innerHTML = ''; 
        let totalPrice = 0;
        database.collection('Project').doc(projectId).collection(subCategory)
            .orderBy('CreatedDate', 'desc')
            .get()
            .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                
                const projectData = doc.data();
                projectData.projectId = doc.id;
                const row = document.createElement('tr');
                var price = parseFloat(projectData.Price);

                row.innerHTML = `
                <td> <div align="center">${Intl.NumberFormat().format(price)}</div></td>
                <td> <div align="center">${projectData.Note}</div></td>
                <td><div align="center">${projectData.CreatedDate.toDate().toLocaleDateString()}</div></td>
                <td class="hideInfo">
                <div style="display: flex;">
                <div style="width: 40%; margin-right: 20px; " class="w3-border w3-hover-light-green w3-round-large w3-center editBtn" data-id="${projectData.projectId}">Edit</div>
                <div style="width: 40%; margin-right: 20px; " class="w3-border w3-hover-light-green w3-round-large w3-center deleteBtn" data-id="${projectData.projectId}">Delete</div>
                </div>
                </td>
                `;
                bodyTable.appendChild(row);
                totalPrice += price;
            });
            const footerRow = document.createElement('tr');
            footerRow.innerHTML = `
                <td><div align="center">${new Intl.NumberFormat().format(totalPrice)}</div></td>
                <td colspan="2"></td>
                <td><div align="center">Total</div></td>
            `;
            bodyTable.appendChild(footerRow);
            
            bodyTable.addEventListener('click', event => {
                const target = event.target;
                const dataId = target.getAttribute('data-id');
    
                if (target.classList.contains('viewBtn')) {
                    window.location.href = `navigation.html?projectId=${projectId}`;
                } else if (target.classList.contains('editBtn')) {
                    populateEditModal(projectId, dataId);
                } else if (target.classList.contains('deleteBtn')) {
                    deleteData(projectId, dataId);
                }
            });
        }).catch(error => {
            console.error("Error fetching data: ", error);
        });
    }
    
    
    function populateEditModal(projectId, dataId) {
        const database = firebase.firestore();
        const priceRef = database.collection('Project').doc(projectId).collection(subCategory).doc(dataId);
        const UpdatePrice = document.getElementById('UpdatePrice');
        const UpdateNote = document.getElementById('UpdateNote');
        const updateCreatedDate = document.getElementById('updateCreatedDate');
    
        priceRef.get().then(doc => {
            if (doc.exists) {
                const priceData = doc.data();
                UpdatePrice.value = priceData.Price;
                UpdateNote.value = priceData.Note;
    
                document.getElementById('id02').style.display = 'block';
                const createdDate = priceData.CreatedDate.toDate();
                const year = createdDate.getFullYear();
                const month = String(createdDate.getMonth() + 1).padStart(2, '0');
                const day = String(createdDate.getDate()).padStart(2, '0');
                updateCreatedDate.value = `${year}-${month}-${day}`;
    
                const updateBtn = document.getElementById('UpdateBtn');
                updateBtn.onclick = function() {
                    priceRef.update({
                        Price: UpdatePrice.value,
                        Note: UpdateNote.value,
                        CreatedDate: firebase.firestore.Timestamp.fromDate(new Date(document.getElementById('updateCreatedDate').value + 'T00:00:00')),
                    }).then(() => {
                        location.reload();
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
    
    
    function deleteData(projectId, dataId) {
        const confirmDelete = confirm("Are you sure you want to delete this record?");
        if (confirmDelete) {
            const database = firebase.firestore();
            const priceRef = database.collection('Project').doc(projectId).collection(subCategory).doc(dataId);
            priceRef.delete().then(() => {
                location.reload();
            }).catch(error => {
                console.error("Error deleting price: ", error);
            });
        }
    }

    expandBtn.addEventListener("click", e => {
        var expandableView = document.getElementById("expandableView");
        if (expandableView.classList.contains("hidden")) {
            expandableView.classList.remove("hidden");
        } else {
            expandableView.classList.add("hidden");
        }
    });    
    
    }