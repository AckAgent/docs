# CLI Reference

Complete reference for all AckAgent CLI commands.

## Global Flags

These flags work with all commands:

| Flag | Environment Variable | Description |
|------|---------------------|-------------|
| `-c, --config-dir <path>` | `ACKAGENT_CONFIG_DIR` | Use alternative config directory |
| `-p, --profile <name>` | `ACKAGENT_PROFILE` | Use specified profile (overrides active) |
| `--org <identifier>` | `ACKAGENT_ORG` | Use specified organization (UUID, local name, or emoji words) |
| `--log-level <level>` | `ACKAGENT_LOG_LEVEL` | Set log level: debug, info, warn, error |
| `--ble-device <name>` | `ACKAGENT_BLE_DEVICE` | BLE device name or address for local transport |
| `--version` | | Show version information |
| `--help` | | Show help for command |

Environment variables provide defaults; flags take precedence.

## ackagent login

Authenticate and pair with your mobile device.

```bash
ackagent login [flags]
```

### Flags

| Flag | Description |
|------|-------------|
| `--config` | Show current login configuration |
| `--logout` | Log out and clear credentials |
| `--keys` | Show enrolled keys after login |
| `--force` | Force re-login even if already logged in |
| `--device-name <name>` | Set device name for this computer |
| `--profile <name>` | Create or use named profile |

### Advanced Flags

| Flag | Description |
|------|-------------|
| `--relay <url>` | Custom relay server URL |
| `--issuer <url>` | Custom OIDC issuer URL |
| `--sandbox` | Use sandbox environment |
| `--localdev` | Use local development servers |
| `--accept-software-approver-keys` | Accept software-backed keys from approver |

### Examples

```bash
# Standard login
ackagent login

# Check login status
ackagent login --config

# Log out
ackagent login --logout

# Create work profile
ackagent login --profile work

# Force re-login
ackagent login --force
```

---

## ackagent gpg

GPG-compatible signing and encryption.

```bash
ackagent gpg [flags] [file]
```

### Signing Flags

| Flag | Description |
|------|-------------|
| `-s, --sign` | Sign a message |
| `-b, --detach-sign` | Create detached signature |
| `-a, --armor` | ASCII armor output |
| `-u, --local-user <key>` | Use specified key for signing |
| `-o, --output <file>` | Write output to file |

### Key Management Flags

| Flag | Description |
|------|-------------|
| `-k, --list-keys` | List enrolled keys |
| `--export` | Export public key |
| `--generate-key` | Generate new GPG key |
| `--name <name>` | Name for generated key |
| `--email <email>` | Email for generated key |
| `-t, --type <algo>` | Algorithm: ecdsa (P-256), ed25519 |

### Encryption Flags

| Flag | Description |
|------|-------------|
| `-e, --encrypt` | Encrypt data |
| `-d, --decrypt` | Decrypt data |
| `-r, --recipient <key>` | Encrypt for recipient |

### Examples

```bash
# Generate a new key
ackagent gpg --generate-key --name "Alice" --email "alice@example.com"

# List keys
ackagent gpg -k

# Sign a file (detached, armored)
ackagent gpg -ba file.txt

# Export public key
ackagent gpg --export

# Verify (use standard gpg)
gpg --verify file.txt.asc file.txt
```

---

## ackagent ssh

SSH key management.

```bash
ackagent ssh [flags]
```

### Flags

| Flag | Description |
|------|-------------|
| `-g, --generate-key` | Generate new SSH key |
| `-l, --list-keys` | List enrolled SSH keys |
| `-k, --key <name>` | Export key by name or fingerprint |
| `-n, --name <name>` | Name for generated key |
| `-t, --type <algo>` | Algorithm: ecdsa, ed25519 |
| `-o, --output <file>` | Write public key to file |

### Examples

```bash
# Generate P-256 key (hardware-backed)
ackagent ssh --generate-key --type ecdsa --name "github"

# Generate Ed25519 key (software-backed)
ackagent ssh --generate-key --type ed25519 --name "backup"

# List keys
ackagent ssh --list-keys

# Get public key
ackagent ssh --key github

# Save public key to file
ackagent ssh --key github -o ~/.ssh/ackagent.pub
```

---

## ackagent age

Age encryption key management.

### ackagent age keygen

Generate a new Age identity.

```bash
ackagent age keygen
```

Creates an Age identity on your phone. The private key is stored on the device.

### ackagent age recipient

Print your Age recipient (public key).

```bash
ackagent age recipient
```

Output: `age1ackagent1...`

Share this with anyone who should encrypt files for you.

### ackagent age identity

Print your Age identity for decryption.

```bash
ackagent age identity [flags]
```

| Flag | Description |
|------|-------------|
| `--save` | Save identity to default file |

### Examples

```bash
# Generate identity
ackagent age keygen

# Get recipient for sharing
ackagent age recipient

# Decrypt a file
age -d -i <(ackagent age identity) secrets.age > secrets.txt

# Save identity to default location
ackagent age identity --save
```

---

## ackagent keys

View and manage enrolled signing keys.

```bash
ackagent keys [flags]
```

### Flags

| Flag | Description |
|------|-------------|
| `--sync` | Sync keys from mobile devices |

### Examples

```bash
# List all keys
ackagent keys

# Sync keys from phone
ackagent keys --sync
```

### Output

```
Enrolled Keys:
  SSH (hardware):
    github (ecdsa-sha2-nistp256)
      Fingerprint: SHA256:abc123...
      Device: iPhone 15 Pro   # or your Android device name

  GPG (hardware):
    Alice <alice@example.com>
      Key ID: ABC123DEF456

  Age (software):
    age1ackagent1qyza...
```

---

## ackagent profile

Manage configuration profiles.

### ackagent profile list

List all profiles.

```bash
ackagent profile list
```

Aliases: `ls`

### ackagent profile show

Show profile details.

```bash
ackagent profile show [name]
```

If no name provided, shows the active profile.

### ackagent profile use

Switch to a profile.

```bash
ackagent profile use <name>
```

Aliases: `switch`

### ackagent profile rename

Rename a profile.

```bash
ackagent profile rename <old> <new>
```

Aliases: `mv`

### ackagent profile delete

Delete a profile.

```bash
ackagent profile delete <name>
```

Aliases: `rm`

Requires confirmation unless `--force` is used.

### Examples

```bash
# List profiles
ackagent profile list

# Show current profile
ackagent profile show

# Switch to work profile
ackagent profile use work

# Rename profile
ackagent profile rename personal home

# Delete profile
ackagent profile delete old-profile
```

---

## ackagent hook

Application integration hooks.

### ackagent hook claude

Claude Code permission hook.

```bash
ackagent hook claude [flags]
```

| Flag | Description |
|------|-------------|
| `--configure` | Add hook to Claude Code config |

When run without flags, processes a permission request from stdin (used by Claude Code).

### Examples

```bash
# Configure hook
ackagent hook claude --configure

# Test hook manually
echo '{"tool":"Bash","input":{"command":"ls"}}' | ackagent hook claude
```

---

## ackagent org

Manage organizations.

```bash
ackagent org [subcommand]
```

When run without a subcommand, shows the currently active organization.

### ackagent org list

List all organizations.

```bash
ackagent org list
```

Aliases: `ls`

### ackagent org show

Show organization details.

```bash
ackagent org show [identifier]
```

If no identifier is provided, shows the active organization. The identifier can be a UUID, local name, or emoji words.

### ackagent org default

Set the default organization.

```bash
ackagent org default <identifier>
```

The identifier can be a UUID, local name, or emoji words.

### Examples

```bash
# Show active organization
ackagent org

# List all organizations
ackagent org list

# Show a specific organization
ackagent org show "my-org"

# Set default organization
ackagent org default "my-org"
```

---

## ackagent ble

Bluetooth Low Energy utilities for local transport.

```bash
ackagent ble [flags]
```

### ackagent ble list

List nearby AckAgent BLE devices.

```bash
ackagent ble list [flags]
```

| Flag | Description |
|------|-------------|
| `--timeout <duration>` | Scan timeout (e.g., 5s). Default: 3s |

Also available as `ackagent ble --list`.

### Examples

```bash
# List nearby BLE devices
ackagent ble list

# Scan with longer timeout
ackagent ble list --timeout 10s
```

---

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | General error |
| 2 | User rejected / blocked (Claude hook) |

---

## Configuration Files

Default location: `~/.config/ackagent/` or `~/.ackagent/`

| File | Purpose |
|------|---------|
| `config.json` | Global settings, active profile |
| `profiles/<name>.json` | Per-profile credentials and keys |

### config.json

```json
{
  "active_profile": "default",
  "log_level": "info"
}
```

### profiles/default.json

```json
{
  "user_id": "...",
  "access_token": "...",
  "refresh_token": "...",
  "identity_public_key": "...",
  "devices": [...]
}
```
