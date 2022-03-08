from flask import Blueprint, request, jsonify
from google.cloud import datastore
import json
import constants

# Citation: The parts of this code that establish the framework for interacting with Datastore are based on code
# presented in CS493 (Cloud Application Development, Modules 3 and 4), with modifications are required.


client = datastore.Client()

bp = Blueprint('user', __name__, url_prefix='/users')


@bp.route('', methods=['GET','POST'])
def register_user_get_user():
    if request.method == 'GET':
        print('getting users')
        query = client.query(kind=constants.users)
        results = list(query.fetch())
        print("results: " + str(results))
        for e in results:
            e["id"] = e.key.id
        return json.dumps(results)
        
    if request.method == 'POST':
        # new user
        new_user = datastore.entity.Entity(key=client.key(constants.users))
        # get email from request
        new_user["email"] = request.form["email"]
        # set default values
        new_user["verified"] = True  # default to true unless/until verification set up
        new_user["has_bike"] = False
        new_user["account_locked"] = False
        # add user to database
        client.put(new_user)
        
        return json.dumps(new_user, indent=2, sort_keys=True), 201

    else:
        return jsonify(error='Method not recognized')

@bp.route('/<email>', methods=['POST', 'GET'])
def users_patch_delete_get_by_email(email):
    if request.method == 'GET':
        query = client.query(kind=constants.users)
        query.add_filter('email', '=', email)
        results = list(query.fetch())
        # for e in results:
        #     e["email"] = e.key.email
        return json.dumps(results), 200
    else:
        return jsonify(error='Method not recognized')
    # user_key = client.key(constants.users, email)
    # user = client.get(key=user_key)
    # if user is not None:
    #     content = request.get_json()
    #     for key in content:
    #         user.update({key: content[key]}),
    #         client.put(user)
    #     user["id"] = user.key.id
    #     user["self"] = request.base_url
    #     return json.dumps(user, indent=2, sort_keys=True), 200
    return json.dumps({"Error": "No user with this id"})