# 🚀 reNOVAtion

**Nova Launcher deserves a second life.**

Development stopped. Updates ended. But millions still love it. **reNOVAtion** is a community-driven, open-source movement to pick up where things left off — and build something even better.

---

## 🔥 What is this?

Nova Launcher was *the* Android launcher for years — fast, customizable, and powerful. After its acquisition, development went silent. No updates, no communication, no roadmap.

**reNOVAtion** is the community's answer:
- 📖 Fully open-source
- 🛠️ Maintained by developers who actually use it
- 🤝 Built in the open, with contributions from anyone who cares

This repository hosts the **landing page** for the project — where people can join the waitlist and sign up as contributors.

---

## 🌐 Live Page

> **[Visit reNOVAtion →](#)** *(deploy link here)*

---

## ✨ Features

- **Waitlist signup** — email collection with Google Sheets integration
- **Contributor registration** — name, role, GitHub profile → saved to Google Sheets
- **Live counters** — see how many people have joined in real-time
- **Fully responsive** — works on desktop, tablet, and mobile
- **Dark theme** — colors matched to Nova Launcher's iconic icon

---

## 📂 Project Structure

```
reNOVAtion/
├── index.html              # Main landing page
├── style.css               # Styles (dark theme, Nova brand colors)
├── script.js               # Waitlist/contributor logic + Google Sheets POST
├── google-apps-script.js   # Google Apps Script for sheet integration
└── assets/
    └── nova-icon.png       # Nova Launcher icon
```

---

## 🛠️ Setup

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/reNOVAtion.git
cd reNOVAtion
```

### 2. Open locally

Just open `index.html` in your browser. No build tools needed.

### 3. Google Sheets integration (optional)

1. Create a Google Sheet with two tabs: `Waitlist` and `Contributors`
2. **Waitlist** headers: `Timestamp | Email`
3. **Contributors** headers: `Timestamp | Name | Email | Role | GitHub`
4. Go to **Extensions → Apps Script**, paste the contents of `google-apps-script.js`
5. **Deploy → New Deployment** → Web app → Anyone can access
6. Copy the Web App URL and paste it into `script.js` at line 12

---

## 🤝 Contributing

We need all kinds of help:

| Role | What you'd do |
|------|---------------|
| **Developers** | Android/Kotlin, feature implementation, performance |
| **Designers** | UI/UX, icon packs, themes, launcher interface |
| **Testers** | Beta testing, bug reports, device compatibility |
| **Community** | Docs, translations, social media, outreach |

**To join:**
1. Visit the [landing page](#) and click **"Join as Contributor"**
2. Or fork this repo and submit a PR

---

## 📜 License

This is a community project. Not affiliated with the original Nova Launcher team.

MIT License — use it, fork it, build on it.

---

## 📬 Contact

[![Instagram](https://img.shields.io/badge/Instagram-chrg__bsr-E4405F?style=flat&logo=instagram&logoColor=white)](https://instagram.com/chrg_bsr)

---

<p align="center">
  <strong>Nova Launcher isn't dead. We won't let it die.</strong><br>
  <sub>Made with ❤️ by the community</sub>
</p>
