browser.wIDs = new Map();

/**
 * There was an error executing the script.
 * Display the popup's error message, and hide the normal UI.
 */
function reportExecuteScriptError(error) {
  console.error(`Failed to execute mute content script: ${error.message}`);
}

function reportError(error) {
  console.error(`Failed to execute promise: ${error}`);
}

function actuallyMute(tabs) {

  var wID = tabs[0].windowId;

  if (!browser.wIDs.has(wID))
  {
    browser.wIDs.set(wID, true);
  }


  for (var i = 0; i < tabs.length; i++) {
    browser.tabs.update(tabs[i].id, {
      muted: browser.wIDs.get(wID)
    });
  }

  browser.wIDs.set(wID, !browser.wIDs.get(wID));
}

function toggleMute() {
  var m = browser.tabs.query({
    currentWindow: true
  });
  m.then(actuallyMute, reportError);
}

browser.browserAction.onClicked.addListener(toggleMute);
browser.commands.onCommand.addListener((command) => {
  toggleMute();
});