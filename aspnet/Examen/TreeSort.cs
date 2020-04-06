using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

//Binary search tree - From: https://www.geeksforgeeks.org/implementation-binary-search-tree-javascript/ - Ported to C# by me

namespace Examen
{
    public class Node
    {
        Haversine haversine = new Haversine();
        public GPSData data;
        public Node left;
        public Node right;
        public double key;

        public Node(GPSData data)
        {
            this.data = data;
            this.left = null;
            this.right = null;
            this.key = haversine.getDistance(data.lat, data.lon);
        }
    }

    public class BinarySearchTree
    {
        public Node root;
        public List<GPSData> sorted;

        public BinarySearchTree()
        {
            root = null;
            sorted = new List<GPSData>();
        }

        public void Insert(GPSData data)
        {
            Node newNode = new Node(data);

            if (root == null)
            {
                root = newNode;
            }
            else
            {
                InsertNode(root, newNode);
            }
        }

        private void InsertNode(Node node, Node newNode)
        {
            if (newNode.key < node.key)
            {
                if (node.left == null)
                {
                    node.left = newNode;
                }
                else
                {
                    InsertNode(node.left, newNode);
                }
            }
            else
            {
                if (node.right == null)
                {
                    node.right = newNode;
                }
                else
                {
                    InsertNode(node.right, newNode);
                }
            }
        }

        private void Remove(Node node)
        {
            root = RemoveNode(root, node);
        }

        private Node RemoveNode(Node root, Node node)
        {
            if (root == null)
            {
                return null;
            }
            else if (node.key < root.key)
            {
                root.left = RemoveNode(root.left, node);
                return root;
            }
            else if (node.key > root.key)
            {
                root.right = RemoveNode(root.right, node);
                return root;
            }
            else
            {
                if (root.left == null && root.right == null)
                {
                    root = null;
                    return root;
                }
                if (root.left == null)
                {
                    root = root.right;
                    return root;
                }
                else if (root.right == null)
                {
                    root = root.left;
                    return root;
                }

                Node aux = FindMinNode(root.right);
                root.data = aux.data;

                root.right = RemoveNode(root.right, aux);
                return root;
            }
        }

        private Node FindMinNode(Node node)
        {
            if (node.left == null)
            {
                return node;
            }
            else
            {
                return FindMinNode(node.left);
            }
        }

        public void Inorder(Node node)
        {
            if (node != null)
            {
                Inorder(node.left);
                sorted.Add(node.data);
                Node right = node.right;
                Remove(node);
                Inorder(right);
            }
        }
    }
}
