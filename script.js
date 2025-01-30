// Import Firebase and Firestore
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, getDoc } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD0kXfsVqMKDmpqRI8fLmHVbNSDGR7jZBw",
  authDomain: "krishna-dairy-products-1b024.firebaseapp.com",
  projectId: "krishna-dairy-products-1b024",
  storageBucket: "krishna-dairy-products-1b024.firebasestorage.app",
  messagingSenderId: "38817783657",
  appId: "1:38817783657:web:5a86fa2694d3bee48ee7f8",
  measurementId: "G-9LG57Q29Y4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Add Customer Form
document.getElementById('addCustomerForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const name = document.getElementById('customerName').value;
  const phone = document.getElementById('customerPhone').value;
  const address = document.getElementById('customerAddress').value;

  // Debugging: Log the form data
  console.log("Form submitted with data:", { name, phone, address });

  try {
    const docRef = await addDoc(collection(db, "customers"), {
      name: name,
      phone: phone,
      address: address
    });
    // Debugging: Log the document ID
    console.log("Customer added with ID: ", docRef.id);
    alert('Customer added successfully!');
    updateCustomerList();
    document.getElementById('addCustomerForm').reset();
  } catch (e) {
    // Debugging: Log the error
    console.error("Error adding customer: ", e.message);
    alert('Error adding customer!');
  }
});

// Milk Collection Form
document.getElementById('milkCollectionForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const customerId = document.getElementById('customerList').value;
  const quantity = parseFloat(document.getElementById('milkQuantity').value);
  const fatContent = parseFloat(document.getElementById('fatContent').value);

  try {
    const payment = calculatePayment(quantity, fatContent);
    const docRef = await addDoc(collection(db, "milkRecords"), {
      customerId: customerId,
      quantity: quantity,
      fatContent: fatContent,
      payment: payment
    });
    console.log("Milk record added with ID: ", docRef.id);
    alert('Milk recorded successfully!');
    updateCustomerTable();
    document.getElementById('milkCollectionForm').reset();
  } catch (e) {
    console.error("Error recording milk: ", e.message);
    alert('Error recording milk!');
  }
});

// Update Customer List in Dropdown
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

// Update Customer Table
async function updateCustomerTable() {
  const tableBody = document.querySelector('#customerTable tbody');
  tableBody.innerHTML = '';

  const querySnapshot = await getDocs(collection(db, "milkRecords"));
  querySnapshot.forEach(async (doc) => {
    const record = doc.data();
    const customerDoc = await getDoc(doc(db, "customers", record.customerId));
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
  });
}

// Payment Calculation Logic
function calculatePayment(quantity, fatContent) {
  const baseRate = 50; // Base rate per liter
  const fatMultiplier = fatContent / 100; // Adjust payment based on fat content
  return quantity * baseRate * (1 + fatMultiplier);
}

// Initial load
updateCustomerList();
updateCustomerTable();
