import { CreateOptions, MessageChannelCallbackData } from 'capacitor-browserview';
import { ChannelCallbackData, NodeJS } from 'capacitor-nodejs';

import { BrowserView } from './BrowserView';

import config from '../../../capacitor.config.json';

const menu = document.querySelector("#menu ul");
const reloadButton = document.querySelector<HTMLButtonElement>("#reload");
const contactButton = document.querySelector<HTMLButtonElement>("#contact");
const messageScreen = document.querySelector("#message-screen");

const browserOptions: CreateOptions = {
    enableBridge: true,
    backgroundColor: "#00FFFFFF", /* transparent */
};

BrowserView.create(browserOptions).then(async browser => {
    let isOffline = false;

    if (config.primaryColor) {
        updateColor({ args: [config.primaryColor] });
    }

    // load menu if one is specified
    const menuItems = config.menu;
    if (menuItems && menuItems.length > 0) {
        for (const menuItem of menuItems) {
            addMenuItem({ args: [menuItem] });
        }
        enableMenu({ args: [true] });
    }

    if (config.menuColor) {
        updateMenuColor({ args: [config.menuColor] });
    }

    // remove contact button if no url is specified
    if (!config.contactUrl) {
        contactButton?.remove();
    }

    browser.addListener('will-navigate', event => {
        if (event.isExternal) return;
        document.body.classList.remove('idle');
    });
    
    browser.addListener('did-finish-load', () => {
        if (isOffline) return;
        document.body.classList.add('idle');

        // change page background if transparent
        const changeBackground = `
            const html = document.querySelector('html');
            if (getComputedStyle(html).backgroundColor == 'rgba(0, 0, 0, 0)') {
                html.style.backgroundColor = 'white';
            }
        `
        browser.executeJavaScript({ code: changeBackground });
    });

    browser.addListener('did-fail-load', () => {
        isOffline = true;
        browser.hide();

        if (navigator.onLine) {
            document.body.classList.add('page-offline');
            return;
        }

        document.body.classList.add('user-offline');
        window.addEventListener("online", onlineCallback);

        function onlineCallback() {
            window.removeEventListener("online", onlineCallback);
            loadUrl();
        }
    });

    browser.addListener('page-title-updated', event => {
        document.title = `${event.title} - ${config.appName}`;
    });

    // ? TODO: error screens
    //browser.addListener('render-process-gone', () => { });
    //browser.addListener('unresponsive', () => { });
    //browser.addListener('responsive', () => { });

    reloadButton?.addEventListener("click", () => loadUrl());
    contactButton?.addEventListener("click", () => {
        // workaround: cant open external URLs on Capacitor Electron platform
        const code = `window.open("${config.contactUrl}");`;
        browser.executeJavaScript({ code });
    });

    function updateColor(event: MessageChannelCallbackData | ChannelCallbackData) {
        const color = event.args[0];

        const regex = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i;
        const result = regex.exec(color);

        if (!result) return;

        const hexToInt = (hex: string | undefined) => parseInt(hex ?? "FF", 16);
        const hex = { red: result[1], green: result[2], blue: result[3] };
        const rgb = { red: hexToInt(hex.red), green: hexToInt(hex.green), blue: hexToInt(hex.blue) }

        document.documentElement.style.setProperty('--primary-rgb', `${rgb.red}, ${rgb.green}, ${rgb.blue}`);
    }

    function updateMenuColor(event: MessageChannelCallbackData | ChannelCallbackData) {
        const color = event.args[0];
        if (!color) return;

        document.documentElement.style.setProperty('--menu-background', color);
    }

    function enableMenu(event: MessageChannelCallbackData | ChannelCallbackData) {
        const enable = event.args[0];
        if (enable === undefined) return;

        if (enable) {
            document.body.classList.add('menu');
        } else {
            document.body.classList.remove('menu');
        }

        browser.setMenuEnabled(enable);
    }

    function addMenuItem(event: MessageChannelCallbackData | ChannelCallbackData) {
        const item = event.args[0];
        if (!menu || !item) return;

        const menuItem = document.createElement('li');

        switch (item.type) {
            case 'text':
                menuItem.innerHTML = `<p><strong>${item.text}</strong></p>`;
                break;
            case 'separator':
                menuItem.innerHTML = `<p class="separator"><strong>|</strong></p>`;
                break;
            case 'button':
                menuItem.innerHTML = `<a href="#">${item.text}</a>`;
                break;
            case 'button_primary':
                menuItem.innerHTML = `<a href="#" role="button">${item.text}</a>`;
                break;
        }

        if (item.id) {
            menuItem.id = `MenuItem-${item.id}`;

            menuItem.addEventListener('click', () => {
                const data = { eventName: "wrapper:onMenuClick", args: [item.id] };

                NodeJS.send(data);
                browser.sendMessage(data);
            });
        }

        menu.appendChild(menuItem);
    }

    function removeMenuItem(event: MessageChannelCallbackData | ChannelCallbackData) {
        const itemId = event.args[0];
        if (!menu || !itemId) return;

        const id = `MenuItem-${itemId}`;
        const element = menu.querySelector(`#${id}`);
        if (!element) return;

        menu.removeChild(element);
    }

    function openMessageScreen(event: MessageChannelCallbackData | ChannelCallbackData) {
        const html = event.args[0];

        if (isOffline || !messageScreen || !html) return;

        messageScreen.innerHTML = html;
        document.body.classList.add('message');
        browser.hide();
    }

    function closeMessageScreen() {
        if (!messageScreen) return;

        messageScreen.innerHTML = "";
        document.body.classList.remove('message');
        browser.show();
    }

    function sendMessage(receiver: 'nodejs' | 'pwa', ...args: any[]) {
        const data = { eventName: "wrapper:onMessage", args };

        if (receiver === 'nodejs') {
            NodeJS.send(data);
        } else if (receiver === 'pwa') {
            browser.sendMessage(data);
        }
    }

    // ---------------- API ----------------

    /**
     * PWA:
     *  CapacitorBrowserView.send("wrapper:updateColor", color);
     *  CapacitorBrowserView.send("wrapper:updateMenuColor", color);
     *  CapacitorBrowserView.send("wrapper:enableMenu", enable);
     *  CapacitorBrowserView.send("wrapper:addMenuItem", menuItem);
     *  CapacitorBrowserView.send("wrapper:removeMenuItem", itemId);
     *  CapacitorBrowserView.send("wrapper:openMessageScreen", html);
     *  CapacitorBrowserView.send("wrapper:closeMessageScreen");
     *  CapacitorBrowserView.send("wrapper:sendMessage", data...);
     *  CapacitorBrowserView.addListener("wrapper:onMessage", (data...) => {});
     * 
     * Node.js:
     *  const { channel } = require('bridge');
     *  channel.send("wrapper:updateColor", color);
     *  channel.send("wrapper:updateMenuColor", color);
     *  channel.send("wrapper:enableMenu", enable);
     *  channel.send("wrapper:addMenuItem", menuItem);
     *  channel.send("wrapper:removeMenuItem", itemId);
     *  channel.send("wrapper:openMessageScreen", html);
     *  channel.send("wrapper:closeMessageScreen");
     *  channel.send("wrapper:sendMessage", data...);
     *  channel.addListener("wrapper:onMessage", (data...) => {});
     * 
     * Message Screen:
     *  closeMessageScreen();
     *  sendMessage("nodejs" | "pwa", data...);
     */

    browser.addMessageListener("wrapper:updateColor", updateColor);
    NodeJS.addListener("wrapper:updateColor", updateColor);

    browser.addMessageListener("wrapper:updateMenuColor", updateMenuColor);
    NodeJS.addListener("wrapper:updateMenuColor", updateMenuColor);

    browser.addMessageListener("wrapper:enableMenu", enableMenu);
    NodeJS.addListener("wrapper:enableMenu", enableMenu);

    browser.addMessageListener("wrapper:addMenuItem", addMenuItem);
    NodeJS.addListener("wrapper:addMenuItem", addMenuItem);

    browser.addMessageListener("wrapper:removeMenuItem", removeMenuItem);
    NodeJS.addListener("wrapper:removeMenuItem", removeMenuItem);

    browser.addMessageListener("wrapper:openMessageScreen", openMessageScreen);
    NodeJS.addListener("wrapper:openMessageScreen", openMessageScreen);

    browser.addMessageListener("wrapper:closeMessageScreen", closeMessageScreen);
    NodeJS.addListener("wrapper:closeMessageScreen", closeMessageScreen);
    (document as any).closeMessageScreen = closeMessageScreen;

    browser.addMessageListener("wrapper:sendMessage", event => sendMessage("nodejs", ...event.args));
    NodeJS.addListener("wrapper:sendMessage", event => sendMessage("pwa", ...event.args));
    (document as any).sendMessage = sendMessage;

    // ------------ API Forward ------------

    /**
     * Node.js:
     *  const { channel } = require('bridge');
     * 
     *  channel.send("wrapper:loadUrl", url);
     *  channel.send("wrapper:reload");
     *  channel.send("wrapper:clearHistory");
     *  channel.send("wrapper:goBack");
     *  channel.send("wrapper:goForward");
     *  channel.send("wrapper:executeJavaScript", code);
     * 
     *  channel.addListener("will-navigate", url => {});
     *  channel.addListener("did-start-loading", () => {});
     *  channel.addListener("did-finish-load", () => {});
     *  channel.addListener("did-fail-load", error => {});
     *  channel.addListener("dom-ready", () => {});
     */

    NodeJS.addListener("wrapper:loadUrl", event => {
        const url = event.args[0];
        if (!url) return;

        browser.loadUrl({ url });
    });

    NodeJS.addListener("wrapper:reload", () => {
        browser.reload();
    });

    NodeJS.addListener("wrapper:clearHistory", () => {
        browser.clearHistory();
    });

    NodeJS.addListener("wrapper:goBack", () => {
        browser.goBack();
    });

    NodeJS.addListener("wrapper:goForward", () => {
        browser.goForward();
    });

    NodeJS.addListener("wrapper:executeJavaScript", event => {
        const code = event.args[0];
        if (!code) return;

        browser.executeJavaScript({ code });
    });
    
    browser.addListener("will-navigate", event => {
        const eventName = "wrapper:will-navigate";
        const url = event.url;
        NodeJS.send({ eventName, args: [url] });
    });

    browser.addListener("did-start-loading", () => {
        const eventName = "wrapper:did-start-loading";
        NodeJS.send({ eventName, args: [] });
    });

    browser.addListener("did-finish-load", () => {
        const eventName = "wrapper:did-finish-load";
        NodeJS.send({ eventName, args: [] });
    });

    browser.addListener("did-fail-load", event => {
        const eventName = "wrapper:did-fail-load";
        const error = event.error;
        NodeJS.send({ eventName, args: [error] });
    });

    browser.addListener("dom-ready", () => {
        const eventName = "wrapper:dom-ready";
        NodeJS.send({ eventName, args: [] });
    });
    
    // -------------------------------------
    
    await NodeJS.whenReady();
    loadUrl(config.appUrl);

    function loadUrl(url?: string): void {
        document.body.classList.remove('idle', 'page-offline', 'user-offline');
        isOffline = false;

        browser.show();

        if (!url) {
            browser.reload();
        } else {
            browser.loadUrl({ url });
        }
    }
});
