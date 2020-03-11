#!/bin/bash
touch gpsdata.json
input="gpsdata.xml"
output="gpsdata.json"
trackCounter=1
echo "{" >> $output
while read -r line
do
    this=$line
    if [[ $this == \<trk\>* ]] 
    then
        echo "\"Track${trackCounter}\": [" >> $output
        trackCounter=$(( $trackCounter + 1 ))
    fi
    if [[ $this == \</trk\>* ]]
    then
        truncate -s-2 $output
        echo "]," >> $output
    fi
    if [[ $this == \<trkseg\>* ]]
    then
        echo "[" >> $output
    fi
    if [[ $this == \</trkseg\>* ]]
    then
        truncate -s-2 $output
        echo "]," >> $output
    fi
    if [[ $this == \<trkpt* ]]
    then
        toWrite="{"
        lat=$(echo $this | cut -d '"' -f 2)
        lon=$(echo $this | cut -d '"' -f 4)
        toWrite="${toWrite}\"lat\": ${lat}, \"lon\": ${lon}, "
        echo $toWrite >> $output
    fi
    if [[ $this == \<ele\>* ]]
    then
        ele=$(echo $this | grep -Po "(?<=\>).*?(?=\<)")
        toWrite="\"ele\": ${ele}, "
        echo $toWrite >> $output
    fi
    if [[ $this == \<time\>* ]]
    then
        timestamp=$(echo $this | grep -Po "(?<=\>).*?(?=\<)")
        toWrite="\"time\": \"${timestamp}\"}, "
        echo $toWrite >> $output
    fi
done < "$input"
truncate -s-2 $output
echo "}" >> $output