// GTM Custom HTML Tag: Enhanced CarNow Event Tracking
// Trigger: All Pages

<script>
(function() {
'use strict';

// DISCLAIMER: This script is provided "as-is" for automotive dealerships
// to track their own customers. Ensure compliance with privacy laws and
// vendor terms of service before implementation.

// Configuration
var CARNOW_CONFIG = {
    debug: false, // Set to true for debugging
    preventDuplicateLeads: true,
    sessionStorageKey: 'carnow_lead_fired',
    domains: ['carnow.com', 'app.carnow.com', 'static.app.carnow.com']
};

// Debug logging function
function debugLog(message, data) {
    if (CARNOW_CONFIG.debug) {
        console.log('[CarNow Tracking]', message, data || '');
    }
}

// Check if lead already fired in this session
function hasLeadFiredThisSession() {
    if (!CARNOW_CONFIG.preventDuplicateLeads) return false;
    try {
        return sessionStorage.getItem(CARNOW_CONFIG.sessionStorageKey) === 'true';
    } catch (e) {
        return false;
    }
}

// Mark lead as fired in this session
function markLeadFired() {
    if (!CARNOW_CONFIG.preventDuplicateLeads) return;
    try {
        sessionStorage.setItem(CARNOW_CONFIG.sessionStorageKey, 'true');
    } catch (e) {
        debugLog('Could not set sessionStorage');
    }
}

// Check if URL contains CarNow domains
function isCarNowURL(url) {
    if (!url) return false;
    var i;
    for (i = 0; i < CARNOW_CONFIG.domains.length; i++) {
        if (url.indexOf(CARNOW_CONFIG.domains[i]) !== -1) {
            return true;
        }
    }
    return false;
}

// 1. Track CarNow iframe creation and loads
function trackCarNowIframes() {
    var observer = new MutationObserver(function(mutations) {
        var i, j;
        for (i = 0; i < mutations.length; i++) {
            var mutation = mutations[i];
            for (j = 0; j < mutation.addedNodes.length; j++) {
                var node = mutation.addedNodes[j];
                if (node.nodeType === 1 && node.tagName === 'IFRAME') {
                    var src = node.src || '';
                    if (isCarNowURL(src)) {
                        debugLog('CarNow iframe detected:', src);
                        
                        // Extract URL parameters
                        var urlParts = src.split('?');
                        var urlParams = new URLSearchParams(urlParts[1] || '');
                        
                        dataLayer.push({
                            'event': 'carnow_iframe_loaded',
                            'carnow_src': src,
                            'carnow_dealer_id': urlParams.get('dealer_id') || urlParams.get('dealerId'),
                            'carnow_vin': urlParams.get('vin'),
                            'carnow_vehicle_id': urlParams.get('vehicle_id') || urlParams.get('vehicleId'),
                            'carnow_source': urlParams.get('source') || urlParams.get('utm_source'),
                            'carnow_campaign': urlParams.get('campaign') || urlParams.get('utm_campaign'),
                            'carnow_entry_page': window.location.href
                        });
                    }
                }
            }
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Also check for existing iframes on page load
    var existingIframes = document.querySelectorAll('iframe');
    var i;
    for (i = 0; i < existingIframes.length; i++) {
        var iframe = existingIframes[i];
        var src = iframe.src || '';
        if (isCarNowURL(src)) {
            debugLog('Existing CarNow iframe found:', src);
            var urlParts = src.split('?');
            var urlParams = new URLSearchParams(urlParts[1] || '');
            
            dataLayer.push({
                'event': 'carnow_iframe_existing',
                'carnow_src': src,
                'carnow_dealer_id': urlParams.get('dealer_id') || urlParams.get('dealerId'),
                'carnow_vin': urlParams.get('vin'),
                'carnow_vehicle_id': urlParams.get('vehicle_id') || urlParams.get('vehicleId')
            });
        }
    }
}

// 2. Track network requests to CarNow APIs
function trackCarNowNetworkRequests() {
    if (window.fetch) {
        var originalFetch = window.fetch;
        window.fetch = function() {
            var url = arguments[0];
            var options = arguments[1] || {};
            
            if (typeof url === 'string' && isCarNowURL(url)) {
                debugLog('CarNow API call detected:', url);
                
                dataLayer.push({
                    'event': 'carnow_api_call',
                    'carnow_endpoint': url,
                    'carnow_method': options.method || 'GET'
                });
            }
            
            return originalFetch.apply(this, arguments);
        };
    }

    // Track XMLHttpRequest as well
    if (window.XMLHttpRequest) {
        var originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url) {
            if (typeof url === 'string' && isCarNowURL(url)) {
                debugLog('CarNow XHR call detected:', url);
                
                dataLayer.push({
                    'event': 'carnow_xhr_call',
                    'carnow_endpoint': url,
                    'carnow_method': method || 'GET'
                });
            }
            
            return originalOpen.apply(this, arguments);
        };
    }
}

// 3. Enhanced PostMessage Event Tracking - MAIN LEAD GENERATION LOGIC
function trackCarNowPostMessages() {
    window.addEventListener('message', function(event) {
        // Check if message is from CarNow domains
        if (!event.origin) return;
        
        var isFromCarNow = false;
        var i;
        for (i = 0; i < CARNOW_CONFIG.domains.length; i++) {
            if (event.origin.indexOf(CARNOW_CONFIG.domains[i]) !== -1) {
                isFromCarNow = true;
                break;
            }
        }
        
        if (!isFromCarNow) return;

        debugLog('CarNow postMessage received:', {
            origin: event.origin,
            data: event.data
        });

        var data = event.data;
        
        // Always push the raw postMessage data for debugging
        dataLayer.push({
            'event': 'carnow_postmessage',
            'carnow_message_data': data,
            'carnow_origin': event.origin
        });

        // ENHANCED LEAD GENERATION EVENT PROCESSING
        try {
            var messageData = typeof data === 'string' ? JSON.parse(data) : data;
            
            // 1. LEAD GENERATION - Customer Information Submitted
            if (messageData && (
                (messageData.type === 'new_chat_message' && messageData.message && messageData.message.customer) ||
                (messageData.type === 'lead_generated') ||
                (messageData.type === 'form_submit') ||
                (messageData.type === 'customer_info_submit') ||
                (messageData.event && messageData.event.indexOf('lead') !== -1) ||
                (messageData.action === 'submit' && messageData.customer) ||
                (messageData.customer && messageData.customer.email && messageData.customer.phone)
            )) {
                
                // Prevent duplicate leads
                if (hasLeadFiredThisSession()) {
                    debugLog('Duplicate lead prevented - already fired this session');
                    return;
                }

                var customer = messageData.customer || (messageData.data && messageData.data.customer) || (messageData.message && messageData.message.customer) || {};
                var vehicle = messageData.vehicle || (messageData.data && messageData.data.vehicle) || (messageData.message && messageData.message.inventory) || {};
                var dealInfo = messageData.deal || (messageData.data && messageData.data.deal) || {};
                
                debugLog('Lead generation event detected:', {
                    customer: customer,
                    vehicle: vehicle,
                    deal: dealInfo
                });

                // Mark lead as fired to prevent duplicates
                markLeadFired();

                // Push comprehensive lead data to GTM
                dataLayer.push({
                    'event': 'generate_lead',
                    'lead_type': 'digital_retail',
                    'lead_source': 'carnow',
                    'lead_source_detail': 'CarNow Digital Retail',
                    'vehicle_category': (vehicle.make && vehicle.model) ? vehicle.make + '_' + vehicle.model : 'unknown',
                    'lead_value': vehicle.price || vehicle.msrp || dealInfo.total || 0,
                    'currency': vehicle.currency || 'USD',
                    
                    // Customer Data
                    'customer_first_name': customer.first_name || customer.firstName || customer.fname,
                    'customer_last_name': customer.last_name || customer.lastName || customer.lname,
                    'customer_email': customer.email || customer.emailAddress,
                    'customer_phone': customer.phone || customer.phoneNumber || customer.mobile,
                    'customer_zip': customer.postal_code || customer.zipCode || customer.zip,
                    'customer_state': customer.state || customer.stateCode || customer.state_code,
                    'customer_city': customer.city,
                    'customer_credit_score': customer.creditScore || customer.credit_score,
                    
                    // Vehicle Data
                    'vehicle_vin': vehicle.vin || vehicle.VIN,
                    'vehicle_year': vehicle.year || vehicle.modelYear,
                    'vehicle_make': vehicle.make_name || vehicle.make || vehicle.brand,
                    'vehicle_model': vehicle.model_name || vehicle.model,
                    'vehicle_trim': vehicle.trim_name || vehicle.trim || vehicle.trimLevel,
                    'vehicle_style': vehicle.body_type || vehicle.style || vehicle.bodyStyle,
                    'vehicle_color': vehicle.exterior_color || vehicle.color || vehicle.exteriorColor,
                    'vehicle_stock_number': vehicle.stock_number || vehicle.stockNumber || vehicle.stock || vehicle.stockId,
                    'vehicle_msrp': vehicle.msrp || vehicle.MSRP,
                    'vehicle_price': vehicle.sticker_price || vehicle.price || vehicle.salePrice || vehicle.sellingPrice,
                    'vehicle_mileage': vehicle.mileage || vehicle.odometer,
                    'vehicle_condition': vehicle.condition || vehicle.type_text || vehicle.type,
                    
                    // Deal/Finance Data
                    'monthly_payment': dealInfo.monthlyPayment || dealInfo.payment || messageData.monthlyPayment,
                    'down_payment': dealInfo.downPayment || dealInfo.down || messageData.downPayment,
                    'trade_value': dealInfo.tradeValue || dealInfo.tradeAmount || messageData.tradeValue,
                    'finance_term': dealInfo.term || dealInfo.loanTerm || messageData.term,
                    'apr': dealInfo.apr || dealInfo.interestRate || messageData.apr,
                    
                    // Tracking Data
                    'carnow_session_id': messageData.sessionId || messageData.session || messageData.id,
                    'carnow_dealer_id': messageData.dealerId || messageData.dealer_id,
                    'carnow_timestamp': Date.now(),
                    'carnow_event_type': messageData.type || 'lead_generated'
                });
            }

            // 2. DIGITAL RETAIL SESSION START
            if (messageData.type === 'session_start' || 
                messageData.type === 'dr_start' || 
                messageData.event === 'digital_retail_start') {
                
                var vehicle = messageData.vehicle || (messageData.data && messageData.data.vehicle) || {};
                
                dataLayer.push({
                    'event': 'carnow_session_start',
                    'carnow_session_id': messageData.sessionId || messageData.session,
                    'carnow_dealer_id': messageData.dealerId || messageData.dealer_id,
                    'vehicle_vin': vehicle.vin,
                    'vehicle_make': vehicle.make,
                    'vehicle_model': vehicle.model,
                    'carnow_entry_point': messageData.entryPoint || 'unknown'
                });
            }

            // 3. STEP PROGRESSION TRACKING
            if (messageData.type === 'step_complete' || 
                messageData.type === 'progress_update' ||
                messageData.event === 'step_completed') {
                
                dataLayer.push({
                    'event': 'carnow_step_completed',
                    'carnow_step': messageData.step || messageData.currentStep,
                    'carnow_session_id': messageData.sessionId || messageData.session,
                    'carnow_progress_percent': messageData.progress || messageData.progressPercent
                });
            }

            // 4. PAYMENT CALCULATION
            if (messageData.type === 'payment_calculated' ||
                messageData.event === 'payment_update' ||
                (messageData.monthlyPayment && messageData.type === 'calculation')) {
                
                dataLayer.push({
                    'event': 'carnow_payment_calculated',
                    'monthly_payment': messageData.monthlyPayment || messageData.payment,
                    'down_payment': messageData.downPayment || messageData.down,
                    'trade_value': messageData.tradeValue || messageData.trade,
                    'finance_term': messageData.term || messageData.loanTerm,
                    'carnow_session_id': messageData.sessionId || messageData.session
                });
            }

            // 5. TRADE-IN VALUATION
            if (messageData.type === 'trade_valued' ||
                messageData.event === 'trade_valuation' ||
                (messageData.tradeValue && messageData.type === 'valuation')) {
                
                var tradeVehicle = messageData.tradeVehicle || messageData.trade || {};
                
                dataLayer.push({
                    'event': 'carnow_trade_valued',
                    'trade_value': messageData.tradeValue || messageData.value,
                    'trade_vin': tradeVehicle.vin,
                    'trade_year': tradeVehicle.year,
                    'trade_make': tradeVehicle.make,
                    'trade_model': tradeVehicle.model,
                    'trade_mileage': tradeVehicle.mileage,
                    'carnow_session_id': messageData.sessionId || messageData.session
                });
            }

            // 6. CHAT INITIATED
            if (messageData.type === 'chat_started' ||
                messageData.event === 'chat_init' ||
                messageData.action === 'chat_start') {
                
                dataLayer.push({
                    'event': 'carnow_chat_started',
                    'carnow_session_id': messageData.sessionId || messageData.session,
                    'carnow_chat_type': messageData.chatType || 'live_chat'
                });
            }

            // 7. APPOINTMENT SCHEDULED
            if (messageData.type === 'appointment_scheduled' ||
                messageData.event === 'appointment_booked') {
                
                dataLayer.push({
                    'event': 'carnow_appointment_scheduled',
                    'appointment_type': messageData.appointmentType || messageData.type,
                    'appointment_date': messageData.appointmentDate || messageData.date,
                    'carnow_session_id': messageData.sessionId || messageData.session
                });
            }

        } catch (e) {
            debugLog('Error processing CarNow postMessage:', e);
        }
    }, false);
}

// 4. Track console messages for additional insights
function trackCarNowConsoleMessages() {
    var originalLog = console.log;
    var originalError = console.error;

    console.log = function() {
        var message = Array.prototype.slice.call(arguments).join(' ');
        
        // Track CarNow-specific console messages
        if (message.indexOf('CarNow') !== -1 || message.indexOf('carnow') !== -1 || message.indexOf('Real-Time Retail') !== -1) {
            dataLayer.push({
                'event': 'carnow_console_message',
                'message_type': 'log',
                'message_content': message.substring(0, 200) // Limit length
            });
        }
        
        originalLog.apply(console, arguments);
    };

    console.error = function() {
        var message = Array.prototype.slice.call(arguments).join(' ');
        
        if (message.indexOf('CarNow') !== -1 || message.indexOf('carnow') !== -1) {
            dataLayer.push({
                'event': 'carnow_console_message',
                'message_type': 'error',
                'message_content': message.substring(0, 200)
            });
        }
        
        originalError.apply(console, arguments);
    };
}

// 5. Initialize all tracking methods
function initCarNowTracking() {
    try {
        debugLog('Initializing CarNow tracking...');
        
        trackCarNowIframes();
        trackCarNowNetworkRequests();
        trackCarNowPostMessages();
        trackCarNowConsoleMessages();
        
        // Track page load with CarNow context
        dataLayer.push({
            'event': 'carnow_tracking_initialized',
            'carnow_page_url': window.location.href,
            'carnow_referrer': document.referrer || 'direct',
            'carnow_timestamp': Date.now()
        });
        
        debugLog('CarNow tracking initialized successfully');
        
    } catch (e) {
        debugLog('CarNow tracking initialization error:', e);
        
        // Track initialization errors
        dataLayer.push({
            'event': 'carnow_tracking_error',
            'error_message': e.message || 'Unknown error',
            'error_type': 'initialization'
        });
    }
}

// Wait for page to load, then initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarNowTracking);
} else {
    initCarNowTracking();
}

})();
</script>