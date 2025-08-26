# Basic GTM Setup Example

Complete example of implementing Gubagoo and XTime tracking scripts in Google Tag Manager.

## 📋 Overview

This example shows the most common implementation: using Google Tag Manager to deploy tracking scripts across a dealership website with both Gubagoo payment calculators and XTime service scheduling.

## 🎯 What You'll Accomplish

- Deploy enhanced tracking for both Gubagoo and XTime widgets
- Capture comprehensive customer interaction data
- Set up proper triggers and variables in GTM
- Test and validate implementation

## 📁 File Structure

```
examples/basic-gtm-setup/
├── README.md                    # This file
├── gtm-container-export.json    # Complete GTM container setup
├── gubagoo-tag-config.json      # Gubagoo tag configuration
├── xtime-tag-config.json        # XTime tag configuration
└── testing-checklist.md         # Validation steps
```

## 🚀 Step-by-Step Implementation

### Step 1: Create GTM Tags

#### Gubagoo Enhanced Tracking Tag

1. **In GTM, create new Tag**:
   - Name: `Gubagoo Enhanced Tracking`
   - Type: `Custom HTML`

2. **Add the Script**:
```html
<!-- Gubagoo Enhanced Tracking -->
<script>
// Copy entire content from /scripts/gubagoo/enhanced-tracking.js
// Paste here between script tags
</script>
```

3. **Configure Triggering**:
   - Trigger: `All Pages` (or create custom trigger for Gubagoo pages)

#### XTime Message Tracking Tag

1. **In GTM, create new Tag**:
   - Name: `XTime Message Tracking`
   - Type: `Custom HTML`

2. **Add the Script**:
```html
<!-- XTime Message Tracking -->
<script>
// Copy entire content from /scripts/xtime/message-tracking.js
// Paste here between script tags
</script>
```

3. **Configure Triggering**:
   - Trigger: `All Pages` (or create custom trigger for service pages)

### Step 2: Create Custom Variables (Optional)

For easier event tracking, create these built-in variables:

#### Data Layer Variables:
- `gubagoo_vin` → `{{gubagoo_vin}}`
- `customer_email` → `{{customer_email}}`
- `vehicle_price` → `{{vehicle_price}}`
- `xtime_dealer_id` → `{{xtime_dealer_id}}`
- `xtime_appointment_id` → `{{xtime_appointment_id}}`

### Step 3: Set Up Custom Triggers

#### Gubagoo Events Trigger:
- **Trigger Name**: `Gubagoo Events`
- **Trigger Type**: `Custom Event`
- **Event Name**: `gubagoo_.*` (use regex matching)

#### XTime Events Trigger:
- **Trigger Name**: `XTime Events` 
- **Trigger Type**: `Custom Event`
- **Event Name**: `xtime_message`

### Step 4: Create Analytics Events (Optional)

#### Google Analytics 4 Events:

**Lead Generation Event**:
```javascript
// Tag Type: GA4 Event
// Event Name: generate_lead
// Parameters:
{
  'lead_source': '{{lead_source}}',
  'vehicle_category': '{{vehicle_category}}',
  'lead_value': {{lead_value}},
  'customer_zip': '{{customer_zip}}'
}
```

**Service Appointment Event**:
```javascript
// Tag Type: GA4 Event  
// Event Name: service_appointment
// Parameters:
{
  'dealer_id': '{{xtime_dealer_id}}',
  'appointment_step': '{{xtime_step}}',
  'source': 'xtime_widget'
}
```

## 🧪 Testing Your Implementation

### Using GTM Preview Mode

1. **Enable Preview Mode**:
   - Click `Preview` in GTM
   - Navigate to your website in the new tab

2. **Test Gubagoo Tracking**:
   - Go to vehicle detail page with payment calculator
   - Interact with the calculator widget
   - Fill out customer contact form
   - Check for these events in GTM Preview:
     - `gubagoo_calculator_loaded`
     - `gubagoo_calculator_started` 
     - `generate_lead`

3. **Test XTime Tracking**:
   - Navigate to service scheduling page
   - Interact with appointment booking widget
   - Progress through booking steps
   - Check for `xtime_message` events with step data

### Validation Checklist

- [ ] **Tags Fire Correctly**: Both scripts load without errors
- [ ] **Events Appear in DataLayer**: Check DataLayer tab in GTM Preview
- [ ] **Customer Data Captured**: Email, phone, VIN data populated
- [ ] **No JavaScript Errors**: Clean browser console
- [ ] **Mobile Compatibility**: Test on mobile devices

## 📊 Expected Data Flow

### Gubagoo Customer Journey:
1. **Page Load** → `gubagoo_calculator_loaded`
2. **Calculator Start** → `gubagoo_calculator_started`
3. **Contact Form** → `generate_lead` (with customer PII)
4. **Payment Selection** → `gubagoo_payment_selected`
5. **Completion** → `gubagoo_order_completed`

### XTime Appointment Flow:
1. **Widget Load** → `xtime_message` (initialization)
2. **Step Progression** → `xtime_message` (with step data)
3. **Form Completion** → `xtime_message` (with appointment details)

## 🔧 Common Customizations

### Different DataLayer Name
If your site uses a custom dataLayer name:

```javascript
// Replace in both scripts:
dataLayer.push(eventData);

// With:
window.yourCustomDataLayer.push(eventData);
```

### Event Name Prefixes
To avoid naming conflicts:

```javascript
// Change from:
'event': 'gubagoo_calculator_loaded'

// To:
'event': 'dealership_gubagoo_calculator_loaded'
```

### Additional Gubagoo Origins
If you use custom Gubagoo domains:

```javascript
// In gubagoo script, add to allowed origins check:
if (event.origin.includes('your-custom-gubagoo-domain.com')) {
  // Process event
}
```

## 🐛 Troubleshooting

### Scripts Not Firing
**Problem**: No events in GTM Preview
**Solutions**:
- Check that widgets are actually loading on test pages
- Verify GTM tag triggers are set correctly
- Look for JavaScript errors in browser console
- Ensure scripts are pasted correctly in Custom HTML tags

### Missing Customer Data
**Problem**: Events fire but customer data is empty
**Solutions**:
- Customer must complete contact forms for PII to be captured
- Check timing - some data only available after form submission
- Verify widget postMessage structure hasn't changed

### Events Firing Multiple Times
**Problem**: Duplicate events in dataLayer
**Solutions**:
- Scripts include basic deduplication
- Check for multiple instances of tracking tags
- Consider additional deduplication logic if needed

## 📈 Analytics Integration

### Google Analytics 4 Setup

1. **Create Custom Events** in GA4:
   - `generate_lead` (conversion event)
   - `service_appointment` (engagement event)
   - `payment_calculator_interaction` (engagement event)

2. **Set Up Conversions**:
   - Mark `generate_lead` as conversion
   - Configure conversion values using `lead_value` parameter

3. **Create Custom Dimensions**:
   - Customer ZIP code
   - Vehicle VIN
   - Lead source attribution

### Reporting Benefits

With this implementation, you'll be able to report on:
- **Lead Attribution**: Which marketing channels drive calculator usage
- **Customer Journey**: Path from browse → calculate → lead
- **Conversion Rates**: Calculator interactions to actual leads
- **Geographic Analysis**: Lead generation by customer location
- **Vehicle Interest**: Most popular vehicles and price ranges
- **Service Demand**: Appointment booking patterns and preferences

## 📞 Support

### Getting Help
- Review individual vendor READMEs in `/scripts/` folders
- Check main project documentation in `/documentation/`
- Open GitHub issues for bugs or questions
- Join community discussions for implementation advice

### Next Steps
- Review privacy compliance requirements
- Consider advanced customizations
- Explore additional vendor integrations
- Set up automated reporting dashboards

---

*This example provides a solid foundation for most dealership tracking needs. Customize based on your specific requirements and website platform.*