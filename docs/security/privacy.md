# Privacy

This page explains what data AckAgent collects, stores, and processes.

## Design Principle: Server Blindness

AckAgent is designed so the server knows as little as possible about your activity. The relay service is "blind"—it transports encrypted data without the ability to read it.

## What the Server Sees

### Account Information

When you sign up:

| Data | Purpose | Stored |
|------|---------|--------|
| User ID | Randomly generated account identifier | Yes |
| Device names | Display to you | Yes |
| Push notification tokens | Delivery | Yes |

We do not collect email addresses or other personal identifiers. Your account is identified only by a randomly generated UUID.

### Request Metadata

When you make a signing request:

| Data | Purpose | Stored |
|------|---------|--------|
| User ID | Routing | Temporarily |
| Request ID | Correlation | Temporarily |
| Request type (hint) | Push notification text | Temporarily |
| Expiry time | Cleanup | Temporarily |
| Timestamp | Debugging | Temporarily |
| IP address | Displayed to Approver as "verified by relay" | Temporarily |

Requests are deleted after expiry or response (whichever is first). Typical retention is less than 5 minutes. The relay tracks request status as `pending`, `responded`, or `expired` — it never knows whether a request was approved or rejected.

The IP address is captured by the relay and included in the request metadata sent to the Approver. This appears in the mobile app as "verified by relay" context, helping you identify where requests originated.

### What the Server Never Sees

| Data | Why Not |
|------|---------|
| What you're signing | E2E encrypted |
| Your signatures | E2E encrypted |
| Git commit messages | E2E encrypted |
| SSH session data | E2E encrypted |
| Private keys | Never leave device |
| Which device approved | BBS+ anonymous attestation reveals only device properties (e.g., hardware-backed) to the requester, not the specific device identity. While the server knows the user's account for routing, it cannot cryptographically correlate specific devices or track activity across organizations. |

## Local Data Storage

### Requester (CLI)

Stored in `~/.config/ackagent/` or `~/.ackagent/`:

| File | Contents |
|------|----------|
| `config.json` | Active profile, settings |
| `profiles/*.json` | Per-profile login state, tokens |
| `keys/` | Public keys (cached from Approver) |

**No private keys are stored on your computer.**

### Approver (Mobile App)

| Data | Storage |
|------|---------|
| Private keys | Secure Enclave / StrongBox (hardware) |
| Encrypted keys | Keychain / Keystore (software keys) |
| Login tokens | Secure storage |
| Push token | Secure storage |

## Data Retention

### Server-Side

| Data | Retention |
|------|-----------|
| Account info | Until account deletion |
| Device registrations | Until removed by user |
| Signing requests | Until responded or expired (max 5 min) |
| Push tokens | Until device unregistered |

### Logs

Server logs may contain:

- Request IDs (UUIDs)
- Timestamps
- IP addresses
- Error messages

Logs never contain request content (which is encrypted).

## Third-Party Services

### Push Notifications

| Platform | Provider | Data Sent |
|----------|----------|-----------|
| iOS | Apple Push Notification service (APNs) | Device token, encrypted payload |
| Android | Firebase Cloud Messaging (FCM) | Device token, encrypted payload |

Push payloads are encrypted. Apple and Google cannot read the content of your signing requests.

### Authentication

AckAgent uses its own OIDC provider for authentication. Users authenticate using their Approver's device authentication key—there is no username/password or third-party OAuth (no Sign in with Apple/Google).

This means:

- No email address is required or collected
- Authentication is cryptographic, not credential-based
- Your identity is tied to your device's hardware-backed key

### Response Attestation

Signing responses are attested using BBS+ anonymous credentials. This means:

- The server cannot correlate which device handled which request
- Responses from the same device to different requests are unlinkable
- Only the requesting CLI verifies the attestation proof, inside the E2E encrypted blob
- The proof reveals device type (iOS/Android) and attestation level, but not device identity

For protocol details, see the [Cryptographic Deep Dive](deep-dive.md#response-attestation).

## Delete Your Data

To delete your account and all associated server-side data:

1. Open the AckAgent mobile app
2. Go to Settings → Account
3. Tap "Delete Account"

This removes all server-side data associated with your account, including device registrations and push tokens.

To remove a specific device without deleting your account:

1. Open the AckAgent mobile app
2. Go to Settings → Devices
3. Tap the device and select "Remove"

## Telemetry

AckAgent does not collect telemetry or analytics. We don't track:

- Feature usage
- Error reports (unless you explicitly submit them)
- Performance metrics

The only data we receive is what's necessary to route your encrypted requests.

## Contact

For privacy concerns or data requests:

- Email: privacy@ackagent.com

## Learn More

- [Security Overview](index.md) — Trust model and security properties
- [Cryptographic Deep Dive](deep-dive.md) — Protocol details
