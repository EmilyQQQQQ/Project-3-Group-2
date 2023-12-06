from flask import Flask, render_template, jsonify, request
from pymongo import MongoClient
import requests

app = Flask(__name__, template_folder='templates')

@app.route("/")
def homepage():
    message = "Test"
    return render_template('homepage-Emily.html')


@app.route("/latest-Emily.html")
def latest():

    return render_template("latest-Emily.html")


@app.route("/comparison-Emily.html")
def comparison():

    return render_template("comparison-Emily.html")


@app.route("/historical-Emily.html")
def historical():
    return render_template("historical-Emily.html")

@app.route("/getData")
def get_data():
    mongo = MongoClient(port=27017)
    db = mongo['earthquakes']
    query = {}
    fields = {'_id': 0}

    earthquakes = db.hist_quakes.find(query, fields).limit(3)
    earthquakes = list(earthquakes)

    return jsonify(earthquakes)

@app.route("/getLatestEarthquakes", methods=["GET"])
def get_latest_earthquakes():
    magnitude = request.args.get("magnitude", type=float)
    time_period = request.args.get("time_period", type=int)

    if magnitude is None or time_period is None:
        return jsonify({"error": "Invalid input. Please provide magnitude and time_period parameters."}), 400

    usgs_api_url = "https://earthquake.usgs.gov/fdsnws/event/1/query"
    params = {
        "format": "geojson",
        "minmagnitude": magnitude,
        "starttime": f"-{time_period}d",
    }
    try:
        response = requests.get(usgs_api_url, params=params)
        response.raise_for_status()
        data = response.json()
    except requests.RequestException as e:
        return jsonify({"error": f"Error fetching data from USGS API: {str(e)}"}), 500

    earthquakes = [
        {
            "id": feature["id"],
            "magnitude": feature["properties"]["mag"],
            "location": feature["properties"]["place"],
        }
        for feature in data["features"]
    ]

    return jsonify(earthquakes)

if __name__ == "__main__":
    app.run(debug=False)
