# SSH Keys

Use AckAgent for SSH authentication and signing with biometric approval.

## Overview

AckAgent supports multiple SSH key configurations:

| Algorithm | Storage Options | Sync | Notes |
|-----------|-----------------|------|-------|
| P-256 ECDSA | Hardware | No | Maximum security, non-exportable |
| P-256 ECDSA | Software | Yes | Can sync across devices |
| Ed25519 | Software | Yes | Wide compatibility, can sync |

**Hardware keys** are stored in the Secure Enclave (iOS) or StrongBox (Android) and cannot be exported or synchronized between devices.

**Software keys** are stored encrypted with biometric protection and can optionally be synchronized across your Approver devices (including cross-platform iOS ↔ Android).

## Generate an SSH Key

### P-256 Key (Hardware-Backed)

```bash
ackagent ssh --generate-key --type ecdsa --name "github"
```

This creates a P-256 ECDSA key on your phone. P-256 keys can be stored in your phone's Secure Enclave (iOS) or StrongBox (Android) for hardware-backed security, or in software with optional cross-device sync. You choose the storage mode when you approve the key generation on your phone.

### Ed25519 Key (Software-Backed)

```bash
ackagent ssh --generate-key --type ed25519 --name "github"
```

Ed25519 keys are always software-backed (Secure Enclave and StrongBox only support P-256) and can be synced across your Approver devices.

## List SSH Keys

```bash
ackagent ssh --list-keys
```

Output:

```
SSH Keys:
  github (ecdsa-sha2-nistp256)
    Fingerprint: SHA256:abc123...
    Storage: hardware
    Created: 2024-01-15

  backup (ssh-ed25519)
    Fingerprint: SHA256:xyz789...
    Storage: software
    Created: 2024-01-15
```

## Get Public Key

Export a public key for adding to servers or GitHub:

```bash
ackagent ssh --key github
```

Output:

```
ecdsa-sha2-nistp256 AAAA... github
```

### Add to GitHub

1. Copy the public key output
2. Go to [GitHub SSH Keys](https://github.com/settings/keys)
3. Click "New SSH key"
4. Paste the key and save

### Add to Server

```bash
ackagent ssh --key github >> ~/.ssh/authorized_keys  # On the server
```

## Configure SSH Client

AckAgent provides shared library providers that work with the standard SSH client: a PKCS#11 provider for hardware P-256 keys and an OpenSSH Security Key provider for software Ed25519 and hardware P-256 keys.

### For Hardware Keys (P-256)

Add to `~/.ssh/config`:

=== "macOS"

    ```
    Host github.com
        PKCS11Provider /usr/local/lib/libackagent-pkcs11.dylib
        IdentitiesOnly yes

    Host *.example.com
        PKCS11Provider /usr/local/lib/libackagent-pkcs11.dylib
        IdentitiesOnly yes
    ```

=== "Linux"

    ```
    Host github.com
        PKCS11Provider /usr/local/lib/libackagent-pkcs11.so
        IdentitiesOnly yes

    Host *.example.com
        PKCS11Provider /usr/local/lib/libackagent-pkcs11.so
        IdentitiesOnly yes
    ```

### For Ed25519 Keys (Security Key Provider)

Add to `~/.ssh/config`:

=== "macOS"

    ```
    Host github.com
        PKCS11Provider /usr/local/lib/libackagent-sk.dylib
        IdentitiesOnly yes
    ```

=== "Linux"

    ```
    Host github.com
        PKCS11Provider /usr/local/lib/libackagent-sk.so
        IdentitiesOnly yes
    ```

### Mixed Configuration

You can use both providers for different hosts (shown for macOS; use `.so` on Linux):

```
# Hardware key for production
Host prod-*.example.com
    PKCS11Provider /usr/local/lib/libackagent-pkcs11.dylib
    IdentitiesOnly yes

# Software key for development
Host dev-*.example.com
    PKCS11Provider /usr/local/lib/libackagent-sk.dylib
    IdentitiesOnly yes
```

## Test Connection

```bash
ssh -T git@github.com
```

Your phone will show the SSH authentication request. Approve with biometrics.

```
Hi username! You've successfully authenticated, but GitHub does not provide shell access.
```

## SSH Signing (Git)

You can also use SSH keys to sign git commits:

```bash
# Configure git for SSH signing
git config --global gpg.format ssh
git config --global user.signingkey "key::ecdsa-sha2-nistp256 AAAA..."
git config --global commit.gpgsign true

# Set up allowed signers for verification
echo "you@example.com ecdsa-sha2-nistp256 AAAA..." >> ~/.ssh/allowed_signers
git config --global gpg.ssh.allowedSignersFile ~/.ssh/allowed_signers
```

## Troubleshooting

### "Agent refused operation"

The SSH agent might be interfering. Either:

1. Unload the agent: `ssh-add -D`
2. Or use `IdentitiesOnly yes` in your SSH config

### "No PKCS#11 provider found"

Ensure the provider library exists:

```bash
ls /usr/local/lib/libackagent-pkcs11.dylib   # macOS
ls /usr/local/lib/libackagent-pkcs11.so      # Linux
```

If not, reinstall the CLI.

### Key Not Listed

Sync your keys from your phone:

```bash
ackagent keys --sync
```

### Permission Denied

1. Verify the public key is added to the server/service
2. Check that you're using the correct PKCS#11 provider for your key type
3. Ensure you're logged in: `ackagent login --config`

## Security Considerations

- **Hardware keys** cannot be exported or synced—maximum security for high-value credentials
- **Software keys** can sync across devices but are still protected by biometric authentication
- Both key types require biometric approval for every use
- Keys are enrolled per-profile; use separate profiles for personal and work
- For critical infrastructure, prefer hardware P-256 keys
- For convenience and compatibility, software Ed25519 keys with sync are a good choice

## Next Steps

- [Claude Code Approvals](claude-code.md) — Approve AI tool calls
- [Age + SOPS Encryption](age-sops.md) — Encrypt secrets
