# import necessary libraries
from sqlalchemy import func

from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)

# Dependencies for Spoonacular API
import requests
import pandas as pd
import json
from pprint import pprint

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine


# ==================Machine Learning=============
# import pandas as pd
from sklearn.preprocessing import LabelEncoder
from keras.utils import to_categorical
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.datasets import make_classification
from keras.models import Sequential
from keras.layers import Dense
from keras.models import load_model
from keras.models import model_from_json
from keras import backend as k
import tensorflow as tf
# import database
data = pd.read_json("db/train.json")

# create cuisnie list for output
cuisine_list = data['cuisine']
cuisine_compilation = []
for cuisine in cuisine_list:
    cuisine_compilation.append(cuisine)
      
cuis_unique = list(set(cuisine_compilation))


# create cuisine list to use as template for unput
ingredients = data.loc[:,'ingredients']

i_map = {}
i_list = []
counter = 0
for lists in ingredients:
    for items in lists:
        if items not in i_map:
            i_list.append(items)
            i_map[items] = counter
            counter = counter + 1

ingredients_encodings = []
for lists in ingredients:
    encoding = [0]*len(i_map)
    for items in lists:
        encoding[i_map[items]] = 1
    ingredients_encodings.append(encoding)


# load deep learning model
# deep_model = None
# with open('Model/deep_model_architecture.json', 'r') as f:

#     deep_model = model_from_json(f.read())
# deep_model = Sequential()
# deep_model.add(Dense(units=20, activation='relu', input_dim=6714))
# deep_model.add(Dense(units=15, activation='relu'))
# deep_model.add(Dense(units=10, activation='relu'))
# deep_model.add(Dense(units=20, activation='softmax'))
# deep_model.compile(optimizer='adam',
#                    loss='categorical_crossentropy',
#                    metrics=['accuracy'])
# # Load weights into the new model
# deep_model.load_weights('Model/cuisine_deep_model_trained.h5')
# ========================================



app = Flask(__name__)

#################################################
# Database Setup
#################################################

app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///db/CuisineFinder.sqlite"

db = SQLAlchemy(app)

class CuisineFinder(db.Model):
    __tablename__ = 'cuisine'

    id = db.Column(db.Integer, primary_key=True)
    recipe_url = db.Column(db.String(500))

    def __repr__(self):
        return '<CuisineFinder %r>' % (self.name)

class CuisineFinderAuto(db.Model):
    __tablename__ = 'ingredient_list'

    id = db.Column(db.Integer, primary_key=True)
    ingredient_autocomplete = db.Column(db.String(500))

    def __repr__(self):
        return '<CuisineFinderAuto %r>' % (self.name)

db.create_all()
#################################################
# End Database Setup
#################################################


# create route that renders index.html template
@app.route("/")
def home():
    return render_template("index.html")

# Query the database and send the jsonified results
@app.route("/url_input", methods=["GET", "POST"])
def url_input_page():
    
    if request.method == "POST":
        recipe_url = request.form["recipe_url"]

        personaldata = CuisineFinder(recipe_url=recipe_url)
        db.session.add(personaldata)
        db.session.commit()
        # ctype=personaldata.id
        # print(CuisineFinder.id)
        return redirect(f"/spoonacular/?id={personaldata.id}", code=302)
        # return jsonify(personaldata.id)
        # return(jsonify(ctype))

    return render_template("spoonacular.html")


@app.route("/spoonacular/")
def spoonacular_app():

    #################################################
    # Get User URL from database
    ###############################
    id = request.args.get('id')
    # print(id)
    # database_url = db.session.query(CuisineFinder.recipe_url).get(id)
    database_url = db.session.query(CuisineFinder.recipe_url).filter(CuisineFinder.id == id).all()
    # print(database_url)
    for i in database_url:
        first_entry = i
        # print(first_entry)
        theurlfromdatabase = ''.join(first_entry)
        print(theurlfromdatabase)

    ###############################
    # End Get User URL from database
    #################################################


    #################################################
    # Build URL
    ###############################

    ##############################
    # # User Input in Terminal
    # user_url = input("What is the URL for the Recipe? ")
    # print(user_url)
    ##############################

    ###############################
    # Hardcoded URL Example
    hardcoded_url = "https://www.allrecipes.com/recipe/10813/best-chocolate-chip-cookie"
    ###############################

    url = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/extract?url="

    headers={
        "X-RapidAPI-Host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
        "X-RapidAPI-Key": "30943f0a23msh36da95252ee0510p14fda2jsnd4729b960015"
    }

    query_url = url + theurlfromdatabase
    # query_url = url + hardcoded_url
    print(query_url)
    ################################
    # End Build URL
    #################################################

    #################################################
    # Start API Request
    ###############################

    response = requests.get(query_url, headers=headers).json()
    # print(response)

    # pprint(response)

    # Just get the Ingredients Dictionary
    ingredients_ext = response['extendedIngredients']
    # pprint(ingredients_ext)

    """# The Loop"""

    # set up lists to hold reponse info
    ingredients = []

    # Loop through to get ingredients
    for i in ingredients_ext:
        ingredients.append(i['name'])

    print(ingredients)

    ################################
    # End API Request
    #################################################

    # # To Pandas
    # ingredients_df = pd.DataFrame(ingredients)
    # # ingredients_df.head()
    # print(ingredients_df)

    #################################################
    # Extra API data which can be used
    ########################
    # spoonacular_cuisines = response['cuisines']
    # print(spoonacular_cuisines)
    # spoonacular_dishTypes = response['dishTypes']
    # print(spoonacular_dishTypes)
    # spoonacular_title = response['title']
    # print(spoonacular_title)
    ########################
    # End Extra API data which can be used
    #################################################

    #################################################
    # Post to Database Setup and JSonify
    ########################
    # engine = create_engine('sqlite:///db/ingredients_db.sqlite', echo=False)
    # engine = create_engine('sqlite://', echo=False)

    # ingredients_df.to_sql('ingred_tbl', con=engine)

    # results = engine.execute("SELECT * FROM ingred_tbl").fetchall()
    # print(results)

    # data_for_json = []

    # for result in results:
    #     data_for_json.append({
    #         "name": result[1]
    #     })
    ########################
    # End Post to Database Setup and JSonify
    #################################################


    # =======CODE TO LOAD INTO ROUTES==========

    # The input variable needs to be put into the list below:
    input_ingred = []
    input_ingred = ingredients

    encoding = [0]*len(i_map)
    for items in input_ingred:
        if items in i_list:
            encoding[i_map[items]] = 1
        else:
            print(items + " not found")
    k.clear_session()
    test = np.expand_dims(encoding, axis=0)
    test.shape
    deep_model = Sequential()
    deep_model.add(Dense(units=20, activation='relu', input_dim=6714))
    deep_model.add(Dense(units=15, activation='relu'))
    deep_model.add(Dense(units=10, activation='relu'))
    deep_model.add(Dense(units=20, activation='softmax'))
    # Load weights into the new model
    deep_model.load_weights('Model/cuisine_deep_model_trained.h5')
    deep_model.compile(optimizer='adam',
                    loss='categorical_crossentropy',
                    metrics=['accuracy'])
    
    output = cuis_unique[int((deep_model.predict_classes(test)))]
    # print(output)
    output.capitalize()
    # ==============================
    k.clear_session()
    # return jsonify(data_for_json)
    return render_template('output.html',output=output)
    # return "cheese"


@app.route('/map')
def Map():
    return render_template('map.html')

@app.route('/viz')
def Viz():
    return render_template('viz.html')

@app.route('/machlearn')
def Colab():
    return render_template('machlearn.html')


@app.route('/autocomplete')
def auto():
    return render_template('autocomplete.html')

@app.route("/autocomplete_post", methods=["GET", "POST"])
def recipe_input_page():
    


    if request.method == "POST":
        # recipe_url = request.form["recipe_url"]
        ingredient_autocomplete = request.form["ingredient_autocomplete"]

        # personaldata = CuisineFinder(recipe_url=recipe_url)
        autocompletedata = CuisineFinderAuto(ingredient_autocomplete=ingredient_autocomplete)
        db.session.add(autocompletedata)
        db.session.commit()
        # ctype=personaldata.id
        # print(CuisineFinder.id)
        return redirect(f"/autocomplete/?id={autocompletedata.id}", code=302)
        # return jsonify(personaldata.id)
        # return(jsonify(ctype))

    return render_template("autocomplete.html")

# This will be where the json for the ingredients list will be stored
@app.route('/autocomplete_ingredients')
def auto_ingredients():
    data = pd.read_json("db/autocomplete_ingredients.json")

    # return jsonify(data)
    return data


if __name__ == "__main__":
    app.run(debug=True)
