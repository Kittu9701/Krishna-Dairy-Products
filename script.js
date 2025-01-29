import { initializeApp } from "https://www.gstatic.com/firebasejs/10.x.x/firebase-app.js";
import { getDatabase, ref, set, push, onValue } from "https://www.gstatic.com/firebasejs/10.x.x/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD0kXfsV...", // Replace with your actual key
  authDomain: "krishna-dairy-products-1b024.firebaseapp.com",
  databaseURL: "https://krishna-dairy-products-1b024-default-rtdb.firebaseio.com/",
  projectId: "krishna-dairy-products-1b024",
  storageBucket: "krishna-dairy-products-1b024.appspot.com",
  messagingSenderId: "38817783657",
  appId: "1:38817783657:web:5a86fa2694d3bee48ee7f8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Add Customer Form Submission
const addCustomerForm = document.getElementById('addCustomerForm');
addCustomerForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const name = document.getElementById('customerName').value;
  const phone = document.getElementById('customerPhone').value;
  const address = document.getElementById('customerAddress').value;

  const newCustomerRef = push(ref(db, 'customers'));
  set(newCustomerRef, { name, phone, address })
    .then(() => {
      alert('Customer added successfully!');
      addCustomerForm.reset();
      fetchCustomers();
    })
    .catch(error => console.error("Error: ", error));
});

// Fetch Customers and Update Dropdown
function fetchCustomers() {
  const customerList = document.getElementById('customerList');
  customerList.innerHTML = '<option value="">Select Customer</option>';

  onValue(ref(db, 'customers'), (snapshot) => {
    customerList.innerHTML = '<option value="">Select Customer</option>';
    snapshot.forEach(childSnapshot => {
      const customer = childSnapshot.val();
      const option = document.createElement('option');
      option.value = childSnapshot.key;
      option.textContent = customer.name;
      customerList.appendChild(option);
    });
  });
}

// Milk Collection Form Submission
const milkCollectionForm = document.getElementById('milkCollectionForm');
milkCollectionForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const customerId = document.getElementById('customerList').value;
  const quantity = parseFloat(document.getElementById('milkQuantity').value);
  const fatContent = parseFloat(document.getElementById('fatContent').value);
  const payment = calculatePayment(quantity, fatContent);

  if (!customerId) {
    alert('Please select a valid customer.');
    return;
  }

  const newMilkRecordRef = push(ref(db, 'milkRecords'));
  set(newMilkRecordRef, { customerId, quantity, fatContent, payment })
    .then(() => {
      alert('Milk recorded successfully!');
      milkCollectionForm.reset();
      fetchMilkRecords();
    })
    .catch(error => console.error("Error: ", error));
});

// Fetch and Display Milk Records
function fetchMilkRecords() {
  const tableBody = document.querySelector('#customerTable tbody');
  tableBody.innerHTML = '';

  onValue(ref(db, 'milkRecords'), (snapshot) => {
    tableBody.innerHTML = '';
    snapshot.forEach(childSnapshot => {
      const record = childSnapshot.val();
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${record.customerId}</td>
        <td>${record.quantity}</td>
        <td>${record.fatContent}</td>
        <td>${record.payment.toFixed(2)}</td>
      `;
      tableBody.appendChild(row);
    });
  });
}

// Payment Calculation Logic
function calculatePayment(quantity, fatContent) {
  const baseRate = 50; // Base rate per liter
  const fatMultiplier = fatContent / 100; // Adjust payment based on fat content
  return quantity * baseRate * (1 + fatMultiplier);
}

// Initialize Data Fetching
fetchCustomers();
fetchMilkRecords();
