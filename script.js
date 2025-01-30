import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, getDoc, doc } from "firebase/firestore";

// Firebase Configuration (REPLACE WITH YOUR ACTUAL CONFIG)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID" // Optional
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function addCustomer(e) {
    e.preventDefault();
    const name = document.getElementById('customerName').value;
    const phone = document.getElementById('customerPhone').value;
    const address = document.getElementById('customerAddress').value;

    try {
        await addDoc(collection(db, "customers"), { name, phone, address });
        alert('Customer added successfully!');
        document.getElementById('addCustomerForm').reset(); // Clear form
        updateCustomerList();
    } catch (error) {
        console.error("Error adding customer: ", error); // Log the error for debugging
        alert('Error adding customer!');
    }
}

document.getElementById('addCustomerForm').addEventListener('submit', addCustomer);

async function recordMilk(e) {
    e.preventDefault();
    const customerId = document.getElementById('customerList').value;
    const quantity = parseFloat(document.getElementById('milkQuantity').value);
    const fatContent = parseFloat(document.getElementById('fatContent').value);

    try {
        const payment = calculatePayment(quantity, fatContent);
        await addDoc(collection(db, "milkRecords"), { customerId, quantity, fatContent, payment });
        alert('Milk recorded successfully!');
        document.getElementById('milkCollectionForm').reset(); // Clear form
        updateCustomerTable();
    } catch (error) {
        console.error("Error recording milk: ", error); // Log the error
        alert('Error recording milk!');
    }
}

document.getElementById('milkCollectionForm').addEventListener('submit', recordMilk);

async function updateCustomerList() {
    const customerList = document.getElementById('customerList');
    customerList.innerHTML = '<option value="">Select Customer</option>';
    const querySnapshot = await getDocs(collection(db, "customers"));
    querySnapshot.forEach((doc) => {
        const option = document.createElement('option');
        option.value = doc.id;
        option.textContent = doc.data().name;
        customerList.appendChild(option);
    });
}

async function updateCustomerTable() {
    const tableBody = document.querySelector('#customerTable tbody');
    tableBody.innerHTML = '';

    try {
        const milkRecordsSnapshot = await getDocs(collection(db, "milkRecords"));

        for (const docSnap of milkRecordsSnapshot.docs) {
            const record = docSnap.data();
            const customerRef = doc(db, "customers", record.customerId);
            const customerDoc = await getDoc(customerRef);

            if (customerDoc.exists()) { // Check if the customer document exists
                const customer = customerDoc.data();
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${customer.name}</td>
                    <td>${customer.phone}</td>
                    <td>${customer.address}</td>
                    <td>${record.quantity}</td>
                    <td>${record.fatContent}</td>
                    <td>${record.payment.toFixed(2)}</td>
                `;
                tableBody.appendChild(row);
            } else {
                console.error("Customer document not found for ID:", record.customerId);
                // Handle the case where the customer document is missing
            }
        }
    } catch (error) {
        console.error("Error updating customer table:", error);
    }
}



function calculatePayment(quantity, fatContent) {
    const baseRate = 50;
    return quantity * baseRate * (1 + fatContent / 100);
}

updateCustomerList();
updateCustomerTable();
