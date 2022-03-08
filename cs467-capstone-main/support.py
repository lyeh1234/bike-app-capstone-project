import requests
from google.cloud import storage

from constants import API_KEY

def get_street_address(latlng):
    params = {
        'latlng': latlng,
        'result_type': 'street_address|premise|route|intersection|',
        'key': API_KEY
    }

    base_url = 'https://maps.googleapis.com/maps/api/geocode/json?'

    response = requests.get(base_url, params=params)

    if response.json()['status'] == 'ZERO_RESULTS':
        return "Corvallis"
    else:
        return response.json()['results'][0]['formatted_address']

def get_walking_distance(origin, destination):
    params = {
        'origins': origin,
        'destinations': destination,
        'mode': 'walking',
        'key': API_KEY
    }
    base_url = "https://maps.googleapis.com/maps/api/distancematrix/json?"
    response = requests.get(base_url, params=params)
    return response.json()['rows'][0]['elements'][0]['distance']['value']


def sort_distance(val):
    return val["distance"]

# from the Google Cloud guide at https://cloud.google.com/storage/docs/uploading-objects#storage-upload-object-python
def upload_file(bucket_name, source_file_name, destination_blob_name):

    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)

    blob.upload_from_filename(source_file_name)

    print(
        "File {} uploaded to {}.".format(source_file_name, destination_blob_name)
        )
    return

def set_address_dictionary(latlng_in):
    my_addr = get_street_address(latlng_in)
    # parse address
    address_parts = [x.strip() for x in my_addr.split(',')]
    length = len(address_parts)
    state_zip_code = (address_parts[length - 2]).split(' ')
    add_info = {"zip": state_zip_code[1], "state": state_zip_code[0], "city": address_parts[length - 3]}
    if length == 5:
        add_info["street"] = address_parts[0] + ", " + address_parts[1]
    elif length == 4:
        add_info["street"] = address_parts[0]
    return add_info

