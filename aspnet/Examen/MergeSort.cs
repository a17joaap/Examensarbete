using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

//Merge sort algorithm - From: https://medium.com/javascript-in-plain-english/javascript-merge-sort-3205891ac060 - Ported to C# by me

namespace Examen
{
    public class MergeSort
    {
        public List<GPSData> result = new List<GPSData>();
        public List<List<GPSData>> queue = new List<List<GPSData>>();
        Haversine haversine = new Haversine();

        public List<GPSData> Sort(List<GPSData> unsorted)
        {
            if (unsorted.Count <= 1)
            {
                return unsorted;
            }

            int mid = unsorted.Count / 2;
            List<GPSData> left = unsorted.Take(mid).ToList();
            List<GPSData> right = unsorted.Skip(mid).ToList();

            return Merge(Sort(left), Sort(right));
        }

        public List<GPSData> Merge(List<GPSData> left, List<GPSData> right)
        {
            List<GPSData> res = new List<GPSData>();
            int leftIdx = 0;
            int rightIdx = 0;

            while (leftIdx < left.Count && rightIdx < right.Count)
            {
                double firstDistance = haversine.getDistance(left.First().lat, left.First().lon);
                double secondDistance = haversine.getDistance(right.First().lat, right.First().lon);
                if (firstDistance < secondDistance)
                {
                    res.Add(left[leftIdx]);
                    leftIdx++;
                } else
                {
                    res.Add(right[rightIdx]);
                    rightIdx++;
                }
            }

            res.AddRange(left.Skip(leftIdx).ToList());
            res.AddRange(right.Skip(rightIdx).ToList());
            return res;

        }
    }
}
