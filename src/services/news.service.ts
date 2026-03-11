import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import { readJson, writeJson } from "../lib/storage";
import type { NewsItem, NewsPayload } from "../types/app";

const CACHE_KEY = "cache:news";
const GUARDIAN_BASE = "https://content.guardianapis.com/search";
const ESPN_SPORTS_RSS = "https://www.espn.com/espn/rss/news";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
  parseTagValue: true,
  trimValues: true,
});

function stripHtml(input?: string) {
  if (!input) return "";
  return input.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function safeId(...parts: Array<string | number | undefined | null>) {
  return parts
    .filter(Boolean)
    .map((part) => String(part).trim())
    .join("::");
}

async function getPoliticsNews(): Promise<NewsItem[]> {
  const response = await axios.get(GUARDIAN_BASE, {
    params: {
      "api-key": "test",
      section: "politics",
      "page-size": 10,
      "show-fields": "thumbnail,trailText",
      orderBy: "newest",
    },
    timeout: 20000,
  });

  const results = response.data?.response?.results ?? [];
  return results.map((item: any, index: number) => ({
    id: safeId("guardian", item.id, item.webPublicationDate, index),
    title: item.webTitle,
    url: item.webUrl,
    source: "The Guardian",
    publishedAt: item.webPublicationDate,
    image: item.fields?.thumbnail,
    summary: stripHtml(item.fields?.trailText),
  }));
}

async function getSportsNews(): Promise<NewsItem[]> {
  const response = await axios.get(ESPN_SPORTS_RSS, {
    responseType: "text",
    timeout: 20000,
  });

  const xml = parser.parse(response.data);
  const rawItems = xml?.rss?.channel?.item ?? [];
  const items = Array.isArray(rawItems) ? rawItems : [rawItems];

  return items.slice(0, 10).map((item: any, index: number) => ({
    id: safeId("espn", item.guid, item.link, item.pubDate, index),
    title: item.title,
    url: item.link,
    source: "ESPN",
    publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : undefined,
    summary: stripHtml(item.description),
  }));
}

export async function getNews(): Promise<NewsPayload> {
  try {
    const [politics, sports] = await Promise.all([
      getPoliticsNews(),
      getSportsNews(),
    ]);

    const payload: NewsPayload = {
      politics,
      sports,
      updatedAt: new Date().toISOString(),
    };

    await writeJson(CACHE_KEY, payload);
    return payload;
  } catch {
    const cached = await readJson<NewsPayload>(CACHE_KEY);
    if (cached) return cached;
    throw new Error("Unable to load news data.");
  }
}