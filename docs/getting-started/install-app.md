# Install Mobile App

The AckAgent mobile app manages your signing keys and handles approval requests.

## iOS

### App Store

Download AckAgent from the [App Store](https://apps.apple.com/app/ackagent).

**Requirements:**

- iOS 18.6 or later
- iPhone with Secure Enclave

### TestFlight (Beta)

For early access to new features, join the [TestFlight beta](https://testflight.apple.com/join/ackagent).

## Android

### Google Play

Download AckAgent from the [Play Store](https://play.google.com/store/apps/details?id=dev.ackagent).

**Requirements:**

- Android 9 or later
- Device with StrongBox or TEE (most devices from 2018+)

## Initial App Setup

1. **Open the app** after installation
2. **Enable notifications** when prompted (required for approval requests)
3. **Set up biometrics** if not already configured on your device

The app will generate your device keys automatically. You'll complete account setup when you pair with a Requester using `ackagent login`.

!!! note "Biometric Authentication Required"
    AckAgent requires Face ID, Touch ID, or fingerprint authentication to be set up on your device. This ensures only you can approve signing requests.

## Key Storage

When you generate keys through AckAgent:

**Hardware keys (P-256):**

- **iOS**: Stored in the Secure Enclave—never leave the hardware
- **Android**: Stored in StrongBox (if available) or the Trusted Execution Environment

**Software keys (P-256 or Ed25519):**

- Stored encrypted in the device keychain with biometric protection
- Can optionally be synchronized across your devices (including iOS ↔ Android)
- Sync uses encrypted cloud storage, not iCloud Keychain, to maintain strict biometric requirements

## Next Steps

With both the CLI and app installed, you're ready to [log in and pair your devices](first-login.md).
