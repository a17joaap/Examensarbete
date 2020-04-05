window.WebSocket = window.WebSocket || window.MozWebSocket;

const connection = new WebSocket('ws://localhost:3000');
const button = document.getElementById('get-stream');
const resultsBox = document.getElementById('resultsbox');
const processingContainer = document.getElementById('processingContainer');

//Lidköpings latitud och longitud
const lidLat = 58.50517;
const lidLon = 13.15765;

let tree = new BinarySearchTree();
let heap = new MaxHeap();
let mergeQueue = [];

let treeSortActive = false;
let mergeSortActive = false;
let heapSortActive = false;


button.addEventListener('click', () => {
    const algorithm = document.querySelector('input[name="algorithm"]:checked');
    if (!algorithm) {
        alert('Pick an algorithm');
        return;
    }
    switch (algorithm.value) {
        case 'tree':
            treeSortActive = true;
            break;
        case 'merge':
            mergeSortActive = true;
            break;
        case 'heap':
            heapSortActive = true;
            break;
    }
    toggleProcessingBox();
    connection.send('hejhej');
    button.disabled = true;
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
            tree = new BinarySearchTree();
        }

        if (mergeSortActive) {
            mergeSortFinish();
            mergeQueue = [];
        }

        if (heapSortActive) {
            const res = heap.sort().splice(0, 11);
            displayResult(res);
            heap = new MaxHeap();
        }

        treeSortActive = false;
        mergeSortActive = false;
        heapSortActive = false;
        button.disabled = false;
        toggleProcessingBox();

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

function toggleProcessingBox() {
    if (processingContainer.style.display === 'block') {
        processingContainer.style.display = 'none';
    } else {
        processingContainer.style.display = 'block';
        if (document.getElementById('result-list')) {
            resultsBox.removeChild(document.getElementById('result-list'));
        }
    }
}

function displayResult(res) {
    const list = document.createElement('ul');
    list.id = 'result-list';

    res.forEach((obj) => {
        const item = document.createElement('li');
        item.innerHTML = JSON.stringify(obj);
        list.appendChild(item);
    })

    resultsBox.appendChild(list);
}

function treeSort(obj, finished) {
    if (finished) {
        tree.inorder(tree.root);
        let res = tree.getSorted();
        displayResult(res.splice(0, 11));
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
    displayResult(res);
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
