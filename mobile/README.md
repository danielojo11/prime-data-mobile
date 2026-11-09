# PrimeData VTU — Mobile

A polished React Native / Expo build of the PrimeData VTU wallet. It keeps the
dark glass visual language of the web app — the black canvas, emerald wallet
gradient, Plus Jakarta Sans typography and five-tab layout — while using native
navigation, sheets, biometrics and haptics.

## Stack

- **Expo SDK 58** / React Native 0.88 / React 19
- **Expo Router** file-based navigation (`src/app/`)
- **AsyncStorage** for the local demo session, users and transactions
- **expo-local-authentication** for fingerprint / Face ID flows
- **expo-blur**, **expo-linear-gradient**, **expo-haptics**, **expo-clipboard**,
  **expo-print**, **expo-sharing**, **expo-network**
- **lucide-react-native** icons
- **Jest** + **jest-expo** for utility tests

## Run it

```bash
cd mobile
npm install
npx expo start
```

Then press `a` for Android, `i` for iOS (macOS), or `w` for web. You can also
scan the QR code with Expo Go. Face ID on iOS requires a development build.

Useful checks:

```bash
npx expo-doctor     # dependency / config validation
npx expo lint       # ESLint
npm test            # Jest unit tests
npx expo export --platform all --output-dir dist   # bundle smoke test
```

## Demo accounts

| Role  | Email                 | Password   |
| ----- | --------------------- | ---------- |
| User  | `demo@primedata.com`  | `demo1234` |
| Admin | `admin@primedata.com` | `admin1234` |

The login screen has a one-tap **Try the demo account** autofill. The demo
user's transaction PIN is `1234`.

## What is included

- **Dashboard** — greeting, wallet balance with show/hide, quick actions,
  service categories, referral banner, notifications sheet and recent
  transactions.
- **Transactions** — search, status filters, money-in / money-out totals, refresh
  on focus plus a 60-second poll while open, pull-to-refresh and a transaction
  detail sheet with inline reference copy, PDF share and receipt printing.
- **Receipts** — branded receipt with amount, status, service details and
  reference; share as PDF on iOS/Android or print via the native print dialog.
  On web, the receipt opens in a print-ready frame so it can be saved as PDF.
- **Print Cards** — network, denomination and quantity picker, generated PINs,
  copy-all and native print output.
- **Offline awareness** — every screen shows a slim banner when the device loses
  connectivity, so actions that fail are not a mystery.
- **Support** — Help Hub guides, searchable FAQs with feedback, WhatsApp /
  phone links and a ticket creation flow.
- **Profile** — editable profile, balances and referral stats, light/dark theme,
  security settings (password, 2FA, biometrics), payment history, data usage,
  subscription management, referral sharing and logout.
- **Service flows** — data, airtime, cable TV, electricity, exam pins, wallet
  funding, transfers and recharge cards, each with details → PIN → success.

Purchases are intentionally mocked: the success flow and transaction history
work, but wallet balances are not debited. This keeps the prototype safe to
explore.

## Project layout

```
mobile/
├─ app.json                 # Expo config, splash screen, icons, Face ID copy
├─ assets/                  # Branded icon, adaptive icon and splash assets
└─ src/
   ├─ app/                  # Expo Router routes
   │  ├─ _layout.js         # Providers, fonts, splash gate, auth redirects
   │  ├─ login.js
   │  ├─ signup.js
   │  └─ (tabs)/            # Dashboard, transactions, print, support, profile
   ├─ components/           # Shared UI, wallet card, sheets, service flows
   ├─ context/              # Auth and toast providers
   ├─ data/                 # Demo users, plans, providers, FAQs
   ├─ theme/                # Colors, typography, theme provider
   └─ utils/                # Formatting and animation helpers
```

## Testing

```bash
npm test            # run once
npm run test:watch  # watch mode
npm run test:ci     # CI mode (non-interactive)
```

Unit tests cover the currency/date formatters and receipt HTML generation,
including escaping and PDF-share behaviour. CI (`.github/workflows/mobile.yml`)
runs lint, tests and a web bundle export on every push or PR that touches
`mobile/`.

## Builds & release

`eas.json` defines three profiles:

| Profile       | Use case                                         |
| ------------- | ------------------------------------------------ |
| `development` | Dev build with `expo-dev-client` (Face ID, etc.) |
| `preview`     | Internal installable build (APK on Android)      |
| `production`  | Store build, auto-incrementing version           |

```bash
npx eas-cli login
npx eas-cli init            # links the project, writes extra.eas.projectId
npm run build:preview       # internal build
npm run build:production    # store build
npx eas-cli submit --platform ios
npx eas-cli submit --platform android
```

EAS login, Apple/Google developer accounts and store listing assets are required
before these commands can run. `expo-dev-client` is installed, so
`npx expo run:ios` / `npx expo run:android` also produce a local development
build for testing native biometrics and printing.

## Next steps (backend wiring)

The app is a fully interactive demo backed by AsyncStorage. Production work
remaining:

- Replace AsyncStorage auth with token-based API sessions and refresh tokens.
- Wallet funding through Paystack, Flutterwave or Monnify checkout.
- Live VTU provider APIs for data, airtime and bills, with real wallet debits.
- Server-generated references and transaction status webhooks/polling.
- Push notifications (Expo Push Service) for purchase results.
- Remote crash reporting and analytics (Sentry, PostHog).
- App Store / Play Store listings, privacy policy and screenshots.

These require provider accounts, API credentials and a backend; none are
scaffolded here so the demo stays runnable without secrets.

## Notes

- Auth state, users, theme and transactions persist in AsyncStorage. Clear app
  storage to reset the demo.
- The app defaults to dark mode and remembers the user's choice. Native
  surfaces follow the in-app toggle through `Appearance.setColorScheme`.
- The existing web app at the repository root is untouched; this Expo project
  lives entirely in `mobile/`.
