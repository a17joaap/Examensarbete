#!/bin/bash
file="gpsdata.json"
elevationIncreaser=0.002
latIncreaser=0.0002
lonIncreaser=0.0002

echo "," >> $file
echo "\"Track14\": [" >> $file
echo "[" >> $file
for i in {1..990000}
do
    if [[ i -eq 1 ]]
    then
        elevationLine=$( tail -7 $file | head -1 )
        lonLine=$( tail -8 $file | head -1 )
        latLine=$( tail -9 $file | head -1 )
    else
        elevationLine=$( tail -3 $file | head -1 )
        lonLine=$( tail -4 $file | head -1 )
        latLine=$( tail -5 $file | head -1 )
        echo "," >> $file
    fi

    elevation=$(echo $elevationLine | grep -Po "(?<=\:).*?(?=\,)")
    longitude=$(echo $lonLine | grep -Po "(?<=\:).*?(?=\,)")
    latitude=$(echo $latLine | grep -Po "(?<=\:).*?(?=\,)")

    date=$(date --iso-8601)
    time=$(date +T%H:%M:%SZ)
    timestamp=\"$date$time\"

    if (( $(echo "$elevation > 70.0" | bc -l) ))
    then
        elevationIncreaser=-0.002
    fi
    if (( $(echo "$elevation < 20.0" | bc -l) ))
    then
        elevationIncreaser=0.002
    fi
    newElevation=$(echo $elevation + $elevationIncreaser | bc -l)

    if (( $(echo "$longitude > 140.0" | bc -l) ))
    then
        lonIncreaser=-0.0002
    fi
    if (( $(echo "$longitude < 80.0" | bc -l) ))
    then
        lonIncreaser=0.0002
    fi
    newLongitude=$(echo $longitude + $lonIncreaser | bc -l)

    if (( $(echo "$latitude > 60.0" | bc -l) ))
    then
        latIncreaser=-0.0002
    fi
    if (( $(echo "$latitude < 10.0" | bc -l) ))
    then
        latIncreaser=0.0002
    fi
    newLatitude=$(echo $latitude + $latIncreaser | bc -l)

    echo "{" >> $file
    echo "\"lat\": $newLatitude," >> $file
    echo "\"lon\": $newLongitude," >> $file
    echo "\"ele\": $newElevation," >> $file
    echo "\"time\": $timestamp" >> $file
    echo "}" >> $file
done
echo "]" >> $file
echo "]" >> $file
echo "}" >> $file