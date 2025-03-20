from flask import Flask, render_template, request, jsonify
from loan_calculator import loan_constant_payment, loan_constant_principal

app = Flask(__name__, static_folder='assets')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.get_json()
    n = int(data['years'])
    amount = float(data['amount'])
    rate = float(data['rate'])
    period = data['period']
    amortization_type = data.get('amortizationType', 'constant-payment')
    
    if amortization_type == 'constant-principal':
        result = loan_constant_principal(n, amount, rate, period)
    else:
        result = loan_constant_payment(n, amount, rate, period)
    
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
