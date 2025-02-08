(function () {
  // Preprogrammed endpoints for the UI (should match the IDs in background.js)
  const endpoints = [
    { id: "endpoint1", label: "Action Item" },
    { id: "endpoint2", label: "Payee List" }
  ];

  // Default selection: all endpoints enabled
  let selectedEndpoints = {};
  endpoints.forEach((ep) => {
    selectedEndpoints[ep.id] = true;
  });

  // Load any saved selection from storage
  chrome.storage.sync.get("selectedEndpoints", (data) => {
    if (data.selectedEndpoints) {
      selectedEndpoints = data.selectedEndpoints;
    }
    buildUI();
  });

  // Create and style the floating panel
  const panel = document.createElement("div");
  panel.id = "header-viewer-panel";
  Object.assign(panel.style, {
    position: "fixed",
    top: "50%",
    right: "10px",
    transform: "translateY(-50%)", // Initially center vertically
    backgroundColor: "#f9f9f9",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    padding: "15px",
    zIndex: "9999",
    maxWidth: "320px",
    minWidth: "200px", // Ensure a minimum width for usability
    fontSize: "14px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    overflow: "auto",
    width: "320px",
    height: "auto",
    position: "fixed"
  });
  document.body.appendChild(panel);

  // Create a draggable header
  const dragHeader = document.createElement("div");
  dragHeader.id = "drag-header";
  dragHeader.textContent = "TraceID Header Viewer";
  Object.assign(dragHeader.style, {
    fontWeight: "bold",
    padding: "10px",
    backgroundColor: "#e0e0e0",
    cursor: "move",
    userSelect: "none",
    marginBottom: "15px",
    borderRadius: "8px 8px 0 0"
  });
  // Insert the header at the top of the panel
  panel.prepend(dragHeader);

  // Enable dragging of the panel by its header
  dragElement(panel, dragHeader);

  function dragElement(elmnt, handle) {
    let pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;
    handle.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
      e.preventDefault();
      // Remove the vertical centering transform when starting to drag.
      elmnt.style.transform = "";
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
      // Once moved, remove the right property so that left/right positioning is manual
      elmnt.style.right = "auto";
    }

    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

  // Create a resize handle for the panel (positioned at bottom-right)
  const resizeHandle = document.createElement("div");
  Object.assign(resizeHandle.style, {
    position: "absolute",
    width: "15px",
    height: "15px",
    right: "0",
    bottom: "0",
    cursor: "se-resize",
    backgroundColor: "transparent"
    // Optionally, you could add borders to make a visible triangle indicator:
    // borderRight: "2px solid #ccc",
    // borderBottom: "2px solid #ccc"
  });
  panel.appendChild(resizeHandle);

  // Implement resizing behavior
  resizeHandle.addEventListener("mousedown", initResize);
  function initResize(e) {
    e.preventDefault();
    document.addEventListener("mousemove", resizePanel);
    document.addEventListener("mouseup", stopResize);
  }
  function resizePanel(e) {
    const rect = panel.getBoundingClientRect();
    // Calculate new width and height from the panel's left and top edges
    let newWidth = e.clientX - rect.left;
    let newHeight = e.clientY - rect.top;
    if (newWidth < 200) newWidth = 200; // Minimum width
    if (newHeight < 150) newHeight = 150; // Minimum height
    panel.style.width = newWidth + "px";
    panel.style.height = newHeight + "px";
  }
  function stopResize() {
    document.removeEventListener("mousemove", resizePanel);
    document.removeEventListener("mouseup", stopResize);
  }

  // Build the UI: checkboxes for endpoints and display areas for header data
  function buildUI() {
    // Remove any existing UI elements except the draggable header and the resize handle.
    // Create a new container for the UI
    const container = document.createElement("div");
    container.style.width = "100%"; // Responsive container
    container.style.boxSizing = "border-box";

    // Create checkboxes for each endpoint
    endpoints.forEach((ep) => {
      const containerDiv = document.createElement("div");
      containerDiv.style.marginBottom = "5px";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = ep.id;
      checkbox.checked = selectedEndpoints[ep.id];
      checkbox.addEventListener("change", function () {
        selectedEndpoints[ep.id] = this.checked;
        chrome.storage.sync.set({ selectedEndpoints });
        // Clear the display if the endpoint is unchecked
        const displayElem = document.getElementById("display-" + ep.id);
        if (!this.checked && displayElem) {
          displayElem.innerHTML = "";
        }
      });

      const label = document.createElement("label");
      label.htmlFor = ep.id;
      label.textContent = " " + ep.label;

      containerDiv.appendChild(checkbox);
      containerDiv.appendChild(label);
      container.appendChild(containerDiv);
    });

    // Create a display area for each endpoint
    endpoints.forEach((ep) => {
      const display = document.createElement("div");
      display.id = "display-" + ep.id;
      Object.assign(display.style, {
        marginTop: "10px",
        padding: "10px",
        borderTop: "1px solid #ddd",
        backgroundColor: "#fff",
        borderRadius: "4px"
      });

      // Create a label for the endpoint
      const label = document.createElement("div");
      label.textContent = ep.label;
      label.style.fontWeight = "bold";
      display.appendChild(label);

      // Create a container for the trace ID and copy button
      const traceContainer = document.createElement("div");
      traceContainer.style.display = "flex";
      traceContainer.style.flexWrap = "wrap";
      traceContainer.style.alignItems = "center";
      traceContainer.style.marginTop = "5px";

      // Create an element to display the trace ID
      const traceId = document.createElement("span");
      traceId.id = "trace-" + ep.id;
      traceId.style.flexGrow = "1";
      traceId.style.wordBreak = "break-all"; // Ensure long text wraps
      traceContainer.appendChild(traceId);

      // Create a button to copy the trace ID
      const copyButton = document.createElement("button");
      copyButton.textContent = "Copy";
      copyButton.style.marginLeft = "10px";
      copyButton.addEventListener("click", () => {
        navigator.clipboard.writeText(traceId.textContent)
          .then(() => {
            copyButton.textContent = "Copied!";
            setTimeout(() => {
              copyButton.textContent = "Copy";
            }, 600)
          })
          .catch((err) => {
            alert("Failed to copy Trace ID. Please try again.");
            console.error("Clipboard copy failed:", err);
          });
      });
      traceContainer.appendChild(copyButton);

      display.appendChild(traceContainer);
      container.appendChild(display);
    });

    // Remove any existing UI (all nodes except dragHeader and resizeHandle) and add the new container.
    // Create an array of nodes that are not dragHeader or resizeHandle.
    const nodesToRemove = [];
    panel.childNodes.forEach((node) => {
      if (node !== dragHeader && node !== resizeHandle) {
        nodesToRemove.push(node);
      }
    });
    nodesToRemove.forEach((node) => panel.removeChild(node));
    // Insert the container after the dragHeader and before the resize handle.
    panel.insertBefore(container, resizeHandle);
  }

  // Listen for header update messages from the background script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "headerUpdate") {
      const epId = message.endpointId;
      if (selectedEndpoints[epId]) {
        const traceIdElem = document.getElementById("trace-" + epId);
        if (traceIdElem) {
          // Update the trace ID element with the header value (or show a default message)
          traceIdElem.textContent = message.headers["X-B3-Traceid"] || "(no trace ID)";
        }
      }
    }
  });
})();
