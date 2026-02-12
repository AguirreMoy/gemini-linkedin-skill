---
name: linkedin-post-skill
description: Generate and share high-quality LinkedIn posts. Use when the user wants to promote a blog post, a project, an achievement, or any topic on LinkedIn. The skill handles content generation, formatting for LinkedIn, and the actual sharing via the LinkedIn API.
---

# Linkedin Post Skill

This skill automates the process of creating and publishing LinkedIn posts. It uses a specialized script to interact with the LinkedIn API.

## Requirements & Setup

### 1. Check for Access Token
The skill requires a LinkedIn Access Token. Before proceeding, check if `LINKEDIN_ACCESS_TOKEN` is set in the environment.

### 2. Guide the User (if missing)
If the token is missing, explain how to get one:
1. Go to the [LinkedIn Developers Portal](https://www.linkedin.com/developers/).
2. Create an app (or use an existing one).
3. Ensure the app has the `w_member_social`, `openid`, and `profile` permissions.
4. Use the "Token Generator" tool in the portal to generate a 3-legged OAuth token.
5. Advise the user to add it to their environment:
   - **Temporary (Current Session):** `export LINKEDIN_ACCESS_TOKEN=your_token_here`
   - **Persistent:** Add `export LINKEDIN_ACCESS_TOKEN="your_token_here"` to their `.zshrc` or `.bashrc`.

### 3. Environment Variables
- `LINKEDIN_ACCESS_TOKEN`: **(Required)**
- `LINKEDIN_USER_URN`: (Optional) Auto-discovered if missing.

## Workflow

### 1. Validate Environment
Check if `LINKEDIN_ACCESS_TOKEN` is available. If not, trigger the **Setup Guide** above.

### 2. Gather Context
If the user hasn't provided a specific topic or link, ask for:
- The main topic or a URL to the content (blog post, repo, etc.).
- The desired tone (professional, enthusiastic, educational, etc.).
- Any specific hashtags or mentions to include.

### 2. Generate Post Content
Generate a compelling LinkedIn post following these best practices:
- **Hook**: A strong opening line to stop the scroll.
- **Body**: Use bullet points, emojis, and whitespace to make it readable.
- **CTA**: A clear call to action (e.g., "Check it out here:", "What are your thoughts?").
- **Hashtags**: Include 3-5 relevant hashtags at the bottom.

**Note**: Formatting should be plain text with emojis and basic punctuation. LinkedIn does not support Markdown in the `commentary` field.

### 3. Review and Confirm
Present the generated post to the user for approval. Show:
- **Commentary**: The main text of the post.
- **Article Details**: (If a URL is provided) Title and description.

Ask for confirmation before posting.

### 4. Execute Share
Once confirmed, call the `scripts/share.cjs` script with the payload.

**Command Template:**
```bash
node <SKILL_PATH>/scripts/share.cjs '<json_payload>'
```

**JSON Payload Structure:**
```json
{
  "commentary": "The full text of the post",
  "title": "Article Title (optional)",
  "url": "https://example.com (optional)",
  "description": "Short description for the article preview (optional)"
}
```

## Tips for Great LinkedIn Posts
- Use 3-5 hashtags max.
- Tag people or companies using their exact names (though API tagging requires URNs, simple text mentions are safer).
- Encourage engagement by asking a question at the end.
