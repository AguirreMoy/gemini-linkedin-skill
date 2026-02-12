# Gemini LinkedIn Skill 🚀

A specialized skill for the [Gemini CLI](https://github.com/google/gemini-cli) that helps you generate, format, and publish high-quality LinkedIn posts directly from your terminal.

## Features

- **Smart Generation**: Generates compelling LinkedIn content (hooks, body, CTAs) based on your topics or links.
- **Automated Sharing**: Publishes posts via the LinkedIn API.
- **Token Setup Guide**: Built-in instructions to help you get and configure your LinkedIn Access Token.
- **Auto-Discovery**: Automatically identifies your LinkedIn Member URN.
- **Latest API Support**: Uses LinkedIn API Version `202601`.

## Installation

1. **Download the `.skill` file** from this repository.
2. **Install via Gemini CLI**:
   ```bash
   gemini skills install linkedin-post-skill.skill --scope user
   ```
3. **Reload Skills**:
   In your interactive Gemini session, run:
   ```bash
   /skills reload
   ```

## Setup & Authentication

This skill requires a LinkedIn Access Token with `w_member_social` permissions.

1. Go to the [LinkedIn Developers Portal](https://www.linkedin.com/developers/).
2. Create an app and ensure it has `w_member_social`, `openid`, and `profile` permissions.
3. Use the **Token Generator** to create a 3-legged OAuth token.
4. Export the token in your environment:
   ```bash
   export LINKEDIN_ACCESS_TOKEN="your_token_here"
   ```

## Usage

Once installed, you can trigger the skill by asking Gemini:

> "I want to share my new blog post on LinkedIn: https://example.com/my-post"
> "Help me write a LinkedIn post about my new GitHub project."
> "Share an update on LinkedIn about winning the hackathon!"

Gemini will then:
1. Check for your access token.
2. Generate a draft for your review.
3. Ask for confirmation before posting.

## Development

The skill consists of:
- `SKILL.md`: The procedural instructions for Gemini.
- `scripts/share.cjs`: A Node.js script that interacts with the LinkedIn API.

## License

MIT
