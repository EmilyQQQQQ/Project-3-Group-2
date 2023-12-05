from flask import Flask, render_template, jsonify, request
from flask import Markup
from pymongo import MongoClient
import json
import requests


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
    

@app.route("/getLatestEarthquakes", methods=["GET"])
def get_latest_earthquakes():
    magnitude = request.args.get("magnitude", type=float)
    time_period = request.args.get("time_period", type=int)

    usgs_api_url = "https://earthquake.usgs.gov/fdsnws/event/1/query"
    params = {
        "format": "geojson",
        "minmagnitude": magnitude,
        "starttime": f"-{time_period}d",
    }
    response = requests.get(usgs_api_url, params=params)
    data = response.json()

    earthquakes = [
        {
            "id": feature["id"],
            "magnitude": feature["properties"]["mag"],
            "location": feature["properties"]["place"],
        }
        for feature in data["features"]
    ]

    return earthquakes


if __name__ == "__main__":
    app.run(debug=False)