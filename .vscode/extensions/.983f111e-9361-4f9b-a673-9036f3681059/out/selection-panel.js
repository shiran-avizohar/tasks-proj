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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.showAssistantSelector = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const assistant_model_1 = require("./assistant.model");
const axios_1 = __importDefault(require("axios"));
const redeemCodeCommand = "redeemCode";
const sendSnekEmailCommand = "sendSnekEmail";
const selectAssistantCommand = "selectAssistant";
const freeSkins = ["Quack", "Snoil"];
// let baseUrl = "http://localhost:3000";
let baseUrl = "https://www.quacktrack.fun";
function initializeList(extensionContext) {
    const adoptedList = extensionContext.globalState.get(assistant_model_1.adoptedListKey);
    if (!adoptedList) {
        extensionContext.globalState.update(assistant_model_1.adoptedListKey, freeSkins);
    }
}
function showAssistantSelector(extensionContext, select) {
    if (!extensionContext) {
        return;
    }
    const panel = vscode.window.createWebviewPanel("assistantSelector", "Select Your Assistant", vscode.ViewColumn.One, {
        enableScripts: true,
    });
    const selectedAssistant = extensionContext.globalState.get(assistant_model_1.selectedAssistantKey);
    initializeList(extensionContext);
    let adoptedList = extensionContext.globalState.get(assistant_model_1.adoptedListKey);
    const descriptions = {};
    const price = {};
    assistant_model_1.assistants.forEach((assistant) => {
        switch (assistant) {
            case "Quack":
                descriptions[assistant] = "(•ө•)";
                price[assistant] = 0;
                break;
            case "Snoil":
                descriptions[assistant] = "For lazy days";
                price[assistant] = 0;
                break;
            case "Snek":
                descriptions[assistant] = "For Python enthusiastsss";
                price[assistant] = 0;
                break;
            case "Alberto":
                descriptions[assistant] = "Cold-blooded efficiency";
                price[assistant] = 3.99;
                break;
            case "Aurora":
                descriptions[assistant] = "Purr-fectly adorable!";
                price[assistant] = 3.99;
                break;
            case "Arnold":
                descriptions[assistant] = "Chillin' in Linux world";
                price[assistant] = 3.99;
                break;
            case "Boo":
                descriptions[assistant] = "Hauntingly good companion 👻";
                price[assistant] = 3.99;
                break;
            case "Tomir":
                descriptions[assistant] = "A bark for every line!";
                price[assistant] = 3.99;
                break;
            case "Krusti":
                descriptions[assistant] = "Pinching bugs & cracking code!";
                price[assistant] = 3.99;
                break;
            case "Frosty McFlake":
                descriptions[assistant] = "No meltdown under pressure!";
                price[assistant] = 3.99;
                break;
        }
    });
    const panelAssistants = assistant_model_1.assistants.map((assistant) => ({
        name: assistant,
        uri: panel.webview.asWebviewUri(vscode.Uri.file(path.join(extensionContext.extensionPath, "assets", assistant.toLowerCase(), "profile_pic.gif"))),
        // paymentLink: "http://localhost:3000/buy-" + assistant,
        // paymentLink: "https://b961-2a02-a318-e1ba-2280-7423-71dc-72d-9ec5.ngrok-free.app/buy-" + assistant,
        paymentLink: baseUrl + "/buy-" + assistant.replace(/\s+/g, ""),
        description: descriptions[assistant],
        price: price[assistant],
    }));
    if (adoptedList) {
        panel.webview.html = getWebviewContent(panelAssistants, selectedAssistant, adoptedList);
        panel.webview.onDidReceiveMessage(async (message) => {
            switch (message.command) {
                case selectAssistantCommand:
                    select(message.assistant);
                    panel.webview.html = getWebviewContent(panelAssistants, message.assistant, adoptedList ?? freeSkins);
                    break;
                case redeemCodeCommand:
                    await redeemCode(message.inputValue, extensionContext);
                    adoptedList =
                        extensionContext?.globalState.get(assistant_model_1.adoptedListKey);
                    panel.webview.html = getWebviewContent(panelAssistants, selectedAssistant, adoptedList ?? freeSkins);
                    break;
                case sendSnekEmailCommand:
                    adoptedList = extensionContext?.globalState.get(assistant_model_1.adoptedListKey) || [];
                    try {
                        await axios_1.default.post(`${baseUrl}/get-snek`, {
                            email: message.email
                        });
                        vscode.window.showInformationMessage("Email sent. Check your inbox to redeem your skin.");
                        panel.webview.html = getWebviewContent(panelAssistants, selectedAssistant, adoptedList);
                    }
                    catch (error) {
                        vscode.window.showErrorMessage("Failed to send email. Please try again.");
                    }
                    break;
            }
        }, undefined, extensionContext?.subscriptions);
    }
}
exports.showAssistantSelector = showAssistantSelector;
async function redeemCode(activationCode, extensionContext) {
    let response;
    try {
        response = await axios_1.default.post(baseUrl + "/redeem-code", {
            activationCode: activationCode.toUpperCase(),
        });
    }
    catch (err) {
        vscode.window.showErrorMessage("Something went wrong. You were unable to adopt assistant.", JSON.stringify(err));
        return;
    }
    const responseData = (await response.data);
    if (responseData.success) {
        const purchasedSkin = responseData.skin;
        const adoptedList = extensionContext?.globalState.get(assistant_model_1.adoptedListKey);
        extensionContext?.globalState.update(assistant_model_1.adoptedListKey, [
            ...(adoptedList || freeSkins),
            purchasedSkin,
        ]);
        vscode.window.showInformationMessage("Adopted: " + purchasedSkin);
    }
    else {
        vscode.window.showErrorMessage("You were unable to adopt assistant. Check your activation code and try again.");
    }
}
function getWebviewContent(assistants, selectedAssistant, availableSkins) {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Select Assistant</title>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
          body {
              font-family: 'Inter', 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            min-height: 100vh;
            background: linear-gradient(to bottom right, black, rgba(31, 31, 31, 0.5));
            padding: 1.5rem;
            background-color: black;
          }
          
          @media (min-width: 768px) {
            body {
              padding: 3rem;
            }
          }

.fixed {
    position: fixed;
}

.bottom-6 {
    bottom: 3.5rem;
}

.right-6 {
    right: 1.5rem;
}

.z-50 {
    z-index: 50;
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background-color: rgba(9, 9, 11, 0.95);
    border-radius: 12px;
    padding: 24px;
    width: 90%;
    max-width: 400px;
    border: 1px solid #222223;
}

.modal-header {
    margin-bottom: 20px;
}

.modal-header h2 {
    color: white;
    margin: 0;
    text-align: left;
    align-self: start;
}

.glass-input {
    width: 100%;
    box-sizing: border-box;
    padding: 12px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    color: white;
    font-size: 16px;
    margin-bottom: 16px;
}

.glass-input::placeholder {
    color: rgba(255, 255, 255, 0.5);
}

.glass-input:focus {
    outline: none;
    border-color: #f59e0b;
}

.hidden {
    display: none;
}

.bg-background\/95 {
    background-color: rgba(255, 255, 255, 0.95);
}

.backdrop-blur-lg {
    backdrop-filter: blur(10px);
}

.border-white\/10 {
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.text-2xl {
    font-size: 1.5rem;
}

.font-bold {
    font-weight: bold;
}

          h1{
          margin-bottom: 16px;
          text-align: center;
          font-size: 3rem;
          width: 100%;
          color: white;
          }

          .assistant {
            margin: 10px;
          }

          .assistants {
          margin-top: 1.5rem;
            display: grid;
            grid-template-columns: repeat(1, 1fr);
            gap: 1.5rem;
          }
          
          @media (min-width: 640px) {
            .assistants {
              grid-template-columns: repeat(2, 1fr);
            }
          }
          
          @media (min-width: 1024px) {
            .assistants {
              grid-template-columns: repeat(3, 1fr);
            }
          }
          
          @media (min-width: 1280px) {
            .assistants {
              grid-template-columns: repeat(4, 1fr);
            }
          }

          .assistant-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
          }

          // button {
          //   cursor: pointer;
          //   outline: 1px solid white;
          //   border: none;
          //   background: #1F1F1F;
          //   border-radius: 10px;
          // }

          .selected {
            outline: 3px solid #e0b209;
            border-radius: 10px;
          }

          .cooming-soon{
          outline: 1px solid white;
          border-radius: 10px;
          padding: 12px;
          }

          .tile-text{
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 0;
          }

          .redeem-btn{
          font-weight: 500;
          outline: none;
          margin-left: 4px;
          margin-top: 0;
          padding: 4px 8px;
          }

        button {
          cursor: pointer;
        }

        .redeem-code-container {
        margin-bottom: 24px;
        }

        .description{
        text-align: center;
        }

        button[disabled] {
        pointer-event: none;
        outline: 1px solid black;
        opacity: 0.4;
        }

.assistant-card {
display: flex;
flex-direction: column;
padding: 24px;
justify-content: center;
align-items: center;
  position: relative;
  overflow: hidden;
  border-radius: 0.75rem;
  background-color: #19191B;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 300ms ease-out;
}
  h2, p {
    text-align: center;
  }

.assistant-card:not(.selected-card):hover {
  border-color: rgba(255, 255, 255, 0.2);
  background-color: #1D1D20;
}

        .bundle-container {
          width: 100%;
          max-width: 36rem;
          margin: 0 auto;
        }

        .bundle-container:hover {
          transform: scale(1.02);
        }

        .bundle-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }

.premium-button {
cursor: pointer;
border: none;
  background: linear-gradient(to right, #f59e0b, #d97706);
  color: black;
  font-size: 1rem;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  transition: all 300ms;
  box-shadow: -5px 0 10px 2px rgba(0, 0, 0, 0.6);
}

.premium-button:hover {
  background: linear-gradient(to right, #fbbf24, #f59e0b);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.25);
}

.premium-button:active {
  transform: scale(0.95);
}

        .price-container {
          display: flex;
          align-items: baseline;
          gap: 0.75rem;
        }

        .current-price {
          font-size: 1.5rem;
          font-weight: bold;
        }

        .original-price {
          font-size: 1.125rem;
          color: #666;
          text-decoration: line-through;
        }

        .savings-badge {
          background: linear-gradient(to right, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.2));
          padding: 0.5rem 1rem;
          border-radius: 9999px;
        }

        .savings-text {
          color: #f59e0b;
          font-weight: 600;
        }

  .w-full {
    width: 100%;
  }

.close-button {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.6);
    font-size: 24px;
    cursor: pointer;
    padding: 4px;
    line-height: 1;
}

.close-button:hover {
    color: white;
}

        .adopt-button {
        border: none;
        text-align: center;
        text-decoration: none;
          background: linear-gradient(to right, rgba(245, 158, 11, 0.9), rgba(217, 119, 6, 0.9));
          backdrop-filter: blur(4px);
          color: black;
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          transition: all 300ms ease;
          font-size: 0.875rem;
          width: 100%;
          display: block;
          box-sizing: border-box;
        }

        .adopt-button:not(:disabled):hover {
          background: linear-gradient(to right, rgba(251, 191, 36, 0.9), rgba(245, 158, 11, 0.9));
          color: black;
          }

        .adopt-button:active {
          transform: scale(0.95);
        }

        .bundle-description {
          font-size: 0.875rem;
          color: #666;
        }

        .bundle-button {
          width: 100%;
        }

        button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          background: rgba(245, 158, 11, 0.5);
        }

        .selected-card {
          outline: 2px solid #f59e0b;
          box-shadow: 0 0 15px rgba(245, 158, 11, 0.3);
          transform: scale(1.02);
        }

        .badge {
          position: absolute;
          top: 12px;
          left: 12px;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
          z-index: 10;
        }

        .popular-badge {
          background: linear-gradient(to right, #f59e0b, #d97706);
          color: black;
        }

        .new-badge {
          background: linear-gradient(to right, #3b82f6, #2563eb);
          color: white;
        }

        </style>
      </head>
      <body>
        <style>
          body {
            min-height: 100vh;
            background: linear-gradient(to bottom right, black, rgba(31, 31, 31, 0.5));
            padding: 1.5rem;
          }
          
          @media (min-width: 768px) {
            body {
              padding: 3rem;
            }
          }
        </style>
        <h1>Select Your Assistant</h1>
            ${availableSkins.length === assistants.length
        ? ""
        : `
            <div class="bundle-container assistant-card">
                <div class="bundle-content">
                  <div class="price-container">
                    <span class="current-price">$27.18</span>
                    <span class="original-price">$33.98</span>
                  </div>
                  <div class="savings-badge">
                    <span class="savings-text">Save 20% Today!</span>
                  </div>
                  <p class="bundle-description">
                    Get lifetime access to ALL (7) assistants at the best price.
                  </p>
                </div>
                        <button
                    class="premium-button w-full"
                  >
                    Get All Assistants
                  </button>
            </div>
            `}
        <div class="assistants">
        ${assistants
        .map((assistant) => `
              <div class="assistant-card ${assistant.name} ${selectedAssistant === assistant.name ? "selected-card" : ""}">
                ${assistant.name === "Aurora"
        ? `<div class="badge popular-badge">Most Popular</div>`
        : assistant.name === "Frosty McFlake"
            ? `<div class="badge new-badge">New!</div>`
            : ""}
                <img src="${assistant.uri}" class="assistant" width="100" height="100">

                <h2 class="tile-text">${assistant.name}</h2>
                <p class="description"><i>${assistant.description}</i></p>
                ${availableSkins.includes(assistant.name)
        ? `<button id="${assistant.name}" 
                        class="select-assistant adopt-button ${selectedAssistant === assistant.name ? "selected" : ""}"
                        ${selectedAssistant === assistant.name ? "disabled" : ""}>
                        ${selectedAssistant === assistant.name
            ? "Currently Selected"
            : "Select"}
                       </button>`
        : assistant.name === "Snek"
            ? `<button class="adopt-button" id="getSnekBtn">Get Snek for Free</button>`
            : `<a class="adopt-button" href="${assistant.paymentLink}"> Adopt forever - $${assistant.price} </a>`}
              </div>
            `)
        .join("")}
            <button id="activationButton" class="fixed bottom-6 right-6 premium-button z-50">
      Enter Activation Code
    </button>

    <div id="activationModal" class="modal hidden">
        <div class="modal-content">
            <div class="modal-header">
                <h2 style="display: flex; justify-content: space-between; align-items: center;">
                    Activate Premium
                    <button class="close-button" id="closeModal">×</button>
                </h2>
            </div>
            <div class="modal-body">
                <form class="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Enter Activation Code"
                        class="glass-input"
                        id="activationCode"
                    />
                    <button type="submit" id="redeemCode" class="premium-button w-full">
                        Redeem
                    </button>
                </form>
            </div>
        </div>
    </div>

    <div id="snekModal" class="modal hidden">
        <div class="modal-content">
            <div class="modal-header">
                <h2 style="display: flex; justify-content: space-between; align-items: center;">
                    Get Snek for Free
                    <button class="close-button" id="closeSnekModal">×</button>
                </h2>
            </div>
            <div class="modal-body">
                <form id="snekForm" class="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        class="glass-input"
                        id="snekEmail"
                        required
                    />
                    <button type="submit" class="premium-button w-full">
                        Get Snek
                    </button>
                </form>
            </div>
        </div>
    </div>
        <script>
          const inputValue = document.getElementById('activationCode');
          const vscode = acquireVsCodeApi();
          const form = document.querySelector('form');
          
          form.addEventListener('submit', (e) => {
            e.preventDefault();
            vscode.postMessage({
              command: \`${redeemCodeCommand}\`,
              inputValue: inputValue.value
            });
          });

document.addEventListener('DOMContentLoaded', function() {
    const activationButton = document.getElementById('activationButton');
    const activationModal = document.getElementById('activationModal');

    activationButton.addEventListener('click', function() {
        activationModal.classList.toggle('hidden');
    });

    closeModal.addEventListener('click', function() {
        activationModal.classList.add('hidden');
    });

    // Zamykanie modalu po kliknięciu poza nim
    activationModal.addEventListener('click', function(e) {
        if (e.target === activationModal) {
            activationModal.classList.add('hidden');
        }
    });

    // Add any additional JavaScript for form handling here
});

          document.querySelectorAll('.select-assistant').forEach(assistant => {
            assistant.addEventListener('click', () => {
              vscode.postMessage({
                command: '${selectAssistantCommand}',
                assistant: assistant.id
              });
            });
          });

          const snekModal = document.getElementById('snekModal');
          const getSnekBtn = document.getElementById('getSnekBtn');
          const closeSnekModal = document.getElementById('closeSnekModal');
          const snekForm = document.getElementById('snekForm');

          if (getSnekBtn) {
            getSnekBtn.addEventListener('click', (e) => {
              e.stopPropagation(); // Prevent event bubbling
              snekModal.classList.remove('hidden');
            });
          }

          if (closeSnekModal) {
            closeSnekModal.addEventListener('click', () => {
              snekModal.classList.add('hidden');
            });
          }

          snekModal.addEventListener('click', (e) => {
            if (e.target === snekModal) {
              snekModal.classList.add('hidden');
            }
          });

          snekForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('snekEmail').value;
            vscode.postMessage({
              command: '${sendSnekEmailCommand}',
              email: email
            });
            snekModal.classList.add('hidden');
            vscode.postMessage({
              command: '${selectAssistantCommand}',
              assistant: selectedAssistant || 'Quack'
            });
          });
        </script>
      </body>
      </html>
    `;
}
//# sourceMappingURL=selection-panel.js.map