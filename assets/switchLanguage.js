const translations = {
    en: {
        title: 'Loan Calculator',
        loanTerm: 'Loan Term (years):',
        loanAmount: 'Loan Amount:',
        interestRate: 'Annual Interest Rate (%):',
        scheduleTitle: 'Amortization Schedule',
        period: 'Period',
        startingBalance: 'Starting Balance',
        interest: 'Interest',
        principal: 'Principal',
        payment: 'Payment',
        endingBalance: 'Ending Balance',
        annually: 'Annually',
        monthly: 'Monthly',
        quarterly: 'Quarterly',
        semiannually: 'Semi-annually',
        amortizationType: 'Amortization Type:',
        constantPayment: 'Constant Payment',
        constantPrincipal: 'Constant Principal',
        downloadExcel: 'Download as Excel file',
    },
    fr: {
        title: 'Calculateur de prêt',
        loanTerm: 'Durée du prêt (années) :',
        loanAmount: 'Montant du prêt :',
        interestRate: 'Taux d\'intérêt annuel (%) :',
        scheduleTitle: 'Amortissements',
        period: 'Période',
        startingBalance: 'Capital dû en début de période',
        interest: 'Intérêts',
        principal: 'Amortissements',
        payment: 'Annuités',
        endingBalance: 'Capital dû en fin de période',
        annually: 'Annuellement',
        monthly: 'Mensuellement',
        quarterly: 'Trimestriellement',
        semiannually: 'Semestriellement',
        amortizationType: 'Type d\'amortissement :',
        constantPayment: 'Annuités constantes',
        constantPrincipal: 'Amortissements constants',
        downloadExcel: 'Télécharger au format Excel',
    }
};

function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
    const cname = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(cname) === 0) {
            return c.substring(cname.length, c.length);
        }
    }
    return "";
}

function switchLanguage(lang) {
    setCookie('language', lang, 30);
    document.title = translations[lang].title;
    document.querySelector('h1').textContent = translations[lang].title;
    document.querySelector('label[for="loan-years"]').textContent = translations[lang].loanTerm;
    document.querySelector('label[for="loan-amount"]').textContent = translations[lang].loanAmount;
    document.querySelector('label[for="interest-rate"]').textContent = translations[lang].interestRate;
    document.querySelector('label[for="period"]').textContent = translations[lang].period;
    
    // Update the amortization type label using ID instead of for attribute
    document.querySelector('#label-amortization-type').textContent = translations[lang].amortizationType;
    
    document.querySelector('#results h2').textContent = translations[lang].scheduleTitle;
    document.querySelector('option[value="annually"]').textContent = translations[lang].annually;
    document.querySelector('option[value="monthly"]').textContent = translations[lang].monthly;
    document.querySelector('option[value="quarterly"]').textContent = translations[lang].quarterly;
    document.querySelector('option[value="semi-annually"]').textContent = translations[lang].semiannually;

    // Update toggle buttons
    document.querySelector('.toggle-button[data-value="constant-payment"]').textContent = translations[lang].constantPayment;
    document.querySelector('.toggle-button[data-value="constant-principal"]').textContent = translations[lang].constantPrincipal;

    // Update download button
    document.querySelector('#download-excel').textContent = translations[lang].downloadExcel;

    // Update table headers
    const headers = document.querySelectorAll('#loan-table th');
    headers[0].textContent = translations[lang].period;
    headers[1].textContent = translations[lang].startingBalance;
    headers[2].textContent = translations[lang].interest;
    headers[3].textContent = translations[lang].principal;
    headers[4].textContent = translations[lang].payment;
    headers[5].textContent = translations[lang].endingBalance;
}

document.getElementById('flag-france').addEventListener('click', () => switchLanguage('fr'));
document.getElementById('flag-us').addEventListener('click', () => switchLanguage('en'));

// Initial language setup
const savedLanguage = getCookie('language') || 'en';
switchLanguage(savedLanguage);
