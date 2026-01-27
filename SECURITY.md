# Security Policy

## Supported Versions

| Version | Supported |
| --- | --- |
| 1.0.0+ | ✅ Yes |
| < 1.0.0 | ❌ No |

## Reporting a Vulnerability

**Please do not open a public issue for security vulnerabilities.** Instead, please report security issues directly to the maintainers.

### How to Report

1. **Email**: Contact the maintainers with details of the vulnerability
2. **Include**:
   - Description of the vulnerability
   - Steps to reproduce (if applicable)
   - Potential impact
   - Your name/contact info

### What to Expect

- Acknowledgment within 24-48 hours
- Assessment and prioritization
- Timeline for fix (typically 30 days)
- Credit in release notes (optional, your choice)

## Security Considerations

### API Key Security

- **Storage**: API keys are stored in Chrome's encrypted local storage
- **Transmission**: Keys are sent only to official API endpoints over HTTPS
- **Exposure**: Keys are never logged or exposed in console
- **Best Practice**: Use environment-specific API keys with limited permissions

### Code Security

- All external dependencies are regularly updated
- No telemetry or data collection beyond what's necessary
- Text content is sent only to your chosen AI provider
- Extension uses Content Security Policy (CSP) headers

### User Privacy

- No tracking or analytics
- No user data collection
- Text is only sent to AI providers during refinement
- Original text always under user control

## Security Features

1. **Local Storage Only**: API keys stored in Chrome's encrypted storage
2. **HTTPS Only**: All API communications use HTTPS
3. **No Persistence**: Temporary data is cleared after use
4. **User Control**: Users control all settings and can disable at any time
5. **Open Source**: Code is publicly auditable

## Best Practices for Users

1. **API Key Management**
   - Use unique API keys for the extension
   - Regularly rotate API keys
   - Use keys with minimal required permissions

2. **Usage**
   - Don't refine sensitive information
   - Be aware of API provider privacy policies
   - Review AI provider terms of service

3. **Updates**
   - Keep the extension updated
   - Review changes in release notes
   - Report issues immediately

## Dependency Security

This extension has minimal dependencies:

- **Chrome APIs**: Built-in, managed by Chrome
- **No external CDNs**: All code is local
- **No npm dependencies**: Pure JavaScript

## Incident Response

In case of a security incident:

1. Vulnerability is assessed and confirmed
2. Fix is developed and tested
3. Security release is published
4. Users are notified
5. Incident details are documented

## Third-Party Services

This extension communicates with:

- **Google Gemini API** (optional)
- **OpenAI API** (optional)
- **Anthropic Claude API** (optional)
- **Custom Endpoints** (user-defined)

Please review the privacy policies of your chosen API provider.

## Compliance

- Complies with Chrome Web Store policies
- Adheres to data privacy regulations
- No data collection beyond extension functionality

## Questions?

If you have security-related questions, please contact the maintainers privately.

---

**Last Updated**: January 27, 2026
