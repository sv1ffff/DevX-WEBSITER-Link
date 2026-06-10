<div align="center">
  <img src="https://i.ibb.co/xq8qjh77/image-25.jpg" alt="DEVX SQ Banner" width="600"/>
  
  # DEVX SQ — Portfolio Generation Bot
  
  <p align="center">
    <strong>A fully automated Discord bot that generates stunning personal portfolio websites for your community members.</strong>
  </p>
  
  <p align="center">
    <a href="https://devxsq.online/store/portfolio-generation-bot">
      <img src="https://img.shields.io/badge/Get%20it%20on-DevX%20Store-gold?style=for-the-badge&logo=shopify" alt="Get it on DevX Store"/>
    </a>
    <img src="https://img.shields.io/badge/version-2.0.0-blue?style=for-the-badge" alt="Version 2.0.0"/>
    <img src="https://img.shields.io/badge/node-22%2B-green?style=for-the-badge&logo=node.js" alt="Node 22+"/>
  </p>
</div>

---

## 📋 Overview

DEVX SQ Portfolio Generation Bot creates a complete ticket-based workflow where users submit their information through interactive modal forms and receive a fully customized, ready-to-deploy static portfolio website — packed with animations, custom cursors, social links, and more.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎫 **Ticket System** | Dedicated private channels per user |
| 📝 **Step-by-Step Forms** | Modal-based data collection (name, bio, photo, links) |
| 🌐 **Static Portfolio** | Beautifully styled HTML/CSS/JS generated on the fly |
| 📦 **Auto ZIP** | Complete site packaged into a `.zip` archive |
| 🔗 **Social Links** | YouTube, Discord, TikTok, GitHub — all customizable |
| 🖼️ **Media Assets** | Badges, fonts, cursors, backgrounds included |
| 🔒 **Auto-Close** | Tickets close automatically after completion |
| 🚀 **One-Click Setup** | Slash command `/setup` to deploy the panel |

---

## 🎬 Demo

<div align="center">
  
  🖥️ **Live Demo:** [wx.devxsq.online](https://wx.devxsq.online/)
  
  <a href="https://wx.devxsq.online/">
    <img src="https://i.ibb.co/xq8qjh77/image-25.jpg" alt="Portfolio Preview" width="600"/>
  </a>
  
  *Click the image above to see a live portfolio sample*
  
</div>

---

## 🎯 How It Works

```
1. Admin runs /setup → Panel appears
2. User clicks 🚀 "Create Portfolio" → Private ticket opens
3. User clicks ✨ "Start" → Fills in Step 1 (name, photo, bio, links)
4. User clicks 📎 "Step 2" → Adds social media links
5. Bot generates the HTML portfolio → Zips it → Sends it
6. Ticket auto-closes — portfolio ready to deploy!
```

---

## 🛠️ Installation

### Requirements

| Dependency | Version |
|------------|---------|
| [Node.js](https://nodejs.org) | ≥ 22 |
| [Discord Bot Token](https://discord.com/developers/applications) | Valid token |
| [npm](https://npmjs.com) | (comes with Node.js) |

### Steps

1. **Download the bot** from the [DevX Store](https://devxsq.online/store/portfolio-generation-bot).

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure the bot** — edit `bot/config.js`:
   ```js
   module.exports = {
       token: 'YOUR_DISCORD_BOT_TOKEN',
       ownerId: 'YOUR_DISCORD_USER_ID',
       ticketCategoryId: 'CATEGORY_ID_FOR_TICKETS'
   };
   ```

4. **Run the bot:**
   ```bash
   npm start
   ```
   Or:
   ```bash
   node bot/index.js
   ```

---

## ⚙️ Configuration

### `bot/config.js`

| Field | Type | Description |
|-------|------|-------------|
| `token` | `string` | Your Discord bot token |
| `ownerId` | `string` | Discord ID of the bot owner |
| `ticketCategoryId` | `string` | Category where ticket channels are created |

### Discord Intents Required

- `Guilds`
- `MessageContent`

Enable these in the [Discord Developer Portal](https://discord.com/developers/applications) → Bot → Privileged Gateway Intents.

### Bot Permissions

The bot needs these permissions in your server:

- `View Channels`
- `Send Messages`
- `Manage Channels`
- `Create Public Threads`
- `Send Messages in Threads`
- `Attach Files`
- `Embed Links`
- `Read Message History`

---

## 📖 Usage

### Commands

| Command | Description | Access |
|---------|-------------|--------|
| `/setup` | Sends the portfolio creation panel | Owner only |
| `بانل` | Same as `/setup` (text command) | Owner only |
| Create Portfolio button | Opens a ticket | Everyone |

### User Flow

1. User clicks **🚀 Create Portfolio** on the panel
2. A private ticket channel is created
3. User clicks **✨ Start** to begin
4. **Step 1 Modal:** Name, profile picture URL, bio (optional), YouTube, Discord
5. **Step 2 Modal:** TikTok, GitHub
6. Bot generates the portfolio → sends the `.zip` file
7. Ticket auto-deletes after delivery

### File Upload Restrictions

If file uploads are restricted in your server, the bot automatically attempts to send the portfolio via **Direct Message** to the user, then closes the ticket after 120 seconds.

---

## 📁 Project Structure

```
DEVXSQ-BOT/
├── bot/
│   ├── index.js          # Main bot logic
│   ├── config.js         # Configuration
│   ├── generator.js      # Portfolio site generator
│   ├── build.js          # Build/obfuscation utility
│   └── package.json      # Bot dependencies
├── assets/               # Portfolio assets (images, fonts, media)
├── index.html            # Portfolio template
├── script.js             # Portfolio JavaScript (obfuscated)
├── style.css             # Portfolio styles
└── package.json          # Root package.json
```

---

## 🤝 Support

- **Store Page:** [devxsq.online/store/portfolio-generation-bot](https://devxsq.online/store/portfolio-generation-bot)
- **Developer:** Saif Fikry
- **Instagram:** [@sv1ffff](https://instagram.com/sv1ffff)

---

<div align="center">
  <br/>
  <a href="https://devxsq.online/store/portfolio-generation-bot">
    <img src="https://img.shields.io/badge/%F0%9F%9B%92%20Get%20your%20copy-DevX%20Store-gold?style=for-the-badge&labelColor=black" alt="Get your copy"/>
  </a>
  <br/><br/>
  <sub>© 2026 DEVX SQ. All rights reserved.</sub>
</div>
