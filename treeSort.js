//Binary search tree - From: https://www.geeksforgeeks.org/implementation-binary-search-tree-javascript/

class Node {
    constructor(data) {
        this.key = getDistanceFromLatLonInKm(data.lat, data.lon);
        this.data = data;
        this.left = null;
        this.right = null;
    }
}

class BinarySearchTree {
    constructor() {
        this.root = null;
        this.sorted = [];
    }

    getSorted() {
        return this.sorted;
    }

    insert(data) {
        const newNode = new Node(data);

        if (this.root === null) {
            this.root = newNode;
        } else {
            this.insertNode(this.root, newNode);
        }
    }

    insertNode(node, newNode) {
        if (newNode.key < node.key) {
            if (node.left === null) {
                node.left = newNode;
            } else {
                this.insertNode(node.left, newNode);
            }
        } else {
            if (node.right === null) {
                node.right = newNode;
            } else {
                this.insertNode(node.right, newNode);
            }
        }
    }

    remove(node) {
        this.root = this.removeNode(this.root, node);
    }

    removeNode(root, node) {
        if (root === null) {
            return null;
        } else if (node.key < root.key) {
            root.left = this.removeNode(root.left, node);
            return root;
        } else if (node.key > root.key) {
            root.right = this.removeNode(root.right, node);
            return root;
        } else {
            if (root.left === null && root.right === null) {
                root = null;
                return root;
            }
            if (root.left === null) {
                root = root.right;
                return root;
            } else if (root.right === null) {
                root = root.left;
                return root;
            }

            const aux = this.findMinNode(root.right);
            root.data = aux.data;

            root.right = this.removeNode(root.right, aux.data);
            return root;
        }
    }

    findMinNode(node) {
        if (node.left === null) {
            return node;
        } else {
            return this.findMinNode(node.left);
        }
    }

    inorder(node) {
        if (node !== null) {
            this.inorder(node.left);
            this.sorted.push(node.data);
            const right = node.right;
            this.remove(node);
            this.inorder(right);
        }
    }
}