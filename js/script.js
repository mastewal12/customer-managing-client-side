function showNotification(message, type = "success") {
    const notification = document.getElementById("notification");
    notification.className = `alert alert-${type}`;
    notification.textContent = message;

    // Show the notification with a pop-up effect
    notification.classList.add("show");
    notification.classList.remove("d-none");
    
    setTimeout(() => {
        // Hide the notification with the reverse effect
        notification.classList.remove("show");
        setTimeout(() => {
            notification.classList.add("d-none");
        }, 300); 
    }, 3000); 
}

function displayForm(formId) {
    const forms = ["customer-table", "new-form", "edit-form"];
    forms.map(id => {
		if(id){
			document.getElementById("image").style.display = "none"
		}
        
        const element = document.getElementById(id); 
        if (id === formId) {
			element.style.display = "block";
        } else {
			element.style.display = "none";
        }
    });
}

function displayCustomers() {
    displayForm("customer-table");
    fetchCustomers();
}

document.getElementById("insert-customer-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const data = {
        name: formData.get("name"),
        address: formData.get("address"),
        company: formData.get("company"),
    };

    fetch("https://customer-managing-server-side-5.onrender.com/insert-customer-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    })
    .then((response) => {
		console.log(response)
        showNotification("Customer info added successfully!", "success");
		fetchCustomers();
        displayCustomers(); 
    })
    .catch((error) => {
        showNotification(error.message || "Failed to add customer info.", "danger");
    });
});

function fetchCustomers() {
    fetch("https://customer-managing-server-side-5.onrender.com/customers")
        .then((response) => response.json())
        .then((data) => {
            const customerList = document.getElementById("customer-list");
            customerList.innerHTML = "";
            data.map((customer, index) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${customer.name}</td>
                    <td>${customer.address}</td>
                    <td>${customer.company}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="fetchCustomerById(${customer.ID})">Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteUserById(${customer.ID})">Delete</button>
                    </td>
                `;
                customerList.appendChild(row);
            });
        });
}

function fetchCustomerById(id) {
    fetch(`https://customer-managing-server-side-5.onrender.com/customers/${id}`)
        .then((response) => response.json())
        .then((data) => {
            document.querySelector("#edit-form input[name=id]").value = data.id;
            document.querySelector("#edit-form input[name=editName]").value = data.name;
            document.querySelector("#edit-form input[name=editAdress]").value = data.address;
            document.querySelector("#edit-form input[name=editCompany]").value = data.company;
            displayForm('edit-form');
        })
        .catch(() => {
            showNotification("Failed to fetch customer data.", "danger");
        });
}

function editCustomer(e) {
    e.preventDefault();
    const id = document.querySelector("#edit-form input[name=id]").value;
    const newName = document.querySelector("#edit-form input[name=editName]").value;
    const newAddress = document.querySelector("#edit-form input[name=editAdress]").value;
    const newCompany = document.querySelector("#edit-form input[name=editCompany]").value;

    fetch("https://customer-managing-server-side-5.onrender.com/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, newName, newAddress, newCompany }),
    })
    .then((response) => console.log(response))
    .then(() => {
        showNotification("Customer name updated successfully!", "success");
        displayForm('customer-table');
        fetchCustomers(); // Refresh customer list
    })
    .catch(() => {
        showNotification("Failed to update customer name.", "danger");
    });
}

function deleteUserById(id) {
    if (confirm("Are you sure you want to delete this customer?")) {
        fetch("https://customer-managing-server-side-5.onrender.com/remove-user", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        })
        .then((response) => console.log(response))
        .then(() => {
            showNotification("Customer deleted successfully!", "success");
            fetchCustomers();
        })
        .catch(() => {
            showNotification("Failed to delete customer.", "danger");
        });
    }
}

document.getElementById("edit-form").addEventListener("submit", editCustomer);