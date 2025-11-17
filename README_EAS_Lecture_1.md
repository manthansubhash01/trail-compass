# Building Real Expo Apps

So far, we’ve used **`expo start`** and **Expo Go** for local testing — great for learning, but limited.  
Now we move to **EAS (Expo Application Services)**, which lets us build **real installable apps** (`.apk`, `.ipa`) that can go to the Play Store or App Store.

---

## What You’ll Learn Today

- What **EAS** (Expo Application Services) is and why it matters.
- How to configure your app for real builds using `app.json`.
- How to connect your project to EAS Cloud.
- How to build a **Dev Client** — your own custom Expo Go.
- How to run and test it on a real device.

---

## Step 1 — Clone the Project

We’ll use the **Trail Compass** project.

```bash
git clone https://github.com/anuragkaushik-glitch/trail-compass.git
cd trail-compass
npm install
```

---

## Step 2 — Understand `app.json`

`app.json` defines your app’s **identity**, **metadata**, and **build settings**.

Example:
```json
{
  "expo": {
    "name": "trail-compass",
    "slug": "trail-compass",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.<yourname>.trailcompass"
    },
    "android": {
      "package": "com.<yourname>.trailcompass",
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
```

> **`android.package`** and **`ios.bundleIdentifier`** must be unique!  
> Use: `com.<yourname>.trailcompass` (all lowercase, no spaces)

---

## Step 3 — Environment Check

Before using EAS, fix your setup:

```bash
npx expo-doctor          # Checks for issues
npx expo install --check # Verifies correct versions
npx expo login           # Login or create Expo account
npx expo whoami          # Confirm you're logged in
```

---

## Step 4 — Connect Project to EAS

```bash
npx eas build:configure
```

- This creates an `eas.json` file.
- It also adds a **projectId** inside your `app.json` under `extra.eas.projectId`.
- Visit [https://expo.dev](https://expo.dev) → log in → see your new project on the dashboard.

---

## Step 5 — Build Your First Dev Client

Install the Dev Client dependency:

```bash
npx expo install expo-dev-client
```

Now run your first build (Android preferred):

```bash
npx eas build --platform android --profile development
```

### What this does
- Builds your **own version of Expo Go** that includes your native modules.
- Uploads and compiles your app in the EAS Cloud.
- Once complete, gives you an **APK download link** and a **QR code**.

---

## Step 6 — Run Your App

After the build finishes:
1. Download the `.apk` file to your Android device.
2. Install it (enable “Install from unknown sources” if prompted).
3. Start the dev server:
   ```bash
   npx expo start --dev-client
   ```
4. Open the app → scan the QR → your JS bundle will load live!

> You’ve now built a *real installable version* of Trail Compass!

---

## Optional (iOS Simulator Build)

If you’re on macOS with Xcode:
Add this profile to `eas.json`:
```json
"dev-sim": {
  "developmentClient": true,
  "distribution": "internal",
  "ios": { "simulator": true }
}
```

Then build:
```bash
npx eas build --platform ios --profile dev-sim
```

After download:
- Extract the `.tar.gz`
- Drag the `.app` into your iOS Simulator window.

---

## Helpful Commands

| Task | Command |
|------|----------|
| Fix dependency issues | `npx expo-doctor` |
| Check installed versions | `npx expo install --check` |
| Login to Expo | `npx expo login` |
| Link project to EAS | `npx eas build:configure` |
| Build Dev Client | `npx eas build --platform android --profile development` |
| Start Dev Server | `npx expo start --dev-client` |
| List old builds | `npx eas build:list` |

---

## Recap

You learned what EAS is.  
Configured app.json properly.  
Linked project with EAS.  
Built and installed your own Dev Client.  
Ran your project outside Expo Go.

---

