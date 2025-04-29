
const form = document.getElementById('expense-form');
const expenseList = document.getElementById('expense-list');
const searchInput = document.getElementById('search');
const startDateInput = document.getElementById('start-date');
const endDateInput = document.getElementById('end-date');

let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

form.onsubmit = (e) => {
  e.preventDefault();
  const expense = {
    category: document.getElementById('category').value,
    description: document.getElementById('description').value,
    amount: parseFloat(document.getElementById('amount').value),
    note: document.getElementById('note').value,
    date: document.getElementById('date').value,
  };
  expenses.push(expense);
  localStorage.setItem('expenses', JSON.stringify(expenses));
  form.reset();
  renderExpenses();
};

function renderExpenses() {
  expenseList.innerHTML = '';
  const filtered = expenses.filter(exp => {
    const search = searchInput.value.toLowerCase();
    const dateCheck =
      (!startDateInput.value || exp.date >= startDateInput.value) &&
      (!endDateInput.value || exp.date <= endDateInput.value);
    return (
      (exp.description.toLowerCase().includes(search) ||
      exp.note.toLowerCase().includes(search)) && dateCheck
    );
  });
  filtered.forEach(exp => {
    const div = document.createElement('div');
    div.className = 'expense-card';
    div.innerHTML = `
      <strong>${exp.category}</strong> | ${exp.amount} افغانی<br>
      📅 ${exp.date}<br>
      📝 ${exp.description} - ${exp.note}
    `;
    expenseList.appendChild(div);
  });
}

searchInput.oninput = renderExpenses;
startDateInput.onchange = renderExpenses;
endDateInput.onchange = renderExpenses;

function exportCSV() {
  let csv = "کتگوری,شرح,مبلغ,یادداشت,تاریخ\n";
  expenses.forEach(exp => {
    csv += `${exp.category},${exp.description},${exp.amount},${exp.note},${exp.date}\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'expenses.csv';
  link.click();
}

renderExpenses();
