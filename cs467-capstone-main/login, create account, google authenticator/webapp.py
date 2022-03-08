# React Related:
#
# CODE WORKS WITH HTML, NOT REACT (YET)
# MIGHT USE MATERIAL DESIGN UI INSTEAD
#
# REACT CODE NOTES:
#
# import './App.css';
# import {useState, useEffect} from 'react'
#
# need to add this code in a function as shown below:
# useEffects(() => fetch('http://someIPaddress:50000/get' { 'methods':'GET', headers: { 'blah i.e. json or not'}}))
#
# function App() {const[articles, setArticles] = useState([])}
#
# Then need form.js done/created in React

#--------------------------------------------------------------------------------------------------------------------------

# Start of webapp.py

from flask import Flask, render_template, request, url_for, session, redirect, flash

import re   # RegEx regular expressions if necessary

#--------------------------------------------------------------------------------------------------------------------------

# Database Related:

from FIRESTOREPLACEHOLDER.db_connector import connect_to_database, execute_query   # in case Firestore database is used
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS   # may need to prevent error on webpage

# Alternative way instead of connect_to_database & execute_query:
#
# SQLAlchemy placeholder code in case this is used
# Refer to SQLAlchemy database via db (i.e. db.session.add(bike))
webapp.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///students.sqlite3'
webapp.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False   # so we are not tracking all modifications to the database
db = SQLAlchemy(webapp)
# Also set up classes to access bike and user data from database, then refer to bike and user in code via these classes
# class bikes(db.Model):
#   bike_id = db.Column("bikeID, db.Integer, primary_key=True")
#   more_bike_attributes = ...
#
# class users(db.Model):
#   user_id = db.Column("userID, db.Integer, primary_key=True")
#   more_user_attributes = ...

#--------------------------------------------------------------------------------------------------------------------------

# Google Authenticator Setup Related:

import os
from os.path import join, dirname
from dotenv import load_dotenv
from flask_oauth import OAuth
from urllib2 import Request, urlopen, URLError   # used in route '/landing'

# Get Google Client ID and Client Secret at this link
# https://code.google.com/apis/console
GOOGLE_CLIENT_ID = os.environ.get("some google client id")
GOOGLE_CLIENT_SECRET = os.environ.get("some google client secret")

# Redirect URI from Google APIs console for routing
REDIRECT_URI = '/oauth2callback'

SECRET_KEY = os.environ.get("SECRET_KEY")
DEBUG = True

# Creates Flask instance
webapp = Flask(__name__)
CORS(webapp)   # React related

# Google auth related
webapp.debug = DEBUG
webapp.secret_key = SECRET_KEY
oauth = OAuth()

google = oauth.remote_app('google', base_url='https://www.google.com/accounts/',
                          authorize_url='https://accounts.google.com/o/oauth2/auth',
                          request_token_url=None,
                          request_token_params={'scope': 'https://www.googleapis.com/auth/userinfo.email',
                                                'response_type': 'SOME CODE'},
                          access_token_url='https://accounts.google.com/o/oauth2/token',
                          access_token_method='POST',
                          access_token_params={'grant_type': 'SOME AUTHORIZATION CODE'},
                          consumer_key=GOOGLE_CLIENT_ID,
                          consumer_secret=GOOGLE_CLIENT_SECRET)

#--------------------------------------------------------------------------------------------------------------------------

# Google Auth Route to Login Related Routes:

# FOR NOW, USING .HTML AS URL REDIRECT/RENDER_TEMPLATE
@webapp.route('/')
def index():
    # Google Auth route checks for token
    # if no token, redirect to login route
    # if token exists, check if token valid or not then redirect to login if unauthorized
    access_token = session.get('access_token')
    if access_token is None:
        return render_template("google_auth_login.html")
 
    access_token = access_token[0]
 
    headers = {'Authorization': 'OAuth '+access_token}
    req = Request('https://www.googleapis.com/oauth2/v1/userinfo',
                  None, headers)
    try:
        res = urlopen(req)
    except URLError, e:
        if e.code == 401:
            # invalid token, unauthorized access, return to login route
            session.pop('access_token', None)
            return render_template("google_auth_login.html")
        return res.read()
 
    return res.read()

#--------------------------------------------------------------------------------------------------------------------------

# Landing Route (Example):

# For instance, user sees selection of bikes, now wants to sign up, clicks 'login' button
# Will be referencing Bike index page throughout code as placeholder until merged with code from teammates
@webapp.route('/landing')
def landing():
    db_connection = connect_to_database()
    query = "SELECT * from Bikes"
    result = execute_query(db_connection, query).fetchall()
    return render_template('landing.html', bikes=result)

#--------------------------------------------------------------------------------------------------------------------------

# Login Route, Create Account Route, Google Auth URI Redirect Step):

@webapp.route('/login')
def login():
    return render_template("login.html")

# making sure google authorization passes before logging in to bike app
@webapp.route('/google_auth_login')
def google_auth_login():
    callback=url_for('authorized', _external=True)
    return google.authorize(callback=callback)

# redirects to google authenticator URI with token access
# returns to index route to finish authorization check
@app.route(REDIRECT_URI)
@google.authorized_handler
def authorized(resp):
    access_token = resp['access_token']
    session['access_token'] = access_token, ''
    return render_template("index.html")

@webapp.route('/user_login', methods=['POST', 'GET'])
def user_login():
    db_connection = connect_to_database()
    if request.method == 'GET':
        return render_template('landing.html')
    elif request.method == 'POST':
        userName = request.form['username']
        userPassword = request.form['password']

        try:
            userquery = 'SELECT * FROM Users where userName = %s and userPassword = %s'

            # login info matches an existing account
            if userquery:
                data = (userName, userPassword)
                result = execute_query(db_connection, userquery, data).fetchall()

                bikequery = 'SELECT * FROM Bikes'
                bikesresult = execute_query(db_connection, bikequery).fetchall()

                flash('Login successful. Welcome back!', 'success')

        # Note: keeps saying UndefinedError: tuple object has no element 0
        except:
            flash('Incorrect login/password. Account not found, please try again.', 'warning')
            return render_template('login.html')
            
        return render_template('index_user.html', user=result, bikes=bikesresult)

@webapp.route('/user_login/<int:user_id>')
def user(user_id):
    db_connection = connect_to_database()
    userID = user_id
    
    userquery = 'SELECT * FROM Users WHERE userID = %i' % user_id
    result = execute_query(db_connection, userquery).fetchall()

    bikequery = 'SELECT * FROM Bikes'
    bikesresult = execute_query(db_connection, bikequery).fetchall()
    
    return render_template('index_user.html', user=result, bikes=bikesresult )

@webapp.route('/createAccount')
def createAccount():
    return render_template("createAccount.html")

@webapp.route('/new_user_login', methods = ['GET', 'POST'])
def new_user_login():
    db_connection = connect_to_database()

    if request.method == 'GET':
        return render_template('landing.html')

    elif request.method == 'POST':
        userName = request.form['username']
        userPassword = request.form['password']
        userEmail = request.form['email']

        try:
            usernameExists = 'SELECT userName FROM Users WHERE userName = %s'

            if len(userName) < 6:
                flash('Username too short. Please try again.', 'warning')
                return render_template("createAccount.html")
            
            elif len(userPassword) < 6:
                flash('Password too short. Please try again.', 'warning')
                return render_template("createAccount.html")
            
            elif ('@' not in userEmail) and ('.' not in userEmail):
                flash('Email entry invalid. Please try again.', 'warning')
                return render_template("createAccount.html")

            elif usernameExists is not None:
                acctQuery = 'INSERT INTO Users (userName, userPassword, userEmail) VALUES (%s,%s,%s)'
                data = (userName, userPassword, userEmail)
                result = execute_query(db_connection, acctQuery, data).fetchall()

                testuserquery = 'SELECT * FROM Users where userName = %s and userPassword = %s'
                testdata = (userName, userPassword)
                testresult = execute_query(db_connection, testuserquery, testdata).fetchall()

                bikequery = 'SELECT * FROM Bikes'
                bikesresult = execute_query(db_connection, bikequery).fetchall()

                flash('Your account has been successfully registered. Welcome!', 'success')

        # if there is still an error after all requirements are met, the username must already exist in the database
        except:
            flash('User already exists. Please try again.', 'warning')
            return render_template("createAccount.html")

        # TO DO LIST: for creating an account, query for the user ID and send it as a variable in the flask render
        return render_template('index_new_user.html', user=testresult, bikes=bikesresult)

@webapp.route('/continueGuest')
def continueGuest():
    return render_template("index.html")   # leads to index.html, which is the main/start page without signed in user

@webapp.errorhandler(404)
def heh_error(e):
    return render_template('404.html'), 404

@webapp.errorhandler(500)
def another_heh_error(e):
    return render_template('500.html'), 500

# To start flask locally
# if __name__ == '__main__':
#     # db.create_all()   # may need this for SQLAlchemy
#     webapp.run(debug=True)