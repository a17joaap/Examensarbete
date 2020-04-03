from datetime import datetime
from datetime import timedelta
import json
import random

objects = 1200000
latitude = 40.1234567
longitude = 100.7654321
elevation = 60.4206900

objectsArray = []

now = datetime.now()

for i in range(objects):
    increment = round(random.uniform(0.0001, 0.1), 4)
    if latitude > 60:
        latIncrement = abs(increment)
    else:
        latIncrement = increment

    if longitude > 120:
        lonIncrement = abs(increment)
    else:
        lonIncrement = increment
    
    if elevation > 80:
        eleIncrement = abs(increment)
    else:
        eleIncrement = increment

    latitude += latIncrement
    longitude += lonIncrement
    elevation += eleIncrement
    time = now + timedelta(seconds=random.randint(1,11))
    if (i % 41) == 0:
        time = now + timedelta(days=1)
    timestamp = time.strftime("%Y-%m-%dT%H:%M:%SZ")
    now = time

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

