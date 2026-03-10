# Install CLI

The AckAgent CLI is available for macOS and Linux with multiple installation options.

## macOS

### Homebrew Cask (Recommended)

Install everything with a single notarized package:

```bash
brew install --cask ackagent/tap/ackagent
```

This installs all components to `/usr/local/`:
- `/usr/local/bin/ackagent` - Main CLI
- `/usr/local/bin/age-plugin-ackagent` - Age encryption plugin
- `/usr/local/lib/libackagent-sk.dylib` - OpenSSH Security Key provider (hardware P-256, software Ed25519)
- `/usr/local/lib/libackagent-pkcs11.dylib` - PKCS#11 provider (hardware P-256)

### Homebrew Formula (Selective Install)

Install only the components you need:

```bash
# All components
brew install ackagent/tap/ackagent

# Or install selectively — component formulas auto-install the CLI
brew install ackagent/tap/ackagent-cli               # CLI only
brew install ackagent/tap/ackagent-sk-provider       # SSH support (OpenSSH Security Key provider)
brew install ackagent/tap/ackagent-pkcs11            # SSH support (PKCS#11 provider, hardware P-256)
brew install ackagent/tap/ackagent-age-plugin        # Age encryption support
```

### Manual Installation

Download the `.pkg` installer from [GitHub Releases](https://github.com/ackagent/ackagent/releases) and run it.

## Linux

### Homebrew

```bash
# Install everything
brew install ackagent/tap/ackagent

# Or install selectively — component formulas auto-install the CLI
brew install ackagent/tap/ackagent-cli               # CLI only
brew install ackagent/tap/ackagent-sk-provider       # Add SSH support
```

### Debian/Ubuntu

Download `.deb` packages from [GitHub Releases](https://github.com/ackagent/ackagent/releases):

```bash
# Install everything
sudo dpkg -i ackagent_*.deb

# Or install selectively
sudo dpkg -i ackagent-cli_*.deb                # CLI only
sudo dpkg -i ackagent-sk-provider_*.deb        # Add SSH support (OpenSSH Security Key provider)
sudo dpkg -i ackagent-pkcs11_*.deb             # Add SSH support (PKCS#11 provider, hardware P-256)
sudo dpkg -i ackagent-age-plugin_*.deb         # Add Age encryption support
```

### Fedora/RHEL

Download `.rpm` packages from [GitHub Releases](https://github.com/ackagent/ackagent/releases):

```bash
# Install everything
sudo rpm -i ackagent-*.rpm

# Or install selectively
sudo rpm -i ackagent-cli-*.rpm
sudo rpm -i ackagent-sk-provider-*.rpm
```

### Tarball

For other distributions or manual installation:

```bash
# Download component tarballs from GitHub Releases
curl -fsSL https://github.com/ackagent/ackagent/releases/latest/download/ackagent-vX.Y.Z-linux-amd64.tar.gz | tar xz
sudo mv ackagent /usr/local/bin/

# Add SSH provider if needed
curl -fsSL https://github.com/ackagent/ackagent/releases/latest/download/ackagent-sk-provider-vX.Y.Z-linux-amd64.tar.gz | tar xz
sudo mv libackagent-sk.so /usr/local/lib/
sudo ldconfig
```

## Verify Installation

```bash
ackagent --version
```

## What's Installed

| Package | Contents | Use Case |
|---------|----------|----------|
| `ackagent-cli` | Main CLI binary | Login, GPG signing, key management |
| `ackagent-sk-provider` | `libackagent-sk.{dylib,so}` | OpenSSH Security Key SSH provider (hardware P-256, software Ed25519) |
| `ackagent-pkcs11` | `libackagent-pkcs11.{dylib,so}` | PKCS#11 SSH provider (hardware P-256 only) |
| `ackagent-age-plugin` | `age-plugin-ackagent` | Age/SOPS encryption |
| `ackagent` | Meta-package | All of the above |

## Next Steps

With the CLI installed, [install the mobile app](install-app.md) on your iPhone or Android device.
