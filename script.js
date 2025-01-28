// Sample data storage
let customers = [];
let milkRecords = [];

// Add Customer Form
document.getElementById('addCustomerForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const name = document.getElementById('customerName').value;
  const phone = document.getElementById('customerPhone').value;
  const address = document.getElementById('customerAddress').value;

  const customer = {
    id: Date.now(),
    name,
    phone,
    address
  };

  customers.push(customer);
  updateCustomerList();
  document.getElementById('addCustomerForm').reset();
  alert('Customer added successfully!');
});

// Milk Collection Form
document.getElementById('milkCollectionForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const customerId = document.getElementById('customerList').value;
  const quantity = parseFloat(document.getElementById('milkQuantity').value);
  const fatContent = parseFloat(document.getElementById('fatContent').value);

  const customer = customers.find(c => c.id == customerId);
  if (!customer) {
    alert('Please select a valid customer.');
    return;
  }

  const payment = calculatePayment(quantity, fatContent);

  const record = {
    customerId,
    customerName: customer.name,
    quantity,
    fatContent,
    payment
  };

  milkRecords.push(record);
  updateCustomerTable();
  document.getElementById('milkCollectionForm').reset();
  alert('Milk recorded successfully!');
});

// Update Customer List in Dropdown
function updateCustomerList() {
  const customerList = document.getElementById('customerList');
  customerList.innerHTML = '<option value="">Select Customer</option>';
  customers.forEach(customer => {
    const option = document.createElement('option');
    option.value = customer.id;
    option.textContent = customer.name;
    customerList.appendChild(option);
  });
}

// Update Customer Table
function updateCustomerTable() {
  const tableBody = document.querySelector('#customerTable tbody');
  tableBody.innerHTML = '';

  milkRecords.forEach(record => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${record.customerName}</td>
      <td>${customers.find(c => c.id == record.customerId).phone}</td>
      <td>${customers.find(c => c.id == record.customerId).address}</td>
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