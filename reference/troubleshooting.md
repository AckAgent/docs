# Troubleshooting

Common issues and solutions for AckAgent.

## Login Issues

### QR Code Won't Scan

**Symptoms:** App doesn't recognize the QR code

**Solutions:**

1. **Improve visibility**
    - Increase terminal window size
    - Increase font size
    - Ensure good lighting (avoid glare on screen)

2. **Terminal compatibility**
    - Try a different terminal app
    - Some terminals render block characters differently

3. **Camera issues**
    - Clean your phone camera lens
    - Hold steady, not too close

### Security Codes Don't Match

**Symptoms:** The SAS code on your phone differs from your computer

**This is a security feature.** Mismatched codes may indicate a man-in-the-middle attack.

**What to do:**

1. **Do not approve** the request on your phone
2. Cancel the login attempt
3. Try again on a different network (e.g., switch from public WiFi to mobile data)
4. If it persists, contact support

### "User not found" Error

**Symptoms:** Login fails with user not found message

**Solutions:**

1. Ensure you're using the same account on CLI and phone
2. Sign out of the app and sign in again
3. Try `ackagent login --force`

---

## Push Notification Issues

### Not Receiving Notifications

**Symptoms:** Phone doesn't alert for signing requests

**iOS:**

1. Settings → AckAgent → Notifications → Enable all
2. Settings → Focus → Check AckAgent isn't silenced
3. Force quit and reopen the app

**Android:**

1. Settings → Apps → AckAgent → Notifications → Enable
2. Battery → Don't optimize AckAgent
3. Check Do Not Disturb settings

### Delayed Notifications

**Solutions:**

1. Disable battery optimization for AckAgent
2. Ensure strong network connection on phone
3. Check that background app refresh is enabled

---

## Key Issues

### "No Keys Found"

**Symptoms:** Commands fail saying no keys are available

**Solutions:**

1. **Sync keys from phone:**
    ```bash
    ackagent keys --sync
    ```

2. **Check login status:**
    ```bash
    ackagent login --config
    ```

3. **Generate a key if needed:**
    ```bash
    ackagent gpg --generate-key --name "Name" --email "email@example.com"
    ```

### "Key not found" for Specific Operation

**Symptoms:** SSH or GPG command fails finding the key

**Solutions:**

1. List available keys:
    ```bash
    ackagent gpg -k        # For GPG
    ackagent ssh --list-keys  # For SSH
    ackagent keys          # All keys
    ```

2. Verify you're using the correct key ID or fingerprint

3. Check you're on the correct profile:
    ```bash
    ackagent profile show
    ```

---

## SSH Issues

### "Agent refused operation"

**Symptoms:** SSH fails with agent error

**Cause:** The SSH agent is conflicting with the PKCS#11 provider

**Solutions:**

1. Add `IdentitiesOnly yes` to your SSH config:
    ```
    Host example.com
        PKCS11Provider /usr/local/lib/libackagent-pkcs11.dylib
        IdentitiesOnly yes
    ```

2. Or unload agent keys temporarily:
    ```bash
    ssh-add -D
    ```

### "No PKCS#11 provider"

**Symptoms:** SSH can't find the PKCS#11 library

**Solutions:**

1. Verify library exists:
    ```bash
    ls /usr/local/lib/libackagent-pkcs11.dylib   # macOS
    ls /usr/local/lib/libackagent-pkcs11.so      # Linux
    ```

2. Reinstall CLI if missing:
    ```bash
    brew reinstall ackagent  # macOS
    ```

3. Check SSH config path is correct (use absolute path)

### Permission Denied

**Symptoms:** SSH connection rejected

**Solutions:**

1. Verify public key is on the server:
    ```bash
    ackagent ssh --key <name>  # Get public key
    # Add to server's ~/.ssh/authorized_keys
    ```

2. Check server accepts the key type (some old servers reject ECDSA)

3. Verify you approved the request on your phone (check it wasn't rejected/expired)

---

## GPG Issues

### Git Signing Fails

**Symptoms:** Git commit fails with GPG error

**Solutions:**

1. **Verify git config:**
    ```bash
    git config --global gpg.program
    # Should be: ackagent gpg
    ```

2. **Check signing key:**
    ```bash
    git config --global user.signingkey
    # Should match a key from: ackagent gpg -k
    ```

3. **Test signing directly:**
    ```bash
    echo "test" | ackagent gpg -s
    # Should prompt on your phone
    ```

### Signature Not Verified on GitHub

**Symptoms:** Commits don't show "Verified" badge

**Solutions:**

1. Export and upload your public key:
    ```bash
    ackagent gpg --export
    # Copy output to GitHub Settings → SSH and GPG keys → New GPG key
    ```

2. Ensure git email matches key email:
    ```bash
    git config --global user.email
    # Must match email in GPG key
    ```

---

## Timeout Issues

### "Request expired" / "Operation timed out"

**Symptoms:** Operations fail after 2 minutes

**Cause:** Approval wasn't received in time

**Solutions:**

1. Keep phone nearby when using AckAgent
2. Enable lock screen notifications
3. Ensure phone has network connectivity
4. Check the request wasn't silently rejected

---

## Profile Issues

### Wrong Profile Active

**Symptoms:** Using keys from wrong account

**Solutions:**

1. Check active profile:
    ```bash
    ackagent profile show
    ```

2. Switch profiles:
    ```bash
    ackagent profile use <correct-profile>
    ```

3. Or use `--profile` flag:
    ```bash
    ackagent gpg --profile work -k
    ```

---

## Debug Logging

Enable verbose output to diagnose issues:

```bash
# Set log level for a command
ackagent --log-level debug login

# Enable PKCS#11 debugging
export ACKAGENT_PKCS11_DEBUG=1
ssh -v user@host
```

---

## Reset Everything

If nothing else works, you can reset and start fresh:

```bash
# Remove all local configuration
rm -rf ~/.config/ackagent ~/.ackagent

# Log in again
ackagent login
```

On your phone:
1. Open AckAgent app
2. Settings → Account → Sign Out
3. Sign in again

> **Warning: This removes all local keys**
>
> You'll need to regenerate keys and reconfigure integrations (git, SSH, etc.).

---

## Getting Help

If these steps don't resolve your issue:

1. **GitHub Issues:** [Report a bug](https://github.com/ackagent/ackagent/issues)
2. **Debug info:** Run `ackagent login --config` and include the output (redact tokens)
3. **Logs:** Include relevant log output with `--log-level debug`
