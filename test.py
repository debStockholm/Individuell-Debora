data = """
Game 1: 14 green, 8 blue, 9 red; 5 blue, 4 green, 2 red; 4 red, 4 blue, 4 green; 1 blue, 3 green, 2 red; 10 red, 3 blue, 15 green; 2 red, 6 green, 3 blue
Game 2: 1 red, 12 green, 2 blue; 2 green, 1 blue, 1 red; 4 green, 2 blue; 10 green, 3 blue; 4 green, 2 red, 2 blue
Game 3: 16 red, 3 green; 7 green, 15 red, 3 blue; 4 green, 20 red, 1 blue; 12 red, 13 green, 1 blue; 2 green, 8 red, 1 blue; 16 red, 7 green
"""


max_x_color={'red': 12, 'green': 13, 'blue':14}
possible_games=[]


data_parsed_1=data.strip().split('\n')
#print(data_parsed_1)
data_parsed_2= data_parsed_1[0].split(':')
#print(data_parsed_2)
data_parsed_3=data_parsed_2[1].split(';')
print(data_parsed_3)
