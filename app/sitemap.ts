import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { agents } from "@/data/agents";
import { solutions } from "@/data/solutions";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date();
  const core = ["", "/intelligence", "/solutions", "/agents", "/about", "/contact", "/register", "/privacy", "/terms"];

  return [
    ...core.map((path) => ({
      url: `${base}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : path === "/intelligence" ? 0.9 : 0.7,
    })),
    ...solutions.map((s) => ({ url: `${base}/solutions/${s.slug}`, lastModified: now, priority: 0.6 })),
    ...agents.map((a) => ({ url: `${base}/agents/${a.slug}`, lastModified: now, priority: 0.6 })),
  ];
}
