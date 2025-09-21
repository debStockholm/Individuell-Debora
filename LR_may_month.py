import numpy as np
import pandas as pd
import matplotlib.pyplot as plt 
from sklearn.linear_model import LinearRegression


files = {
    '2020': 'Sum_matsvinn_2020.csv',
    '2021': 'Sum_matsvinn_2021.csv',
    '2022': 'Sum_matsvinn_2022.csv',
    '2023': 'Sum_matsvinn_2023.csv'
} 

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression

all_data = pd.DataFrame()

# Files and corresponding labels
files = {
    '2020': 'Sum_matsvinn_2020.csv',
    '2021': 'Sum_matsvinn_2021.csv',
    '2022': 'Sum_matsvinn_2022.csv',
    '2023': 'Sum_matsvinn_2023.csv'
}

# Map month names to numbers
month_map = {'januari':1, 'februari':2, 'mars':3, 'april':4, 'maj':5}

plt.figure(figsize=(10,6))

for year, file in files.items():
    # Load CSV
    df = pd.read_csv(file)
    
    # Map months to numbers
    df['month_num'] = df['Manad'].map(month_map)
    
    # Use only Jan–May
    train_df = df[df['month_num'] <= 5]
    
    X = train_df['month_num'].values.reshape(-1,1)
    y = train_df[f'Tot matsvinn {year}'].values
    
    # Train a separate LinearRegression for this year
    model = LinearRegression()
    model.fit(X, y)
    
    # Predict trend line for Jan–May
    X_pred = np.arange(1,6).reshape(-1,1)
    y_pred = model.predict(X_pred)
    
    # Plot actual points
    plt.scatter(X, y, label=f'{year} actual')
    
    # Plot regression line for this year
    plt.plot(X_pred, y_pred, linestyle='--', label=f'{year} trend')

# Customize plot
plt.xticks(np.arange(1,6), ['jan','feb','mar','apr','may'])
plt.xlabel('month')
plt.ylabel('Total waste(kg)')
plt.title('Linear Regression per year ut to may')
plt.ylim(bottom=0)
plt.legend()
plt.show()


all_data.to_csv('AY_may_pred.csv', index=False)