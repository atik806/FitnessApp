# FitnessApp

A cross-platform fitness tracker built with Expo and Supabase.

## Download

[![Download APK](https://img.shields.io/badge/Download-APK-brightgreen?style=for-the-badge&logo=android)](https://github.com/atik806/FitnessApp/releases/latest)

Download the latest APK from the [Releases](https://github.com/atik806/FitnessApp/releases) page.

> **Note:** Enable **Install from unknown sources** in your device settings.

## Updates

This app supports **over-the-air (OTA) updates** via EAS Update. When the developer pushes a code change, the app checks for updates on launch and applies them automatically — no reinstall needed.

For native changes, a new APK is published as a GitHub Release.

## Development

```bash
npx expo start
```

Scan the QR code with **Expo Go** (Android/iOS) or open in a web browser.

## Tech Stack

- **Framework:** React Native + Expo SDK 56
- **Auth & Database:** Supabase
- **Auth Flow:** Google OAuth via Expo Auth Proxy
- **Routing:** Expo Router
- **State:** Zustand
- **Build & Updates:** EAS Build + EAS Update
