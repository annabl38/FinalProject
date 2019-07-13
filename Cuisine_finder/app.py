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

app = Flask(__name__)

#################################################
# Database Setup 
# This may not be necessary!!
#################################################

app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///db/db.sqlite"

db = SQLAlchemy(app)


#################################################
# Original Database Setup
#################################################

app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///db/FastFood.sqlite"

db = SQLAlchemy(app)


class FastFood(db.Model):
    __tablename__ = 'fastfood'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64))
    restaurant = db.Column(db.String)
    menuitem = db.Column(db.String)

    def __repr__(self):
        return '<FastFood %r>' % (self.name)
#################################################
# End Original Database Setup
#################################################



# create route that renders index.html template
@app.route("/")
def home():
    return render_template("index.html")


@app.route("/spoonacular/")
def spoonacular_app():

    # # User Input
    user_url = input("What is the URL for the Recipe? ")
    print(user_url)

    ## Build URL

    # Hardcoded URL Example
    # import_url = "https://www.allrecipes.com/recipe/10813/best-chocolate-chip-cookie"

    url = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/extract?url="

    headers={
        "X-RapidAPI-Host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
        "X-RapidAPI-Key": "30943f0a23msh36da95252ee0510p14fda2jsnd4729b960015"
    }

    query_url = url + user_url
    print(query_url)

    response = requests.get(query_url, headers=headers).json()
    # print(response)

    # pprint(response)

    # Just get the Ingredients Dictionary
    ingredients_ext = response['extendedIngredients']
    pprint(ingredients_ext)

    """# The Loop"""

    # set up lists to hold reponse info
    ingredients = []

    # Loop through to get ingredients
    for i in ingredients_ext:
        ingredients.append(i['name'])

    print(ingredients)

    # To Pandas
    ingredients_df = pd.DataFrame(ingredients)
    # ingredients_df.head()
    print(ingredients_df)

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
    engine = create_engine('sqlite:///db/ingredients_db.sqlite', echo=False)
    # engine = create_engine('sqlite://', echo=False)

    ingredients_df.to_sql('ingred_tbl', con=engine)

    results = engine.execute("SELECT * FROM ingred_tbl").fetchall()
    print(results)

    data_for_json = []

    for result in results:
        data_for_json.append({
            "name": result[1]
        })
    ########################
    # End Post to Database Setup and JSonify
    #################################################

    return jsonify(data_for_json)
    # return "cheese"



# Query the database and send the jsonified results
@app.route("/send", methods=["GET", "POST"])
def send():
    if request.method == "POST":
        name = request.form["surveyName"]
        restaurant = request.form["surveyRestaurant"]
        menuitem = request.form["surveyMenu"]

        personaldata = FastFood(name=name, restaurant=restaurant, menuitem=menuitem)
        db.session.add(personaldata)
        db.session.commit()
        return redirect("/", code=302)

    return render_template("form.html")



# create route that returns data for plotting
@app.route("/api/fastfood")
def pals():
    # results = db.session.query(FastFood.name, FastFood.restaurant, FastFood.menuitem).all()

    data = db.session.query(FastFood.restaurant, func.count(FastFood.name))\
    .group_by(FastFood.restaurant).all()


    return jsonify(data)

@app.route("/api/sequence")
def seq():
    results = db.session.query(FastFood.name, FastFood.restaurant, FastFood.menuitem).all()



    return jsonify([r._asdict() for r in results])

@app.route('/Anna')
def Anna():
    return render_template('Anna.html')


@app.route('/Kim')
def Kim():
    return render_template('Kim.html')


@app.route('/Cristian')
def Cristian():
    return render_template('Cristian.html')


if __name__ == "__main__":
    app.run(debug=True)
