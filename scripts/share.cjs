#!/usr/bin/env node

/**
 * LinkedIn Share Script for Gemini CLI Skill
 * 
 * Usage: node share.cjs '{"commentary": "Hello LinkedIn!", "title": "My Post", "url": "https://example.com"}'
 * 
 * Requirements:
 * - LINKEDIN_ACCESS_TOKEN environment variable
 * - LINKEDIN_USER_URN (optional, auto-discovered if missing)
 */

const { env, argv, exit } = process;

const ACCESS_TOKEN = env.LINKEDIN_ACCESS_TOKEN;
const USER_URN_OVERRIDE = env.LINKEDIN_USER_URN;
// LinkedIn API versions are YYYYMM. Using the latest stable version.
const API_VERSION = env.LINKEDIN_API_VERSION || "202601"; 

if (!ACCESS_TOKEN) {
  console.error("❌ Missing LINKEDIN_ACCESS_TOKEN environment variable.");
  process.exit(1);
}

async function getMyUrn() {
  if (USER_URN_OVERRIDE && USER_URN_OVERRIDE.startsWith("urn:li:")) {
    return USER_URN_OVERRIDE;
  }

  const endpoints = [
    "https://api.linkedin.com/v2/userinfo",
    "https://api.linkedin.com/v2/me",
  ];

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${ACCESS_TOKEN}`,
          "X-Restli-Protocol-Version": "2.0.0",
        },
      });

      if (!res.ok) continue;

      const data = await res.json();
      const id = data.sub || data.id;
      if (id) {
        return `urn:li:person:${id}`;
      }
    } catch (error) {
      // Silently try next endpoint
    }
  }

  return null;
}

async function postToLinkedIn({ commentary, title, url, description }) {
  const authorUrn = await getMyUrn();
  if (!authorUrn) {
    console.error("❌ Could not discover LinkedIn User URN. Please ensure your token has the right permissions (openid, profile, w_member_social).");
    exit(1);
  }

  const payload = {
    author: authorUrn,
    commentary: commentary,
    visibility: "PUBLIC",
    distribution: {
      feedDistribution: "MAIN_FEED",
      targetEntities: [],
      thirdPartyDistributionChannels: [],
    },
    lifecycleState: "PUBLISHED",
  };

  if (url) {
    payload.content = {
      article: {
        source: url,
        title: title || "Shared via Gemini CLI",
        description: description || "",
      },
    };
  }

  try {
    const response = await fetch("https://api.linkedin.com/rest/posts", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${ACCESS_TOKEN}`,
        "Linkedin-Version": API_VERSION,
        "X-Restli-Protocol-Version": "2.0.0",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const postId = response.headers.get("x-restli-id");
      console.log(`🚀 Successfully posted to LinkedIn! Post ID: ${postId}`);
    } else {
      const errorData = await response.json();
      console.error(`❌ Failed to post (Status ${response.status}):`, JSON.stringify(errorData, null, 2));
      exit(1);
    }
  } catch (error) {
    console.error("❌ Network error while posting to LinkedIn:", error.message);
    exit(1);
  }
}

async function main() {
  const args = argv.slice(2);
  if (args.length === 0) {
    console.error("Usage: node share.cjs '<json_payload>'");
    exit(1);
  }

  try {
    const input = JSON.parse(args[0]);
    await postToLinkedIn(input);
  } catch (err) {
    console.error("❌ Invalid JSON input:", err.message);
    exit(1);
  }
}

main();
