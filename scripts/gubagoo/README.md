# Gubagoo Enhanced Tracking

Comprehensive tracking script for Gubagoo payment calculators that captures detailed customer interaction data and lead generation events.

## 🎯 What This Script Captures

### Customer Data
- Email addresses, phone numbers, names
- ZIP codes and state information
- Credit score data (when available)

### Vehicle Information
- VIN numbers, make, model, year, trim
- Pricing information (MSRP, sale price)
- Stock numbers and vehicle details

### Interaction Events
- Calculator initialization and loading
- Payment option selections
- Trade-in completions
- Lead generation moments
- Order completion events

## 📊 Events Pushed to dataLayer

| Event Name | Triggered When | Key Data |
|------------|----------------|----------|
| `gubagoo_calculator_loaded` | Calculator widget loads | VIN, entry source, account ID |
| `gubagoo_calculator_started` | User begins calculation | Vehicle info, entry point |
| `generate_lead` | Customer provides email/phone | Full customer & vehicle data |
| `gubagoo_payment_selected` | User selects payment option | Payment amount, session ID |
| `gubagoo_order_completed` | Transaction completed | Transaction ID, final details |
| `gubagoo_trade_completed` | Trade-in process finished | Trade vehicle details |

## 🚀 Implementation

### Google Tag Manager
1. Create a new **Custom HTML Tag**
2. Copy the entire script from `enhanced-tracking.js`
3. Set trigger to **All Pages** (or pages with Gubagoo widgets)
4. Save and publish

### Manual Implementation
Add the script before your closing `</body>` tag:

```html
<!-- Gubagoo Enhanced Tracking -->
<script>
// Paste the enhanced-tracking.js content here
</script>
```

## 🔧 Configuration

The script works out-of-the-box but can be customized:

### dataLayer Name
By default pushes to `dataLayer`. To use a different name:

```javascript
// Replace 'dataLayer.push' with your dataLayer name
window.yourDataLayer = window.yourDataLayer || [];
window.yourDataLayer.push(eventData);
```

### Event Prefix
Change the event prefix by modifying the event names:

```javascript
// Change from 'gubagoo_' to your preferred prefix
'event': 'your_prefix_calculator_loaded'
```

## 🧪 Testing

### GTM Preview Mode
1. Enable GTM Preview mode
2. Navigate to a page with Gubagoo widget
3. Interact with the payment calculator
4. Check the dataLayer tab for events

### Console Debugging
The script logs initialization status:
```
[GTM] Enhanced Gubagoo tracking initialized
```

### Expected Event Flow
1. Page loads → `gubagoo_calculator_loaded`
2. User starts calculation → `gubagoo_calculator_started`  
3. User provides contact info → `generate_lead`
4. User completes process → `gubagoo_order_completed`

## ⚖️ Privacy Considerations

This script captures personally identifiable information (PII) including:
- Customer email addresses and phone numbers
- Names and location data
- Financial information (credit scores)

**Requirements:**
- Ensure your privacy policy covers enhanced tracking
- Obtain appropriate customer consent
- Comply with GDPR, CCPA, and other applicable regulations
- Only use on websites where you own the customer relationship

## 🐛 Troubleshooting

### No Events Firing
- Check that Gubagoo widget is loading properly
- Verify GTM tag is firing on correct pages
- Check browser console for JavaScript errors

### Missing Customer Data
- Customer must provide email/phone for lead events
- Some data only available at specific interaction points
- Check the `gubagoo_postmessage` events for raw data

### Duplicate Events
- Script includes basic deduplication
- Multiple page loads may cause reinitialization
- Consider adding additional deduplication logic if needed

## 📈 Analytics Integration

### Google Analytics 4
Create custom events in GA4 based on dataLayer events:

```javascript
// Example GA4 event configuration
gtag('event', 'generate_lead', {
  'lead_source': 'gubagoo',
  'vehicle_category': '{{vehicle_category}}',
  'lead_value': {{lead_value}}
});
```

## 🤝 Contributing

Found a bug or have an improvement? Open an issue or submit a pull request!