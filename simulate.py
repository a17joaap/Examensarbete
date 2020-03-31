from datetime import datetime
import json

objects = 1200000
latitude = 40.1234567
latIncrement = 0.0002
longitude = 100.7654321
lonIncrement = 0.0002
elevation = 60.4206900
eleIncrement = 0.0002

objectsArray = []

for i in range(objects):
    if latitude > 60:
        latIncrement = -0.0002
    elif latitude < 20:
        latIncrement = 0.0002

    if longitude > 120:
        lonIncrement = -0.0002
    elif longitude < 80:
        lonIncrement = 0.0002
    
    if elevation > 80:
        eleIncrement = -0.0002
    elif elevation < 30:
        eleIncrement = 0.0002
    
    latitude += latIncrement
    longitude += lonIncrement
    elevation += eleIncrement
    now = datetime.now()
    timestamp = now.strftime("%Y-%m-%dT%H:%M:%SZ")

    obj = {
        "lat": round(latitude, 7),
        "lon": round(longitude, 7),
        "ele": round(elevation, 7),
        "time": timestamp
    }
    objectsArray.append(obj)

json = json.dumps(objectsArray, indent=4)
file = open("gpsdata.json", "a")
file.write(",\n")
file.write('"Track13": [\n')
file.write(json)
file.write("\n]\n}")
file.close()

