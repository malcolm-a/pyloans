// calculate on input change after a short delay
const inputs = document.querySelectorAll('input, select');
inputs.forEach(input => {
        input.addEventListener('input', debounce(calculateLoan, 500));
});
  
  // Debounce function to prevent too many requests
  function debounce(func, wait) {
      let timeout;
      return function() {
          clearTimeout(timeout);
          timeout = setTimeout(() => {
              func.apply(this, arguments);
          }, wait);
      };
  }
  
  // Setup toggle buttons
  document.addEventListener('DOMContentLoaded', function() {
      const toggleButtons = document.querySelectorAll('.toggle-button');
      const hiddenInput = document.getElementById('amortization-type');
      
      toggleButtons.forEach(button => {
          button.addEventListener('click', function() {
              // Remove active class from all buttons
              toggleButtons.forEach(btn => btn.classList.remove('active'));
              
              // Add active class to clicked button
              this.classList.add('active');
              
              // Update hidden input value
              hiddenInput.value = this.dataset.value;
              
              // Trigger recalculation
              calculateLoan();
          });
      });
  });

  function calculateLoan() {
      const years = parseInt(document.getElementById('loan-years').value);
      const amount = parseFloat(document.getElementById('loan-amount').value);
      const rate = parseFloat(document.getElementById('interest-rate').value) / 100;
      const period = document.getElementById('period').value;
      const amortizationType = document.getElementById('amortization-type').value;
      
      // Validate inputs
      if (isNaN(years) || isNaN(amount) || isNaN(rate)) {
          return;
      }
      
      fetch('/calculate', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              years: years,
              amount: amount,
              rate: rate,
              period: period,
              amortizationType: amortizationType
          }),
      })
      .then(response => response.json())
      .then(data => {
          updateTable(data);
      })
      .catch(error => {
          console.error('Error:', error);
      });
  }
  
  function updateTable(schedule) {
      const tableBody = document.getElementById('loan-body');
      tableBody.innerHTML = '';
      
      schedule.forEach((row, index) => {
          const tr = document.createElement('tr');
          
          // Special formatting for the last row (totals)
          if (index === schedule.length - 1) {
              tr.innerHTML = `
                  <td><strong>${row[0]}</strong></td>
                  <td></td>
                  <td><strong>${formatNumber(row[2])}</strong></td>
                  <td><strong>${formatNumber(row[3])}</strong></td>
                  <td><strong>${formatNumber(row[4])}</strong></td>
                  <td></td>
              `;
          } else {
              tr.innerHTML = `
                  <td>${row[0]}</td>
                  <td>${formatNumber(row[1])}</td>
                  <td>${formatNumber(row[2])}</td>
                  <td>${formatNumber(row[3])}</td>
                  <td>${formatNumber(row[4])}</td>
                  <td>${formatNumber(row[5])}</td>
              `;
          }
          
          tableBody.appendChild(tr);
      });
  }
  
  function formatNumber(num) {
      if (num === "" || num === undefined) return "";
      return parseFloat(num).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
      });
  }
  
  // Initial calculation on page load
  calculateLoan();