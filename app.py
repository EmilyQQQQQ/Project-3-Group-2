from flask import Flask, jsonify
from flask import render_template 

#################################################
# Flask Setup
#################################################
app = Flask(__name__, template_folder='templates')

@app.route("/")

def homepage():
    message = "Test"
    return render_template('homepage.html') 
    

if __name__ == "__main__":
    app.run(debug=True)