export class InputManager {
    constructor(map, options = {}) {
        var _a, _b;
        this.downKeys = new Set();
        this.pressedKeys = new Set();
        this.releasedKeys = new Set();
        this.downMouseButtons = new Set();
        this.pressedMouseButtons = new Set();
        this.releasedMouseButtons = new Set();
        this.clickedMouseButtons = new Set();
        this.mapStack = [];
        this.onKeyDown = (e) => {
            if (!this.enabled)
                return;
            const key = e.code;
            if (this.preventDefault)
                e.preventDefault();
            if (!this.downKeys.has(key)) {
                this.downKeys.add(key);
                this.pressedKeys.add(key);
            }
        };
        this.onKeyUp = (e) => {
            if (!this.enabled)
                return;
            const key = e.code;
            if (this.preventDefault)
                e.preventDefault();
            if (this.downKeys.has(key)) {
                this.downKeys.delete(key);
            }
            this.releasedKeys.add(key);
        };
        this.onMouseDown = (e) => {
            const btn = this.normalizeMouseButton(e);
            if (!btn)
                return;
            this.doMouseDown(btn, e);
        };
        this.onMouseUp = (e) => {
            const btn = this.normalizeMouseButton(e);
            if (!btn)
                return;
            this.doMouseUp(btn, e);
        };
        this.onClick = (e) => {
            const btn = this.normalizeMouseButton(e);
            if (!btn)
                return;
            this.doClick(btn, e);
        };
        this.onTouchStart = (e) => {
            if (e.touches.length === 0)
                return;
            this.doMouseDown("MouseLeft", e);
        };
        this.onTouchEnd = (e) => {
            this.doMouseUp("MouseLeft", e);
            this.doClick("MouseLeft", e);
        };
        this.onTouchCancel = (e) => {
            this.doMouseUp("MouseLeft", e);
        };
        this.onBlur = () => {
            this.resetAll();
        };
        this.keyboardTarget = options.keyboardTarget;
        this.mouseTarget = options.mouseTarget;
        this.touchTarget = options.touchTarget;
        this.blurTarget = options.blurTarget;
        this.enabled = (_a = options.enabled) !== null && _a !== void 0 ? _a : true;
        this.preventDefault = (_b = options.preventDefault) !== null && _b !== void 0 ? _b : false;
        if (map) {
            this.pushMap(map);
        }
        this.attachListeners();
    }
    setEnabled(enabled) {
        this.enabled = enabled;
        if (!enabled) {
            this.resetAll();
        }
    }
    isEnabled() {
        return this.enabled;
    }
    pushMap(map) {
        this.mapStack.push(map);
    }
    popMap() {
        return this.mapStack.pop();
    }
    clearMaps() {
        this.mapStack.length = 0;
    }
    get activeMap() {
        if (this.mapStack.length === 0)
            return undefined;
        return this.mapStack[this.mapStack.length - 1];
    }
    endFrame() {
        this.pressedKeys.clear();
        this.releasedKeys.clear();
        this.pressedMouseButtons.clear();
        this.releasedMouseButtons.clear();
        this.clickedMouseButtons.clear();
    }
    resetFrame() {
        this.endFrame();
    }
    isKeyDown(key) {
        return this.downKeys.has(key);
    }
    peekKeyPressed(key) {
        return this.pressedKeys.has(key);
    }
    consumeKeyPressed(key) {
        if (this.pressedKeys.has(key)) {
            this.pressedKeys.delete(key);
            return true;
        }
        return false;
    }
    peekKeyReleased(key) {
        return this.releasedKeys.has(key);
    }
    consumeKeyReleased(key) {
        if (this.releasedKeys.has(key)) {
            this.releasedKeys.delete(key);
            return true;
        }
        return false;
    }
    isMouseDown(button) {
        return this.downMouseButtons.has(button);
    }
    peekMousePressed(button) {
        return this.pressedMouseButtons.has(button);
    }
    consumeMousePressed(button) {
        if (this.pressedMouseButtons.has(button)) {
            this.pressedMouseButtons.delete(button);
            return true;
        }
        return false;
    }
    peekMouseReleased(button) {
        return this.releasedMouseButtons.has(button);
    }
    consumeMouseReleased(button) {
        if (this.releasedMouseButtons.has(button)) {
            this.releasedMouseButtons.delete(button);
            return true;
        }
        return false;
    }
    peekMouseClicked(button) {
        return this.clickedMouseButtons.has(button);
    }
    consumeMouseClicked(button) {
        if (this.clickedMouseButtons.has(button)) {
            this.clickedMouseButtons.delete(button);
            return true;
        }
        return false;
    }
    isActionDown(action) {
        const tokens = this.getActionTokens(action);
        for (const token of tokens) {
            if (this.isMouseToken(token)) {
                if (this.isMouseDown(token))
                    return true;
            }
            else {
                if (this.isKeyDown(token))
                    return true;
            }
        }
        return false;
    }
    peekActionPressed(action) {
        const tokens = this.getActionTokens(action);
        for (const token of tokens) {
            if (this.isMouseToken(token)) {
                if (this.peekMousePressed(token))
                    return true;
            }
            else {
                if (this.peekKeyPressed(token))
                    return true;
            }
        }
        return false;
    }
    consumeActionPressed(action) {
        const tokens = this.getActionTokens(action);
        let consumed = false;
        for (const token of tokens) {
            if (this.isMouseToken(token)) {
                if (this.consumeMousePressed(token))
                    consumed = true;
            }
            else {
                if (this.consumeKeyPressed(token))
                    consumed = true;
            }
        }
        return consumed;
    }
    peekActionReleased(action) {
        const tokens = this.getActionTokens(action);
        for (const token of tokens) {
            if (this.isMouseToken(token)) {
                if (this.peekMouseReleased(token))
                    return true;
            }
            else {
                if (this.peekKeyReleased(token))
                    return true;
            }
        }
        return false;
    }
    consumeActionReleased(action) {
        const tokens = this.getActionTokens(action);
        let consumed = false;
        for (const token of tokens) {
            if (this.isMouseToken(token)) {
                if (this.consumeMouseReleased(token))
                    consumed = true;
            }
            else {
                if (this.consumeKeyReleased(token))
                    consumed = true;
            }
        }
        return consumed;
    }
    destroy() {
        this.detachListeners();
        this.resetAll();
        this.clearMaps();
    }
    attachListeners() {
        if (this.keyboardTarget != undefined) {
            this.keyboardTarget.addEventListener("keydown", this.onKeyDown);
            this.keyboardTarget.addEventListener("keyup", this.onKeyUp);
        }
        if (this.mouseTarget != undefined) {
            this.mouseTarget.addEventListener("mousedown", this.onMouseDown);
            this.mouseTarget.addEventListener("mouseup", this.onMouseUp);
            this.mouseTarget.addEventListener("click", this.onClick);
        }
        if (this.touchTarget != undefined) {
            this.touchTarget.addEventListener("touchstart", this.onTouchStart, { passive: false });
            this.touchTarget.addEventListener("touchend", this.onTouchEnd, { passive: false });
            this.touchTarget.addEventListener("touchcancel", this.onTouchCancel, { passive: false });
        }
        if (this.blurTarget != undefined) {
            this.blurTarget.addEventListener("blur", this.onBlur);
        }
    }
    detachListeners() {
        if (this.keyboardTarget != undefined) {
            this.keyboardTarget.removeEventListener("keydown", this.onKeyDown);
            this.keyboardTarget.removeEventListener("keyup", this.onKeyUp);
        }
        if (this.mouseTarget != undefined) {
            this.mouseTarget.removeEventListener("mousedown", this.onMouseDown);
            this.mouseTarget.removeEventListener("mouseup", this.onMouseUp);
            this.mouseTarget.removeEventListener("click", this.onClick);
        }
        if (this.touchTarget != undefined) {
            this.touchTarget.removeEventListener("touchstart", this.onTouchStart);
            this.touchTarget.removeEventListener("touchend", this.onTouchEnd);
            this.touchTarget.removeEventListener("touchcancel", this.onTouchCancel);
        }
        if (this.blurTarget != undefined) {
            this.blurTarget.removeEventListener("blur", this.onBlur);
        }
    }
    getActionTokens(action) {
        var _a;
        const map = this.activeMap;
        return (_a = map === null || map === void 0 ? void 0 : map.getTokens(action)) !== null && _a !== void 0 ? _a : [];
    }
    isMouseToken(token) {
        return token.startsWith("Mouse");
    }
    normalizeMouseButton(e) {
        switch (e.button) {
            case 0: return "MouseLeft";
            case 1: return "MouseMiddle";
            case 2: return "MouseRight";
            default: return null;
        }
    }
    doMouseDown(button, e) {
        if (!this.enabled)
            return;
        if (this.preventDefault && e)
            e.preventDefault();
        if (!this.downMouseButtons.has(button)) {
            this.downMouseButtons.add(button);
            this.pressedMouseButtons.add(button);
        }
    }
    doMouseUp(button, e) {
        if (!this.enabled)
            return;
        if (this.preventDefault && e)
            e.preventDefault();
        if (this.downMouseButtons.has(button)) {
            this.downMouseButtons.delete(button);
        }
        this.releasedMouseButtons.add(button);
    }
    doClick(button, e) {
        if (!this.enabled)
            return;
        if (this.preventDefault && e)
            e.preventDefault();
        this.clickedMouseButtons.add(button);
    }
    resetAll() {
        this.downKeys.clear();
        this.pressedKeys.clear();
        this.releasedKeys.clear();
        this.downMouseButtons.clear();
        this.pressedMouseButtons.clear();
        this.releasedMouseButtons.clear();
        this.clickedMouseButtons.clear();
    }
}
