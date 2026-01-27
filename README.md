# Discord Security Bot (Anti-Raid / Anti-Abuse)

A Node.js Discord bot built to mitigate common server raid vectors such as mass bans/kicks, destructive moderation actions, and permission/role abuse.

## Features
- Anti-nuke detection (time-windowed action tracking)
- Mass ban/kick protection
- Permission escalation protection (e.g., dangerous role changes)
- Whitelist / trusted users & roles
- Security logging (audit-log driven)

> Note: This bot is a defensive tool. Tune thresholds for your server to reduce false positives.

## Tech Stack
- Node.js
- discord.js

## Getting Started

### 1) Install dependencies
```bash
npm install
