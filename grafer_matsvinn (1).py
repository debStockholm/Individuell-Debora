import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
from sklearn import linear_model
from sklearn.linear_model import LinearRegression


# df = pd.read_csv('Sum_matsvinn_2020.csv')
# df2= pd.read_csv('Sum_matsvinn_2021.csv')
# df3= pd.read_csv('Sum_matsvinn_2022.csv')
# df4= pd.read_csv('Sum_matsvinn_2023.csv')

# ny_df=pd.DataFrame(df)
# ny_df2=pd.DataFrame(df2)
# ny_df3=pd.DataFrame(df3)
# ny_df4=pd.DataFrame(df4)
# #print(ny_df, ny_df2, ny_df3, ny_df4)

# merge1 = pd.merge(ny_df, ny_df2, on='Manad', how= 'inner')
# merge2=pd.merge(merge1, ny_df3, on = 'Manad', how='inner')
# merge_months=pd.merge(merge2, ny_df4, on='Manad', how='inner')
# print(merge_months)

# merge_months.to_csv('FilLR.csv', index=False)


df = pd.read_csv('FilLR.csv')
print(df)

df['2024']= None
df['2025']= None
df['2026']= None
print(df)   #korrekt


df = pd.DataFrame(df)

'''Jag ville ha en funktion som beraknade de tre nasta kommande ar baserad pa de tidigare varden: 
ex. 2020-2023 data predicts 2024, 2020 till 2024 data predicts 2025.
Rekursiv LR. 
Fick hjalp av AI, och inte ens med det var det enkelt att fa fram resultat, 
jag fick fixa grundliga data sjalv for att det skulle bli korrekt:
'''

# Function to recursively fill missing years with linear regression  - 
def recursive_regression(row, years_available, model):

    for year in years_available:
        # Prepare the feature matrix X with years from 2020 to the current year minus 1
        X = np.array([[y] for y in range(2020, year)])
        
        # Prepare the target variable y with the corresponding values for those years (column names as strings)
        y = row.loc[map(str, range(2020, year))].values  # Convert years to strings for correct indexing
        model.fit(X, y)
        # Predict the value for the current year
        predicted_value = model.predict([[year]])
        # Update the row with the predicted value
        row[str(year)] = predicted_value[0]
        
    return row

# Recursive function to handle all rows
def fill_recursive(df):
    model = LinearRegression()
    
    # For each row in the dataframe
    for index, row in df.iterrows():
        # First predict 2024 using 2020-2023 data
        row = recursive_regression(row, [2024], model)
        
        # Then predict 2025 using 2020-2024 data (including the prediction for 2024)
        row = recursive_regression(row, [2025], model)
        
        # Finally predict 2026 using 2020-2025 data (including the predictions for 2024 and 2025)
        row = recursive_regression(row, [2026], model)
        
        # Update the dataframe with the updated row
        df.loc[index] = row
        
    return df

Ny_df = fill_recursive(df)


Ny_df['2024'] = Ny_df['2024'].astype(int)
Ny_df['2025'] = Ny_df['2025'].astype(int)
Ny_df['2026'] = Ny_df['2026'].astype(int)

print(Ny_df)


plt.figure(figsize=(10, 6))
colors = sns.color_palette("tab10", len(Ny_df))  # tab10 is a good default color palette
for index, row in Ny_df.iterrows():
    # Get the color for this row (month)
    color = colors[index]
    # Plotting 2020 to 2023 as solid lines:korrekt
    plt.plot([2020, 2021, 2022, 2023], row[['2020', '2021', '2022', '2023']], label=row['Manad'], color=color, linestyle='-', marker='o')
    # Plotting 2024-2026 as dashed lines:korrket
    plt.plot([2023, 2024, 2025, 2026], row[['2023', '2024', '2025', '2026']], color=color, linestyle='--', marker='x')

plt.xlabel('Ar')
plt.ylabel('Matsvinn i kg')
plt.title('Forutspa framtidens matsvinn 2024-2026')
plt.legend(title="Manader", loc='center right')
plt.grid(True)
plt.show()

Ny_df.to_csv('Predictions 2024-2026.csv', index=False)