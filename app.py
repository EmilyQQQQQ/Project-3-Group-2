from flask import Flask, render_template, jsonify, request
from flask import Markup
import requests
from pymongo import MongoClient
import json
from bs4 import BeautifulSoup
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


@app.route("/latest.html")
def latest():

    return render_template("latest.html")


@app.route("/comparison.html")
def comparison():

    return render_template("comparison.html")


@app.route("/getNews")
def getNews():

    newslist = []

    url = "https://abcnews.go.com/alerts/earthquakes"

    html = requests.get(url).text
    soup = BeautifulSoup(html, 'html.parser')

    topics = soup.find("section", class_="Topics")

    articles = topics.find_all("div", class_="ContentRoll__Headline")
    
    for article in articles[0:15]:
        title = article.find("a", class_="AnchorLink")["data-track-ctatext"]
        link = article.find("a", class_="AnchorLink")["href"]

        newslist.append("<a href=\"" + link + "\"><b>"+title+"</b></a>")

        #newsDict = {"Title": title,
        #            "link": link}
        
        #newslist.append(newsDict)
        
        #newslist.append(title)


    return newslist

@app.route("/getCountries")
def getCountries():

    
    #Specify Mongo connection
    mongo = MongoClient(port=27017)
    db = mongo['earthquakes']

    query = {}
    fields = {'country': 1, '_id': 0}
    sort = [('country', 1)]

    countries = db.hist_quakes.find(query, fields).sort(sort).distinct('country')


    final_countries = ["ALL"]

    for country in countries:
        final_countries.append(country)

    return final_countries

@app.route("/getData")
def getData():
    

    #Get Arguments
    minMagnitude = request.args.get("minMagnitude", type=float)
    maxMagnitude = request.args.get("maxMagnitude", type=float)
    minYear = request.args.get("minYear", type=int)
    maxYear = request.args.get("maxYear", type=int)
    country = request.args.get("country", type=str)
    id = request.args.get("id", type=str)


    #Specify Mongo connection
    mongo = MongoClient(port=27017)
    db = mongo['earthquakes']
    fields = {'_id': 0}

    #Prepare query critiera based on arguments
    query = {}
    if minMagnitude is None or minMagnitude.strip() == "":
        minMagnitude = 1
    if maxMagnitude is None or maxMagnitude.strip() == "":
        maxMagnitude = 9.5
    query['eq_primary'] = {"$gte": minMagnitude, "$lte": maxMagnitude}

    if minYear is None or minYear.strip() == "":
        minYear = -2150
    if maxYear is None or maxYear.strip() == "":
        maxYear = 2020
    query['year'] = {"$gte": minYear, "$lte": maxYear}

    if country and country!= "ALL":
        query['country'] = country

    if id and id.strip() != "":
        query['i_d'] = id
    
    #Sort by magniude desc, date desc
    sort = [('eq_primary', -1), ('year', -1), ('month', -1), ('day', -1)]

    #Get data from the DB
    earthquakes = db.hist_quakes.find(query, fields).sort(sort)
    earthquakes = list(earthquakes)


    #Return list of earthquakes
    return earthquakes
    

    
    
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