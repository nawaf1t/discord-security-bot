# Discord Security Bot

A defensive Node.js bot for Discord servers, designed to mitigate common raid, abuse, and privilege-escalation vectors. Built around audit-log monitoring, time-windowed action tracking, and a configurable trust model.

## Overview

Most Discord server incidents come from a small number of repeatable patterns: mass bans or kicks, sudden permission changes, role escalation, and channel destruction. This bot watches for those patterns in real time and intervenes before damage spreads.

## Features

- Anti-nuke engine with time-windowed action tracking
- Mass ban and kick protection with configurable thresholds
- Permission and role escalation protection (e.g. dangerous role changes)
- Whitelist for trusted users and roles
- Audit-log driven security logging for incident review

## Tech Stack

- Runtime: Node.js
- Library: discord.js
- Storage: lightweight JSON configuration (no external database required)

## Getting Started

```bash
# 1) Install dependencies
npm install

# 2) Configure the bot
#    - Set your bot token in a .env file as DISCORD_TOKEN
#    - Adjust thresholds and trusted roles in the config file

# 3) Run the bot
npm start
```

## Configuration

Thresholds (such as how many bans within how many seconds count as a raid) are exposed in the configuration so they can be tuned per server. Defaults are conservative; production servers should review and adjust them to reduce false positives.

## Notes

This is a defensive tool. It does not replace good operational hygiene (least-privilege roles, separation of duties for administrators, and regular audit-log review). It is intended to add an automated layer of detection and response on top of those practices.

## License

MIT
