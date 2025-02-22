
const loadProject = async () => {
    const uid = sessionStorage.getItem('uid');
    const email = sessionStorage.getItem('email');
    if (!uid || !email) {
        window.location.href = "index.html";
    }
    displayProjects()
    const Note = document.getElementById('Note');
    const ProjectName = document.getElementById('ProjectName');
    const PersonName = document.getElementById('PersonName');
    const Phone = document.getElementById('Phone');
    
    function displayProjects() {
        const database = firebase.firestore();
        const tableBody = document.getElementById('Body');
        tableBody.innerHTML = '';
        database.collection('Project').orderBy('StartDate', 'desc').get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                const projectData = doc.data();
                const row = document.createElement('tr');
                row.innerHTML = `
                <td> <div align="center">${projectData.ProjectName}</div></td>
                <td> <div align="center">${projectData.PersonName}</div></td>
                <td> <div align="center">${projectData.Phone}</div></td>
                <td> <div align="center">${projectData.Note}</div></td>
                <td><div align="center">${projectData.StartDate.toDate().toLocaleDateString()}</div></td>
                    <td class="hideInfo">
                    <div style="display: flex;">
                    <div style="width: 40%; margin-right: 20px; " class="w3-border w3-hover-light-green w3-round-large w3-center viewBtn" data-id="${doc.id}">View</div>
                    <div style="width: 40%; margin-right: 20px; " class="w3-border w3-hover-light-green w3-round-large w3-center editBtn" data-id="${doc.id}">Edit</div>
                    <div style="width: 40%; margin-right: 20px; " class="w3-border w3-hover-light-green w3-round-large w3-center deleteBtn" data-id="${doc.id}">Delete</div>
                    </div>
                    </td>
                    `;
                    tableBody.appendChild(row);
            });
            
            tableBody.addEventListener('click', event => {
                const target = event.target;
                const projectId = target.getAttribute('data-id');
                if (target.classList.contains('viewBtn')) {
                    window.location.href = `navigation.html?projectId=${projectId}`;
                } else if (target.classList.contains('editBtn')) {
                    populateEditModal(projectId);
                } else if (target.classList.contains('deleteBtn')) {
                    deleteProject(projectId);
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
        displayDataWithFilter();
        });
    
    function displayDataWithFilter() {
        const database = firebase.firestore();
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const tableBody = document.getElementById('Body');
        tableBody.innerHTML = ''; 
    
        const startTimestamp = firebase.firestore.Timestamp.fromDate(new Date(startDate + 'T00:00:00'));
        const endTimestamp = firebase.firestore.Timestamp.fromDate(new Date(endDate + 'T23:59:59'));

        database.collection('Project')
        .where('StartDate', '>=', startTimestamp)
        .where('StartDate', '<=', endTimestamp)
        .orderBy('StartDate', 'desc').get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                const projectData = doc.data();
                const row = document.createElement('tr');
                row.innerHTML = `
                <td> <div align="center">${projectData.ProjectName}</div></td>
                <td> <div align="center">${projectData.PersonName}</div></td>
                <td> <div align="center">${projectData.Phone}</div></td>
                <td> <div align="center">${projectData.Note}</div></td>
                <td><div align="center">${projectData.StartDate.toDate().toLocaleDateString()}</div></td>
                    <td class="hideInfo">
                    <div style="display: flex;">
                    <div style="width: 40%; margin-right: 20px; " class="w3-border w3-hover-light-green w3-round-large w3-center viewBtn" data-id="${doc.id}">View</div>
                    <div style="width: 40%; margin-right: 20px; " class="w3-border w3-hover-light-green w3-round-large w3-center editBtn" data-id="${doc.id}">Edit</div>
                    <div style="width: 40%; margin-right: 20px; " class="w3-border w3-hover-light-green w3-round-large w3-center deleteBtn" data-id="${doc.id}">Delete</div>
                    </div>
                    </td>
                    `;
                    tableBody.appendChild(row);
            });
            tableBody.addEventListener('click', event => {
                const target = event.target;
                const projectId = target.getAttribute('data-id');
    
                if (target.classList.contains('viewBtn')) {
                    window.location.href = `navigation.html?projectId=${projectId}`;
                } else if (target.classList.contains('editBtn')) {
                    populateEditModal(projectId);
                } else if (target.classList.contains('deleteBtn')) {
                    deleteProject(projectId);
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
        XLSX.writeFile(workbook, `Project.xlsx`);
    });
    
    
    function populateEditModal(projectId) {
        const database = firebase.firestore();
        const projectRef = database.collection('Project').doc(projectId);
        const UpdateProjectName = document.getElementById('UpdateProjectName');
        const UpdatePersonName = document.getElementById('UpdatePersonName');
        const UpdatePhone = document.getElementById('UpdatePhone');
        const UpdateNote = document.getElementById('UpdateNote');
        const updateCreatedDate = document.getElementById('updateCreatedDate');
    
        projectRef.get().then(doc => {
            if (doc.exists) {
                const projectData = doc.data();
                UpdateProjectName.value = projectData.ProjectName;
                UpdatePersonName.value = projectData.PersonName;
                UpdatePhone.value = projectData.Phone;
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
                        ProjectName: UpdateProjectName.value,
                        PersonName: UpdatePersonName.value,
                        Phone: UpdatePhone.value,
                        Note: UpdateNote.value,
                        StartDate: firebase.firestore.Timestamp.fromDate(new Date(document.getElementById('updateCreatedDate').value + 'T00:00:00')),
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
    
    
    function deleteProject(projectId) {
        const confirmDelete = confirm("Are you sure you want to delete this record?");
        if (confirmDelete) {
            const database = firebase.firestore();
            const priceRef = database.collection('Project').doc(projectId);
            priceRef.delete().then(() => {
                location.reload();
            }).catch(error => {
                console.error("Error deleting price: ", error);
            });
        }
    }
    
    // add data to firsbase Database
    addBtn.addEventListener('click', e => {
        e.preventDefault();
        const database = firebase.firestore();
        const usercollection = database.collection('Project').doc();
        const dateValue = document.getElementById('createdDate').value;
        const createdDateTime = new Date(dateValue + 'T00:00:00');
        usercollection.set({
            ProjectName: ProjectName.value,
            PersonName: PersonName.value,
            Phone: Phone.value,
            Note: Note.value,
            StartDate: firebase.firestore.Timestamp.fromDate(createdDateTime),
        }).then(() => {
            // Data successfully uploaded, refresh the webpage
            location.reload();
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
    
