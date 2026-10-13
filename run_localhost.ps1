# ====================================================================
# NexusEdu AI Success Platform - Universal High-Performance Web Server
# Powered by in-memory compiled asynchronous multi-threaded C# TCP engine
# ====================================================================

$Port = 5000
$RootPath = $PSScriptRoot
if (-not $RootPath) {
    $RootPath = (Get-Location).Path
}

$csharpCode = @"
using System;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using System.Collections.Generic;

public class NexusServer
{
    private TcpListener listener;
    private string rootPath;
    private bool isRunning;
    private static readonly Dictionary<string, string> MimeMap = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
    {
        { ".html", "text/html; charset=utf-8" },
        { ".htm",  "text/html; charset=utf-8" },
        { ".css",  "text/css; charset=utf-8" },
        { ".js",   "application/javascript; charset=utf-8" },
        { ".json", "application/json; charset=utf-8" },
        { ".png",  "image/png" },
        { ".jpg",  "image/jpeg" },
        { ".jpeg", "image/jpeg" },
        { ".svg",  "image/svg+xml" },
        { ".ico",  "image/x-icon" },
        { ".woff", "font/woff" },
        { ".woff2","font/woff2" },
        { ".ttf",  "font/ttf" }
    };

    public NexusServer(int port, string root)
    {
        rootPath = root;
        listener = new TcpListener(IPAddress.Any, port);
        listener.Server.SetSocketOption(SocketOptionLevel.Socket, SocketOptionName.ReuseAddress, true);
    }

    public void Start()
    {
        isRunning = true;
        listener.Start(200);
        Thread acceptThread = new Thread(AcceptLoop) { IsBackground = true };
        acceptThread.Start();
    }

    private void AcceptLoop()
    {
        while (isRunning)
        {
            try
            {
                TcpClient client = listener.AcceptTcpClient();
                ThreadPool.QueueUserWorkItem(ProcessClient, client);
            }
            catch
            {
                if (!isRunning) break;
            }
        }
    }

    private void ProcessClient(object state)
    {
        TcpClient client = (TcpClient)state;
        try
        {
            client.NoDelay = true;
            client.ReceiveTimeout = 2000;
            client.SendTimeout = 8000;

            using (NetworkStream stream = client.GetStream())
            {
                int waitMs = 0;
                while (!stream.DataAvailable && waitMs < 1500)
                {
                    Thread.Sleep(15);
                    waitMs += 15;
                }

                if (!stream.DataAvailable)
                {
                    return;
                }

                byte[] buf = new byte[16384];
                int totalRead = 0;
                while (totalRead < buf.Length)
                {
                    int r = stream.Read(buf, totalRead, buf.Length - totalRead);
                    if (r <= 0) break;
                    totalRead += r;
                    string current = Encoding.ASCII.GetString(buf, 0, totalRead);
                    if (current.Contains("\r\n\r\n") || current.Contains("\n\n")) break;
                    if (!stream.DataAvailable)
                    {
                        Thread.Sleep(10);
                        if (!stream.DataAvailable) break;
                    }
                }

                if (totalRead <= 0) return;

                string req = Encoding.ASCII.GetString(buf, 0, totalRead);
                int endOfLine = req.IndexOf("\r\n");
                if (endOfLine < 0) endOfLine = req.IndexOf("\n");
                string firstLine = (endOfLine > 0) ? req.Substring(0, endOfLine).Trim() : req.Trim();
                string[] parts = firstLine.Split(' ');
                string method = (parts.Length >= 1) ? parts[0].ToUpperInvariant() : "GET";
                string rawPath = (parts.Length >= 2) ? parts[1].Split('?')[0].TrimStart('/') : "";

                if (string.IsNullOrWhiteSpace(rawPath) || rawPath.Equals("index.html", StringComparison.OrdinalIgnoreCase))
                {
                    rawPath = "login.html";
                }

                string lower = rawPath.ToLowerInvariant().TrimEnd('/');
                string target = rawPath;
                if (lower == "login" || lower == "logins" || lower == "loginpages" || lower == "login-pages") target = "login.html";
                else if (lower == "student-login" || lower == "student_login" || lower == "login/student") target = "student-login.html";
                else if (lower == "faculty-login" || lower == "faculty_login" || lower == "login/faculty") target = "faculty-login.html";
                else if (lower == "placement-login" || lower == "placement_login" || lower == "login/placement") target = "placement-login.html";
                else if (lower == "admin-login" || lower == "administrator-login" || lower == "login/admin") target = "admin-login.html";
                else if (lower == "student" || lower == "students") target = "student.html";
                else if (lower == "faculty" || lower == "facalty") target = "faculty.html";
                else if (lower == "placement" || lower == "placements") target = "placement.html";
                else if (lower == "admin" || lower == "administrator") target = "administrator.html";

                string fullPath = Path.Combine(rootPath, target.Replace('/', Path.DirectorySeparatorChar));
                if (!File.Exists(fullPath))
                {
                    string htmlPath = fullPath + ".html";
                    if (File.Exists(htmlPath)) fullPath = htmlPath;
                }

                if (File.Exists(fullPath))
                {
                    byte[] fileBytes = File.ReadAllBytes(fullPath);
                    string ext = Path.GetExtension(fullPath);
                    string mime;
                    if (!MimeMap.TryGetValue(ext, out mime)) mime = "application/octet-stream";

                    string header = "HTTP/1.1 200 OK\r\nContent-Type: " + mime +
                                    "\r\nContent-Length: " + fileBytes.Length +
                                    "\r\nAccess-Control-Allow-Origin: *\r\nConnection: close\r\n\r\n";
                    byte[] hdrBytes = Encoding.ASCII.GetBytes(header);
                    stream.Write(hdrBytes, 0, hdrBytes.Length);

                    if (method != "HEAD")
                    {
                        stream.Write(fileBytes, 0, fileBytes.Length);
                    }
                    stream.Flush();
                }
                else
                {
                    string notFound = "<html><body><h1>404 Not Found</h1><p>The requested path '" + rawPath + "' was not found.</p><a href='/login.html'>Go to Portal</a></body></html>";
                    byte[] notFoundBytes = Encoding.UTF8.GetBytes(notFound);
                    string header = "HTTP/1.1 404 Not Found\r\nContent-Type: text/html; charset=utf-8\r\nContent-Length: " + notFoundBytes.Length + "\r\nConnection: close\r\n\r\n";
                    byte[] hdrBytes = Encoding.ASCII.GetBytes(header);
                    stream.Write(hdrBytes, 0, hdrBytes.Length);
                    if (method != "HEAD")
                    {
                        stream.Write(notFoundBytes, 0, notFoundBytes.Length);
                    }
                    stream.Flush();
                }

                try
                {
                    client.Client.Shutdown(SocketShutdown.Send);
                }
                catch {}
            }
        }
        catch {}
        finally
        {
            try { client.Close(); } catch {}
        }
    }
}
"@

Add-Type -TypeDefinition $csharpCode

$server = New-Object NexusServer($Port, $RootPath)
$server.Start()

Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "  NexusEdu AI Analytics Platform - Enterprise C# Server Active" -ForegroundColor Green
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "  Local URL:     http://localhost:$Port/" -ForegroundColor Yellow
Write-Host "  Root Path:     $RootPath" -ForegroundColor White
Write-Host "  Portals:" -ForegroundColor White
Write-Host "    - Hub Selector:     http://localhost:$Port/login.html" -ForegroundColor Gray
Write-Host "    - Student Portal:   http://localhost:$Port/student.html" -ForegroundColor Gray
Write-Host "    - Faculty Portal:   http://localhost:$Port/faculty.html" -ForegroundColor Gray
Write-Host "    - Placement Portal: http://localhost:$Port/placement.html" -ForegroundColor Gray
Write-Host "    - Admin Portal:     http://localhost:$Port/administrator.html" -ForegroundColor Gray
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "  Multi-threaded, persistent server active. Press Ctrl+C to stop.`n" -ForegroundColor DarkGray

while ($true) {
    Start-Sleep -Seconds 3600
}
