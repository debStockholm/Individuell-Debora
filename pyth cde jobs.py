print('Hej, let us talk about work or internship possibilities!')

internship = 'Internship (LIA): december 2025 - april 2026'
print(internship)
examensarbete = True
if examensarbete:
    print('Can write Examensarbetet (a lower-level master exam) within the company')
work_extra_or_and_summer = 'Can work part-time/hourly during the whole 2025'
print(work_extra_or_and_summer)


import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

Best_candidate = {
    'SKILLS': ['Python', 'PostGreSQL', 'Neverending WHILE-loops' , 'ChatGPT', 'GitHub', 'Rail engineering', 'Brings sweets to office', 'Mind her own business' ],
    'ON A SCALE FROM 1 TO 10': [3, 5, 7, 6,-2, 7, 20, 9]
}

best_cand=pd.DataFrame(Best_candidate)
best_cand.to_csv('best candidate application.csv', index = False)


Best_best= pd.read_csv('best candidate application.csv')
Best_of_the_best = Best_best.sort_values(by= 'ON A SCALE FROM 1 TO 10' , ascending =True)
print(Best_of_the_best)

sns.barplot(data= Best_of_the_best, x='SKILLS', y = 'ON A SCALE FROM 1 TO 10')
plt.title('Debora the best candidate:')
plt.show()
#close Plot to keep on running code:

print("...company team scanning available roles...loadin'...")

work_position = 'available'  #please do not change
deb = 'this candidate'

if work_position == 'available':
    print(f"{deb} is an amazing opportunity, let's reach her out!")
elif work_position == 'not available':
    other_relevant_openings = True
    if other_relevant_openings:
        print(f"let's see what else can suit {deb} best!")
    else: 
        print(f"can't miss this outstanding opportunity though, let's look better for {deb}' possibilities!")
else:
    print( 'do we really wanna miss this once in a lifetime opportunity? :-( ')  #please don't choose :(


print(f'{deb} reply back:')

print('Thank you for your time' + ' and')
Weekend_approach = True     #change bool according to preferences

for greeting in range(3):
    if Weekend_approach:
        print('wish you a great weekend!')
    else:
        print('wish you a proficuous week!')



print('DO YOU THINK MY CODE IS TERRIBLE? I CAN ACTUALLY DO WORSE! Reach me out if you wanna know more, or show me how to do best! :-)   :-)')
#OBS
print(f'({deb} has some humor)')


#committed and pushed   --- done?