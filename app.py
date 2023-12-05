from flask import Flask, jsonify
from flask import render_template 
from flask import Markup
from pymongo import MongoClient


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

    mongo = MongoClient(port=27017)
    db = mongo['earthquakes']
    query = {}
    fields = {'_id': False}

    earthquakes = db.hist_quakes.find(query, fields)
    earthquakes_json = jsonify(list(earthquakes))
    return render_template('historical.html', earthquake_list = earthquakes_json) 
    

if __name__ == "__main__":
    app.run(debug=True)