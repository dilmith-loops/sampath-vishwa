/**
 * Sampath Vishwa Arcade - VR Joystick & Gamepad Input Adapter
 * Enables physical VR Joysticks, Bluetooth mini-controllers, and Gamepads
 * on standard 2D displays with zero interference to existing camera tracking.
 */
(function() {
    const DEADZONE = 0.14;

    const state = {
        mode: 'CAMERA', // 'CAMERA' | 'JOYSTICK'
        gameId: '',
        connected: false,
        controllerCount: 0,
        // Virtual Cursor on Canvas
        cursorX: 0,
        cursorY: 0,
        cursorSpeed: 16,
        cursorInitialized: false,
        // Input axes & buttons
        stickX: 0,
        stickY: 0,
        stick2X: 0,
        stick2Y: 0,
        trigger: false,
        triggerValue: 0,
        grip: false,
        buttonA: false,
        buttonB: false,
        leftTrigger: false,
        rightTrigger: false,
        dpadLeft: false,
        dpadRight: false,
        // Dual controller positions (if 2 controllers paired)
        leftStick: { x: 0, y: 0, trigger: false },
        rightStick: { x: 0, y: 0, trigger: false },
        lastInputTime: 0
    };

    function applyDeadzone(val) {
        if (Math.abs(val) < DEADZONE) return 0;
        return (val - Math.sign(val) * DEADZONE) / (1 - DEADZONE);
    }

    // Direct Browser Gamepad Polling
    function pollHardwareGamepads() {
        if (!navigator.getGamepads) return false;
        const gamepads = navigator.getGamepads();
        if (!gamepads) return false;

        const activeList = [];
        for (let i = 0; i < gamepads.length; i++) {
            if (gamepads[i] && gamepads[i].connected) {
                activeList.push(gamepads[i]);
            }
        }

        state.controllerCount = activeList.length;
        state.connected = activeList.length > 0;

        if (activeList.length === 0) return false;

        const primary = activeList[0];
        const secondary = activeList.length > 1 ? activeList[1] : null;

        // Primary thumbstick
        state.stickX = applyDeadzone(primary.axes[0] || 0);
        state.stickY = applyDeadzone(primary.axes[1] || 0);

        // Secondary stick (if single controller has right stick, or 2nd controller)
        if (secondary) {
            state.stick2X = applyDeadzone(secondary.axes[0] || 0);
            state.stick2Y = applyDeadzone(secondary.axes[1] || 0);
        } else if (primary.axes.length >= 4) {
            state.stick2X = applyDeadzone(primary.axes[2] || 0);
            state.stick2Y = applyDeadzone(primary.axes[3] || 0);
        } else {
            state.stick2X = 0;
            state.stick2Y = 0;
        }

        // Buttons & Triggers
        const btn0 = primary.buttons[0]; // Usually trigger or A
        const btn1 = primary.buttons[1]; // Usually grip or B
        const btn2 = primary.buttons[2];
        const btn3 = primary.buttons[3];
        const btnLeftTrigger = primary.buttons[6] || primary.buttons[4];
        const btnRightTrigger = secondary ? (secondary.buttons[0] || secondary.buttons[6]) : (primary.buttons[7] || primary.buttons[5]);

        state.trigger = Boolean(btn0 && (btn0.pressed || btn0.value > 0.25));
        state.triggerValue = btn0 ? btn0.value : (state.trigger ? 1 : 0);
        state.grip = Boolean(btn1 && (btn1.pressed || btn1.value > 0.25));
        state.buttonA = Boolean(btn0 && btn0.pressed);
        state.buttonB = Boolean(btn1 && btn1.pressed);
        state.leftTrigger = Boolean(btnLeftTrigger && btnLeftTrigger.pressed);
        state.rightTrigger = Boolean(btnRightTrigger && btnRightTrigger.pressed);

        // D-pad or face buttons
        state.dpadLeft = Boolean((primary.buttons[14] && primary.buttons[14].pressed) || (primary.axes[0] < -0.6));
        state.dpadRight = Boolean((primary.buttons[15] && primary.buttons[15].pressed) || (primary.axes[0] > 0.6));

        // Dual controllers mapping
        state.leftStick.x = state.stickX;
        state.leftStick.y = state.stickY;
        state.leftStick.trigger = state.trigger;

        if (secondary) {
            state.rightStick.x = state.stick2X;
            state.rightStick.y = state.stick2Y;
            const secBtn = secondary.buttons[0] || secondary.buttons[1];
            state.rightStick.trigger = Boolean(secBtn && (secBtn.pressed || secBtn.value > 0.25));
        }

        if (Math.abs(state.stickX) > 0 || Math.abs(state.stickY) > 0 || state.trigger) {
            state.lastInputTime = Date.now();
        }

        return true;
    }

    // Parent Window PostMessage Listener (handles cross-origin or unfocused iframe restrictions)
    window.addEventListener('message', (e) => {
        if (!e.data || typeof e.data !== 'object') return;

        if (e.data.type === 'SET_INPUT_MODE') {
            state.mode = e.data.mode === 'JOYSTICK' ? 'JOYSTICK' : 'CAMERA';
            console.log('[VRJoystick] Input Mode changed to:', state.mode);
        } else if (e.data.type === 'VR_JOYSTICK_STATE') {
            // State streamed from parent window
            state.connected = Boolean(e.data.connected);
            state.controllerCount = e.data.controllerCount || 1;
            if (typeof e.data.stickX === 'number') state.stickX = e.data.stickX;
            if (typeof e.data.stickY === 'number') state.stickY = e.data.stickY;
            if (typeof e.data.stick2X === 'number') state.stick2X = e.data.stick2X;
            if (typeof e.data.stick2Y === 'number') state.stick2Y = e.data.stick2Y;
            if (typeof e.data.trigger === 'boolean') state.trigger = e.data.trigger;
            if (typeof e.data.leftTrigger === 'boolean') state.leftTrigger = e.data.leftTrigger;
            if (typeof e.data.rightTrigger === 'boolean') state.rightTrigger = e.data.rightTrigger;
            state.lastInputTime = Date.now();
        }
    });

    window.addEventListener('gamepadconnected', (e) => {
        state.connected = true;
        console.log('[VRJoystick] Gamepad connected:', e.gamepad.id);
    });

    window.addEventListener('gamepaddisconnected', () => {
        pollHardwareGamepads();
    });

    // Public API
    window.VRJoystick = {
        init: function(opts) {
            if (opts && opts.gameId) state.gameId = opts.gameId;
            if (opts && opts.initialMode) state.mode = opts.initialMode;
            // Notify parent that game is ready to receive input mode
            try {
                window.parent.postMessage({ type: 'GAME_JOYSTICK_READY', gameId: state.gameId }, '*');
            } catch(e){}
        },

        isJoystickMode: function() {
            return state.mode === 'JOYSTICK';
        },

        setMode: function(newMode) {
            state.mode = newMode === 'JOYSTICK' ? 'JOYSTICK' : 'CAMERA';
        },

        update: function(canvasWidth, canvasHeight) {
            // Poll physical gamepad
            pollHardwareGamepads();

            // Initialize cursor to canvas center if needed
            if (!state.cursorInitialized && canvasWidth && canvasHeight) {
                state.cursorX = canvasWidth / 2;
                state.cursorY = canvasHeight / 2;
                state.cursorInitialized = true;
            }

            // Update virtual cursor if in joystick mode
            if (state.mode === 'JOYSTICK' && canvasWidth && canvasHeight) {
                state.cursorX += state.stickX * state.cursorSpeed;
                state.cursorY += state.stickY * state.cursorSpeed;

                // Clamp to screen bounds
                const pad = 40;
                state.cursorX = Math.max(pad, Math.min(canvasWidth - pad, state.cursorX));
                state.cursorY = Math.max(pad, Math.min(canvasHeight - pad, state.cursorY));
            }

            return state;
        },

        getState: function() {
            return state;
        },

        // Draw In-Game VR Joystick Cyber HUD
        drawHud: function(ctx, canvasWidth, canvasHeight, customHint) {
            if (state.mode !== 'JOYSTICK') return;

            ctx.save();
            const hudY = 18;
            const hudW = Math.min(380, canvasWidth * 0.92);
            const hudH = 34;
            const hudX = (canvasWidth - hudW) / 2;

            // Glassmorphic Cyber Pill
            ctx.shadowBlur = 18;
            ctx.shadowColor = 'rgba(0, 242, 255, 0.35)';
            ctx.fillStyle = 'rgba(5, 11, 24, 0.88)';
            ctx.beginPath();
            if (ctx.roundRect) {
                ctx.roundRect(hudX, hudY, hudW, hudH, 17);
            } else {
                ctx.rect(hudX, hudY, hudW, hudH);
            }
            ctx.fill();

            // Glowing cyan/orange border
            ctx.strokeStyle = state.connected ? '#00f2ff' : '#f37021';
            ctx.lineWidth = 1.8;
            ctx.stroke();

            // Status Indicator Dot
            const dotX = hudX + 18;
            const dotY = hudY + hudH / 2;
            ctx.beginPath();
            ctx.arc(dotX, dotY, 4.5, 0, Math.PI * 2);
            ctx.fillStyle = state.connected ? '#00ff88' : '#ffaa00';
            ctx.shadowBlur = 8;
            ctx.shadowColor = state.connected ? '#00ff88' : '#ffaa00';
            ctx.fill();

            // Controller Label
            ctx.font = '800 11px "Outfit", sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            const statusText = state.connected 
                ? `VR JOYSTICK ACTIVE (${state.controllerCount || 1})` 
                : 'VR JOYSTICK: PRESS ANY BUTTON';
            ctx.fillText(statusText, dotX + 10, dotY);

            // Action Hint Pill on Right
            const hint = customHint || '[STICK] Move  •  [TRIGGER] Action';
            ctx.font = '700 9.5px "Plus Jakarta Sans", monospace';
            ctx.fillStyle = '#00f2ff';
            ctx.textAlign = 'right';
            ctx.fillText(hint, hudX + hudW - 14, dotY);

            // Draw Virtual Reticle if cursor is in use
            const cX = state.cursorX;
            const cY = state.cursorY;
            ctx.shadowBlur = 20;
            ctx.shadowColor = state.trigger ? '#00ff88' : '#00f2ff';
            ctx.strokeStyle = state.trigger ? '#00ff88' : '#00f2ff';
            ctx.lineWidth = 2.5;

            // Outer Reticle Circle
            ctx.beginPath();
            ctx.arc(cX, cY, state.trigger ? 18 : 24, 0, Math.PI * 2);
            ctx.stroke();

            // Inner Core Dot
            ctx.fillStyle = state.trigger ? '#00ff88' : '#ffffff';
            ctx.beginPath();
            ctx.arc(cX, cY, 5, 0, Math.PI * 2);
            ctx.fill();

            // Crosshair Ticks
            const tickLen = 6;
            const tickDist = state.trigger ? 22 : 28;
            ctx.beginPath();
            ctx.moveTo(cX - tickDist, cY); ctx.lineTo(cX - tickDist + tickLen, cY);
            ctx.moveTo(cX + tickDist, cY); ctx.lineTo(cX + tickDist - tickLen, cY);
            ctx.moveTo(cX, cY - tickDist); ctx.lineTo(cX, cY - tickDist + tickLen);
            ctx.moveTo(cX, cY + tickDist); ctx.lineTo(cX, cY + tickDist - tickLen);
            ctx.stroke();

            ctx.restore();
        }
    };
})();
