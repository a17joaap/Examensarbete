using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Examen
{
    public class MaxHeap
    {
        public List<GPSData> items;
        public int heapSize;
        Haversine haversine = new Haversine();

        public MaxHeap()
        {
            heapSize = -1;
            items = new List<GPSData>();
        }

        public void Push(GPSData item)
        {
            items.Add(item);
            heapSize++;

            while (heapSize > 1 && Compare(heapSize / 2, heapSize))
            {
                Swap(heapSize, heapSize / 2);
            }
        }

        private Boolean Compare(int first, int second)
        {
            double firstDistance = haversine.getDistance(items[first].lat, items[first].lon);
            double secondDistance = haversine.getDistance(items[second].lat, items[second].lon);

            return firstDistance < secondDistance;
        }

        private void Swap(int first, int second)
        {
            GPSData temp = items[first];
            items[first] = items[second];
            items[second] = temp;
        }

        // Heapify - From: https://www.w3resource.com/javascript-exercises/searching-and-sorting-algorithm/searching-and-sorting-algorithm-exercise-3.php - Ported to C# by me
        private void Heapify(int i)
        {
            int left = 2 * i + 1;
            int right = left + 1;
            int max = i;

            if (left < heapSize && Compare(max, left))
            {
                max = left;
            }

            if (right < heapSize && Compare(max, right))
            {
                max = right;
            }

            if (max != i)
            {
                Swap(i, max);
                Heapify(max);
            }
        }

        public List<GPSData> Sort()
        {
            for (int i = items.Count - 1; i >= 0; i--)
            {
                Swap(0, i);
                heapSize--;
                Heapify(0);
            }
            return items;
        }
    }
}
