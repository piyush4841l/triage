import { NextResponse } from "next/server";
import { networkInterfaces } from "os";

export async function GET() {
  const nets = networkInterfaces();
  let localIp = "localhost";

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]!) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1)
      if (net.family === "IPv4" && !net.internal) {
        // Prefer Wi-Fi or Ethernet
        if (name.toLowerCase().includes("wi-fi") || name.toLowerCase().includes("wlan") || name.toLowerCase().includes("eth")) {
            localIp = net.address;
            break;
        }
        // Fallback to first available if not named wifi
        if (localIp === "localhost") {
            localIp = net.address;
        }
      }
    }
  }

  return NextResponse.json({ ip: localIp });
}
