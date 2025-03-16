"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.displayTypingOrDeleteAssistantDependingOnTextChange = exports.displayTransparentAssistantIfCursorIsOnText = exports.clearAnimationTimer = exports.checkIfAssistantShouldBeTransparent = exports.showRegularAnimation = exports.hideDuckOverlay = exports.toggleDuckOverlayBasedOnText = exports.createImage = exports.removeCurrentAnimation = void 0;
const vscode = __importStar(require("vscode"));
const assistant_utils_1 = require("./assistant.utils");
let activeImage = [];
let transparentAnimationTimer;
let deletingTimer;
let sleepingAnimationTimer;
let typingTimer;
let isDeleteImageShown = false;
let isTransparent = true;
let isTypingImageShown = false;
function removeCurrentAnimation() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }
    activeImage.forEach((decoration) => editor.setDecorations(decoration, []));
    activeImage = [];
}
exports.removeCurrentAnimation = removeCurrentAnimation;
function createImage(imagePath) {
    return vscode.window.createTextEditorDecorationType({
        after: {
            contentIconPath: imagePath,
            margin: "-6px 0px 0px 0px",
            width: "0px",
            height: "0px",
        },
    });
}
exports.createImage = createImage;
function toggleDuckOverlayBasedOnText(editor) {
    const text = editor.document.getText();
    if (text === '') {
        hideDuckOverlay();
    }
    else {
        showRegularAnimation();
    }
}
exports.toggleDuckOverlayBasedOnText = toggleDuckOverlayBasedOnText;
function hideDuckOverlay() {
    removeCurrentAnimation();
    clearAnimationTimer(transparentAnimationTimer);
    clearAnimationTimer(deletingTimer);
    clearAnimationTimer(sleepingAnimationTimer);
    clearAnimationTimer(typingTimer);
    isDeleteImageShown = false;
    isTypingImageShown = false;
}
exports.hideDuckOverlay = hideDuckOverlay;
function showRegularAnimation() {
    if (!assistant_utils_1.extensionContext) {
        vscode.window.showErrorMessage("Extension context is not available.");
        return;
    }
    clearAnimationTimer(transparentAnimationTimer);
    if (isTransparent) {
        startTransparentRegularAnimationInterval();
    }
    else {
        showImage(assistant_utils_1.assistant.regular);
    }
    startSleepingAnimationTimer();
}
exports.showRegularAnimation = showRegularAnimation;
function checkIfAssistantShouldBeTransparent() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }
    const cursorPosition = editor.selection.active;
    isTransparent =
        editor.document
            .lineAt(cursorPosition.line)
            .text.substring(cursorPosition.character)
            .trim().length > 0;
}
exports.checkIfAssistantShouldBeTransparent = checkIfAssistantShouldBeTransparent;
function clearAnimationTimer(animationTimer) {
    if (animationTimer) {
        clearInterval(animationTimer);
    }
}
exports.clearAnimationTimer = clearAnimationTimer;
function displayTransparentAssistantIfCursorIsOnText() {
    vscode.window.onDidChangeTextEditorSelection(() => {
        checkIfAssistantShouldBeTransparent();
        if (!isDeleteImageShown && !isTypingImageShown) {
            showRegularAnimation();
        }
    });
}
exports.displayTransparentAssistantIfCursorIsOnText = displayTransparentAssistantIfCursorIsOnText;
function displayTypingOrDeleteAssistantDependingOnTextChange() {
    vscode.workspace.onDidChangeTextDocument(({ contentChanges }) => {
        if (contentChanges[0].text.length > 0) {
            showTypingAnimation();
        }
        else if (contentChanges[0].text === "") {
            showDeleteAnimation();
        }
    });
}
exports.displayTypingOrDeleteAssistantDependingOnTextChange = displayTypingOrDeleteAssistantDependingOnTextChange;
function showImage(image) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }
    const selection = editor.selection;
    removeCurrentAnimation();
    editor.setDecorations(image, [
        new vscode.Range(selection.start, selection.end),
    ]);
    activeImage.push(image);
}
function showTypingAnimation() {
    clearAnimationTimer(transparentAnimationTimer);
    clearAnimationTimer(typingTimer);
    clearAnimationTimer(sleepingAnimationTimer);
    showImage(assistant_utils_1.assistant.typing);
    isTypingImageShown = true;
    typingTimer = setTimeout(() => {
        isTypingImageShown = false;
        showRegularAnimation();
    }, 750);
}
function startSleepingAnimationTimer() {
    if (!assistant_utils_1.extensionContext) {
        vscode.window.showErrorMessage("Extension context is not available.");
        return;
    }
    clearAnimationTimer(sleepingAnimationTimer);
    sleepingAnimationTimer = setTimeout(() => {
        clearAnimationTimer(transparentAnimationTimer);
        showImage(isTransparent ? assistant_utils_1.assistant.transSleeping : assistant_utils_1.assistant.sleeping);
    }, 3000);
}
function showDeleteAnimation() {
    clearAnimationTimer(transparentAnimationTimer);
    clearAnimationTimer(deletingTimer);
    showImage(assistant_utils_1.assistant.deleting);
    isDeleteImageShown = true;
    deletingTimer = setTimeout(() => {
        isDeleteImageShown = false;
        showRegularAnimation();
    }, 500);
}
function startTransparentRegularAnimationInterval() {
    const assistantImages = [
        "bot",
        "mid",
        "top",
        "mid",
    ];
    let currentImageIndex = 0;
    transparentAnimationTimer = setInterval(() => {
        showImage(assistant_utils_1.assistant.transRegular[assistantImages[currentImageIndex]]);
        currentImageIndex = (currentImageIndex + 1) % assistantImages.length;
    }, 120);
}
//# sourceMappingURL=animation.utils.js.map