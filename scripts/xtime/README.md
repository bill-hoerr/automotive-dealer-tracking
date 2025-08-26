# XTime Message Tracking

Enhanced tracking script for XTime service scheduling widgets that captures postMessage communications and appointment booking data.

## 🎯 What This Script Captures

### Appointment Data
- Dealer ID and location information
- Appointment IDs and scheduling steps
- Promotional campaign tracking
- Click tracking integration (Dotomi, Cobalt)

### User Interactions
- Widget initialization and loading
- Step-by-step appointment booking flow
- Form completion and submission events
- Cross-domain communication data

## 📊 Events Pushed to dataLayer

| Event Name | Triggered When | Key Data |
|------------|----------------|----------|
| `xtime_message` | Any XTime postMessage received | Origin, raw message data |
| `xtime_step` | User progresses through booking | Current step in appointment flow |
| `xtime_dealer_id` | Widget loads with dealer context | Dealer identification |
| `xtime_appointment_id` | Appointment created/updated | Unique appointment identifier |
| `xtime_promo_id` | Promotional tracking active | Campaign/promotion identifier |

## 🚀 Implementation

### Google Tag Manager
1. Create a new **Custom HTML Tag**
2. Copy the entire script from `message-tracking.js`
3. Set trigger to **All Pages** (or pages with XTime widgets)
4. Save and publish

### Manual Implementation
Add the script before your closing `</body>` tag:

```html
<!-- XTime Message Tracking -->
<script>
// Paste the message-tracking.js content here
</script>
🔧 Configuration
Adding Additional Origins
If you use different XTime domains, add them to the allowed origins:
javascriptvar ALLOWED_ORIGINS = [
  "https://consumer8x5.xtime.com",
  "https://consumer.xtime.com",
  "https://your-custom-xtime-domain.com" // Add your domain
];
Custom Data Layer Name
To use a different dataLayer name:
javascript// Replace this line:
window.dataLayer = window.dataLayer || [];
window.dataLayer.push(data);

// With your custom name:
window.yourDataLayer = window.yourDataLayer || [];
window.yourDataLayer.push(data);
Disable Deduplication
To receive all messages (including duplicates):
javascript// Comment out or remove these lines:
var tryHash = hash(JSON.stringify(data));
if (tryHash === lastPayloadHash) return;
lastPayloadHash = tryHash;
🧪 Testing
GTM Preview Mode

Enable GTM Preview mode
Navigate to a page with XTime widget
Interact with the service scheduler
Check the dataLayer tab for xtime_message events

Console Debugging
Check browser console for any JavaScript errors. The script runs silently but will show errors if XTime integration fails.
Expected Data Structure
javascript{
  event: "xtime_message",
  xtime_origin: "https://consumer.xtime.com",
  xtime_clickTracker: "dotomi",
  xtime_step: "vehicle-selection",
  xtime_dealer_id: "12345",
  xtime_params: { /* full raw parameters */ }
}
🔍 Data Fields Explained
Core Fields

xtime_origin: Source domain of the message
xtime_clickTracker: Attribution tracking system (dotomi/cobalt)
xtime_params: Complete raw message data for debugging

Appointment Flow Fields

xtime_step: Current step in booking process
xtime_dealer_id: Dealer location identifier
xtime_appointment_id: Unique appointment reference
xtime_promo_id: Active promotional campaign

⚖️ Privacy Considerations
This script captures service appointment data which may include:

Customer scheduling preferences
Vehicle service information
Dealer location data

Requirements:

Ensure privacy policy covers service scheduling tracking
Obtain customer consent for enhanced tracking
Comply with automotive industry privacy standards
Only use on dealership websites you own/operate

🐛 Troubleshooting
No Events Firing

Verify XTime widget is properly loaded
Check that widget origin matches allowed origins
Ensure GTM tag fires on pages with XTime widgets
Check browser console for JavaScript errors

Missing Data Fields

Some fields only populate at specific booking steps
Check xtime_params for complete raw data
XTime may use different field names across versions

Duplicate Messages

Script includes built-in deduplication
Some XTime widgets may send rapid repeated messages
Consider adjusting deduplication sensitivity if needed

📈 Analytics Integration
Google Analytics 4
Create custom events based on XTime interactions:
javascript// Example: Track appointment booking steps
gtag('event', 'appointment_step', {
  'step_name': '{{xtime_step}}',
  'dealer_id': '{{xtime_dealer_id}}',
  'appointment_source': 'xtime_widget'
});
Service Department KPIs
Track key service metrics:

Appointment booking conversion rates
Most popular service time slots
Promotional campaign effectiveness
Customer journey drop-off points

🤝 Contributing
Have improvements or found issues? Open a GitHub issue or submit a pull request!
