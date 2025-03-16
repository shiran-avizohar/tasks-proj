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
exports.createAssistant = exports.initizalizeAnimationProcess = exports.extensionContext = exports.assistant = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const animation_utils_1 = require("./animation.utils");
function initizalizeAnimationProcess(currentAssistant, context) {
    createAssistant(currentAssistant, context);
    (0, animation_utils_1.displayTypingOrDeleteAssistantDependingOnTextChange)();
    (0, animation_utils_1.displayTransparentAssistantIfCursorIsOnText)();
    vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (editor && editor.document.isUntitled) {
            (0, animation_utils_1.toggleDuckOverlayBasedOnText)(editor);
        }
        else {
            (0, animation_utils_1.showRegularAnimation)();
        }
    });
}
exports.initizalizeAnimationProcess = initizalizeAnimationProcess;
function createAssistant(currentAssistant, context) {
    if (!context) {
        return;
    }
    exports.extensionContext = context;
    const relativePath = path.join(context.extensionPath, "assets");
    const assistantPath = path.join(relativePath, currentAssistant.toLowerCase());
    const assistantTransPath = path.join(assistantPath, "trans");
    exports.assistant = {
        regular: (0, animation_utils_1.createImage)(path.join(assistantPath, `regular.gif`)),
        sleeping: (0, animation_utils_1.createImage)(path.join(assistantPath, `sleeping.gif`)),
        typing: (0, animation_utils_1.createImage)(path.join(assistantPath, `typing.gif`)),
        deleting: (0, animation_utils_1.createImage)(path.join(assistantPath, `angry.gif`)),
        transSleeping: (0, animation_utils_1.createImage)(path.join(assistantTransPath, `sleeping.png`)),
        transRegular: {
            top: (0, animation_utils_1.createImage)(path.join(assistantTransPath, `top.png`)),
            mid: (0, animation_utils_1.createImage)(path.join(assistantTransPath, `mid.png`)),
            bot: (0, animation_utils_1.createImage)(path.join(assistantTransPath, `bot.png`)),
        },
    };
}
exports.createAssistant = createAssistant;
//# sourceMappingURL=assistant.utils.js.map