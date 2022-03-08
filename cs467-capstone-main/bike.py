from flask import Blueprint, request
from google.cloud import datastore
import json
from PIL import Image
from werkzeug.utils import secure_filename
import tempfile
from datetime import datetime, timezone

import constants
from haversine import haversine, Unit
from support import get_street_address, get_walking_distance, sort_distance, upload_file, set_address_dictionary

# Citation: The parts of this code that establish the framework for interacting with Datastore are based on code
# presented in CS493 (Cloud Application Development, Modules 3 and 4), with modifications are required.

client = datastore.Client()

bp = Blueprint('bike', __name__, url_prefix='/bikes')

_m_to_miles = 0.000621371

# route for manually adding bikes
@bp.route('', methods=['POST'])
def add_bike():
    info = request.get_json()
    # ensure all required attributes included in request

    if "lat" in info and "lng" in info:
        new_bike = datastore.entity.Entity(key=client.key(constants.bikes))
        new_bike.update({"street": info["street"], "city": info["city"], "state": info["state"], "zip": info["zip"],
                         "lat": info["lat"], "lng": info["lng"]})
        new_bike["available"] = True
        client.put(new_bike)
        new_bike["id"] = new_bike.key.id
        # generate url for resource
        new_bike["self"] = request.base_url + "/" + str(new_bike["id"])
        return json.dumps(new_bike, indent=2, sort_keys=True)
    else:
        return json.dumps({"Error": "The request object is missing at least one of the required attributes"})

# This is the route that returns a list of bikes (as json) in the area of the user. The latitude and longitude of the
# user are passed in as parameters of a GET request. The function queries the database for a list of bikes. For bikes
# that are available, the haversine distance between the user and the bike is calculated. If the distance is <= the
# search radius (starts as 1 mile), the walking distance between the user and bike is calculated and the bike is added
# to the bike list. The list of available bikes within the search radius is returned to the user sorted by walking
# distance between user and bike. If no bikes are within the search radius, the radius is increased by 1 mile and
# the bikes are reevaluated. The search radius is increased up to 5 miles. If no bikes are within 5 miles, a message
# is returned that no bikes are available in the user's area.
@bp.route('', methods=['GET'])
def get_bike_list():
    
    lat = request.args.get('lat')
    lng = request.args.get('lng')

    user_loc = (float(lat), float(lng))
    origin = lat + ',' + lng

    query = client.query(kind=constants.bikes)
    bike_data = list(query.fetch())

    for bike in bike_data:
        bike["hav_dist"] = haversine(user_loc, (float(bike["lat"]), float(bike["lng"])), unit=Unit.MILES)

    bike_list = []
    search_radius = 1
    while len(bike_list) == 0 and search_radius <= 5:
        for bike in bike_data:
            if bike["available"] is True and bike["hav_dist"] <= search_radius:
                latlng = str(bike['lat']) + "," + str(bike['lng'])
                bike['distance'] = get_walking_distance(origin, latlng) * _m_to_miles
                if bike['num_ratings'] > 0:
                    bike['rating'] = bike['stars']/bike['num_ratings']
                else:
                    bike['rating'] = 0
                bike['id'] = bike.key.id
                bike_list.append(bike)
        search_radius += 1
    bike_list.sort(key=sort_distance)
    if len(bike_list) > 0:
        return json.dumps(bike_list)
    else:
        return json.dumps({"Error": "No available bikes in your area"})


@bp.route('/<id>', methods=['PATCH'])
def bikes_patch_delete_get_by_id(id):
    bike_key = client.key(constants.bikes, int(id))
    bike = client.get(key=bike_key)
    if bike is not None:
        content = request.get_json()
        for key in content:
            bike.update({key: content[key]}),
            client.put(bike)
        bike["id"] = bike.key.id
        bike["self"] = request.base_url
        return json.dumps(bike, indent=2, sort_keys=True), 200
    return json.dumps({"Error": "No bike with this id"})

@bp.route('/donate', methods=['POST'])
def donate_bike():
    # get bike info from request
    info = {"lat": request.form["lat"],
            "lng": request.form["lng"],
            "type": request.form["type"],
            "num_speeds": request.form["num_speeds"],
            "basket": request.form["basket"],
            "cargo_rack": request.form["cargo_rack"],
            "lock_combo": request.form["lock_combo"]}
    # get lat and lng from request and use it to get reverse geocoded address
    latlng = str(info["lat"]) + "," + str(info["lng"])
    address_info = set_address_dictionary(latlng)
    for key in address_info:
        info[key] = address_info[key]

    # create new bike entity
    new_bike = datastore.entity.Entity(key=client.key(constants.bikes))
    # dump info about bike into new_bike
    for key in info:
        new_bike[key] = info[key]
    # set default values
    new_bike["available"] = True
    new_bike["stars"] = 0
    new_bike["num_ratings"] = 0
    # add bike to database
    client.put(new_bike)
    # get id of new_bike
    new_bike_id = new_bike.key.id
    with tempfile.TemporaryDirectory() as directory:
        # deal with file upload
        file = request.files["File"]
        file_components = (secure_filename(file.filename)).split('.')
        file_ext = file_components[1]
        # tie filename to bike id
        filename = str(new_bike_id) + "in." + file_ext
        file.save(directory + '/' + filename)
        # resize to 800px wide (keep aspect ratio)
        image = Image.open(directory + '/' + filename)
        new_width = 800
        new_height = int(new_width * float(image.size[1]) / float(image.size[0]))
        image = image.resize((new_width, new_height), Image.ANTIALIAS)
        large_file = str(new_bike_id) + "." + file_ext
        image.save(directory + '/' + large_file)
        bucket_name = "bike-kollective1.appspot.com"
        upload_file(bucket_name, directory + '/' + large_file, large_file)
        image_url_large = "https://storage.googleapis.com/bike-kollective1.appspot.com/" + large_file
        # make and upload thumbnail image
        image = Image.open(directory + '/' + filename)
        thumb_size = (150, 150)
        image.thumbnail(thumb_size)
        thumbnail = str(new_bike_id) + "sq." + file_ext
        image.save(directory + '/' + thumbnail)
        upload_file(bucket_name, directory + '/' + thumbnail, thumbnail)
        image_url = "https://storage.googleapis.com/bike-kollective1.appspot.com/" + thumbnail

        new_bike.update({"image_url": image_url, "image_url_large": image_url_large})
        client.put(new_bike)

    return json.dumps(new_bike, indent=2, sort_keys=True), 201

@bp.route('/checkout', methods=['POST'])
def checkout_bike():
    info = request.get_json()
    print(info)
    bike_id = info['formData']["bikeID"]
    user_email = info['formData']["userEmail"]

    # update bike
    bike_key = client.key(constants.bikes, int(bike_id))
    bike = client.get(key=bike_key)
    query = client.query(kind=constants.users)
    query.add_filter("email", "=", user_email)
    users = list(query.fetch())
    for user in users:
        if user["has_bike"]:
            return json.dumps({"Error": "User has bike"}), 403
        if bike is None or bike["available"] is False:
            return json.dumps({"Error": "Bike not Available"}), 403
        user["has_bike"] = True
        client.put(user)

    bike.update({"available": False})
    client.put(bike)

    # add a ride entry
    new_ride = datastore.entity.Entity(key=client.key("rides"))
    new_ride["user"] = user_email
    new_ride["bike"] = bike_id
    new_ride["start_time"] = datetime.now(timezone.utc).strftime('%Y-%m-%d-%H-%M')
    client.put(new_ride)

    return json.dumps(new_ride, indent=2, sort_keys=True), 201


# checkin
@bp.route('/return', methods=['PATCH'])
def return_bike():
    # get all info from request
    user_email = request.form["email"]
    bike_info = {"lat": request.form["lat"],
                 "lng": request.form["lng"],
                 "stars": request.form["stars"]
                 }
    issue_info = {"operable": request.form["operable"], "feedback": request.form["feedback"]}

    # update user
    query = client.query(kind=constants.users)
    query.add_filter("email", "=", user_email)
    users = list(query.fetch())
    for user in users:
        user["has_bike"] = False
        client.put(user)

    # query and update rides table
    query = client.query(kind="rides")
    query.add_filter("user", "=", user_email)
    rides = list(query.fetch())
    for ride in rides:
        bike_info["id"] = ride["bike"]
        client.delete(ride)
    bike_key = client.key(constants.bikes, int(bike_info["id"]))
    bike = client.get(key=bike_key)
    # get lat and lng from request and use it to get reverse geocoded address
    latlng = str(bike_info["lat"]) + "," + str(bike_info["lng"])
    address_info = set_address_dictionary(latlng)
    for key in address_info:
        bike[key] = address_info[key]

    if bike_info["stars"] != 0:
        new_stars = bike["stars"] + float(bike_info["stars"])
        new_num_ratings = bike["num_ratings"] + 1
        bike.update({"stars": new_stars, "num_ratings": new_num_ratings})

    bike.update({"lat": bike_info["lat"],
                 "lng": bike_info["lng"],
                 })

    if issue_info["operable"]:
        bike.update({"available": True})
    client.put(bike)

    # track reported bike issues
    new_issue = datastore.entity.Entity(key=client.key("issues"))
    new_issue["operable"] = issue_info["operable"]
    new_issue["details"] = issue_info["feedback"]
    new_issue["bike"] = int(bike_info["id"])
    new_issue["noted_on"] = datetime.now(timezone.utc).strftime('%Y-%m-%d-%H-%M')
    client.put(new_issue)

    return json.dumps({"Message": "Bike Returned and Checked in"}), 200

