// GTM Custom HTML Tag: Enhanced Gubagoo Event Tracking
// Trigger: All Pages

<script>
(function() {
  'use strict';
  
  // 1. Track Gubagoo iframe loads
  function trackGubagooLoad() {
    // Listen for console messages (if accessible)
    var originalLog = console.log;
    console.log = function() {
      var message = Array.prototype.slice.call(arguments).join(' ');
      
      // Track CBO loader events
      if (message.includes('[cbo-loader]')) {
        var url = arguments[1] || '';
        var urlParams = new URLSearchParams(url.split('?')[1] || '');
        
        dataLayer.push({
          'event': 'gubagoo_calculator_loaded',
          'gubagoo_vin': urlParams.get('vin'),
          'gubagoo_flow': urlParams.get('flow'),
          'gubagoo_entry_button': decodeURIComponent(urlParams.get('entry_button') || ''),
          'gubagoo_entry_page': urlParams.get('entry_page'),
          'gubagoo_account_id': urlParams.get('account_id'),
          'gubagoo_visitor_uuid': urlParams.get('visitor_uuid')
        });
      }
      
      // Track Gubagoo mapping completion
      if (message.includes('Gubagoo mapping completed successfully')) {
        dataLayer.push({
          'event': 'gubagoo_mapping_completed',
          'gubagoo_status': 'success'
        });
      }
      
      // Track clicks within Gubagoo
      if (message === 'CLICKED' && arguments.callee.caller) {
        dataLayer.push({
          'event': 'gubagoo_interaction',
          'gubagoo_action': 'click',
          'gubagoo_timestamp': Date.now()
        });
      }
      
      originalLog.apply(console, arguments);
    };
  }
  
  // 2. Track iframe creation and URL changes
  function trackIframeChanges() {
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1 && node.tagName === 'IFRAME') {
            var src = node.src || '';
            if (src.includes('gubagoo.io')) {
              dataLayer.push({
                'event': 'gubagoo_iframe_created',
                'gubagoo_src': src
              });
            }
          }
        });
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  // 3. Track Segment analytics calls (if accessible)
  function trackSegmentEvents() {
    if (window.analytics && window.analytics.track) {
      var originalTrack = window.analytics.track;
      window.analytics.track = function(event, properties) {
        // Check if it's a Gubagoo-related event
        if (event && (event.includes('gubagoo') || event.includes('payment') || event.includes('calculator'))) {
          dataLayer.push({
            'event': 'gubagoo_segment_event',
            'segment_event_name': event,
            'segment_properties': properties || {}
          });
        }
        return originalTrack.apply(this, arguments);
      };
    }
  }
  
  // 4. Monitor for form submissions via network requests
  function trackNetworkRequests() {
    if (window.fetch) {
      var originalFetch = window.fetch;
      window.fetch = function() {
        var url = arguments[0];
        if (typeof url === 'string' && url.includes('gubagoo')) {
          dataLayer.push({
            'event': 'gubagoo_api_call',
            'gubagoo_endpoint': url,
            'gubagoo_method': (arguments[1] && arguments[1].method) || 'GET'
          });
        }
        return originalFetch.apply(this, arguments);
      };
    }
  }
  
  // 5. Track postMessage events (cross-domain communication) - ENHANCED
  function trackPostMessages() {
    window.addEventListener('message', function(event) {
      if (event.origin && event.origin.includes('gubagoo.io')) {
        var data = event.data;
        
        // Always push the raw postMessage data
        dataLayer.push({
          'event': 'gubagoo_postmessage',
          'gubagoo_message_data': data,
          'gubagoo_origin': event.origin
        });
        
        // ENHANCED: Process specific event types for lead generation
        
        // 1. INITIAL LOAD - cbo_initialize
        if (data && data.type === 'cbo_initialize') {
          var payload = data.payload || {};
          
          dataLayer.push({
            'event': 'gubagoo_calculator_started',
            'vehicle_vin': payload.vin,
            'entry_button': payload.entryButton,
            'entry_page': payload.entryPage,
            'entry_flow': payload.entryFlow,
            'gubagoo_account_id': payload.accountId,
            'gubagoo_visitor_id': payload.visitorId,
            'source': payload.source || 'Direct'
          });
        }
        
        // 2. LEAD GENERATION EVENT - Enhanced to capture customer data
        if (data && data.type === 'cbo_progress' && data.data && 
            data.data.customer && data.data.customer.email && 
            data.data.status === 'live') {
          
          var customer = data.data.customer;
          var vehicle = data.data.vehicle || {};
          
          dataLayer.push({
            'event': 'generate_lead',
            'lead_type': 'payment_calculator',
            'lead_source': 'gubagoo',
            'vehicle_category': vehicle.make + '_' + vehicle.model,
            'lead_value': vehicle.price || 0,
            'currency': vehicle.currency_code || 'USD',
            
            // Customer Data
            'customer_zip': customer.zip,
            'customer_state': customer.state_code,
            'customer_first_name': customer.first_name,
            'customer_last_name': customer.last_name,
            'customer_email': customer.email,
            'customer_phone': customer.phone,
            'customer_credit_score': customer.credit_score,
            'customer_credit_verified': customer.credit_score_verified,
            
            // Vehicle Data
            'vehicle_vin': vehicle.vin,
            'vehicle_year': vehicle.year,
            'vehicle_make': vehicle.make,
            'vehicle_model': vehicle.model,
            'vehicle_trim': vehicle.trim,
            'vehicle_type': vehicle.type,
            'vehicle_color': vehicle.color,
            'vehicle_stock_number': vehicle.stock_number,
            'vehicle_msrp': vehicle.msrp,
            'vehicle_price': vehicle.price
          });
        }
        
        // 3. ORDER COMPLETED EVENT
        if (data && data.type === 'cbo_progress' && data.data && 
            data.data.progress === 'complete' && data.data.status === 'completed') {
          
          var customer = data.data.customer || {};
          var vehicle = data.data.vehicle || {};
          
          dataLayer.push({
            'event': 'gubagoo_order_completed',
            'transaction_id': data.data.uuid,
            'vehicle_vin': vehicle.vin,
            'vehicle_price': vehicle.price,
            'customer_zip': customer.zip,
            'lead_value': vehicle.price,
            'conversion_status': data.data.status
          });
        }
        
        // 4. PAYMENT SELECTION
        if (data && data.type === 'SDA_PagePublishHistoryUpdated' && 
            data.data && data.data.interactionButtonText && 
            data.data.interactionButtonText.includes('/mo')) {
          
          dataLayer.push({
            'event': 'gubagoo_payment_selected',
            'payment_amount': data.data.interactionButtonText,
            'interaction_type': 'payment_option_click',
            'gubagoo_session_id': data.data.sessionId
          });
        }
        
        // 5. TRADE-IN COMPLETION
        if (data && data.type === 'SDA_PagePublishHistoryUpdated' && 
            data.data && data.data.eventCategory === 'drTradeInFinish') {
          
          var props = data.data.props || {};
          
          dataLayer.push({
            'event': 'gubagoo_trade_completed',
            'deal_type': props['digret/dealtype'],
            'vehicle_vin': props['digret/vehiclevin'],
            'vehicle_make': props['digret/vehiclemake'],
            'vehicle_model': props['digret/vehiclemodel'],
            'price_unlocked': props['digret/priceunlocked']
          });
        }
      }
    }, false);
  }
  
  // Initialize all tracking methods
  function initGubagooTracking() {
    try {
      trackGubagooLoad();
      trackIframeChanges();
      trackSegmentEvents();
      trackNetworkRequests();
      trackPostMessages();
      
      console.log('[GTM] Enhanced Gubagoo tracking initialized');
    } catch (e) {
      console.log('[GTM] Gubagoo tracking initialization error:', e);
    }
  }
  
  // Wait for page to load, then initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGubagooTracking);
  } else {
    initGubagooTracking();
  }
  
})();
</script>