# import necessary libraries
from sqlalchemy import func

from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)

from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)

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

# ====================probably should remove before goign live?===============
# @app.before_first_request
# def setup():
#     # Recreate database each time for demo
#     db.drop_all()
#     db.create_all()


# create route that renders index.html template
@app.route("/")
def home():
    return render_template("index.html")


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
    app.run()
