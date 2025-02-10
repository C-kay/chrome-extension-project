# TraceID Header Viewer

![image](https://github.com/user-attachments/assets/fcbabe4c-f260-4675-96c5-1232b10d182e)


TraceID Header Viewer is a Chrome extension designed to monitor network responses and display specific header attributes (specifically, the `X-B3-Traceid`) from defined endpoints. The extension displays this information in a draggable, resizable panel on the page. The panel can be closed by the user, and it will remain closed on subsequent page reloads until reopened via the popup.

## Features

- **Real-Time Header Monitoring:**  
  Observes network responses on specified endpoints and displays header values in real time.

- **Draggable & Resizable Panel:**  
  The floating panel can be moved and resized for optimal positioning.

- **Persistent Close State:**  
  If the user closes the panel, it remains closed on page reloads until manually reopened.

- **Popup for Reopening the Panel:**  
  Provides a simple popup interface with a button to reinitialize the panel when needed.

- **Manifest V3 Compliance:**  
  Built using Manifest V3 features, including a service worker background script and a unified action API.

## Folder Structure

![image](https://github.com/user-attachments/assets/ad130096-6163-463d-b339-c02f15e28a58)



## Installation

1. **Clone or Download the Repository:**
   ```bash
   git clone https://github.com/your-username/traceid-header-viewer.git

Or download and unzip the repository files.

## Load the Extension in Chrome:

Open Chrome and navigate to chrome://extensions/.
Enable Developer mode using the toggle in the top right.
Click Load unpacked.
Select the folder containing your extension files (the chrome-extension/ folder).
Verify Installation:

The extension icon should appear in your Chrome toolbar.
When you load a page that makes network requests matching your configured endpoints, the panel will be injected automatically (unless it has been closed).
Usage
Viewing Headers:
When active, the extension injects a floating panel that displays header values (e.g., X-B3-Traceid) for the defined endpoints.

### Moving and Resizing the Panel:

Drag the Panel: Click and hold the header (the top section) to drag the panel to your desired location.
Resize the Panel: Drag the resize handle located at the bottom-right corner of the panel.
Closing the Panel:
Click the close (✖) button in the top-right corner of the panel to hide it. The panel will remain closed on subsequent page reloads.

### Reopening the Panel:

Click the extension icon to open the popup.
In the popup, click "Open TraceID Panel" to reinitialize the panel on the current page.
Customization
Endpoints and Headers:
Edit content.js and background.js to adjust the list of endpoints and the headers you want to monitor. Update the endpoints array in content.js and the monitoredEndpoints array in background.js as needed.

### Styling:
Modify the inline styles in content.js to change the appearance of the floating panel and its components.

Manifest V3 Specifics
Service Worker:
The extension uses a service worker (in background.js) instead of a persistent background page.

### Permissions:
The manifest declares necessary permissions (e.g., webRequest, activeTab, and tabs) and separates host permissions using host_permissions.

### Popup and Action API:
The extension uses the unified action API with a default popup (popup.html) as specified in the manifest.

### Troubleshooting
#### Panel Not Appearing:
If the panel does not appear on page load, check that the panelClosed flag in chrome.storage.local is not set. Reopen the panel via the popup.

#### Network Headers Not Showing:
Verify that the URL patterns in background.js match the endpoints you are testing against.


