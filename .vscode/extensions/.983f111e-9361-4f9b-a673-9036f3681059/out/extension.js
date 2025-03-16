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
exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const assistant_model_1 = require("./assistant.model");
const selection_panel_1 = require("./selection-panel");
const assistant_utils_1 = require("./assistant.utils");
const animation_utils_1 = require("./animation.utils");
let currentAssistant = "Quack";
let extensionContext;
let statusBarItem;
function activate(context) {
    extensionContext = context;
    setCurrentAssitant();
    extensionContext.globalState.setKeysForSync([assistant_model_1.selectedAssistantKey, assistant_model_1.adoptedListKey]);
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = "$(heart) QuackTrack";
    statusBarItem.tooltip = "Click to select your assistant";
    statusBarItem.command = 'quacktrack-cursor.quacktrack.selectAssistant';
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);
    (0, assistant_utils_1.initizalizeAnimationProcess)(currentAssistant, extensionContext);
    createAssistantSelectionPanel();
}
exports.activate = activate;
function createAssistantSelectionPanel() {
    const disposable = vscode.commands.registerCommand("quacktrack-cursor.quacktrack.selectAssistant", () => (0, selection_panel_1.showAssistantSelector)(extensionContext, selectAssistant));
    if (extensionContext) {
        extensionContext.subscriptions.push(disposable);
    }
}
function setCurrentAssitant() {
    if (!extensionContext) {
        return;
    }
    const globalStateAssistant = extensionContext.globalState.get(assistant_model_1.selectedAssistantKey);
    if (globalStateAssistant) {
        currentAssistant = globalStateAssistant;
    }
}
function selectAssistant(assistant) {
    (0, animation_utils_1.removeCurrentAnimation)();
    currentAssistant = assistant;
    if (extensionContext) {
        (0, assistant_utils_1.createAssistant)(currentAssistant, extensionContext);
    }
    extensionContext?.globalState.update(assistant_model_1.selectedAssistantKey, currentAssistant);
    vscode.window.showInformationMessage(`Your coding is now supervised by ${assistant}`);
}
//# sourceMappingURL=extension.js.map