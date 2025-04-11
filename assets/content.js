chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "InjectAudio") {
    const style = document.createElement("style");
    style.textContent = `
          /* Audio Player Styles - Enhanced Version */
          .audio-player {
            position: fixed;
            z-index: 10000;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1);
            padding: 16px;
            width: 340px;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            border: 1px solid rgba(0, 0, 0, 0.08);
            backdrop-filter: blur(10px);
            opacity: 0;
            transform: translateY(20px);
            animation: fadeIn 0.5s forwards;
          }

          @keyframes fadeIn {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          /* Desktop positioning (bottom-left) */
          .audio-player.desktop {
            bottom: 24px;
            left: 24px;
          }

          /* Mobile positioning (bottom-center) */
          .audio-player.mobile {
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            width: calc(100% - 40px);
            max-width: 400px;
            animation: fadeInMobile 0.5s forwards;
          }

          @keyframes fadeInMobile {
            to {
              opacity: 1;
              transform: translateX(-50%) translateY(0);
            }
          }

          /* Hide the default audio element */
          .audio-element {
            display: none;
          }

          /* Player title */
          .player-title {
            font-size: 15px;
            font-weight: 600;
            margin-bottom: 12px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #333;
            padding-bottom: 8px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          }

          /* Player controls container */
          .player-controls {
            display: flex;
            align-items: center;
            gap: 10px;
          }

          /* Play/Pause button */
          .play-pause-btn,
          .volume-btn {
            background: none;
            border: none;
            cursor: pointer;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.2s ease;
            background-color: rgba(0, 0, 0, 0.03);
          }

          .play-pause-btn:hover,
          .volume-btn:hover {
            background-color: rgba(0, 0, 0, 0.08);
            transform: scale(1.05);
          }

          .play-pause-btn:active,
          .volume-btn:active {
            transform: scale(0.95);
          }

          .play-pause-btn svg,
          .volume-btn svg {
            width: 20px;
            height: 20px;
            color: #333;
            transition: color 0.2s ease;
          }

          .play-pause-btn:hover svg,
          .volume-btn:hover svg {
            color: #f50;
          }

          /* Time display */
          .time-display {
            font-size: 13px;
            color: #666;
            min-width: 42px;
            font-variant-numeric: tabular-nums;
            font-weight: 500;
          }

          .duration {
            text-align: right;
          }

          /* Progress bar */
          .progress-container {
            flex: 1;
            padding: 0 4px;
            height: 20px;
            display: flex;
            align-items: center;
          }

          .progress-bar {
            height: 5px;
            background-color: #e0e0e0;
            border-radius: 3px;
            cursor: pointer;
            position: relative;
            width: 100%;
            overflow: hidden;
            transition: height 0.2s ease;
          }

          .progress-container:hover .progress-bar {
            height: 8px;
          }

          .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #f50, #ff7e33);
            border-radius: 3px;
            width: 0%;
            position: absolute;
            top: 0;
            left: 0;
            transition: width 0.1s linear;
            box-shadow: 0 0 8px rgba(255, 85, 0, 0.3);
          }

          /* Volume controls */
          .volume-slider-container {
            width: 70px;
            height: 20px;
            display: flex;
            align-items: center;
          }

          .volume-slider {
            height: 5px;
            background-color: #e0e0e0;
            border-radius: 3px;
            cursor: pointer;
            position: relative;
            width: 100%;
            overflow: hidden;
            transition: height 0.2s ease;
          }

          .volume-slider-container:hover .volume-slider {
            height: 8px;
          }

          .volume-fill {
            height: 100%;
            background: linear-gradient(90deg, #f50, #ff7e33);
            border-radius: 3px;
            width: 100%;
            position: absolute;
            top: 0;
            left: 0;
            transition: width 0.2s ease;
          }

          /* Helper class to hide elements */
          .hidden {
            display: none;
          }

          /* Close button */
          .close-btn {
            position: absolute;
            top: 12px;
            right: 12px;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: rgba(0, 0, 0, 0.05);
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
          }

          .close-btn:hover {
            background: rgba(0, 0, 0, 0.1);
            transform: scale(1.1);
          }

          .close-btn svg {
            width: 14px;
            height: 14px;
            color: #666;
          }

          /* Responsive adjustments */
          @media (max-width: 480px) {
            .volume-slider-container {
              width: 50px;
            }

            .time-display {
              min-width: 38px;
              font-size: 12px;
            }
            
            .audio-player {
              padding: 14px;
            }
          }

          /* Loading animation styles */
          @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
          }
          
          .loading-indicator {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 16px 0;
            width: 100%;
          }
          
          .loading-dots {
            display: flex;
            gap: 8px;
            margin-bottom: 12px;
          }
          
          .loading-dots span {
            display: inline-block;
            width: 8px;
            height: 8px;
            background-color: #f50;
            border-radius: 50%;
            animation: pulse 1.4s infinite ease-in-out;
          }
          
          .loading-dots span:nth-child(2) {
            animation-delay: 0.2s;
          }
          
          .loading-dots span:nth-child(3) {
            animation-delay: 0.4s;
          }
          
          .loading-text {
            font-size: 14px;
            color: #666;
            animation: pulse 1.4s infinite ease-in-out;
            text-align: center;
            width: 100%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          
          .player-controls.loading {
            display: none;
          }
        `;
    document.head.appendChild(style);

    let audioPlayer = document.querySelector('.audio-player');
    if (!audioPlayer) {
      audioPlayer = document.createElement('div');
      audioPlayer.className = 'audio-player';
      document.body.appendChild(audioPlayer);
    }

    // Hiển thị player với trạng thái loading
    if (request.action === "InjectAudio" && !request.audioSrc) {
      audioPlayer.innerHTML = `
              <button class="close-btn">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              <div class="player-title">Reseter TTS Converter</div>
              <div class="loading-indicator">
                <div class="loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div class="loading-text">Converting text to speech...</div>
              </div>
              <div class="player-controls loading">
                <!-- Player controls sẽ hiển thị khi có audio src -->
              </div>
            `;

      const closeBtn = audioPlayer.querySelector(".close-btn");
      closeBtn.addEventListener("click", () => {
        chrome.runtime.sendMessage({ action: "CancelConversion" });

        audioPlayer.style.animation = "none";
        audioPlayer.style.opacity = "1";
        if (isMobile()) {
          audioPlayer.style.transform = "translateX(-50%) translateY(20px)";
        } else {
          audioPlayer.style.transform = "translateY(20px)";
        }
        audioPlayer.style.opacity = "0";
        setTimeout(() => {
          audioPlayer.remove();
        }, 300);
      });

      updatePlayerPosition();
      return;
    }

    const audioElement = document.createElement('audio');
    audioElement.src = request.audioSrc;
    audioElement.className = 'audio-element';
    audioElement.controls = true;
    audioPlayer.innerHTML = '';
    audioPlayer.appendChild(audioElement);

    audioElement.addEventListener('error', (e) => {
      console.error('Audio error:', e);
      audioPlayer.querySelector(".player-title").textContent = "Error playing audio";
    });

    audioElement.addEventListener('canplay', () => {
      console.log('Audio can be played');
    });

    audioPlayer.innerHTML += `
          <button class="close-btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <div class="player-title">Reseter TTS Converter</div>
          <div class="player-controls">
            <button class="play-pause-btn">
              <svg id="play-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              <svg class="hidden" id="pause-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="6" y="4" width="4" height="16"></rect>
                <rect x="14" y="4" width="4" height="16"></rect>
              </svg>
            </button>
            <div class="time-display current-time">0:00</div>
            <div class="progress-container">
              <div class="progress-bar">
                <div class="progress-fill"></div>
              </div>
            </div>
            <div class="time-display duration">0:00</div>
            <button class="volume-btn">
              <svg class="volume-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
              </svg>
              <svg class="mute-icon hidden" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <line x1="23" y1="9" x2="17" y2="15"></line>
                <line x1="17" y1="9" x2="23" y2="15"></line>
              </svg>
            </button>
            <div class="volume-slider-container">
              <div class="volume-slider">
                <div class="volume-fill"></div>
              </div>
            </div>
          </div>
        `;

    const playPauseBtn = audioPlayer.querySelector(".play-pause-btn");
    const playIcon = audioPlayer.querySelector("#play-icon");
    const pauseIcon = audioPlayer.querySelector("#pause-icon");
    const progressBar = audioPlayer.querySelector(".progress-bar");
    const progressFill = audioPlayer.querySelector(".progress-fill");
    const currentTimeDisplay = audioPlayer.querySelector(".current-time");
    const durationDisplay = audioPlayer.querySelector(".duration");
    const volumeBtn = audioPlayer.querySelector(".volume-btn");
    const volumeIcon = audioPlayer.querySelector(".volume-icon");
    const muteIcon = audioPlayer.querySelector(".mute-icon");
    const volumeSlider = audioPlayer.querySelector(".volume-slider");
    const volumeFill = audioPlayer.querySelector(".volume-fill");
    const closeBtn = audioPlayer.querySelector(".close-btn");

    let isDraggingProgress = false;
    let isDraggingVolume = false;
    let isMuted = false;
    let previousVolume = 1;

    function formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60);
      return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
    }

    function updateProgress() {
      if (!isDraggingProgress && audioElement.duration) {
        const percentage = (audioElement.currentTime / audioElement.duration) * 100;
        progressFill.style.width = `${percentage}%`;
        currentTimeDisplay.textContent = formatTime(audioElement.currentTime);
      }
    }

    function setProgress(e) {
      const width = progressBar.clientWidth;
      const clickX = e.offsetX;
      const duration = audioElement.duration;

      if (e.target !== progressBar) {
        const rect = progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        audioElement.currentTime = (clickX / width) * duration;
      } else {
        audioElement.currentTime = (clickX / width) * duration;
      }
    }

    function setVolume(e) {
      const width = volumeSlider.clientWidth;
      const clickX = e.offsetX;

      let volumeLevel;
      if (e.target !== volumeSlider) {
        const rect = volumeSlider.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        volumeLevel = Math.max(0, Math.min(1, clickX / width));
      } else {
        volumeLevel = Math.max(0, Math.min(1, clickX / width));
      }

      audioElement.volume = volumeLevel;
      volumeFill.style.width = `${volumeLevel * 100}%`;

      if (volumeLevel === 0) {
        isMuted = true;
        volumeIcon.classList.add("hidden");
        muteIcon.classList.remove("hidden");
      } else {
        isMuted = false;
        volumeIcon.classList.remove("hidden");
        muteIcon.classList.add("hidden");
      }

      previousVolume = volumeLevel;
    }

    function togglePlay() {
      if (audioElement.paused) {
        audioElement.play().catch(err => {
          console.error("Error playing audio:", err);
        });
        playIcon.classList.add("hidden");
        pauseIcon.classList.remove("hidden");
      } else {
        audioElement.pause();
        playIcon.classList.remove("hidden");
        pauseIcon.classList.add("hidden");
      }
    }

    function toggleMute() {
      if (isMuted) {
        audioElement.volume = previousVolume;
        volumeFill.style.width = `${previousVolume * 100}%`;
        volumeIcon.classList.remove("hidden");
        muteIcon.classList.add("hidden");
      } else {
        previousVolume = audioElement.volume;
        audioElement.volume = 0;
        volumeFill.style.width = "0%";
        volumeIcon.classList.add("hidden");
        muteIcon.classList.remove("hidden");
      }
      isMuted = !isMuted;
    }

    function closePlayer() {
      audioElement.pause();
      audioPlayer.style.animation = "none";
      audioPlayer.style.opacity = "1";

      if (isMobile()) {
        audioPlayer.style.transform = "translateX(-50%) translateY(20px)";
      } else {
        audioPlayer.style.transform = "translateY(20px)";
      }

      audioPlayer.style.opacity = "0";

      setTimeout(() => {
        audioPlayer.remove();
      }, 300);
    }

    function isMobile() {
      return window.innerWidth < 768;
    }

    function updatePlayerPosition() {
      if (isMobile()) {
        audioPlayer.classList.add("mobile");
        audioPlayer.classList.remove("desktop");
      } else {
        audioPlayer.classList.add("desktop");
        audioPlayer.classList.remove("mobile");
      }
    }

    playPauseBtn.addEventListener("click", togglePlay);
    volumeBtn.addEventListener("click", toggleMute);
    closeBtn.addEventListener("click", closePlayer);

    progressBar.addEventListener("click", setProgress);
    volumeSlider.addEventListener("click", setVolume);

    progressBar.addEventListener("mousedown", (e) => {
      isDraggingProgress = true;
      setProgress(e);
    });

    volumeSlider.addEventListener("mousedown", (e) => {
      isDraggingVolume = true;
      setVolume(e);
    });

    progressBar.addEventListener("touchstart", (e) => {
      const touch = e.touches[0];
      const rect = progressBar.getBoundingClientRect();
      const clickX = touch.clientX - rect.left;
      const width = progressBar.clientWidth;
      const duration = audioElement.duration;

      audioElement.currentTime = (clickX / width) * duration;
    });

    volumeSlider.addEventListener("touchstart", (e) => {
      const touch = e.touches[0];
      const rect = volumeSlider.getBoundingClientRect();
      const clickX = touch.clientX - rect.left;
      const width = volumeSlider.clientWidth;

      const volumeLevel = Math.max(0, Math.min(1, clickX / width));
      audioElement.volume = volumeLevel;
      volumeFill.style.width = `${volumeLevel * 100}%`;

      if (volumeLevel === 0) {
        isMuted = true;
        volumeIcon.classList.add("hidden");
        muteIcon.classList.remove("hidden");
      } else {
        isMuted = false;
        volumeIcon.classList.remove("hidden");
        muteIcon.classList.add("hidden");
      }

      previousVolume = volumeLevel;
    });

    document.addEventListener("mousemove", (e) => {
      if (isDraggingProgress) {
        setProgress(e);
      }
      if (isDraggingVolume) {
        setVolume(e);
      }
    });

    document.addEventListener("mouseup", () => {
      isDraggingProgress = false;
      isDraggingVolume = false;
    });

    audioElement.addEventListener("timeupdate", updateProgress);

    audioElement.addEventListener("loadedmetadata", () => {
      durationDisplay.textContent = formatTime(audioElement.duration);
    });

    audioElement.addEventListener("ended", () => {
      playIcon.classList.remove("hidden");
      pauseIcon.classList.add("hidden");
    });

    window.addEventListener("resize", updatePlayerPosition);
    updatePlayerPosition();

    volumeFill.style.width = `${audioElement.volume * 100}%`;

    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    audioPlayer.addEventListener("mousedown", (e) => {
      if (e.target.classList.contains("player-title") ||
        (e.target === audioPlayer && !e.target.classList.contains("player-controls"))) {
        isDragging = true;
        const rect = audioPlayer.getBoundingClientRect();
        dragOffsetX = e.clientX - rect.left;
        dragOffsetY = e.clientY - rect.top;
        audioPlayer.style.cursor = "grabbing";
        audioPlayer.style.transition = "none";
        e.preventDefault();
      }
    });

    document.addEventListener("mousemove", (e) => {
      if (isDragging && !isMobile()) {
        const newX = e.clientX - dragOffsetX;
        const newY = e.clientY - dragOffsetY;

        const maxX = window.innerWidth - audioPlayer.offsetWidth;
        const maxY = window.innerHeight - audioPlayer.offsetHeight;

        audioPlayer.style.left = `${Math.max(0, Math.min(newX, maxX))}px`;
        audioPlayer.style.top = `${Math.max(0, Math.min(newY, maxY))}px`;
        audioPlayer.style.bottom = "auto";
        audioPlayer.style.transform = "none";
      }
    });

    document.addEventListener("mouseup", () => {
      if (isDragging) {
        isDragging = false;
        audioPlayer.style.cursor = "default";
        audioPlayer.style.transition = "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)";

        const rect = audioPlayer.getBoundingClientRect();
        if (rect.bottom > window.innerHeight - 30) {
          audioPlayer.style.top = "auto";
          audioPlayer.style.bottom = "24px";
        }
      }
    });

    audioPlayer.addEventListener("touchstart", (e) => {
      if (isMobile()) return;

      const touch = e.touches[0];
      if (touch.target.classList.contains("player-title") ||
        (touch.target === audioPlayer && !touch.target.classList.contains("player-controls"))) {
        isDragging = true;
        const rect = audioPlayer.getBoundingClientRect();
        dragOffsetX = touch.clientX - rect.left;
        dragOffsetY = touch.clientY - rect.top;
        audioPlayer.style.cursor = "grabbing";
        audioPlayer.style.transition = "none";
        e.preventDefault();
      }
    });

    document.addEventListener("touchmove", (e) => {
      if (isDragging && !isMobile() && e.touches.length === 1) {
        const touch = e.touches[0];
        const newX = touch.clientX - dragOffsetX;
        const newY = touch.clientY - dragOffsetY;

        const maxX = window.innerWidth - audioPlayer.offsetWidth;
        const maxY = window.innerHeight - audioPlayer.offsetHeight;

        audioPlayer.style.left = `${Math.max(0, Math.min(newX, maxX))}px`;
        audioPlayer.style.top = `${Math.max(0, Math.min(newY, maxY))}px`;
        audioPlayer.style.bottom = "auto";
        audioPlayer.style.transform = "none";
      }
    });

    document.addEventListener("touchend", () => {
      if (isDragging) {
        isDragging = false;
        audioPlayer.style.cursor = "default";
        audioPlayer.style.transition = "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)";

        const rect = audioPlayer.getBoundingClientRect();
        if (rect.bottom > window.innerHeight - 30) {
          audioPlayer.style.top = "auto";
          audioPlayer.style.bottom = "24px";
        }
      }
    });
  } else if (request.action === "ShowError") {
    const style = document.createElement("style");
    style.textContent = `
      /* Error Popup Styles */
      .error-popup {
        position: fixed;
        z-index: 10000;
        background-color: #ffffff;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1);
        padding: 16px;
        width: 340px;
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        border: 1px solid rgba(0, 0, 0, 0.08);
        backdrop-filter: blur(10px);
        opacity: 0;
        transform: translateY(20px);
        animation: fadeIn 0.5s forwards;
      }

      /* Desktop positioning (center) */
      .error-popup.desktop {
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) translateY(20px);
        animation: fadeInErrorDesktop 0.5s forwards;
      }

      @keyframes fadeInErrorDesktop {
        to {
          opacity: 1;
          transform: translate(-50%, -50%);
        }
      }

      /* Mobile positioning (bottom-center) */
      .error-popup.mobile {
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        width: calc(100% - 40px);
        max-width: 400px;
        animation: fadeInErrorMobile 0.5s forwards;
      }

      @keyframes fadeInErrorMobile {
        to {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
      }

      /* Error title */
      .error-title {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 12px;
        color: #d32f2f;
        padding-bottom: 8px;
        border-bottom: 1px solid rgba(211, 47, 47, 0.2);
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .error-title svg {
        width: 20px;
        height: 20px;
        color: #d32f2f;
      }

      /* Error message */
      .error-message {
        font-size: 14px;
        color: #333;
        line-height: 1.5;
        margin-bottom: 16px;
      }

      /* Close button - for the error popup */
      .error-close-btn {
        position: absolute;
        top: 12px;
        right: 12px;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.05);
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
      }

      .error-close-btn:hover {
        background: rgba(0, 0, 0, 0.1);
        transform: scale(1.1);
      }

      .error-close-btn svg {
        width: 14px;
        height: 14px;
        color: #666;
      }

      /* Button in the error popup */
      .error-btn {
        background: linear-gradient(90deg, #d32f2f, #f44336);
        color: white;
        border: none;
        border-radius: 6px;
        padding: 10px 16px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        display: block;
        width: 100%;
        transition: all 0.2s ease;
        box-shadow: 0 2px 4px rgba(211, 47, 47, 0.2);
      }

      .error-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(211, 47, 47, 0.3);
      }

      .error-btn:active {
        transform: translateY(0);
        box-shadow: 0 1px 2px rgba(211, 47, 47, 0.2);
      }
    `;
    document.head.appendChild(style);

    const existingAudioPlayer = document.querySelector('.audio-player');
    if (existingAudioPlayer) {
      existingAudioPlayer.remove();
    }

    let errorPopup = document.querySelector('.error-popup');
    if (!errorPopup) {
      errorPopup = document.createElement('div');
      errorPopup.className = 'error-popup';
      document.body.appendChild(errorPopup);
    }

    errorPopup.innerHTML = `
      <button class="error-close-btn">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <div class="error-title">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        Error Notification From Reseter TTS
      </div>
      <div class="error-message">${request.error || "An error occurred while converting text to speech. Please try again."}</div>
      <button class="error-btn">Close</button>
    `;

    function isMobile() {
      return window.innerWidth < 768;
    }

    function updateErrorPosition() {
      if (isMobile()) {
        errorPopup.classList.add("mobile");
        errorPopup.classList.remove("desktop");
      } else {
        errorPopup.classList.add("desktop");
        errorPopup.classList.remove("mobile");
      }
    }

    function closeErrorPopup() {
      errorPopup.style.animation = "none";
      errorPopup.style.opacity = "1";

      if (isMobile()) {
        errorPopup.style.transform = "translateX(-50%) translateY(20px)";
      } else {
        errorPopup.style.transform = "translate(-50%, -50%) translateY(20px)";
      }

      errorPopup.style.opacity = "0";

      setTimeout(() => {
        errorPopup.remove();

        const injectedStyles = document.head.querySelectorAll('style');
        injectedStyles.forEach(style => {
          if (style.textContent.includes('.audio-player') ||
            style.textContent.includes('.error-popup')) {
            style.remove();
          }
        });
      }, 300);
    }

    const closeBtn = errorPopup.querySelector(".error-close-btn");
    const actionBtn = errorPopup.querySelector(".error-btn");

    closeBtn.addEventListener("click", closeErrorPopup);
    actionBtn.addEventListener("click", closeErrorPopup);

    window.addEventListener("resize", updateErrorPosition);
    updateErrorPosition();
  }
});