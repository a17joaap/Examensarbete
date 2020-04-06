// ==UserScript==
// @name         Sort time measure
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Measure sorting time
// @author       You
// @match        file:///E:/SKOLGREJER/Examen/code/index.html
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const container = document.querySelector('#animationContainer');
    const button = document.querySelector('#get-stream');
    const clickEvent = new MouseEvent('click');
    let startTime, endTime, result;
    let times = [];

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
            startTime = new Date().getTime();
        } else {
            if (startTime) {
                endTime = new Date().getTime();
                result = endTime - startTime;
                times.push(result);
                if (times.length == 10) {
                    writeToCSV();
                    return;
                }
                button.dispatchEvent(clickEvent);
            }
        }
    })

    function writeToCSV() {
        let csv = "data:text/csv;charset=utf-8, ";
        times.forEach((entry) => {
            csv += entry.toString()+"\n";
        })
        let a = document.createElement('a');
        a.setAttribute('href', encodeURI(csv));
        a.setAttribute('download', 'sortTimes.csv');
        document.body.appendChild(a);
        times = [];
        a.click();
    }
})();