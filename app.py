from flask import Flask, jsonify
from flask import render_template 
from flask import Markup
from pymongo import MongoClient
import json


#################################################
# Flask Setup
#################################################
app = Flask(__name__, template_folder='templates')

@app.route("/")
def homepage():
    message = "Test"
    return render_template('homepage.html') 


@app.route("/historical.html")
def historical():

    return render_template("historical.html")

@app.route("/getData")
def getData():

    mongo = MongoClient(port=27017)
    db = mongo['earthquakes']
    query = {}
    fields = {'_id': 0}

    earthquakes = db.hist_quakes.find(query, fields).limit(3)
    earthquakes = list(earthquakes)

    return earthquakes
    

if __name__ == "__main__":
    app.run(debug=False)