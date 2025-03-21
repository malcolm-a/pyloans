import pandas as pd
from io import BytesIO

def adjust_rate_and_period(rate: float, n: int, period: str) -> tuple:
    """Adjusts the interest rate and number of periods based on the payment frequency
    
    Args:
        rate (float): interest rate
        n (int): number of periods
        period (str): payment frequency, can be "monthly", "quarterly", "semi-annually", or "annually"

    Raises:
        ValueError: if the period is not one of the expected values

    Returns:
        tuple: the adjusted rate and number of periods
    """
    periods_per_year = {
        "monthly": 12,
        "quarterly": 4,
        "semi-annually": 2,
        "annually": 1
    }
    
    if period not in periods_per_year:
        raise ValueError(f"Invalid period: {period}")
    
    divisor = periods_per_year[period]
    
    if divisor > 1:
        rate = (1 + rate) ** (1 / divisor) - 1
        n = n * divisor
    
    return rate, n


def loan_constant_payment(n: int, amount: float, rate: float, period: str) -> list:
    """Calculates the loan amortization schedule using constant payment method

    Args:
        n (int): number of periods
        amount (float): loan amount
        rate (float): interest rate
        period (str): payment frequency, can be "monthly", "quarterly", "semi-annually", or "annually"

    Returns:
        list: amortization schedule
    """    
    rate, n = adjust_rate_and_period(rate, n, period)
    
    yearly_payment = amount * rate / (1 - (1 + rate) ** -n)
    remaining = amount
    result = []
    for i in range(1, n + 1):
        interests = remaining * rate
        row = [i]
        row.append(round(remaining, 2))
        row.append(round(interests, 2))
        row.append(round(yearly_payment - interests, 2))
        row.append(round(yearly_payment, 2))
        remaining = remaining - yearly_payment + interests
        row.append(round(remaining, 2))
        result.append(row)
    total_interests = round(sum(x[2] for x in result), 2)
    result.append(["Total", "", total_interests, round(amount, 2), round(yearly_payment * n, 2)])
    return result


def loan_constant_principal(n: int, amount: float, rate: float, period: str) -> list:
    """Calculates the loan amortization schedule using constant principal method

    Args:
        n (int): number of periods
        amount (float): loan amount
        rate (float): interest rate
        period (str): payment frequency, can be "monthly", "quarterly", "semi-annually", or "annually"

    Returns:
        list: amortization schedule
    """   
    
    rate, n = adjust_rate_and_period(rate, n, period)
    
    principal_payment = amount / n
    remaining = amount
    result = []
    total_payment = 0
    
    for i in range(1, n + 1):
        interests = remaining * rate
        payment = principal_payment + interests
        total_payment += payment
        
        row = [i]
        row.append(round(remaining, 2))
        row.append(round(interests, 2))
        row.append(round(principal_payment, 2))
        row.append(round(payment, 2))
        
        remaining = remaining - principal_payment
        row.append(round(remaining, 2))
        result.append(row)
    
    total_interests = round(sum(x[2] for x in result), 2)
    result.append(["Total", "", total_interests, round(amount, 2), round(total_payment, 2)])
    return result

def to_xlsx(data: list, lang: str="en") -> BytesIO:
    """Converts the amortization schedule to an Excel file

    Args:
        data (list): the amortization schedule data
        lang (str, optional): the language used for the columns. Defaults to "en".

    Returns:
        BytesIO: an in-memory Excel file
    """    
    import pandas as pd
    from io import BytesIO
    
    if lang == "fr":
        columns = {
            0: "Période",
            1: "Capital dû en début de période",
            2: "Intérêts",
            3: "Amortissements",
            4: "Annuités",
            5: "Capital dû en fin de période"
        }
    else:
        columns = {
            0: "Period",
            1: "Starting Balance",
            2: "Interest",
            3: "Principal",
            4: "Payment",
            5: "Ending Balance"
        }
    
    df = pd.DataFrame(data)
    column_mapping = {i: name for i, name in columns.items() if i < len(df.columns)}
    df.rename(columns=column_mapping, inplace=True)
    
    output = BytesIO()

    with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
        df.to_excel(writer, index=False, sheet_name='Loan Amortization')

    output.seek(0)
    return output
