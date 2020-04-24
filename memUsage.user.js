// ==UserScript==
// @name         Memory usage measure
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Measure memory usage
// @author       You
// @match        file:///E:/SKOLGREJER/Examen/code/index.html
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const container = document.querySelector('#animationContainer');
    const button = document.querySelector('#get-stream');
    const clickEvent = new MouseEvent('click');
    let startHeap, endHeap, result;
    let records = [];
    const NUM_OF_RECORDS = 100;


    function respondToVisibility(element, callback) {
        var options = {
            root: document.documentElement
        }

        var observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                callback(entry.intersectionRatio > 0);
            });
        }, options);

        observer.observe(element);
    }

    respondToVisibility(container, visible => {
        if (visible) {
            startHeap = performance.memory.usedJSHeapSize;
        } else {
            if (startHeap) {
                endHeap = performance.memory.usedJSHeapSize;
                window.gc();
                result = endHeap - startHeap;
                records.push(result);
                if (records.length == NUM_OF_RECORDS) {
                    writeToCSV();
                    return;
                }
                setTimeout( () => {
                    // Wait for GC
                    button.dispatchEvent(clickEvent);
                }, 500);
            }
        }
    })

    function writeToCSV() {
        let csv = "data:text/csv;charset=utf-8, ";
        records.forEach((entry) => {
            csv += entry.toString()+"\n";
        })
        let a = document.createElement('a');
        a.setAttribute('href', encodeURI(csv));
        a.setAttribute('download', 'memUsage.csv');
        document.body.appendChild(a);
        records = [];
        a.click();
    }
})();