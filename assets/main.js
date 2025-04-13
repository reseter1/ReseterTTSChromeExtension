const DEFAULT_SETTINGS = {
  providers: {
    FreeTTS: {
      url: "https://genai-reseter.servernux.com/api/v2/ttsv2-gen",
      speechRate: 1.0,
      voice: "1",
      language: "vi",
      text_optimize: "false",
      aiPrompt: "Giúp tôi chuẩn hóa văn bản này bằng cách loại bỏ những văn bản thừa không liên quan đến câu chuyện ví dụ doc truyen\nDanh sáchThể loạiTùy chỉnh\nLọc Truyện\n, chỉ giữ lại nội dung câu chuyện (nhưng nhớ giữ lại tiêu đề truyện và chương đặt ở đầu nhé), đừng đưa vào các ký tự mới đặc biệt như #, *,..., với những từ bị phân tách theo kiểu w.o.r.d thì nối chung lại thành một word như ban đầu và chỉnh sửa chính tả nếu có"
    },
    OpenAITTS: {
      url: "https://genai-reseter.servernux.com/api/v2/ttsv1-gen",
      speechRate: 1.0,
      voice: "OA001",
      text_optimize: "false",
      aiPrompt: "Giúp tôi chuẩn hóa văn bản này bằng cách loại bỏ những văn bản thừa không liên quan đến câu chuyện ví dụ doc truyen\nDanh sáchThể loạiTùy chỉnh\nLọc Truyện\n, chỉ giữ lại nội dung câu chuyện (nhưng nhớ giữ lại tiêu đề truyện và chương đặt ở đầu nhé), đừng đưa vào các ký tự mới đặc biệt như #, *,..., với những từ bị phân tách theo kiểu w.o.r.d thì nối chung lại thành một word như ban đầu và chỉnh sửa chính tả nếu có"
    }
  },
  current: "FreeTTS"
};

const providerSelectWrapper = document.getElementById('providerSelect');
const providerTrigger = providerSelectWrapper.querySelector('.custom-select-trigger');
const providerOptions = providerSelectWrapper.querySelectorAll('.custom-option');

const speechRateInput = document.getElementById('speechRate');
const rateValueDisplay = document.querySelector('.rate-value');

const voiceSelectWrapper = document.getElementById('voiceSelect');
const voiceTrigger = voiceSelectWrapper.querySelector('.custom-select-trigger');
const voiceOptions = document.getElementById('voiceOptions');

const languageGroup = document.getElementById('languageGroup');
const languageSelectWrapper = document.getElementById('languageSelect');
const languageTrigger = languageSelectWrapper.querySelector('.custom-select-trigger');
const languageOptions = languageSelectWrapper.querySelectorAll('.custom-option');

const textOptimizeSelectWrapper = document.getElementById('textOptimizeSelect');
const textOptimizeTrigger = textOptimizeSelectWrapper.querySelector('.custom-select-trigger');
const textOptimizeOptions = textOptimizeSelectWrapper.querySelectorAll('.custom-option');

const aiPromptGroup = document.getElementById('aiPromptGroup');
const aiPromptTextarea = document.getElementById('aiPrompt');

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['settings'], (result) => {
    if (chrome.runtime.lastError) {
      console.error('Error loading settings:', chrome.runtime.lastError);
      return;
    }
    if (!result.settings) {
      chrome.storage.local.set({ settings: DEFAULT_SETTINGS }, () => {
        if (chrome.runtime.lastError) {
          console.error('Error saving default settings:', chrome.runtime.lastError);
          return;
        }
        loadSettings();
      });
    } else {
      loadSettings();
    }
  });
});

function loadSettings() {
  chrome.storage.local.get(['settings'], (result) => {
    if (!result.settings || !result.settings.providers) {
      chrome.storage.local.set({ settings: DEFAULT_SETTINGS }, () => {
        setTimeout(loadSettings, 100);
      });
      return;
    }

    const currentProviderName = result.settings.current || 'FreeTTS';
    providerOptions.forEach(option => {
      const isSelected = option.getAttribute('data-value') === currentProviderName;
      option.classList.toggle('selected', isSelected);
      if (isSelected) providerTrigger.textContent = option.textContent;
    });

    const currentSettings = result.settings.providers[currentProviderName];
    if (!currentSettings) {
      console.error('Current provider settings not found:', currentProviderName);
      return;
    }

    if (currentSettings.speechRate) {
      speechRateInput.value = currentSettings.speechRate;
      rateValueDisplay.textContent = `${currentSettings.speechRate}x`;
      updateSliderGradient(speechRateInput);
    }

    updateVoiceOptions(currentProviderName);

    setTimeout(() => {
      const options = voiceOptions.querySelectorAll('.custom-option');
      const savedVoice = currentSettings.voice;
      let found = false;
      options.forEach(option => {
        if (option.getAttribute('data-value') === savedVoice) {
          option.click();
          found = true;
        }
      });
      if (!found && options.length) options[0].click();
    }, 0);

    if (currentProviderName === 'FreeTTS' && currentSettings.language) {
      languageOptions.forEach(option => {
        if (option.getAttribute('data-value').toLowerCase() === currentSettings.language.toLowerCase()) {
          option.click();
        }
      });
    }

    languageGroup.style.display = currentProviderName === 'FreeTTS' ? 'block' : 'none';

    const savedTextOptimize = currentSettings.text_optimize || "false";
    textOptimizeOptions.forEach(option => {
      if (option.getAttribute('data-value') === savedTextOptimize) {
        option.classList.add('selected');
        textOptimizeTrigger.textContent = option.textContent;
      } else {
        option.classList.remove('selected');
      }
    });

    // Hiển thị/ẩn và đặt giá trị cho AI Prompt
    aiPromptGroup.style.display = savedTextOptimize === "true" ? "block" : "none";
    const defaultPrompt = "Giúp tôi chuẩn hóa văn bản này bằng cách loại bỏ những văn bản thừa không liên quan đến câu chuyện ví dụ doc truyen\nDanh sáchThể loạiTùy chỉnh\nLọc Truyện\n, chỉ giữ lại nội dung câu chuyện (nhưng nhớ giữ lại tiêu đề truyện và chương đặt ở đầu nhé), đừng đưa vào các ký tự mới đặc biệt như #, *,..., với những từ bị phân tách theo kiểu w.o.r.d thì nối chung lại thành một word như ban đầu và chỉnh sửa chính tả nếu có";
    aiPromptTextarea.value = currentSettings.aiPrompt || defaultPrompt;
  });
}

updateVoiceOptions('FreeTTS');

document.addEventListener('click', (e) => {
  document.querySelectorAll('.custom-select').forEach(select => {
    if (!select.contains(e.target) && !e.target.classList.contains('custom-option')) {
      select.classList.remove('open');
    }
  });
});

document.querySelectorAll('.custom-select-trigger').forEach(trigger => {
  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const parent = trigger.parentNode;
    document.querySelectorAll('.custom-select').forEach(select => {
      if (select !== parent) select.classList.remove('open');
    });
    parent.classList.toggle('open');
  });
});

providerOptions.forEach(option => {
  option.addEventListener('click', () => {
    providerOptions.forEach(opt => opt.classList.remove('selected'));
    option.classList.add('selected');
    providerTrigger.textContent = option.textContent;
    providerSelectWrapper.classList.remove('open');

    const provider = option.getAttribute('data-value');
    updateVoiceOptions(provider);

    // Chọn giọng đầu tiên cho nhà cung cấp mới
    const firstVoiceOption = voiceOptions.querySelector('.custom-option');
    if (firstVoiceOption) {
      voiceOptions.querySelectorAll('.custom-option').forEach(opt => opt.classList.remove('selected'));
      firstVoiceOption.classList.add('selected');
      voiceTrigger.textContent = firstVoiceOption.textContent;
    }

    chrome.storage.local.get(['settings'], (result) => {
      let settingsData = result.settings;
      if (!settingsData || !settingsData.providers) {
        settingsData = { ...DEFAULT_SETTINGS, current: provider };
      } else {
        settingsData.current = provider;
      }
      chrome.storage.local.set({ settings: settingsData });
    });

    const isFreeTTS = provider === 'FreeTTS';
    languageGroup.style.display = isFreeTTS ? 'block' : 'none';
    languageSelectWrapper.classList.toggle('disabled', !isFreeTTS);
    languageTrigger.style.backgroundColor = isFreeTTS ? '' : '#f5f5f5';
    languageTrigger.style.cursor = isFreeTTS ? 'pointer' : 'not-allowed';
  });
});

languageOptions.forEach(option => {
  option.addEventListener('click', () => {
    if (providerTrigger.textContent === 'OpenAITTS') return;

    languageOptions.forEach(opt => opt.classList.remove('selected'));
    option.classList.add('selected');
    languageTrigger.textContent = option.textContent;
    languageSelectWrapper.classList.remove('open');
  });
});

function updateSliderGradient(slider) {
  const percent = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
  slider.style.background = `linear-gradient(to right, #4f46e5 0%, #4f46e5 ${percent}%, #eee ${percent}%, #eee 100%)`;
}

speechRateInput.addEventListener('input', () => {
  const value = parseFloat(speechRateInput.value).toFixed(1);
  rateValueDisplay.textContent = `${value}x`;
  updateSliderGradient(speechRateInput);
  rateValueDisplay.style.transform = 'scale(1.2)';
  setTimeout(() => rateValueDisplay.style.transform = 'scale(1)', 200);
});

updateSliderGradient(speechRateInput);

speechRateInput.addEventListener('mousedown', (e) => {
  const slider = speechRateInput.parentElement;
  const rect = slider.getBoundingClientRect();
  const ripple = document.createElement('span');
  ripple.classList.add('ripple-effect');
  ripple.style.left = (e.clientX - rect.left) + 'px';
  ripple.style.top = (e.clientY - rect.top) + 'px';
  slider.appendChild(ripple);
  setTimeout(() => ripple.remove(), 500);
});

function updateVoiceOptions(provider) {
  voiceOptions.innerHTML = '';
  let firstOption;

  const createOption = (dataValue, textContent) => {
    const option = document.createElement('span');
    option.className = 'custom-option';
    option.setAttribute('data-value', dataValue);
    option.textContent = textContent;
    option.addEventListener('click', () => {
      voiceOptions.querySelectorAll('.custom-option').forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');
      voiceTrigger.textContent = option.textContent;
      voiceSelectWrapper.classList.remove('open');
    });
    return option;
  };

  for (let i = 1; i <= 6; i++) {
    let dataValue, text;
    if (provider === 'FreeTTS') {
      dataValue = i.toString();
      text = `Voice ${i}`;
    } else {
      dataValue = `OA00${i}`;
      text = dataValue;
    }
    const option = createOption(dataValue, text);
    if (!firstOption) firstOption = option;
    voiceOptions.appendChild(option);
  }

  if (firstOption) {
    voiceTrigger.textContent = firstOption.textContent;
    firstOption.classList.add('selected');
  }
}

document.querySelectorAll('.ripple').forEach(rippleElement => {
  rippleElement.addEventListener('click', (e) => {
    const rect = rippleElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    rippleElement.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

document.querySelector('.save-button').addEventListener('click', () => saveSettings());

function saveSettings() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: ['assets/content.js']
    }).then(() => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "InjectConvertButton" });
    }).catch(error => {
      console.error("Error injecting script:", error);
    });
  });

  const currentProvider = providerTrigger.textContent.trim() === 'FreeTTS' ? 'FreeTTS' : 'OpenAITTS';
  const speechRate = parseFloat(speechRateInput.value);
  const selectedVoiceOption = voiceOptions.querySelector('.custom-option.selected');
  const defaultVoice = currentProvider === 'FreeTTS' ? '1' : 'OA001';
  const voice = selectedVoiceOption ? selectedVoiceOption.getAttribute('data-value') : defaultVoice;
  const selectedLanguageOption = languageSelectWrapper.querySelector('.custom-option.selected');
  const language = selectedLanguageOption ? selectedLanguageOption.getAttribute('data-value').toLowerCase() : 'en';
  const selectedTextOptimizeOption = textOptimizeSelectWrapper.querySelector('.custom-option.selected');
  const text_optimize = selectedTextOptimizeOption ? selectedTextOptimizeOption.getAttribute('data-value') : 'false';
  const aiPrompt = aiPromptTextarea.value.trim();

  chrome.storage.local.get(['settings'], (result) => {
    let settingsData = result.settings;
    if (!settingsData || !settingsData.providers) {
      settingsData = { ...DEFAULT_SETTINGS, current: currentProvider };
    }
    if (currentProvider === 'FreeTTS') {
      settingsData.providers.FreeTTS = {
        url: settingsData.providers.FreeTTS.url || DEFAULT_SETTINGS.providers.FreeTTS.url,
        speechRate,
        voice,
        language,
        text_optimize,
        aiPrompt
      };
    } else if (currentProvider === 'OpenAITTS') {
      settingsData.providers.OpenAITTS = {
        url: settingsData.providers.OpenAITTS.url || DEFAULT_SETTINGS.providers.OpenAITTS.url,
        speechRate,
        voice,
        text_optimize,
        aiPrompt
      };
    }
    settingsData.current = currentProvider;

    chrome.storage.local.set({ settings: settingsData }, () => {
      if (chrome.runtime.lastError) {
        console.error('Error saving settings:', chrome.runtime.lastError);
        return;
      }
      const saveButton = document.querySelector('.save-button');
      const originalText = saveButton.textContent;
      saveButton.textContent = 'Saved!';
      setTimeout(() => {
        saveButton.textContent = originalText;
      }, 1500);
    });
  });
}

textOptimizeOptions.forEach(option => {
  option.addEventListener('click', () => {
    textOptimizeOptions.forEach(opt => opt.classList.remove('selected'));
    option.classList.add('selected');
    textOptimizeTrigger.textContent = option.textContent;
    textOptimizeSelectWrapper.classList.remove('open');

    // Hiển thị/ẩn nhóm input AI Prompt
    const isOptimizeEnabled = option.getAttribute('data-value') === 'true';
    aiPromptGroup.style.display = isOptimizeEnabled ? 'block' : 'none';
  });
});