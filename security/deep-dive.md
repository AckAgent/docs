# Cryptographic Deep Dive

This page details the cryptographic protocols and algorithms used by AckAgent.

## Key Types

AckAgent uses several categories of keys for different purposes.

### Device Keys

Each Approver device has four hardware-backed keys created during setup:

| Key | Algorithm | Purpose |
|-----|-----------|---------|
| **Device Attestation Key** | P-256 | App Attest / Play Integrity proof of genuine hardware |
| **Device Authentication Key** | P-256 | Login and session authentication |
| **Device Encryption Key** | P-256 | E2E encryption of requests and key synchronization |
| **Device Signing Key** | P-256 | General-purpose signing operations |

These keys are always hardware-backed (Secure Enclave / StrongBox) and never leave the device.

### Credential Keys

During setup, each device receives a BBS+ anonymous credential from the Credential Issuer service. This credential enables anonymous attestation of signing responses without revealing device identity.

| Key | Algorithm | Purpose |
|-----|-----------|---------|
| **Issuer Public Key** | BLS12-381 G2 (96 bytes) | Verifying anonymous attestation proofs |
| **Device Credential** | BBS+ BLS12-381-SHA-256 | Proving device genuineness without identification |

The credential encodes attestation type, device platform, issuance time, and expiry. During proof generation, only attestation type, device platform, and expiry are revealed — issuance time remains hidden to prevent timing-based correlation.

### User Signing Keys

You can generate signing keys for GPG, SSH, and Age encryption:

| Use Case | Algorithm | Storage Options |
|----------|-----------|-----------------|
| GPG | P-256 ECDSA | Hardware or Software |
| GPG | Ed25519 | Software only |
| SSH | P-256 ECDSA | Hardware or Software |
| SSH | Ed25519 | Software only |
| Age | X25519 | Software only |

**Hardware keys** are stored in the Secure Enclave (iOS) or StrongBox (Android) and cannot be exported or synchronized.

**Software keys** are stored encrypted in the device keychain with biometric protection. They can optionally be synchronized across devices (see Key Synchronization below).

### Why P-256 for Hardware Keys?

The Secure Enclave (iOS) and StrongBox (Android) only support P-256 (secp256r1). This is a deliberate hardware limitation—P-256 has well-understood security properties and efficient hardware implementations.

For SSH where Ed25519 is preferred, we offer software-backed keys with optional cross-device synchronization.

## Key Synchronization

Software keys can be synchronized between Approver devices, including cross-platform (iOS ↔ Android).

### Why Not iCloud Keychain?

iCloud Keychain is incompatible with the `biometryCurrentSet` access control restriction. This restriction ensures that:

- Keys become inaccessible if biometrics change (e.g., new fingerprint added)
- Keys require the *current* biometric enrollment, not just *any* valid biometric

We wanted to use `biometryCurrentSet` to leverage the OS-level biometric enforcement rather than implementing biometric checks manually in the app.

### How Synchronization Works

1. **Key creation**: Software keys are initially created with export permission
2. **Export and encrypt**: The key is exported, then encrypted to all known Device Encryption Keys
3. **Lock down**: The local key is converted to non-exportable with `biometryCurrentSet` restriction
4. **Sync via cloud storage**: The encrypted key blob is stored in iCloud (iOS) or Google Drive (Android)
5. **Import on other devices**: Other Approvers decrypt the blob with their Device Encryption Key and import locally

### Benefits

- **Cross-platform sync**: Works between iOS and Android devices
- **E2E encrypted**: Cloud storage only sees encrypted blobs
- **Biometric protection**: Local keys always require biometric authentication
- **Revocation**: Removing a device from your account prevents it from decrypting new keys

## End-to-End Encryption Protocol

### Key Exchange

Each signing request uses ephemeral ECDH for forward secrecy:

```
┌─────────────────────────────────────────────────────────────────┐
│ Request Encryption (CLI → Phone, multi-device wrapping)          │
├─────────────────────────────────────────────────────────────────┤
│ 1. CLI generates random 32-byte symmetric key                    │
│ 2. CLI encrypts: ciphertext = ChaCha20-Poly1305(symkey, payload) │
│    (request ID as AAD)                                           │
│ 3. For each device:                                              │
│    a. Generate fresh ephemeral P-256 keypair                     │
│    b. shared = ECDH(ephemeral_private, device_encryption_public) │
│    c. wrapping_key = HKDF(shared, salt=request_id,               │
│                           info="signer-wrap-v1")                 │
│    d. wrapped_key = ChaCha20-Poly1305(wrapping_key, symkey)      │
│ 4. Send ciphertext + all wrapped keys to relay                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Response Encryption (Phone → CLI)                                │
├─────────────────────────────────────────────────────────────────┤
│ 1. Phone generates ephemeral P-256 keypair                      │
│ 2. Phone computes: shared = ECDH(phone_ephemeral_private,       │
│                                   cli_ephemeral_public)         │
│ 3. Phone derives: key = HKDF(shared, salt=request_id,           │
│                              info="signer-response-v1")         │
│ 4. Phone encrypts: ciphertext = ChaCha20-Poly1305(key, sig)     │
└─────────────────────────────────────────────────────────────────┘
```

### Forward Secrecy

Because each request uses fresh ephemeral keys, compromising long-term identity keys does not reveal past requests or signatures. Each session has independent keying material.

## SAS (Short Authentication String)

SAS verification detects man-in-the-middle attacks during pairing.

### Computation

Both CLI and phone independently compute:

```
input = cli_public_key || sort(device_public_keys)
hash = SHA256(input)
sas_indices = hash[0:5]  # First 5 bytes
```

Each byte maps to a word/emoji from a 256-entry dictionary, producing a 5-word/emoji code.

### Why It Works

- The relay doesn't have either private key
- If the relay substitutes a different public key, the hash changes
- Both parties compute the same hash only if they have the genuine keys
- Visual comparison by the user catches any mismatch

### Dictionary

The SAS dictionary contains 256 entries, with each word semantically matching its corresponding emoji at the same index. Examples from the actual dictionary:

```
Words: dog, cat, mouse, rabbit, fox, bear, panda, tiger, lion, ...
       apple, pear, orange, lemon, banana, melon, grapes, cherry, ...
       sun, moon, star, rainbow, cloud, snowflake, fire, wave, ...
       castle, hammer, key, phone, laptop, camera, rocket, anchor, ...

Emoji: 🐶, 🐱, 🐭, 🐰, 🦊, 🐻, 🐼, 🐯, 🦁, ...
       🍎, 🍐, 🍊, 🍋, 🍌, 🍈, 🍇, 🍒, ...
       ☀️, 🌙, ⭐, 🌈, ☁️, ❄️, 🔥, 🌊, ...
       🏰, 🔨, 🔑, 📱, 💻, 📷, 🚀, ⚓, ...
```

### Security Properties

| Property | Value |
|----------|-------|
| Dictionary size | 256 entries |
| Bits per symbol | 8 bits (log₂ 256) |
| Symbols displayed | 5 |
| **Total entropy** | **40 bits** |

**What 40 bits means:**

- An attacker has a **1 in 1,099,511,627,776** chance of guessing the correct SAS
- To have a 50% chance of success, an attacker would need ~550 billion attempts
- Each attempt requires a full MITM setup and user interaction, making brute force infeasible

**Why 5 symbols is sufficient:**

- SAS verification is interactive—the user must visually compare both displays
- An attacker cannot retry; a single mismatch alerts the user to abort
- 40 bits exceeds the security of 4-digit PINs (13.3 bits) by a factor of ~8 million

**Dictionary design considerations:**

- Words are common, single-syllable or short for easy verbal comparison
- Emojis are visually distinct and universally recognized
- Word-emoji pairs are semantically matched (dog → 🐶) to aid memory
- No homophones or visually similar entries that could cause confusion

## Hardware Security

### iOS Secure Enclave

The Secure Enclave is a dedicated security coprocessor in Apple devices:

- **Isolated execution** — Runs separately from the main processor
- **Hardware key storage** — Keys generated inside, never exported
- **Biometric binding** — Keys require Face ID/Touch ID to use
- **App Attest** — Cryptographic proof of genuine Apple hardware

When you generate a key via AckAgent:

1. Key is generated inside the Secure Enclave
2. Public key is exported (this is safe)
3. Private key operations require the Secure Enclave + biometrics
4. The private key literally cannot be read by any software

### Android StrongBox

StrongBox is Android's equivalent:

- **Dedicated security chip** — Separate from main processor
- **Hardware-backed keystore** — Keys protected in hardware
- **Biometric authentication** — Required for key use
- **Key attestation** — Proof of hardware protection

Not all Android devices have StrongBox. Those that don't fall back to the Trusted Execution Environment (TEE), which provides similar but slightly weaker guarantees.

### Per-Organization Device Keys

When a device joins an organization, it generates a separate hardware-backed P-256 key specifically for that organization. This binding key serves as the per-org device identifier, preventing cross-organization device correlation — a device's binding key in Org A is cryptographically unrelated to its binding key in Org B.

## Response Attestation

Every signing response includes an anonymous attestation proof that proves it came from a genuine device without revealing *which* device.

### How It Works

Response attestation uses BBS+ selective disclosure on BLS12-381:

1. **Credential issuance** (during setup): The device obtains a BBS+ credential from the Credential Issuer, after proving device genuineness via identified attestation (App Attest / Play Integrity)
2. **Proof generation** (per response): The device creates a zero-knowledge proof that selectively discloses attestation type and device platform, while hiding device identity and issuance time
3. **Scope-bound pseudonym**: Each proof includes a pseudonym derived from the request ID, allowing repeat detection within a single request without linking across requests

Identified attestation (App Attest / Play Integrity) is only used during device enrollment. All signing responses use anonymous attestation.

### Privacy Properties

- **Unlinkability**: Responses from the same device to different requests cannot be correlated
- **Repeat detection**: Multiple responses to the *same* request from the same device share a pseudonym
- **No device identity**: The proof reveals device type (iOS/Android) and attestation level, but not which specific device. While the requester often knows the **user's identity** (e.g., for an organization-initiated request), it cannot identify the specific device used. This prevents organizations from correlating a user's activity across multiple organizations or third-party services.
- **Verifier-only**: Every anonymous attestation proof is transported **inside the E2E encrypted response blob**. Only the requesting CLI verifies the proof—the relay never sees it, ensuring the server cannot cryptographically link a response to a specific device.

### CLI-Side Verification

The CLI verifies each anonymous attestation by checking:

1. Pseudonym scope matches the request ID
2. Credential has not expired (with clock skew tolerance)
3. Attestation type meets the configured policy
4. BBS+ proof is valid against the issuer's public key

## Request Privacy

The relay sees only encrypted blobs and minimal metadata:

| Field | Visible to Relay | Purpose |
|-------|------------------|---------|
| Request ID | Yes | Routing |
| User ID | Yes | Push notification delivery |
| Request type hint | Yes | Push notification message |
| Expiry time | Yes | Garbage collection |
| Encrypted payload | No (encrypted) | Actual request |
| Encrypted response | No (encrypted) | Signature |

The relay cannot:

- Read what you're signing
- See the signature
- See whether a request was approved or rejected — it only tracks status as `pending`, `responded`, or `expired`
- Modify requests (would break encryption)
- Impersonate your phone (would fail SAS/authentication)

## Protocol Threat Model

| Attack | Mitigated By |
|--------|--------------|
| Relay reads requests | E2E encryption |
| Relay modifies requests | AEAD authentication |
| Relay substitutes keys | SAS verification |
| Replay attacks | Request IDs, expiry |
| Traffic analysis | Minimal metadata, encryption |
| Compromised CLI | Phone shows true request |
| Compromised relay | E2E encryption, SAS |

## Cryptographic Libraries

AckAgent uses standard, audited cryptographic implementations:

| Platform | Library |
|----------|---------|
| iOS | Apple CryptoKit, Security.framework |
| Android | Android Keystore, Tink |
| CLI (Go) | Go standard library crypto |
| BBS+ (all platforms) | zkryptium (Rust, via FFI) |

No custom cryptographic code—we use primitives as designed.

## Learn More

- [Security Overview](index.md) — High-level trust model
- [Privacy](privacy.md) — Data handling and collection
