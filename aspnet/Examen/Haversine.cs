using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Examen
{
    public class Haversine
    {
        private double lidLat = 58.50517;
        private double lidLon = 13.15765;


        // Haversine formula - From: https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
        public double getDistance(double lat, double lon)
        {
            var R = 6371; // Radius of the earth in km
            var dLat = deg2rad(lat - lidLat);  // deg2rad below
            var dLon = deg2rad(lon - lidLon);
            var a =
                Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                Math.Cos(deg2rad(lidLat)) * Math.Cos(deg2rad(lidLon)) *
                Math.Sin(dLon / 2) * Math.Sin(dLon / 2)
                ;
            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            var d = R * c; // Distance in km
            return d;
        }


        private double deg2rad(double deg)
        {
            return deg * (Math.PI / 180);
        }

    }
}
