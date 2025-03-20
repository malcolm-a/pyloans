from flask import Flask, render_template, request, jsonify, send_file
from loan_calculator import loan_constant_payment, loan_constant_principal, to_xlsx


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

@app.route('/download_excel', methods=['GET'])
def download_excel():
    try:
        # Get parameters from request
        years = int(request.args.get('years', 5))
        amount = float(request.args.get('amount', 100000))
        rate = float(request.args.get('rate', 0.12))
        period = request.args.get('period', 'annually')
        lang = request.args.get('lang', 'en')
        amortization_type = request.args.get('amortizationType', 'constant-payment')
        
        # Calculate data
        if amortization_type == 'constant-principal':
            result = loan_constant_principal(years, amount, rate, period)
        else:
            result = loan_constant_payment(years, amount, rate, period)
        

        excel_file = to_xlsx(result, lang)
        
        # Send as downloadable file
        return send_file(
            excel_file,
            as_attachment=True,
            download_name="loan_amortization.xlsx",
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            max_age=0  
        )
        
    except Exception as e:
        import traceback
        error_msg = f"Excel download error: {str(e)}"
        app.logger.error(error_msg)
        app.logger.error(traceback.format_exc())
        return error_msg, 500


if __name__ == '__main__':
    app.run(debug=True)
