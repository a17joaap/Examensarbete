using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using System.Text;
using Newtonsoft.Json;

namespace Examen
{
    public class Program
    {
        private static Boolean treeSort = false;
        private static Boolean mergeSort = false;
        private static Boolean heapSort = false;
        private static BinarySearchTree tree;
        private static MergeSort merge;
        private static MaxHeap heap;
        public static List<GPSData> result;
        public static Boolean finishedSorting = false;
        public static Boolean finishedSnorting = false;

        public static void Main(string[] args)
        {
            Connect();
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });

        public static async Task Connect()
        {
            ClientWebSocket webSocket = null;
            try
            {
                string url = "ws://localhost:3000";
                webSocket = new ClientWebSocket();
                await webSocket.ConnectAsync(new Uri(url), CancellationToken.None);
                await Task.WhenAll(OnMessage(webSocket));
            }
            catch (Exception e)
            {
                System.Diagnostics.Debug.WriteLine(e.Message);
            }
            finally
            {
                if (webSocket != null)
                {
                    webSocket.Dispose();
                }
            }
        }

        public static async Task OnMessage(ClientWebSocket webSocket)
        {
            var bytes = new byte[10240];
            var buffer = new ArraySegment<byte>(bytes);
            while (webSocket.State == WebSocketState.Open)
            {
                try
                {
                    var result = await webSocket.ReceiveAsync(buffer, CancellationToken.None);
                    if (result.MessageType == WebSocketMessageType.Close)
                    {
                        await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, string.Empty,
                            CancellationToken.None);

                    }
                    else
                    {
                        byte[] msgBytes = buffer.Skip(buffer.Offset).Take(result.Count).ToArray();
                        string message = Encoding.UTF8.GetString(msgBytes);

                        if (message == "Tree")
                        {
                            tree = new BinarySearchTree();
                            treeSort = true;
                            mergeSort = false;
                            heapSort = false;
                        }
                        else if (message == "Merge")
                        {
                            merge = new MergeSort();
                            treeSort = false;
                            mergeSort = true;
                            heapSort = false;
                        }
                        else if (message == "Heap")
                        {
                            heap = new MaxHeap();
                            treeSort = false;
                            mergeSort = false;
                            heapSort = true;
                        }
                        else if (message == "End")
                        {
                            FinishSorting();
                        }
                        else
                        {
                            List<GPSData> points = JsonConvert.DeserializeObject<List<GPSData>>(message);
                            HandleMessage(points);
                        }
                    }
                }
                catch (Exception e)
                {
                    System.Diagnostics.Debug.WriteLine(e.Message);
                }

            }
        }

        public static void HandleMessage(List<GPSData> points)
        {
            if (treeSort)
            {
                points.ForEach(obj =>
                {
                    tree.Insert(obj);
                });
            }
            else if (mergeSort)
            {
                List<GPSData> partition = merge.Sort(points);
                merge.queue.Add(partition);
                partition = null;
                if (merge.queue.Count > 1)
                {
                    for (int i = 0; i < merge.queue.Count - 1; i++)
                    {
                        if (merge.queue[i].Count == merge.queue[i + 1].Count)
                        {
                            List<GPSData> mergedSection = merge.Merge(merge.queue[i], merge.queue[i + 1]);
                            merge.queue[i] = mergedSection;
                            merge.queue.RemoveAt(i + 1);
                            i = 0;
                        }
                    }
                }
            }
            else if (heapSort)
            {
                points.ForEach(obj =>
                {
                    heap.Push(obj);
                });
            }
        }

        private static void FinishSorting()
        {
            if (treeSort)
            {
                tree.Inorder(tree.root);
                result = tree.sorted.Take(10).ToList();
            }
            else if (mergeSort)
            {
                for (int i = merge.queue.Count - 1; i > 0; i--)
                {
                    List<GPSData> mergedSection = merge.Merge(merge.queue[i], merge.queue[i - 1]);
                    merge.queue[i - 1] = mergedSection;
                    merge.queue.RemoveAt(i);
                }
                result = merge.queue[0].Take(10).ToList();
            }
            else if (heapSort)
            {
                result = heap.Sort().Take(10).ToList();
            }
            finishedSorting = true;
        }


    }

    public class GPSData
    {
        public double lat { get; set; }
        public double lon { get; set; }
        double ele { get; set; }
        string time { get; set; }
    }
}

