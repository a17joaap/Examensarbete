//Merge sort algorithm - From: https://medium.com/javascript-in-plain-english/javascript-merge-sort-3205891ac060

function mergeSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }

    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);

    return merge(
        mergeSort(left), mergeSort(right)
    );
}

function merge(left, right) {
    let res = [];
    let leftIdx = 0;
    let rightIdx = 0;

    while (leftIdx < left.length && rightIdx < right.length) {
        const firstDistance = getDistanceFromLatLonInKm(left[leftIdx].lat, left[leftIdx].lon);
        const secondDistance = getDistanceFromLatLonInKm(right[rightIdx].lat, right[rightIdx].lon);
        if (firstDistance < secondDistance) {
            res.push(left[leftIdx]);
            leftIdx++;
        } else {
            res.push(right[rightIdx]);
            rightIdx++;
        }
    }

    return res.concat(left.slice(leftIdx)).concat(right.slice(rightIdx));
}