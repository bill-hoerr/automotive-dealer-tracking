// DISCLAIMER: This script is provided "as-is" for automotive dealerships
// to track their own customers. Ensure compliance with privacy laws and
// vendor terms of service before implementation.
// XTime Enhanced Message Tracking Script
// Captures postMessage communications from XTime service scheduling widgets

<script>
(function() {
  // Allow only known xtime consumer hosts
  var ALLOWED_ORIGINS = [
    "https://consumer8x5.xtime.com",
    "https://consumer.xtime.com" // add others if relevant
  ];
  
  function isAllowedOrigin(origin) {
    try {
      return ALLOWED_ORIGINS.indexOf(origin) !== -1 ||
             (/^https:\/\/consumer[0-9a-z\-]*\.xtime\.com$/i).test(new URL(origin).origin);
    } catch(e) { return false; }
  }
  
  // Optional de-dupe (some widgets post the same payload repeatedly)
  var lastPayloadHash = "";
  
  function hash(s) {
    var h = 0, i, chr;
    if (!s || !s.length) return h;
    for (i = 0; i < s.length; i++) {
      chr = s.charCodeAt(i);
      h = ((h << 5) - h) + chr;
      h |= 0;
    }
    return h.toString();
  }
  
  window.addEventListener("message", function(ev) {
    if (!isAllowedOrigin(ev.origin)) return;
    
    // Expecting shapes like:
    // { clickTracker: "dotomi" | "cobalt", params: {...} }   <-- from your snippet
    // But we'll gracefully handle other structures, too.
    var payload = ev.data || {};
    var data = {};
    
    // Normalize into a consistent structure
    data.event = "xtime_message";
    data["xtime_origin"] = ev.origin;
    
    if (typeof payload === "object") {
      if (payload.clickTracker) data["xtime_clickTracker"] = payload.clickTracker;
      
      if (payload.params && typeof payload.params === "object") {
        // Flatten a subset of known fields that tend to be useful
        var p = payload.params;
        if (p.step) data["xtime_step"] = p.step;
        if (p.dealer_id) data["xtime_dealer_id"] = p.dealer_id;
        if (p.promo_id) data["xtime_promo_id"] = p.promo_id;
        if (p.appointment_id) data["xtime_appointment_id"] = p.appointment_id;
        
        // Keep a raw copy for inspection/debugging
        data["xtime_params"] = p;
      } else {
        data["xtime_params"] = payload;
      }
    } else {
      // Non-object payloads: store raw
      data["xtime_raw"] = String(payload);
    }
    
    // Build a stable hash for de-duping
    var tryHash = hash(JSON.stringify(data));
    if (tryHash === lastPayloadHash) return;
    lastPayloadHash = tryHash;
    
    // Push to dataLayer
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(data);
    
  }, false);
})();
</script>