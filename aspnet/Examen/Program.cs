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
using System.IO;

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
        private static ClientWebSocket webSocket = null;
        private static List<long> memUsageList = new List<long>();
        private static long memUsageBefore;
        private static long memUsageAfter;
        private static string csvPath;


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

        public static void StartStream(string algorithm)
        {
            switch (algorithm)
            {
                case "tree":
                    treeSort = true;
                    mergeSort = false;
                    heapSort = false;
                    break;
                case "merge":
                    mergeSort = true;
                    heapSort = false;
                    treeSort = false;
                    break;
                case "heap":
                    heapSort = true;
                    treeSort = false;
                    mergeSort = false;
                    break;
            }
            byte[] sendBytes = Encoding.UTF8.GetBytes("hej");
            var sendBuffer = new ArraySegment<byte>(sendBytes);
            webSocket.SendAsync(sendBuffer, WebSocketMessageType.Text, true, CancellationToken.None);
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
                        if (message == "Start")
                        {
                            memUsageBefore = GC.GetTotalMemory(false);
                            finishedSorting = false;
                            if (treeSort)
                            {
                                tree = new BinarySearchTree();
                            }
                            else if (mergeSort)
                            {
                                merge = new MergeSort();
                            }
                            else if (heapSort)
                            {
                                heap = new MaxHeap();
                            }
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
                tree = null;
                csvPath = @"E:\SKOLGREJER\Examen\analys\TreeMemUsage_NET.csv";
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
                merge = null;
                csvPath = @"E:\SKOLGREJER\Examen\analys\MergeMemUsage_NET.csv";
            }
            else if (heapSort)
            {
                result = heap.Sort().Take(10).ToList();
                heap = null;
                csvPath = @"E:\SKOLGREJER\Examen\analys\HeapMemUsage_NET.csv";
            }
            finishedSorting = true;
            memUsageAfter = GC.GetTotalMemory(false);
            memUsageList.Add(memUsageAfter - memUsageBefore);
            GC.Collect();
            if (memUsageList.Count == 101)
            {
                string csv = String.Join("\n", memUsageList.Select(x => x.ToString()).ToArray());
                File.WriteAllText(csvPath, csv);
            }
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

