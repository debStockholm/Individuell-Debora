import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np


#MATSVINN(kokssvinn) FORSKOLOR I SODERTALJE   - JAMFORELSE MELLAN JANUARI - FEBRUARI - MARS - APRIL 2023



#_________________________________LOAD________________________________________


df = pd.read_csv('Inlamning2\Rapportering svinn förskola januari.csv')
df2= pd.read_csv('Inlamning2\Rapportering svinn förskola februari.csv')
df3= pd.read_csv('Inlamning2\Rapportering svinn förskola mars.csv')
df4= pd.read_csv('Inlamning2\Rapportering svinn förskola april.csv')
#print(df,df2, df3, df4)


'''
# Ta fram en lista av alla kolumner om det behovs:

columns = ny_df.columns
for column in columns:
     print(column) 

'''

#_____________________________________TRANSFORM________________________________________

#merging de forsta tva dataset:
merging_files= pd.merge(df, df2, on = 'Enhet', how = 'outer')
'''#print(merging_files)'''


#byta namn till kolumner och spara enbart de mest relevanta - drop allt annat:
cleaned_data =merging_files.drop(['Kategori_x', 'Kategori_y', 'Månad_x', 'Månad_y', 'År_x', 'År_y'], axis=1)
cleaned_data_2 = cleaned_data.rename(columns={'Kökssvinn(i kg)_x':'Kökssvinn(i kg) januari', 'Kökssvinn(i kg)_y':'Kökssvinn(i kg) februari'})
#print(cleaned_data_2)


#jag vill visa jamforelse over tid under tva manader. Da tar jag bort de raderna dar minst det ena vardet varde ar 'NaN':

cleaning_data_3 = cleaned_data_2.dropna(subset=['Kökssvinn(i kg) januari', 'Kökssvinn(i kg) februari'])
#print(cleaning_data_3.head(10)) 


#skapar nya kolumner:

#1. raknar skillnad i kg av matsvinn fran januari till februari:
cleaning_data_3['Kökssvinn(i kg) skillnad']= (cleaning_data_3['Kökssvinn(i kg) februari'] - cleaning_data_3['Kökssvinn(i kg) januari'])
cleaning_data_3['Kökssvinn(i kg) skillnad']= cleaning_data_3['Kökssvinn(i kg) skillnad'].astype(float)

#2. Kollar i % hur mycket andring blev det:
cleaning_data_3['Matsvinn forandring jan-feb i %']= (cleaning_data_3['Kökssvinn(i kg) februari'] - cleaning_data_3['Kökssvinn(i kg) januari'])/cleaning_data_3['Kökssvinn(i kg) januari'] * 100
cleaning_data_3['Matsvinn forandring jan-feb i %'] = cleaning_data_3['Matsvinn forandring jan-feb i %'].astype(int) 
#print(cleaning_data_3.dtypes)
#print(cleaning_data_3)


'''rad beraknare:
rows= len(cleaning_data_3)
print(rows)
'''


#skapar en agg() sortering for 'key' insikter om matsvinn hos forskolorna i januari och februari:

matsvinn_keyvalues=cleaning_data_3.agg({'Kökssvinn(i kg) januari':['sum','mean', 'max','min'], 'Kökssvinn(i kg) februari': ['sum','mean', 'max', 'min']})
matsvinn_keyvalues[['Kökssvinn(i kg) januari', 'Kökssvinn(i kg) februari']] = matsvinn_keyvalues[['Kökssvinn(i kg) januari', 'Kökssvinn(i kg) februari']].round(2).astype(float)



# Filtrerar ut data for att skapa en mindre graf, men det gar att koras grafer pa samtliga 'Enheter' dvs forskolorna:

# 1.stort negativt matsvinn forandring: skolor som slandge 40% + mat i februari jmf med januari:
print('NEGATIV UTVECKLING ---> mer matsvinn')
positive_values = cleaning_data_3[cleaning_data_3['Matsvinn forandring jan-feb i %'] >= 40]
neg_matsvinn_utv= positive_values.sort_values(by='Matsvinn forandring jan-feb i %', ascending= True)
data_graph_1 = neg_matsvinn_utv             
 # -----------------5 skolor pa 40 okade deras matsvinn i februari av 40%+
''' print(data_graph_1) '''



# 2. mest positiva matsvinn forandring: skolor som slandge 40% + mindre mat i februari jmf med januari

print('POSITIV UTVECKLING ---> mindre matsvinn')
neg_values = cleaning_data_3[cleaning_data_3['Matsvinn forandring jan-feb i %']  <= -40 ]
pos_matsvinn_utv= neg_values.sort_values(by='Matsvinn forandring jan-feb i %', ascending = True)
data_graph_2 = pos_matsvinn_utv               
# ---------------4 skolor pa 40 minskade deras matsvinn av mer an 40%
'''print(data_graph_2)'''



# 3. forskolor som hade en liten forandring i matsvinn mangd mellan jan/feb:

print('LAGOM OFORANDRAT MATSVINN')
lagom_utveck= cleaning_data_3.loc[(cleaning_data_3['Matsvinn forandring jan-feb i %'] >= -10) & (cleaning_data_3['Matsvinn forandring jan-feb i %'] <=10)]
# ---------------14 skolor pa 40 har en matsvinnforandring av +/-10% mellan de tva manaderna
#----------------22 skolor pa 40 har en matsvinnforandring av +/-15% mellan de tva manaderna

'''print(lagom_utveck) '''

#_________________________________grafer______________________________________

#1. OVERSIKT ANTAL SKOLOR X KG MATSVINN UNDER JANUARI OCH FEBRUARI MANAD

sns.histplot(cleaning_data_3['Kökssvinn(i kg) januari'], kde=True, color='cyan', bins=15)
sns.histplot(cleaning_data_3['Kökssvinn(i kg) februari'], kde= True, color='yellow', bins=15)
plt.title('Antal forskolor x matsvinn i kg - distribution')
plt.ylabel('Antal_forskolor')
plt.xlabel('Matsvinn i kg')
plt.show()

'''overblick over skillnader mellan jan och febr: 
Enligt grafen, de flesta forskolorna hade ett matsvinn mellan 0 och 20kg per enhet under januari e februari. 

'''



# 2.MATSVINN OKNING: forskolor som okade matsvinn 40% + mellan i februari jmf med januari:

neg_utveckling = data_graph_1.melt(id_vars=['Enhet'], value_vars=['Kökssvinn(i kg) januari', 'Kökssvinn(i kg) februari'], 
var_name='Månad', value_name='Kökssvinn (i kg)')
sns.catplot(data=neg_utveckling, x='Enhet', y='Kökssvinn (i kg)', hue='Månad', kind='bar', dodge=True, height=8, aspect=1)
plt.title("Jämförelse av kökssvinn i januari och februari")
plt.suptitle('Top 5 forskolor som okade deras matsvinn fran januari till februari')
plt.xlabel("Forskole namn")
plt.ylabel("Kökssvinn i kg")
plt.show()

'''5 forskolor hade en kraftig okning av matsvinn mellan januari och februari. Ingen av dem varbland de som hade hogst matsvinn varde, daremot en av dem, 'Petunian', 
hade lagst matsvinn varde bade januari och februari'''


# 3 MATSVINN MINSKNING: forskolor som minskade deras matsvinn av 40% + mellan januari och februari:

sns.lineplot(data=data_graph_2, x='Enhet', y= 'Kökssvinn(i kg) januari', color = 'orange', marker='o' , label = 'januari')
sns.lineplot(data=data_graph_2, x='Enhet', y= 'Kökssvinn(i kg) februari', color = 'green', marker= 'o' , label = 'februari')
plt.title("Jämförelse av kökssvinn i januari och februari")
plt.suptitle('Forskolor som minskade deras matsvinn fran januari till februari med en skillnad pa +30%')
plt.xlabel("Forskola")
plt.ylabel("Kökssvinn i kg")
plt.show()

'''4 forskolor minskade deras matsvinn kraftigt mellan januari och februari. 3 av dem hade lag matsvinn varde (mindre an 10kg)
 redan i borjan, 'Gullpudran' var den enda som hade ett matsvinn i januari hogre an 20kg'''

# 4 MATSVINN UTAN STORRE FORANDRING: forskolor som hade ett +\-10% matsvinn forandring mellan januari och februari:
    #a. matsvinnsforandring jmfr:
sns.scatterplot(y='Kökssvinn(i kg) januari', x='Enhet' , data=lagom_utveck, color='darkblue', label='jan' , s=150)
sns.scatterplot(y='Kökssvinn(i kg) februari', x='Enhet',  data=lagom_utveck, color='orange', label = 'feb', s=80)
plt.title('Forskolor som upplevde +\-10% matsvinnsforandring')
plt.legend(loc= 'upper right')
plt.ylabel('Kökssvinn(i kg)')
plt.xlabel('Forskola:')
plt.show()


 #eller
      #b. matsvinnsforandring jmfr:

plt.figure(figsize=(10, 6))
sns.scatterplot(data=lagom_utveck, x='Kökssvinn(i kg) januari', y='Kökssvinn(i kg) februari', color ='salmon', s=150)
for i in range(lagom_utveck.shape[0]):
    plt.text(lagom_utveck['Kökssvinn(i kg) januari'].iloc[i] + 0.5, 
             lagom_utveck['Kökssvinn(i kg) februari'].iloc[i], 
             lagom_utveck['Enhet'].iloc[i],
             fontsize=10, ha='left', va='top')

plt.title('Forskolor med +/-10% matsvinn forandring mellan januari och februari')
plt.suptitle('Scatterplot jmfrs Januari/Februari')
plt.xlabel('matsvinn januari i kg')
plt.ylabel('matsvinn februari i kg')
plt.show()

'''i bada grafer ovan kan man se de forskolor som hade lite forandring mellan matsvinn i januari och februari. I den forsta grafen ser man att punkterna ligger intill varandra,
i den andra kan man nastan saga att samtliga forskolor ligger pa en nastan rat linje, bada visualiseringar bevisar den lilla avvikelsen mellan varden'''


#______________________ny merging - joinar tva till dataset

ny_merging_files= pd.merge(cleaning_data_3, df3, on = 'Enhet', how = 'outer')
ny_merge =pd.merge(ny_merging_files, df4, on = 'Enhet', how='outer')
#print(ny_merge)

#tar bort onodiga kolumner, byter namn till andra:
merging =ny_merge.drop(['Matsvinn forandring jan-feb i %','Kökssvinn(i kg) skillnad', 'Kategori_x', 'År_x','Månad_x' ,'Månad_y','Kategori_y' , 'År_y'], axis=1)
merging_ = merging.rename(columns={'Kökssvinn(i kg)':'Kökssvinn(i kg) mars'})
merging_2 =merging_.rename(columns={'Kökssvinn  (i kg)':'Kökssvinn(i kg) april'})
#print(merging_2)  

#59 rows inkl. kolumns titel


#Jag tar bort samtliga rader dar ALLA varde ar NaN da jag inte kan arbeta med dem anda (fast jag vet jag inte behover gora detta for att jag kommer kora mina nasta grafer pa 'Aggregate' data):

merging_ma = merging_2.dropna(axis=0, how= 'all', subset=merging_2.columns[1:])
print(merging_ma)

#merging_ma= merging_2.dropna(axis=0, how ='any')    kan prova att se forandringar i data om man dropnar samtliga rader med minst en NaN varde
'''rowss=len(merging_ma)
print(rowss)

#52 rader kvar inkl. kolumns titel
'''


#skapar en agg() sortering for 'key' insikter om matsvinn hos Sodertalje forskolor i samtliga manader januari - april, inklusive raderna med NaN varden:

matsvinn_keys=merging_ma.agg({'Kökssvinn(i kg) januari':['sum','mean', 'max','min'], 'Kökssvinn(i kg) februari': ['sum','mean', 'max', 'min'], 
'Kökssvinn(i kg) mars':['sum','mean', 'max','min'], 'Kökssvinn(i kg) april':['sum','mean', 'max','min']})
matsvinn_keys[['Kökssvinn(i kg) januari', 'Kökssvinn(i kg) februari', 'Kökssvinn(i kg) mars', 'Kökssvinn(i kg) april']] = matsvinn_keys[['Kökssvinn(i kg) januari', 'Kökssvinn(i kg) februari','Kökssvinn(i kg) mars','Kökssvinn(i kg) april']].round(2).astype(float)   #kor INT typ pa allt
#  #tycker det ar bra med avrundning, men behovs ej egentligen



# #forbereder mina nya data for plotting enligt AI visdom (skulle jag soka syntax sjalv pa stack overflow skulle det ta 1 ar att gora detta):

matsvinn_keys = matsvinn_keys.reset_index()
merging_data = matsvinn_keys.melt(id_vars=['index'], 
value_vars=['Kökssvinn(i kg) januari', 'Kökssvinn(i kg) februari', 'Kökssvinn(i kg) mars', 'Kökssvinn(i kg) april'],
var_name='Månad',
value_name='Kökssvinn (kg)')
merging_data.columns=['Aggregat_typ', 'Månad', 'Kökssvinn (kg)']
#print(merging_data)




#____________________________i de kommande grafer hanterar vi SUM, MEDEL, MIN, MAX varden_______________________________________


#______________________________________________BETTER SCATTERPLOT (BUBBLES)________________________________________
sns.scatterplot(x='Månad', y='Kökssvinn (kg)', hue='Aggregat_typ', size='Kökssvinn (kg)', sizes=(30, 180), data=merging_data)

plt.title('Matsvinn Sodertalje forskolor_better_scatterplot')
plt.xlabel('Månad')
plt.ylabel('Kökssvinn (i kg)')
plt.show()
'''denna graf var valdig rolig, hade onskat en annan typ av data for att arbeta med den. 
Det framgar att april manad ar den manaden med lagre matsvinnsumma och lagre medel, och innehaller forskolorna som har lagst min och max varde pa matsvinn. 
Om man tar bort samtliga rader med minst en NaN varde, summa matsvinn ar fortfarande lagre i april, men inte medel, min och max'''

#___________________________________________________HEATMAP____________________________________________________________
Data_graph_3 = merging_data.pivot(index='Månad', columns='Aggregat_typ', values='Kökssvinn (kg)')

sns.heatmap(Data_graph_3, annot=True, cmap='YlGnBu', fmt=".2f", linewidths=1)
plt.title('Matsvinn Sodertalje forskolor')
plt.xlabel('Aggregat_typ')
plt.ylabel('Månad')
plt.show()
 #jag har experimenterat med nastan alla fargpaletter har



# merging_data.to_csv('Arbete_med_flera_kolumner.csv', index=False) 
# data_graph_1.to_excel('Df matsvinn_neg 40%_.xlsx', index=False)
# data_graph_2.to_excel('Df matsvinn_pos 40%_.xlsx', index=False)
# Data_graph_3.to_excel('Arbete_med_flera_kolumner_2.xlsx, index=False)
# lagom_utveck.to_excel('Df matsvinn 10%.xlsx', index=False)
merging_ma.to_excel('Df for LR and Cluster.xlsx', index=False)
Data_graph_3.to_pickle('Exempel export inlagd_gurka.pkl')

# #Brunnsang - Grusasen omrade: forskolor som ligger i samma geografiska omrade(saknas en forskola, dar vi hade inget data!): 
# # forskole_namn= ['Algården',  'Grusåsen', 'Oxelgrenshagen', 'Trädgården']
# # forsk_omrade= merging_2[merging_2['Enhet'].isin(forskole_namn)]
# # print(forsk_omrade)


# #UTVARDERING:

'''Mer en 1/3 av de analyserade forskolor hade en nastan oforandrat matsvinn pa +\-10%. 
Mer an halften av de analyserade forskolor hade ett matsvinn forandring pa +/-15%.
Ca 1/4 av de analyserade forskolor hade en krafting okning eller minskning av matsvinnet: av dessa, ca 1/10 hade en kraftigt okning, och 1/10 en kraftig minskning
Samtliga kolumner kan fordelas vidare, men saknas viktigt data for att fordela saker rimligare.
CA 1/4 av forskolorna hade ett matsvinn forandring mellan +/-16% och +/-39%.

Datakallor for dessa analyser val valdig prydliga, men berattar inte oss mycket, da det saknas kontexten som kan ge meningen till de olika varden.
T.ex. saknas viktiga data om barnens narvaro under oppetdagarna, samt sjalva forskolans oppetdagar under en enskild manad. 
Barnens narvaro/franvaro skulle forklara varfor manga skolor hade okat/minskat matvinn mellan de tva manaderna.
Franvaron kan bero pa roda dagar/semester (forsta veckan i januari ar manga fortfarande hemma, sista i februari har man sportlov), eller
sjukfranvaro (februari manga ar sjuka och kanske inte dyker upp pa forskola med kort varsel, dvs mer matsvinn) - man kan inkl.
i matsvinn ocksa varor som har gatt ut och som inte har kunnat anvandas? Det vet vi inte)...
Man borde ocksa behova ett oversikt pa hur mycket mat bestalls jamforts med andel barn som skall serveras, och en detaljerad beskrivning 
pa hur man beraknar koksvinn? 
Viktigt forklaring ocksa och lite bias fran min sida, da koksvinn kanskeinnebar ocksa biprodukter av matlagning som ej gar att anvanda, inte enbart atfardig mat?

Antal barnen pa varje forskola istallet bor ej vara relebant for de flesta berakningar.
Man skulle kunna utvardera att de forskolorna som har hogst koksvinn serverar flera barn, och tvartom. Detta kanns rimligt, och daremot om man kollar
pa de aggregat varderna (max, min, sum, mean) pa fyra manader, kan man se att det inte finns storre forandringar, som kan tolkas att samtliga
enheter gor sitt basta for att ha koll pa deras avfallage.
Given att, i forsta delen av min Transform process, sorterade jag ut de raderna dar minst den ena vardet var NaN, skolan som hade hogst matsvinn i januari var 'Algarden'
med ca 2kg per dag*, och den som hade minsta matsvinn var 'Petunian'. Manga forskolor hade en otrolig lag matsvinn, men svart att veta
varfor blev det sa (barnen tar eget mat? catering? har de inget kok och raknar ej matsvinnet? fel datainmatning i excel_kallan)?

Man skulle ha data for samtliga forskolor i stan med NARVARO, OPPETDAGARNA samt BESKRIVNING om vad som bedoms som matsvinn for att forklara varfor vissa hade betyligt mer an andra

*hur raknar man detta? 43 kg / 21 dagar, som ar antalet vardagar - roda dagar i januari 2023. Jag utgar att skolan varit oppet som vanligt(bias'''