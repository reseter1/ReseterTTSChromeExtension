chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "reseter-tts-converter",
        title: "Speak with Reseter TTS Converter",
        contexts: ["all"]
    });
});

let conversionInProgress = false;
let cancelRequested = false;

const ConvertText = async (text) => {
    conversionInProgress = true;
    cancelRequested = false;

    const { settings } = await chrome.storage.local.get('settings');
    const providerSettings = settings.providers[settings.current];

    if (cancelRequested) {
        conversionInProgress = false;
        throw new Error("Conversion cancelled");
    }

    const response = await fetch(providerSettings.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            text,
            voiceId: providerSettings.voice,
            language: providerSettings.language,
            speed: providerSettings.speechRate,
            model: "tts-1"
        })
    });

    if (cancelRequested) {
        conversionInProgress = false;
        throw new Error("Conversion cancelled");
    }

    const data = await response.json();

    if (data.error) {
        conversionInProgress = false;
        throw new Error(data.error);
    }

    conversionInProgress = false;
    return data.media_url;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "CancelConversion" && conversionInProgress) {
        cancelRequested = true;
    }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (conversionInProgress) return;
    if (info.menuItemId !== "reseter-tts-converter") return;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs.length) return;

        chrome.permissions.contains({ origins: [tabs[0].url] }, (hasPermission) => {
            if (!hasPermission) {
                console.log("No permission for this host");
                return;
            }

            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                files: ['assets/content.js']
            }).then(() => {
                const selectedText = info.selectionText?.trim();
                if (!selectedText) {
                    chrome.tabs.sendMessage(tabs[0].id, { action: "ShowError", error: "No text to convert! Please select some text first" });
                    return;
                }

                chrome.tabs.sendMessage(tabs[0].id, { action: "InjectAudio", audioSrc: null });

                ConvertText(selectedText).then(audioSrc => {
                    if (!cancelRequested) {
                        chrome.tabs.sendMessage(tabs[0].id, { action: "InjectAudio", audioSrc });
                    }
                }).catch(error => {
                    if (error.message !== "Conversion cancelled") {
                        chrome.tabs.sendMessage(tabs[0].id, {
                            action: "ShowError",
                            error: error.message || "Failed to convert text to speech. Please try again"
                        });
                    }
                });
            }).catch(err => {
                console.log("Error injecting content script:", err);
            });
        });
    });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "HandleConvertOnContentButton") {
        if (conversionInProgress) return true;

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (!tabs.length) return;

            chrome.permissions.contains({ origins: [tabs[0].url] }, (hasPermission) => {
                if (!hasPermission) {
                    console.log("No permission for this host");
                    return;
                }

                chrome.tabs.sendMessage(tabs[0].id, { action: "InjectAudio", audioSrc: null });

                ConvertText(request.text).then(audioSrc => {
                    if (!cancelRequested) {
                        chrome.tabs.sendMessage(tabs[0].id, { action: "InjectAudio", audioSrc });
                    }
                }).catch(error => {
                    if (error.message !== "Conversion cancelled") {
                        chrome.tabs.sendMessage(tabs[0].id, {
                            action: "ShowError",
                            error: error.message || "Failed to convert text to speech. Please try again"
                        });
                    }
                });
            });
        });

        return true;
    }

    if (request.action === "ShowError") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (!tabs.length) return;
            chrome.tabs.sendMessage(tabs[0].id, request);
        });
        return true;
    }

    if (request.action === "CancelConversion" && conversionInProgress) {
        cancelRequested = true;
        return true;
    }
});