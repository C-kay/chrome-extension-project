// background.js

// Define the endpoints you want to monitor
const monitoredEndpoints = [
  {
    id: "endpoint1",
    urlPattern: "dpd/v1/dpd/action/item/v1/list", // Adjust to match your desired URL substring
    headerKeys: ["X-B3-Traceid"]
  },
  {
    id: "endpoint2",
    urlPattern: "dpd/v1/dpd/payee/v3/list", // Adjust as needed
    headerKeys: ["X-B3-Traceid"]
  }
];

// Listen for response headers on all URLs.
chrome.webRequest.onHeadersReceived.addListener(
  (details) => {
    monitoredEndpoints.forEach((endpoint) => {
      if (details.url.includes(endpoint.urlPattern)) {
        const headersObj = {};
        endpoint.headerKeys.forEach((key) => {
          // Find the header value (case-insensitive)
          const header = details.responseHeaders.find(
            (h) => h.name.toLowerCase() === key.toLowerCase()
          );
          if (header) {
            headersObj[key] = header.value;
          }
        });
        // If any header was found and the request is associated with a tab, send the data
        if (Object.keys(headersObj).length > 0 && details.tabId >= 0) {
          chrome.tabs.sendMessage(details.tabId, {
            type: "headerUpdate",
            endpointId: endpoint.id,
            headers: headersObj
          });
        }
      }
    });
  },
  { urls: ["<all_urls>"] },
  ["responseHeaders"]
);