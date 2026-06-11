# FitnessApp

A cross-platform fitness tracker built with Expo and Supabase.

## Download

### Android

[![Download APK](https://img.shields.io/badge/Download-APK-green?style=for-the-badge&logo=android)](https://expo.dev/accounts/atik21/projects/FitnessApp/builds/1441abd8-8186-4d70-ad67-dd357e3b972e)

Scan the QR code on the build page, or download the APK from the **Artifacts** section.

> **Note:** You may need to enable **Install from unknown sources** in your device settings.

## Updates

This app supports **over-the-air (OTA) updates** via EAS Update. When the developer pushes a code change, the app checks for updates on launch and applies them automatically — no reinstall needed.

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
