const form = document.getElementById('expenseForm');
const descInput = document.getElementById('desc');
const amountInput = document.getElementById('amount');
const categoryInput = document.getElementById('category');
const expenseList = document.getElementById('expenseList');

const incomeEl = document.getElementById('income');
const expenseEl = document.getElementById('expense');
const balanceEl = document.getElementById('balance');

let transactions = [];

// Chart.js setup
const ctx = document.getElementById('expenseChart').getContext('2d');
let expenseChart = new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: ['Food', 'Transport', 'Shopping', 'Other'],
    datasets: [{
      label: 'Expenses by Category',
      data: [0, 0, 0, 0],
      backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4caf50']
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: '#fff' }
      }
    }
  }
});

// Load from LocalStorage
window.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('transactions');
  if (saved) {
    transactions = JSON.parse(saved);
    renderList();
    updateSummary();
    updateChart();
  }
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const desc = descInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const category = categoryInput.value;

  if (!desc || isNaN(amount)) return;

  const transaction = { desc, amount, category };
  transactions.push(transaction);

  saveToLocalStorage();
  renderList();
  updateSummary();
  updateChart();

  descInput.value = '';
  amountInput.value = '';
  categoryInput.value = '';
});

function renderList() {
  expenseList.innerHTML = '';
  transactions.forEach((t, i) => {
    const li = document.createElement('li');
    li.textContent = `${t.desc} - $${t.amount.toFixed(2)} [${t.category}]`;

    const delBtn = document.createElement('button');
    delBtn.textContent = "❌";
    delBtn.style.marginLeft = "10px";
    delBtn.addEventListener('click', () => {
      transactions.splice(i, 1);
      saveToLocalStorage();
      renderList();
      updateSummary();
      updateChart();
    });

    li.appendChild(delBtn);
    expenseList.appendChild(li);
  });
}

function updateSummary() {
  let income = 0, expense = 0;
  transactions.forEach(t => {
    if (t.amount >= 0) {
      income += t.amount;
    } else {
      expense += Math.abs(t.amount);
    }
  });
  const balance = income - expense;

  incomeEl.textContent = income.toFixed(2);
  expenseEl.textContent = expense.toFixed(2);
  balanceEl.textContent = balance.toFixed(2);
}

function updateChart() {
  const categories = ['Food', 'Transport', 'Shopping', 'Other'];
  const data = [0, 0, 0, 0];

  transactions.forEach(t => {
    const idx = categories.indexOf(t.category);
    if (idx !== -1) {
      data[idx] += t.amount;
    }
  });

  expenseChart.data.datasets[0].data = data;
  expenseChart.update();
}

function saveToLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}
