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

    console.log(providerSettings);

    if (providerSettings.text_optimize == "true") {
        const aiResponse = await fetch("https://genai-reseter.servernux.com/api/v2/ai-gen", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                prompt: (providerSettings.aiPrompt || "Giúp tôi chuẩn hóa văn bản này bằng cách loại bỏ những văn bản thừa không liên quan đến câu chuyện ví dụ doc truyen\nDanh sáchThể loạiTùy chỉnh\nLọc Truyện\n, chỉ giữ lại nội dung câu chuyện (nhưng nhớ giữ lại tiêu đề truyện và chương đặt ở đầu nhé), đừng đưa vào các ký tự mới đặc biệt như #, *,..., với những từ bị phân tách theo kiểu w.o.r.d thì nối chung lại thành một word như ban đầu và chỉnh sửa chính tả nếu có") + ", văn bản là: " + text,
                model: "null-flash",
            })
        });

        if (aiResponse.ok) {
            const aiData = await aiResponse.json();
            text = aiData.text;
        }
        else {
            throw new Error("Error optimizing text");
        }
    }

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

                chrome.tabs.sendMessage(tabs[0].id, { action: "CheckPlayerExists" }, (response) => {
                    if (response && response.playerExists) {
                        chrome.tabs.sendMessage(tabs[0].id, { action: "ShowError", error: "A player is already running! I've removed it for you, please try again." });
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

                chrome.tabs.sendMessage(tabs[0].id, { action: "CheckPlayerExists" }, (response) => {
                    if (response && response.playerExists) {
                        chrome.tabs.sendMessage(tabs[0].id, { action: "ShowError", error: "A player is already running! I've removed it for you, please try again." });
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