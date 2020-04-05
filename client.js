window.WebSocket = window.WebSocket || window.MozWebSocket;

const connection = new WebSocket('ws://localhost:3000');
const treeButton = document.getElementById('treeButton');
const mergeButton = document.getElementById('mergeButton');
const heapButton = document.getElementById('heapButton');


//Lidköpings latitud och longitud
const lidLat = 58.50517;
const lidLon = 13.15765;

const tree = new BinarySearchTree();
const heap = new MaxHeap();
let sortedTree = [];
let mergeQueue = [];

let treeSortActive = false;
let mergeSortActive = false;
let heapSortActive = false;


treeButton.addEventListener('click', () => {
    connection.send('hejhej');
    disableButtons();
    treeSortActive = true;
})

mergeButton.addEventListener('click', () => {
    connection.send('hejhej');
    disableButtons();
    mergeSortActive = true;
})

heapButton.addEventListener('click', () => {
    connection.send('hejhej');
    disableButtons();
    heapSortActive = true;
})

connection.onopen = () => {

}

connection.onerror = (err) => {
    console.log(err);
}

connection.onmessage = (message) => {
    if (message.data === "Start") {
        // Start time
        return;
    }
    if (message.data === "End") {
        // End time
        if (treeSortActive) {
            treeSort(null, true);
        }

        if (mergeSortActive) {
            mergeSortFinish();
        }

        if (heapSortActive) {
            const res = heap.sort().splice(0, 11);
            res.forEach((obj) => {
                console.log(getDistanceFromLatLonInKm(obj.lat, obj.lon))
            })
        }

        treeSortActive = false;
        mergeSortActive = false;
        heapSortActive = false;
        enableButtons();

        return;
    }
    const arr = JSON.parse(message.data);

    if (treeSortActive) {
        arr.forEach((obj) => {
            treeSort(obj, false);
        })
    }

    if (heapSortActive) {
        arr.forEach((obj) => {
            heap.push(obj);
        })
    }

    if (mergeSortActive) {
        partition = mergeSort(arr);
        mergeQueue.push(partition);
        partition = null;
        if (mergeQueue.length > 1) {
            for (let i = 0; i < mergeQueue.length - 1; i++) {
                if (mergeQueue[i].length === mergeQueue[i + 1].length) {
                    mergedSection = merge(mergeQueue[i], mergeQueue[i + 1]);
                    mergeQueue[i] = mergedSection;
                    mergeQueue.splice(i + 1, 1);
                    i = 0;
                }
            }
        }
    }
}

function treeSort(obj, finished) {
    if (finished) {
        tree.inorder(tree.root);
        let res = tree.getSorted();
        res.splice(0, 11).forEach((obj) => {
            console.log(getDistanceFromLatLonInKm(obj.lat, obj.lon))
        })
    } else {
        tree.insert(obj)
    }
}

function mergeSortFinish() {
    for (let i = mergeQueue.length - 1; i > 0; i--) {
        mergedSection = merge(mergeQueue[i], mergeQueue[i - 1]);
        mergeQueue[i - 1] = mergedSection;
        mergeQueue.splice(i, 1);
    }
    let res = mergeQueue[0].splice(0, 11);
    res.forEach((obj) => {
        console.log(getDistanceFromLatLonInKm(obj.lat, obj.lon))
    })
}

function disableButtons() {
    treeButton.disabled = true;
    mergeButton.disabled = true;
    heapButton.disabled = true;
}

function enableButtons() {
    treeButton.disabled = false;
    mergeButton.disabled = false;
    heapButton.disabled = false;
}


// Haversine formula - From: https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
function getDistanceFromLatLonInKm(lat, lon) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat - lidLat);  // deg2rad below
    var dLon = deg2rad(lon - lidLon);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lidLat)) * Math.cos(deg2rad(lidLon)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}
