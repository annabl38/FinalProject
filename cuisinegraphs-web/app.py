import pandas as pd
from math import pi
import heapq

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from pathlib import Path

doc="train.json"
df = pd.read_json(doc, orient='columns')

ingredients = df['ingredients']
all_ingredients = []
for item in ingredients:
    all_ingredients.extend(item)

unique_ingredients = list(set(all_ingredients))

cuisines = df.groupby('cuisine').count()

cuisine_list = list(set(df['cuisine']))
big_dict={}
for item in cuisine_list:
    big_dict[item]=[]

for index, row in df.iterrows():
    big_dict[row['cuisine']].append(row['ingredients'][0])

num_dict={}
for item in cuisine_list:
    num_dict[item]={}

for item in cuisine_list:
    list=big_dict[item]
    for ingred in list:
        if ingred in num_dict[item]:
            num_dict[item][ingred]+=1
        else:
            num_dict[item][ingred]=1

#need a loop to go thorugh all cuisines
country_data = num_dict['filipino']
popIngredients= heapq.nlargest(5, country_data, key=country_data.get)
x= [country_data[key] for key in popIngredients]
filipino= plt.pie(x=x, labels=popIngredients)
