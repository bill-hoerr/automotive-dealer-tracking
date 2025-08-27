# CarNow Enhanced Tracking

Comprehensive tracking script for CarNow digital retail platforms that captures detailed customer interaction data, lead generation events, and complete digital retail journey analytics.

## 🎯 What This Script Captures

### Customer Lead Data
- Complete customer interaction information 
- Lead source attribution and entry points
- Digital retail session tracking

### Vehicle & Deal Information
- Complete vehicle details (VIN, make, model, year, trim, pricing)
- Monthly payment calculations and financing terms
- Trade-in valuations and vehicle information
- Deal progression and completion status

### Digital Retail Journey
- Session start and progression tracking
- Step-by-step completion monitoring
- Payment calculator interactions
- Chat and appointment scheduling events

## 📊 Events Pushed to dataLayer

| Event Name | Triggered When | Key Data |
|------------|----------------|----------|
| `carnow_iframe_loaded` | CarNow widget loads | Dealer ID, VIN, campaign data |
| `carnow_session_start` | Digital retail session begins | Session ID, vehicle info, entry point |
| `generate_lead` | Customer submits contact info | Full customer & vehicle data |
| `carnow_step_completed` | User progresses through steps | Step name, progress percentage |
| `carnow_payment_calculated` | Payment options calculated | Monthly payment, terms, trade value |
| `carnow_trade_valued` | Trade-in vehicle appraised | Trade value, vehicle details |
| `carnow_chat_started` | Customer initiates chat | Session ID, chat type |
| `carnow_appointment_scheduled` | Appointment booked | Appointment type and date |

## 🚀 Implementation

### Google Tag Manager
1. Create a new **Custom HTML Tag**
2. Copy the entire script from `enhanced-tracking.js`
3. Set trigger to **All Pages** (or pages with CarNow widgets)
4. Save and publish

### Manual Implementation
Add the script before your closing `</body>` tag:

```html
<!-- CarNow Enhanced Tracking -->
<script>
// Paste the enhanced-tracking.js content here
</script>
```

## 🔧 Configuration

### Debug Mode
Enable detailed console logging for troubleshooting:

```javascript
var CARNOW_CONFIG = {
    debug: true, // Enable debug logging
    preventDuplicateLeads: true,
    // ... other config options
};
```

### Duplicate Lead Prevention
The script prevents duplicate lead events within the same session using sessionStorage:

```javascript
var CARNOW_CONFIG = {
    debug: false,
    preventDuplicateLeads: true, // Set to false to allow duplicates
    sessionStorageKey: 'carnow_lead_fired'
};
```

### Custom Domains
Add additional CarNow domains if your implementation uses custom URLs:

```javascript
var CARNOW_CONFIG = {
    domains: [
        'carnow.com', 
        'app.carnow.com', 
        'static.app.carnow.com',
        'your-custom-carnow-domain.com' // Add custom domains
    ]
};
```

### Custom dataLayer Name
To use a different dataLayer name:

```javascript
// Replace 'dataLayer.push' throughout the script with:
window.yourCustomDataLayer = window.yourCustomDataLayer || [];
window.yourCustomDataLayer.push(eventData);
```

## 🧪 Testing

### GTM Preview Mode
1. Enable GTM Preview mode
2. Navigate to a page with CarNow digital retail widget
3. Interact with the DR tool (enter customer info, calculate payments)
4. Check the dataLayer tab for CarNow events

### Debug Console Output
Enable debug mode and check browser console for detailed logging:
```
[CarNow Tracking] CarNow iframe detected: https://app.carnow.com/...
[CarNow Tracking] Lead generation event detected: {customer: {...}, vehicle: {...}}
[CarNow Tracking] CarNow tracking initialized successfully
```

### Expected Event Flow
1. Widget loads → `carnow_iframe_loaded`
2. Customer starts DR → `carnow_session_start`
3. Customer enters contact info → `generate_lead`
4. Payment calculated → `carnow_payment_calculated`
5. Trade appraised → `carnow_trade_valued`
6. Appointment scheduled → `carnow_appointment_scheduled`

## 🔍 Data Fields Explained

### Lead Generation Event (`generate_lead`)
The comprehensive lead event includes:

**Customer Data:**
- `customer_first_name`, `customer_last_name`
- `customer_email`, `customer_phone`
- `customer_zip`, `customer_state`, `customer_city`
- `customer_credit_score`

**Vehicle Data:**
- `vehicle_vin`, `vehicle_year`, `vehicle_make`, `vehicle_model`
- `vehicle_trim`, `vehicle_style`, `vehicle_color`
- `vehicle_stock_number`, `vehicle_msrp`, `vehicle_price`
- `vehicle_mileage`, `vehicle_condition`

**Deal Data:**
- `monthly_payment`, `down_payment`, `trade_value`
- `finance_term`, `apr`

**Tracking Data:**
- `carnow_session_id`, `carnow_dealer_id`
- `lead_source`, `lead_value`, `vehicle_category`

## ⚖️ Privacy Considerations

This script captures comprehensive personally identifiable information (PII) including:
- Customer contact details and financial information
- Vehicle interests and purchase intent data
- Digital retail interaction patterns and preferences

**Requirements:**
- Ensure your privacy policy covers digital retail tracking
- Obtain appropriate customer consent for enhanced data collection
- Comply with GDPR, CCPA, and automotive industry privacy standards
- Only use on dealership websites you own/operate

## 🐛 Troubleshooting

### No Events Firing
- Verify CarNow digital retail widget is loading properly
- Check that widget domains match configured domains
- Enable debug mode to see console output
- Ensure GTM tag fires on pages with CarNow widgets

### Missing Lead Data
- Customer must complete contact information form for lead events
- Some vehicle data only available after DR session begins
- Check `carnow_postmessage` events for raw data structure
- Verify postMessage format hasn't changed in CarNow updates

### Duplicate Lead Prevention
- Script uses sessionStorage to prevent duplicate leads
- Duplicates are prevented within the same browser session
- Clear sessionStorage or disable prevention for testing
- Check session storage key: `carnow_lead_fired`

### Console Message Tracking
The script monitors console output for CarNow-related messages:
- Useful for debugging integration issues
- Tracks both log messages and errors
- Limited to 200 characters to prevent data overflow

## 📈 Analytics Integration

### Google Analytics 4
Create custom events based on CarNow digital retail interactions:

```javascript
// Lead generation event
gtag('event', 'generate_lead', {
  'lead_source': 'carnow',
  'vehicle_category': '{{vehicle_category}}',
  'lead_value': {{lead_value}},
  'monthly_payment': {{monthly_payment}}
});

// Digital retail progression
gtag('event', 'digital_retail_step', {
  'step_name': '{{carnow_step}}',
  'progress_percent': {{carnow_progress_percent}},
  'session_id': '{{carnow_session_id}}'
});
```

### Digital Retail KPIs
Track key digital retail metrics:
- DR session completion rates by step
- Average time spent in digital retail process  
- Payment calculation to lead conversion rates
- Trade-in utilization and average values
- Chat engagement and appointment booking rates

### Customer Journey Analysis
Use CarNow data to understand:
- Entry points that drive highest DR engagement
- Steps where customers typically drop off
- Vehicle categories with highest completion rates
- Impact of payment options on lead generation

## 🤝 Contributing

Found a bug or have improvements for CarNow tracking? Open a GitHub issue or submit a pull request!