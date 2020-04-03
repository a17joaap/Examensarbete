from datetime import datetime
from datetime import timedelta
import json
import random

objects = 1200000
latitude = 40.1234567
longitude = 119.9999999
elevation = 60.4206900
latDecreasing = False
lonDecreasing = False
eleDecreasing = False

objectsArray = []

now = datetime.now()

for i in range(objects):
    increment = round(random.uniform(0.0001, 0.1), 4)
    if latDecreasing:
        latIncrement = increment * -1
    else:
        latIncrement = increment

    if lonDecreasing:
        lonIncrement = increment * -1
    else:
        lonIncrement = increment
    
    if eleDecreasing:
        eleIncrement = increment * -1
    else:
        eleIncrement = increment

    latitude += latIncrement
    if latitude > 60:
        latDecreasing = True
    elif latitude < 30:
        latDecreasing = False
        
    longitude += lonIncrement
    if longitude > 120:
        lonDecreasing = True
    elif longitude < 70:
        lonDecreasing = False

    elevation += eleIncrement
    if elevation > 80:
        eleDecreasing = True
    elif elevation < 20:
        eleDecreasing = False

    time = now + timedelta(seconds=random.randint(1,11))
    if (i % 40000) == 0:
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