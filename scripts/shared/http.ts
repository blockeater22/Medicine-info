import axios, { type AxiosInstance } from "axios";
import { sleep } from "./utils.js";

const DEFAULT_DELAY_MS = 350;

export function createHttpClient(baseURL?: string): AxiosInstance {
  return axios.create({
    baseURL,
    timeout: 30000,
    headers: {
      "User-Agent": "DoctorsHub-DataPipeline/1.0 (medical-education; contact@doctors-hub.in)",
      Accept: "application/json,text/html,application/xml",
    },
  });
}

export class RateLimiter {
  private lastCall = 0;
  constructor(private delayMs = DEFAULT_DELAY_MS) {}

  async wait(): Promise<void> {
    const elapsed = Date.now() - this.lastCall;
    if (elapsed < this.delayMs) await sleep(this.delayMs - elapsed);
    this.lastCall = Date.now();
  }
}

export const http = createHttpClient();
export const limiter = new RateLimiter();

export async function getJson<T>(url: string, params?: Record<string, string | number>): Promise<T> {
  await limiter.wait();
  const response = await http.get<T>(url, { params });
  return response.data;
}

export async function getText(url: string): Promise<string> {
  await limiter.wait();
  const response = await http.get<string>(url, { responseType: "text" });
  return response.data;
}
