# PET — Personal Expense Tracker

**Track. Analyze. Manage. Grow.**

A private, flexible expense tracker for recording expenses, managing accounts, and understanding credit-card spending.

## What PET does

PET keeps your transactions organized around the thing that matters: **what you spent, where you spent it, which account paid for it, and whether that payment still needs settlement.**

## Core features

- 🏠 **Home** — View, search, filter and edit transactions by day, week, month or year.
- ➕ **Fast entry** — Add expenses with category, account/sub-account, amount and notes.
- 💳 **Credit-card tracking** — Separate card spending from card payments and see paid versus pending amounts.
- 📊 **Analysis** — Analyze spending by category, account, merchant and time period.
- 🔎 **Search & filtering** — Find transactions quickly using merchant, note, category or account.
- 📅 **Flexible periods** — Use a calendar date as the anchor and switch between day, week, month and year.
- 📅 **Visual Calendar** — A dedicated monthly calendar shows daily expenses, pending amounts, category markers and clickable daily details.
- 💰 **Account types** — Configure whether an account requires payment/settlement or is a direct-debit account.
- 💾 **Data control** — Transactions are stored locally in the browser using localStorage; JSON and CSV backup/export are available.
- ☁️ **Google Drive sync** — Optional and off by default. Back up your data to your own Drive at any time.

## How payment tracking works

A credit-card purchase is an **expense**. Paying the credit card later is a **settlement/transfer**, not another expense. This prevents double-counting.

```
Expense → HDFC Regalia → ₹2,500 → Pending

Card payment → HDFC Savings → HDFC Regalia → ₹2,500

Result → HDFC Regalia outstanding reduced by ₹2,500
```

## Account types

- **Payment / settlement account:** normally used for credit cards where purchases create an amount that must be paid later.
- **Direct account:** normally used for UPI, bank accounts, debit cards, wallets or cash where the transaction is treated as a direct debit.
- The account behavior is configurable in **Settings → Accounts**.

## Analysis views

- Total spending for the selected period.
- Payment status with pending and settled amounts.
- Pending amounts grouped by account/sub-account.
- Category distribution and amounts.
- Account/sub-account spending with paid and pending amounts where applicable.
- Top merchants/notes and spending trends.
- Weeks-in-this-month breakdown, when viewing a month.
- Clicking a pending account can take you back to Home with the relevant transactions filtered for editing.

## Installing PET

When hosted (for example on GitHub Pages), PET installs like a real app — "Add to Home Screen" on Android gives it its own icon and a full-screen launch, and it keeps working completely offline afterward, even if the site later becomes unreachable.

## Data & privacy

Your transaction data is kept in the browser's local storage on the device/browser where you use it. PET does not require a server or an account to use the core app.

Google Drive sync is entirely **optional and off by default**. Nothing is ever sent anywhere unless you explicitly connect it in **Settings → Sync**, and turning it off at any time returns PET to being fully offline.

**Important:** browser storage is not a substitute for backups. Use the Data section to export a JSON backup periodically, especially before clearing browser data or changing devices.

## Sharing / forking PET

This project is free to fork and reuse under the MIT license. Each person's copy keeps its own data in their own browser storage — there is no shared central database. Google Drive sync requires each copy to use its own free Google OAuth Client ID; see the setup section below.

## Running your own copy

1. Fork or download this repository.
2. In your GitHub repo settings, enable **GitHub Pages** for the `main` branch (root folder). GitHub will give you a URL like `https://yourname.github.io/reponame/`.
3. Open that URL — PET is now live and installable ("Add to Home Screen" on Android/Chrome).

### Enabling Google Drive sync (optional)

Google requires every site to have its own registered credential — this is a one-time, free setup:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/) and create a new project (any name).
2. Go to **APIs & Services → Library** and enable the **Google Drive API**.
3. Go to **APIs & Services → OAuth consent screen** — choose "External," fill in the basic required fields, and add your own Google account as a test user.
4. Go to **APIs & Services → Credentials → Create Credentials → OAuth client ID**. Choose **Web application**. Under "Authorized JavaScript origins," add your GitHub Pages URL from step 2 above (e.g. `https://yourname.github.io`).
5. Copy the generated Client ID (it looks like `xxxxxxxx.apps.googleusercontent.com`).
6. In PET, go to **Settings → Sync**, paste the Client ID, and tap **Connect**.

Nothing here is stored anywhere but your own browser and your own Google account.

### If you want anyone (not just you) to connect Drive without a warning screen

PET only requests the `drive.file` scope — access limited to files PET itself creates — which Google classifies as **non-sensitive**. That means opening this up to the public only requires a lightweight "brand verification" (app name, logo, support email, a privacy policy page), not the heavier review or paid security audit that broader Drive/Sheets access would trigger. See **OAuth consent screen → Publish App** in Cloud Console once your app details are filled in.

## Version

Personal Expense Tracker (PET) • Local-first, with optional Google Drive sync

## License

MIT — see [LICENSE](./LICENSE). You're free to use, modify, and share your own version.
