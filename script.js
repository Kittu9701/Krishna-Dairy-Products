// Import Firebase and Firestore
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, getDoc, doc } from "firebase/firestore";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyD0kXfsVqMKDmpqRI8fLmHVbNSDGR7jZBw",
  authDomain: "krishna-dairy-products-1b024.firebaseapp.com",
  projectId: "krishna-dairy-products-1b024",
  storageBucket: "krishna-dairy-products-1b024.appspot.com",
  messagingSenderId: "38817783657",
  appId: "1:38817783657:web:5a86fa2694d3bee48ee7f8",
  measurementId: "G-9LG57Q29Y4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Add Customer Form
async function addCustomer(e) {
  e.preventDefault();
  const name = document.getElementById('customerName').value;
  const phone = document.getElementById('customerPhone').value;
  const address = document.getElementById('customerAddress').value;

  try {
    const docRef = await addDoc(collection(db, "customers"), {
      name, phone, address
    });
    alert('Customer added successfully!');
    updateCustomerList();
  } catch (e) {
    alert('Error adding customer!');
  }
}

document.getElementById('addCustomerForm').addEventListener('submit', addCustomer);

// Milk Collection Form
async function recordMilk(e) {
  e.preventDefault();
  const customerId = document.getElementById('customerList').value;
  const quantity = parseFloat(document.getElementById('milkQuantity').value);
  const fatContent = parseFloat(document.getElementById('fatContent').value);

  try {
    const payment = calculatePayment(quantity, fatContent);
    await addDoc(collection(db, "milkRecords"), {
      customerId, quantity, fatContent, payment
    });
    alert('Milk recorded successfully!');
    updateCustomerTable();
  } catch (e) {
    alert('Error recording milk!');
  }
}

document.getElementById('milkCollectionForm').addEventListener('submit', recordMilk);

// Update Customer List
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
  for (const docSnap of querySnapshot.docs) {
    const record = docSnap.data();
    const customerRef = doc(db, "customers", record.customerId);
    const customerDoc = await getDoc(customerRef);
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
  }
}

// Payment Calculation
function calculatePayment(quantity, fatContent) {
  const baseRate = 50;
  return quantity * baseRate * (1 + fatContent / 100);
}

// Initial Load
updateCustomerList();
updateCustomerTable();

