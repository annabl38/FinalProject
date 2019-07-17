import pandas as pd
import json
from flask import Flask, render_template


app= Flask(__name__)

cusine_data= pd.read_json("cuisine_brief_json.json")

@app.route("/")
def index():
    return render_template("index.html")

