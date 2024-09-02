import type { NextRequest } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { insertTelemetry } from "./sql";

export const runtime = "edge";

function parseUrlParams(url: string): {
  trigger: string;
  clientId: string;
  value?: string;
} {
  const params = new URLSearchParams(new URL(url).search);

  const trigger = params.get("trigger") || "Unknown";
  const clientId = params.get("clientId") || "Unknown";
  const value = params.get("value") || undefined;

  if (!trigger || !clientId) {
    console.error("Trigger and Client ID are required");
    throw new Error("Trigger and Client ID are required");
  }

  //ensure  that all three are less than 100 characters and contain only alphanumeric characters, spaces and hyphens
  if (
    trigger.length > 100 ||
    clientId.length > 100 ||
    (value && value.length > 100) ||
    !/^[a-zA-Z0-9 _-]+$/.test(trigger) ||
    !/^[a-zA-Z0-9 _-]+$/.test(clientId) ||
    (value && !/^[a-zA-Z0-9 /_-]+$/.test(value))
  ) {
    console.error("Invalid parameters for telemetry");
    throw new Error("Invalid parameters");
  }

  return { trigger, clientId, value };
}

export async function GET(request: NextRequest) {
  let trigger, clientId, value;

  try {
    ({ trigger, clientId, value } = parseUrlParams(request.url));
  } catch (e: any) {
    return new Response(e.message, { status: 400 });
  }

  const telemetry = {
    time: new Date().toISOString(),
    trigger,
    clientId,
    value,
    ip:
      request.headers.get("cf-connecting-ip") ||
      request.headers.get("x-real-ip") ||
      request.headers.get("x-forwarded-for") ||
      "Unknown",
    ua: request.headers.get("user-agent") || "Unknown",
  };
  const db = getRequestContext().env.DB;
  await insertTelemetry(db, telemetry);

  return new Response("Telemetry received", { status: 200 });
}
