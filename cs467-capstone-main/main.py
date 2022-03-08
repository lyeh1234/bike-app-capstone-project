from google.cloud import datastore
from flask import Flask, request
import json
import constants
import bike
import user
import flask_cors


# Citation: The parts of this code that establish the framework for interacting with Datastore are based on code
# presented in CS493 (Cloud Application Development, Modules 3 and 4), with modifications are required.

app = Flask(__name__)
flask_cors.CORS(app)

app.register_blueprint(bike.bp)
app.register_blueprint(user.bp)


@app.route('/')
def index():

    return "Please navigate to /bikes or /users to use this API"
    
@app.after_request
def after_request(response):
    white_origin= ['http://localhost/3000/*','http://localhost/8080/*','https://capstone-cs-467-react.wm.r.appspot.com/*','https://react-kollective.wl.r.appspot.com/*']
    if request.headers['Origin'] in white_origin:
        response.headers['Access-Control-Allow-Origin'] = request.headers['Origin'] 
        response.headers['Access-Control-Allow-Methods'] = 'PUT,GET,POST,DELETE'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    return response

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)