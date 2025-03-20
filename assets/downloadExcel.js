document.addEventListener('DOMContentLoaded', function() {
    const downloadButton = document.getElementById('download-excel');
    downloadButton.addEventListener('click', function() {
        // Get form values
        const years = document.getElementById('loan-years').value;
        const amount = document.getElementById('loan-amount').value;
        const rate = document.getElementById('interest-rate').value / 100;
        const period = document.getElementById('period').value;
        const amortizationType = document.getElementById('amortization-type').value;
        const lang = document.documentElement.lang || 'en';
        
        // Construct the URL with query parameters
        const url = `/download_excel?years=${years}&amount=${amount}&rate=${rate}&period=${period}&amortizationType=${amortizationType}&lang=${lang}&t=${new Date().getTime()}`;
        window.open(url, '_blank');
    });
});