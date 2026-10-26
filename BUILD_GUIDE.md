# Soft Skills Platform — Desktop App & Build Guide

This document describes how the Windows Desktop application is configured, where user data is saved, how to continue editing the source code, and how to build a new `.exe` at any time.

---

## 1. Architecture Overview

- **Source Code Layer:** Fully standard Next.js 14 + React 18 + Tailwind CSS. All files in `app/`, `components/`, `lib/` remain 100% accessible, editable, and hot-reloading.
- **Desktop Shell:** Electron 44 manages a native Windows window, background process lifecycle, and application menu.
- **Backend Server:** Uses Next.js standalone server with embedded Node runtime in Electron.
- **AI Service:** Google Gemini AI API directly integrated via server routes (`/api/ai/*`).

---

## 2. Safe & Persistent User Data Storage

> [!IMPORTANT]
> **Your data is never lost or overwritten when rebuilding the app.**

All learner profiles, diagnostic assessments, daily challenges, and speech attempt histories are stored in:
```
%APPDATA%\SoftSkillsPlatformData
(Full path: C:\Users\<YourUsername>\AppData\Roaming\SoftSkillsPlatformData)
```

- When you compile a new `.exe`, install an update, or replace the executable, this folder is **untouched**.
- To **backup** your learner data, simply copy the `SoftSkillsPlatformData` folder.
- To **reset** all data back to fresh demo defaults, you can delete that folder.

---

## 3. How to Edit the Application

You can modify any part of this project just like any web application:

1. Open this folder in your code editor.
2. Edit any page in `app/` or component in `components/`.
3. To test your changes interactively in your browser:
   ```bash
   npm run dev
   ```
   and open **http://localhost:3000**.
4. To test your changes inside the Electron desktop window:
   ```bash
   npm run electron:dev
   ```

---

## 4. How to Build a New .EXE

Whenever you make changes to the code and want to package an updated Windows executable:

### Option A: The 1-Click Batch Script (Recommended)
Double-click the file:
👉 **`build-exe.bat`** in this project folder.

### Option B: Via Terminal / Command Prompt
Run:
```bash
npm run build:exe
```

---

## 5. Output Executables

When the build finishes, your executable files will be located in the `dist/` folder:

1. **`dist/win-unpacked/Soft Skills Platform.exe`**
   - Portable, standalone executable.
   - Run immediately without installing.
2. **`dist/Soft Skills Platform Setup 0.1.0.exe`**
   - Windows Installer (NSIS).
   - Installs the app to Program Files / Start Menu with a desktop shortcut.

---

## 6. Changing the Google Gemini API Key

You can change your Gemini API key anytime:
- In the project: edit [\`.env.local\`](.env.local) with Notepad.
- For packaged app: place a `.env.local` file in the same directory as `Soft Skills Platform.exe` and it will automatically override the key without needing to recompile!
