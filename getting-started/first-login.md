# First Login

This guide walks you through pairing your computer with your mobile device using SAS verification.

## What is SAS Verification?

SAS (Short Authentication String) verification proves that no one is intercepting your connection. Both your computer and phone independently compute a security code from the exchanged keys. If the codes match, you know the connection is secure.

## Login Process

### 1. Start Login

Run the login command:

```bash
ackagent login
```

You'll see a QR code in your terminal:

```
Scan this QR code with the AckAgent app:

    █▀▀▀▀▀█ ▄▄▄▄▄ █▀▀▀▀▀█
    █ ███ █ █▄▄▄█ █ ███ █
    █ ▀▀▀ █ ▀▀▀▀▀ █ ▀▀▀ █
    ▀▀▀▀▀▀▀ █ █ █ ▀▀▀▀▀▀▀
    ...

Waiting for device to scan...
```

### 2. Scan QR Code

Open the AckAgent app on your phone and scan the QR code:

1. Tap **Pair Device** or the **+** button
2. Point your camera at the QR code
3. The app will detect and process the code automatically

### 3. Verify Security Code

After scanning, both screens will show a security code:

**On your computer:**
```
Security code: dog-cat-moon-star-tree
Verify this matches your phone, then approve on your device.
```

**On your phone:**
The app shows the same code with icons.

> **Warning: Codes Must Match**
>
> If the codes don't match, **do not approve**. This could indicate a man-in-the-middle attack. Cancel and try again on a different network.

### 4. Approve on Phone

If the codes match:

1. Tap **Approve** on your phone
2. Authenticate with Face ID, Touch ID, or fingerprint
3. Your computer will confirm the pairing

```
Login successful!

You are now logged in with 1 device(s).
Synced 1 signing key(s) from your device(s).

Signing requests will be sent to all devices.
```

## Enrolled Keys

During login, a P-256 ECDSA signing key is automatically generated in your phone's secure hardware. This key is used for:

- Signing the pairing verification
- Future signing operations (SSH, GPG, etc.)

You can view your enrolled keys anytime:

```bash
ackagent keys
```

## Multiple Profiles

You can maintain separate configurations (e.g., personal and work):

```bash
# Create a work profile
ackagent login --profile work

# Switch between profiles
ackagent profile use personal
ackagent profile use work

# List all profiles
ackagent profile list
```

## Troubleshooting

### QR Code Not Scanning

- Ensure good lighting and a clear view of the QR code
- Try moving your phone closer or further from the screen
- Increase terminal font size or window size

### Codes Don't Match

This is a security feature. If codes don't match:

1. Cancel the login attempt
2. Check that you're not on a compromised network
3. Try again

### Push Notifications Not Arriving

Ensure notifications are enabled:

- **iOS**: Settings → AckAgent → Notifications → Allow Notifications
- **Android**: Settings → Apps → AckAgent → Notifications → Enable

## Next Steps

With login complete, you're ready to set up your first use case:

- [Git Commit Signing](../guides/git-signing.md) — Sign commits with GPG-compatible keys
- [SSH Keys](../guides/ssh-keys.md) — SSH with hardware-backed keys
- [Claude Code Approvals](../guides/claude-code.md) — Approve AI tool calls
- [Age + SOPS Encryption](../guides/age-sops.md) — Encrypt secrets
