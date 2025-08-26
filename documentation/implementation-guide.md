# Implementation Guide

Step-by-step guide for implementing enhanced tracking scripts for automotive dealership third-party widgets.

## ⚚️ Implementation Warning

Before deploying these scripts:
- Review your privacy policy with legal counsel
- Verify compliance with local privacy regulations
- Check current vendor terms of service
- Test thoroughly in non-production environment
- Document your implementation for compliance audits

## 🎯 Before You Start

### Prerequisites
- Access to Google Tag Manager (or similar tag management system)
- Admin access to your dealership website
- Basic understanding of JavaScript and web analytics

### Privacy Requirements
- Updated privacy policy covering enhanced tracking
- Customer consent mechanisms in place
- Compliance with GDPR, CCPA, and automotive industry standards

## 📋 Implementation Steps

### Step 1: Choose Your Vendor Scripts

Navigate to the appropriate script folder:
- **Gubagoo Payment Calculators**: `/scripts/gubagoo/`
- **XTime Service Scheduling**: `/scripts/xtime/`

### Step 2: Google Tag Manager Implementation

#### For Gubagoo Tracking:

1. **Create New Tag**
   - Tag Type: `Custom HTML`
   - Name: `Gubagoo Enhanced Tracking`

2. **Add Script Content**
   - Copy entire content from `scripts/gubagoo/enhanced-tracking.js`
   - Paste into HTML field

3. **Configure Trigger**
   - Trigger Type: `Page View`
   - Fire On: `All Pages` (or specific pages with Gubagoo widgets)

4. **Save and Test**
   - Use GTM Preview mode
   - Verify events appear in dataLayer

#### For XTime Tracking:

1. **Create New Tag**
   - Tag Type: `Custom HTML`
   - Name: `XTime Message Tracking`

2. **Add Script Content**
   - Copy entire content from `scripts/xtime/message-tracking.js`
   - Paste into HTML field

3. **Configure Trigger**
   - Trigger Type: `Page View`
   - Fire On: Pages with XTime widgets

4. **Save and Test**
   - Use GTM Preview mode
   - Check for `xtime_message` events

### Step 3: Manual Implementation (No GTM)

If not using Google Tag Manager:

```html
<!-- Add before closing </body> tag -->

<!-- Gubagoo Enhanced Tracking -->
<script>
// Paste gubagoo/enhanced-tracking.js content here
</script>

<!-- XTime Message Tracking -->
<script>
// Paste xtime/message-tracking.js content here  
</script>
```

### Step 4: Verify Implementation

#### Using GTM Preview Mode:
1. Enable Preview mode in GTM
2. Navigate to pages with widgets
3. Interact with payment calculators/schedulers
4. Check Tags, Triggers, Variables, and Data Layer tabs

#### Using Browser Console:
1. Open Developer Tools (F12)
2. Go to Console tab
3. Look for initialization messages:
   - `[GTM] Enhanced Gubagoo tracking initialized`
4. Check for any JavaScript errors

#### Expected Events:
- **Gubagoo**: `gubagoo_calculator_loaded`, `generate_lead`
- **XTime**: `xtime_message` with step progression

## 🔧 Configuration Options

### Custom Data Layer Names

If your site uses a different dataLayer name:

```javascript
// Replace this:
dataLayer.push(eventData);

// With this:
window.yourCustomDataLayer = window.yourCustomDataLayer || [];
window.yourCustomDataLayer.push(eventData);
```

### Event Name Prefixes

To avoid naming conflicts:

```javascript
// Change event names from:
'event': 'gubagoo_calculator_loaded'

// To your prefix:
'event': 'dealership_gubagoo_calculator_loaded'
```

### Origin Restrictions

For XTime, add your specific domains:

```javascript
var ALLOWED_ORIGINS = [
  "https://consumer8x5.xtime.com",
  "https://consumer.xtime.com",
  "https://your-custom-domain.xtime.com"
];
```

## 📊 Analytics Integration

### Google Analytics 4

Create custom events in GA4 based on captured data:

1. **Set Up Custom Events**:
   - Go to GA4 Admin > Events
   - Click "Create Event"
   - Use dataLayer variable names as parameters

2. **Example Event Configuration**:
```javascript
// Lead generation event
gtag('event', 'generate_lead', {
  'lead_source': '{{gubagoo_lead_source}}',
  'vehicle_vin': '{{vehicle_vin}}',
  'lead_value': {{lead_value}}
});
```

### Adobe Analytics

Configure processing rules to map dataLayer events:

1. Map `gubagoo_*` variables to eVars/props
2. Set up custom success events for lead generation
3. Create segments based on customer interaction patterns

## 🧪 Testing Checklist

### Gubagoo Testing:
- [ ] Calculator loads and fires `gubagoo_calculator_loaded`
- [ ] Customer form submission fires `generate_lead`
- [ ] Payment selection fires `gubagoo_payment_selected`
- [ ] All customer data fields populated correctly
- [ ] No JavaScript errors in console

### XTime Testing:
- [ ] Widget loads and fires `xtime_message`
- [ ] Appointment steps tracked correctly
- [ ] Dealer ID and appointment ID captured
- [ ] Promotional tracking works (if applicable)
- [ ] No duplicate events firing

## 🐛 Common Issues

### Scripts Not Firing
**Problem**: No events appearing in dataLayer
**Solution**: 
- Check GTM tag triggers
- Verify widgets are loading properly
- Look for JavaScript errors in console

### Missing Customer Data
**Problem**: Lead events fire but missing email/phone
**Solution**:
- Ensure customers complete contact forms
- Check timing of script execution
- Verify widget postMessage structure hasn't changed

### Duplicate Events
**Problem**: Same event firing multiple times
**Solution**:
- Scripts include basic deduplication
- Add additional deduplication logic if needed
- Check for multiple script instances

### Cross-Domain Issues
**Problem**: Events not capturing from widget iframes
**Solution**:
- Verify allowed origins configuration
- Check browser security settings
- Ensure widgets are from expected domains

## 📈 Performance Considerations

### Script Loading
- Scripts are lightweight and load asynchronously
- No impact on page load speeds
- Event listeners added after DOM ready

### Data Volume
- Events only fire during widget interactions
- Minimal data storage impact
- Consider data retention policies

## 🔐 Security & Privacy

### Data Handling
- Scripts only capture data from designated widget origins
- No sensitive data stored in scripts themselves
- All PII handling follows standard web practices

### Compliance Requirements
- Update privacy policy to cover enhanced tracking
- Implement cookie consent if required
- Document data processing activities
- Regular compliance audits recommended

## 📞 Support

### Troubleshooting Resources
- Check vendor-specific README files
- Review browser console for errors
- Use GTM Preview mode for debugging

### Community Support
- Open GitHub issues for bugs
- Submit feature requests
- Share implementation experiences

---

*Next: Review privacy compliance requirements in `PRIVACY-COMPLIANCE.md`*