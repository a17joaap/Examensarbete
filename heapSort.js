class MaxHeap {

    constructor() {
        this.items = [];
        this.heapSize = 0;
    }

    getLength() {
        return this.heapSize;
    }

    push(item) {
        let i = this.heapSize || 1;
        this.items.push(item);
        this.heapSize++;

        while (i > 1 && this.compare(Math.floor(i / 2), i)) {
            this.swap(i, Math.floor(i / 2));
            i = Math.floor(i / 2);
        }
    }
    compare(first, second) {
        const firstDistance = getDistanceFromLatLonInKm(this.items[first].lat, this.items[first].lon);
        const secondDistance = getDistanceFromLatLonInKm(this.items[second].lat, this.items[second].lon);

        return firstDistance < secondDistance;
    }

    swap(first, second) {
        const temp = this.items[first];
        this.items[first] = this.items[second];
        this.items[second] = temp;
    }

    heapify(i) {
        const left = 2 * i + 1;
        const right = left + 1;
        let max = i;

        if (left < this.heapSize && this.compare(max, left)) {
            max = left;
        }

        if (right < this.heapSize && this.compare(max, right)) {
            max = right;
        }

        if (max !== i) {
            this.swap(i, max);
            this.heapify(max)
        }
    }

    sort() {
        for (let i = this.items.length - 1; i >= 0; i--) {
            this.swap(0, i);
            this.heapSize--;
            this.heapify(0);
        }
        return this.items;
    }
}