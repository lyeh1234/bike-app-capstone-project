# # React Related:
# #
# # CODE WORKS WITH HTML, NOT REACT (YET)
# # MIGHT USE MATERIAL DESIGN UI INSTEAD
# #
# # REACT CODE NOTES:
# #
# # import './App.css';
# # import {useState, useEffect} from 'react'
# #
# # need to add this code in a function as shown below:
# # useEffects(() => fetch('http://someIPaddress:50000/get' { 'methods':'GET', headers: { 'blah i.e. json or not'}}))
# #
# # function App() {const[articles, setArticles] = useState([])}
# #
# # Then need form.js done/created in React
#
# # Database Related:
#
# from FIRESTOREPLACEHOLDER.db_connector import connect_to_database, execute_query   # in case Firestore database is used
# from flask_sqlalchemy import SQLAlchemy
# from flask_cors import CORS   # may need to prevent error on webpage
#
# # Alternative way instead of connect_to_database & execute_query:
# #
# # SQLAlchemy placeholder code in case this is used
# # Refer to SQLAlchemy database via db (i.e. db.session.add(bike))
# webapp.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///students.sqlite3'
# webapp.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False   # so we are not tracking all modifications to the database
# db = SQLAlchemy(webapp)

# Working Code:

# Author: Lawrence Yeh
# Date: 11/4/2021
# Description:      Google Auth for web app
#                   console.cloud.google.com to set up Google Cloud, APIs, and Auth

# NOTES:
# pip install Authlib Flask   # Authlib has all built-in grant types for you
# in terminal $ flask run   # to run local page
# pip install requests

# Use this version of Firestore (in datastore mode)
# Need whole React front-end

from flask import Flask, redirect, url_for, session, render_template
from authlib.integrations.flask_client import OAuth

# app config
app = Flask(__name__)

# session config
app.secret_key = "secretkey"   # make this more secure

# oauth setup
oauth = OAuth(app)
google = oauth.register(
    name='google',
    client_id="620401076049-v48l9qasc0uuuiip7jr3sl8jmik5ptpk.apps.googleusercontent.com",
    client_secret="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",
    access_token_url='https://accounts.google.com/o/oauth2/token',
    access_token_params=None,
    authorize_url='https://accounts.google.com/o/oauth2/auth',
    authorize_params=None,
    api_base_url='https://www.googleapis.com/oauth2/v1/',
    userinfo_endpoint='https://openidconnect.googleapis.com/v1/userinfo',
    client_kwargs={'scope': 'openid email profile'},
)

@app.route('/')
# @login_required   # need to add a decorator/wrapper to make sure login is required
def landing():
    email = dict(session).get('email')

    if email is None:
        return f'Welcome to Bike Kollective, please sign in'
    else:
        return f'You have signed in as {email}'

# for now routes to user login
@app.route('/index')
def index():
    return render_template("userLogin.html")

@app.route('/login')
def login():
    google = oauth.create_client('google')
    redirect_uri = url_for('authorize', _external=True)

    return google.authorize_redirect(redirect_uri)

@app.route('/authorize')
def authorize():
    google = oauth.create_client('google')  # create the google oauth client
    token = google.authorize_access_token()  # Access token from google (needed to get user info)
    resp = google.get('userinfo')  # user info contains stuff u specified in the scope
    user_info = resp.json()

    # FOR IMPLEMENTING DATABASE LATER:

    # user = oauth.google.userinfo()  # uses openid endpoint to fetch user info
    # # Here use the user data received and query database to find and register the user
    # # then set database data of the user in the session not the profile from google
    # session['profile'] = user_info
    # session.permanent = True  # make the session permanent so it keeps existing after browser gets closed

    session['email'] = user_info['email']

    return redirect('/')

@app.route('/createAccount')
def createAccount():
    return render_template("createAccount.html")

@app.route('/userLogin')
def user_login():
    return render_template("userLogin.html")

@app.route('/logout')
def logout():
    session.clear()
    return redirect('/')

# INTEGRATE THESE ROUTES ONCE DATABASE IS SET UP...

# @app.route('/user_login', methods=['POST', 'GET'])
# def user_login():
#     db_connection = connect_to_database()
#     if request.method == 'GET':
#         return render_template('landing.html')
#     elif request.method == 'POST':
#         userName = request.form['username']
#         userPassword = request.form['password']
#
#         try:
#             userquery = 'SELECT * FROM Users where userName = %s and userPassword = %s'
#
#             # login info matches an existing account
#             if userquery:
#                 data = (userName, userPassword)
#                 result = execute_query(db_connection, userquery, data).fetchall()
#
#                 bikequery = 'SELECT * FROM Bikes'
#                 bikesresult = execute_query(db_connection, bikequery).fetchall()
#
#                 flash('Login successful. Welcome back!', 'success')
#
#         # Note: keeps saying UndefinedError: tuple object has no element 0
#         except:
#             flash('Incorrect login/password. Account not found, please try again.', 'warning')
#             return render_template('login.html')
#
#         return render_template('index_user.html', user=result, bikes=bikesresult)
#
#
# @app.route('/user_login/<int:user_id>')
# def user(user_id):
#     db_connection = connect_to_database()
#     userID = user_id
#
#     userquery = 'SELECT * FROM Users WHERE userID = %i' % user_id
#     result = execute_query(db_connection, userquery).fetchall()
#
#     bikequery = 'SELECT * FROM Bikes'
#     bikesresult = execute_query(db_connection, bikequery).fetchall()
#
#     return render_template('index_user.html', user=result, bikes=bikesresult)
#
# @app.route('/new_user_login', methods=['GET', 'POST'])
# def new_user_login():
#     db_connection = connect_to_database()
#
#     if request.method == 'GET':
#         return render_template('landing.html')
#
#     elif request.method == 'POST':
#         userName = request.form['username']
#         userPassword = request.form['password']
#         userEmail = request.form['email']
#
#         try:
#             usernameExists = 'SELECT userName FROM Users WHERE userName = %s'
#
#             if len(userName) < 6:
#                 flash('Username too short. Please try again.', 'warning')
#                 return render_template("createAccount.html")
#
#             elif len(userPassword) < 6:
#                 flash('Password too short. Please try again.', 'warning')
#                 return render_template("createAccount.html")
#
#             elif ('@' not in userEmail) and ('.' not in userEmail):
#                 flash('Email entry invalid. Please try again.', 'warning')
#                 return render_template("createAccount.html")
#
#             elif usernameExists is not None:
#                 acctQuery = 'INSERT INTO Users (userName, userPassword, userEmail) VALUES (%s,%s,%s)'
#                 data = (userName, userPassword, userEmail)
#                 result = execute_query(db_connection, acctQuery, data).fetchall()
#
#                 testuserquery = 'SELECT * FROM Users where userName = %s and userPassword = %s'
#                 testdata = (userName, userPassword)
#                 testresult = execute_query(db_connection, testuserquery, testdata).fetchall()
#
#                 bikequery = 'SELECT * FROM Bikes'
#                 bikesresult = execute_query(db_connection, bikequery).fetchall()
#
#                 flash('Your account has been successfully registered. Welcome!', 'success')
#
#         # if there is still an error after all requirements are met, the username must already exist in the database
#         except:
#             flash('User already exists. Please try again.', 'warning')
#             return render_template("createAccount.html")
#
#         # TO DO LIST: for creating an account, query for the user ID and send it as a variable in the flask render
#         return render_template('index_new_user.html', user=testresult, bikes=bikesresult)
#
# @app.errorhandler(404)
# def heh_error(e):
#     return render_template('404.html'), 404
#
# @app.errorhandler(500)
# def another_heh_error(e):
#     return render_template('500.html'), 500

if __name__ == "__main__":
    # db.create_all()   # if use SQLAlchemy
    app.run(debug=True)
