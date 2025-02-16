import pandas as pd
import numpy as np



# #########################_______________________2020________________________________________


# # df = pd.read_csv('Mer_ML/2020 Januari Förskola.csv')
# # df2= pd.read_csv('Mer_ML/2020 Februari Förskola.csv')
# # df3= pd.read_csv('Mer_ML/2020 Mars Förskola.csv')
# # df4= pd.read_csv('Mer_ML/2020 April Förskola.csv')

# # #print(df, df2, df3, df4)
# # df.columns = df.columns.str.strip()
# # df2.columns = df2.columns.str.strip()
# # df3.columns = df3.columns.str.strip()
# # df4.columns = df4.columns.str.strip()


# # ny_df=df.drop(['Kategori', 'Månad', 'År', 'Antal dagar', 'Antal ätande på plats', 'Kökssvinn g/barn/dag'], axis=1)
# # ny_df2=df2.drop(['Kategori', 'Månad', 'År', 'Antal dagar', 'Antal ätande på plats', 'Kökssvinn g/barn/dag'], axis=1)
# # ny_df3=df3.drop(['Kategori', 'Månad', 'År', 'Antal dagar', 'Antal ätande på plats', 'Kökssvinn g/barn/dag'], axis=1)
# # ny_df4=df4.drop(['Kategori', 'Månad', 'År', 'Antal dagar', 'Antal ätande på plats', 'Kökssvinn g/barn/dag'], axis=1)

# # #print(ny_df, ny_df2, ny_df3, ny_df4)
# # #print(ny_df.head(2), ny_df2.head(2))
# # #merging de forsta tva dataset:
# # merging_files= pd.merge(ny_df, ny_df2, on = 'Enhet', how = 'inner')
# # #print(merging_files)
# # merging_files_2= pd.merge(merging_files, ny_df3, on = 'Enhet', how = 'inner')
# # #print(merging_files_2)

# # merging_files_2=merging_files_2.rename(columns={'Kökssvinn (kg)_x': 'jan_20', 'Kökssvinn (kg)_y': 'feb_20',  'Kökssvinn (kg)': 'mars_20'})
# # merge2020= pd.merge(merging_files_2, ny_df4, on = 'Enhet', how = 'inner')
# # merge2020=merge2020.rename(columns={'Kökssvinn (kg)': 'apr_20'})
# # #print(merge2020)

# # '''columns = merge2020.columns
# # for column in columns:
# #      print(column) '''

# # matsvinn_2020_mean=merge2020[['jan_20','feb_20','mars_20', 'apr_20'] ].agg('mean')
# # matsvinn_2020_mean=matsvinn_2020_mean[['jan_20','feb_20','mars_20', 'apr_20']].round(2).astype(float)
# # matsvinn_2020_sum=merge2020[['jan_20','feb_20','mars_20', 'apr_20'] ].agg('sum')
# # matsvinn_2020_sum=matsvinn_2020_sum[['jan_20','feb_20','mars_20', 'apr_20']].astype(int)

# # print(matsvinn_2020_mean)
# # print(matsvinn_2020_sum)

# # #matsvinn_2020_mean.to_csv('Medel_matsvinn_2020.csv', index=False)

'''sCATTERPLOT'''
# # matsvinn_2020_sum.to_csv('Sum_matsvinn_2020.csv', index=False)


# ##################  ___________________________________ 2021___________________________


# # df = pd.read_csv('2021 jan.csv')
# # df2= pd.read_csv('2021 febr.csv')
# # df3= pd.read_csv('2021 mars.csv')
# # df4= pd.read_csv('2021 april.csv')

# # #print(df, df2, df3, df4)

# # df.columns = df.columns.str.strip()
# # df2.columns = df2.columns.str.strip()
# # df3.columns = df3.columns.str.strip()
# # df4.columns = df4.columns.str.strip()


# # ny_df=df.drop(['Kategori', 'Månad', 'År', 'Antal dagar', 'Antal ätande på plats', 'Kökssvinn/gäst/dag'], axis=1)
# # ny_df2=df2.drop(['Kategori', 'Månad', 'År', 'Antal dagar', 'Antal ätande på plats', 'Kökssvinn/gäst/dag'], axis=1)
# # ny_df3=df3.drop(['Kategori', 'Månad', 'År', 'Antal dagar', 'Antal ätande på plats', 'Kökssvinn/gäst/dag'], axis=1)
# # ny_df4=df4.drop(['Kategori', 'Månad', 'År', 'Antal dagar', 'Antal ätande på plats', 'Kökssvinn/gäst/dag'], axis=1)

# # #print(ny_df, ny_df2, ny_df3, ny_df4)
# # #print(ny_df.head(2), ny_df2.head(2))

# # merging_files= pd.merge(ny_df, ny_df2, on = 'Enhet', how = 'inner')
# # merging_files_2= pd.merge(merging_files, ny_df3, on = 'Enhet', how = 'inner')
# # #print(merging_files_2)
# # merging_files_2=merging_files_2.rename(columns={'Kökssvinn (i kg)_x': 'jan_21', 'Kökssvinn (i kg)_y': 'feb_21',  'Kökssvinn  (i kg)': 'mars_21'})
# # merge2021= pd.merge(merging_files_2, ny_df4, on = 'Enhet', how = 'inner')
# # merge2021=merge2021.rename(columns={'Kökssvinn  (i kg)': 'apr_21'})
# # #print(merge2021)

# # # columns = merge2021.columns
# # # for column in columns:
# # #      print(column) 

# # matsvinn_2021_mean=merge2021[['jan_21','feb_21','mars_21', 'apr_21'] ].agg('mean')
# # matsvinn_2021_mean=matsvinn_2021_mean[['jan_21','feb_21','mars_21', 'apr_21']].round(2).astype(float)
# # matsvinn_2021_sum=merge2021[['jan_21','feb_21','mars_21', 'apr_21'] ].agg('sum')
# # matsvinn_2021_sum=matsvinn_2021_sum[['jan_21','feb_21','mars_21', 'apr_21']].astype(int)


# # print(matsvinn_2021_mean)
# # print(matsvinn_2021_sum)

# # matsvinn_2021_mean.to_csv('Medel_matsvinn_2021.csv', index=False)
# #matsvinn_2021_sum.to_csv('Sum_matsvinn_2021.csv', index=False)


# ###############_______________________________2022_____________________________________


# # df = pd.read_csv('2022 jan.csv')
# # df2= pd.read_csv('2022 feb.csv')
# # df3= pd.read_csv('2022 mars.csv')
# # df4= pd.read_csv('2022 apr.csv')

# # #print(df, df2, df3, df4)

# # df.columns = df.columns.str.strip()
# # df2.columns = df2.columns.str.strip()
# # df3.columns = df3.columns.str.strip()
# # df4.columns = df4.columns.str.strip()


# # ny_df=df.drop(['Kategori', 'Månad', 'År', 'Antal dagar', 'Antal ätande på plats', 'Kökssvinn/gäst/dag'], axis=1)
# # ny_df2=df2.drop(['Kategori', 'Månad', 'År', 'Antal dagar', 'Antal ätande på plats', 'Kökssvinn/gäst/dag'], axis=1)
# # ny_df3=df3.drop(['Kategori', 'Månad', 'År', 'Antal dagar', 'Antal ätande på plats', 'Kökssvinn/gäst/dag'], axis=1)
# # ny_df4=df4.drop(['Kategori', 'Månad', 'År', 'Antal dagar', 'Antal ätande på plats', 'Kökssvinn/gäst/dag'], axis=1)

# # #print(ny_df, ny_df2, ny_df3, ny_df4)
# # # #print(ny_df.head(2), ny_df2.head(2))

# # merging_files= pd.merge(ny_df, ny_df2, on = 'Enhet', how = 'inner')
# # merging_files_2= pd.merge(merging_files, ny_df3, on = 'Enhet', how = 'inner')
# # #print(merging_files_2)
# # merging_files_2=merging_files_2.rename(columns={'Kökssvinn  (i kg)_x': 'jan_22', 'Kökssvinn  (i kg)_y': 'feb_22',  'Kökssvinn  (i kg)': 'mars_22'})
# # merge2022= pd.merge(merging_files_2, ny_df4, on = 'Enhet', how = 'inner')
# # merge2022=merge2022.rename(columns={'Kökssvinn  (i kg)': 'apr_22'})
# # #print(merge2022)

# # '''columns = merge2022.columns
# # for column in columns:
# #      print(column)'''


# # matsvinn_2022_mean=merge2022[['jan_22','feb_22','mars_22', 'apr_22'] ].agg('mean')
# # matsvinn_2022_mean=matsvinn_2022_mean[['jan_22','feb_22','mars_22', 'apr_22']].round(2).astype(float)
# # matsvinn_2022_sum=merge2022[['jan_22','feb_22','mars_22', 'apr_22'] ].agg('sum')
# # matsvinn_2022_sum=matsvinn_2022_sum[['jan_22','feb_22','mars_22', 'apr_22']].astype(int)


# # print(matsvinn_2022_mean)
# # print(matsvinn_2022_sum)

# # matsvinn_2022_mean.to_csv('Medel_matsvinn_2022.csv', index=False)
# # matsvinn_2022_sum.to_csv('Sum_matsvinn_2022.csv', index=False)


# ###################________________________________2023______________________________________

# df = pd.read_csv('2023 jan.csv')
# df2= pd.read_csv('2023 feb.csv')
# df3= pd.read_csv('2023 mars.csv')
# df4= pd.read_csv('2023 april.csv')

# # #print(df, df2, df3, df4)

# df.columns = df.columns.str.strip()
# df2.columns = df2.columns.str.strip()
# df3.columns = df3.columns.str.strip()
# df4.columns = df4.columns.str.strip()


# ny_df=df.drop(['Kategori', 'Månad', 'År'], axis=1)
# ny_df2=df2.drop(['Kategori', 'Månad', 'År'], axis=1)
# ny_df3=df3.drop(['Kategori', 'Månad', 'År'], axis=1)
# ny_df4=df4.drop(['Kategori', 'Månad', 'År'], axis=1)

# print(ny_df, ny_df2, ny_df3, ny_df4)
# # # #print(ny_df.head(2), ny_df2.head(2))

# merging_files= pd.merge(ny_df, ny_df2, on = 'Enhet', how = 'inner')
# merging_files_2= pd.merge(merging_files, ny_df3, on = 'Enhet', how = 'inner')
# print(merging_files_2)
# merging_files_2=merging_files_2.rename(columns={'Kökssvinn  (i kg)_x': 'jan_23', 'Kökssvinn  (i kg)_y': 'feb_23',  'Kökssvinn  (i kg)': 'mars_23'})
# merge2023= pd.merge(merging_files_2, ny_df4, on = 'Enhet', how = 'inner')
# merge2023=merge2023.rename(columns={'Kökssvinn  (i kg)': 'apr_23'})
# print(merge2023)

# # '''columns = merge2023.columns
# # for column in columns:
# #      print(column)'''


# matsvinn_2023_mean=merge2023[['jan_23','feb_23','mars_23', 'apr_23']].agg('mean')
# matsvinn_2023_mean=matsvinn_2023_mean[['jan_23','feb_23','mars_23','apr_23']].round(2).astype(float)
# matsvinn_2023_sum=merge2023[['jan_23','feb_23','mars_23','apr_23']].agg('sum')
# matsvinn_2023_sum=matsvinn_2023_sum[['jan_23','feb_23','mars_23','apr_23']].astype(int)


# print(matsvinn_2023_mean)
# print(matsvinn_2023_sum)

# matsvinn_2023_mean.to_csv('Medel_matsvinn_2023.csv', index=False)
# matsvinn_2023_sum.to_csv('Sum_matsvinn_2023.csv', index=False)




