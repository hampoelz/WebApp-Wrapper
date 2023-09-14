# 📦️ WebApp-Wrapper

> [!WARNING]  
> **WIP - Work in Progress**

**Table of contents**

* [Erste Schritte](#erste-schritte)
* [Konfiguration](#konfiguration)
* [API - Node.js Projekt](#api---nodejs-projekt)
* [API - Webseite](#api---webseite)
* [API - Meldungsfenster](#api---meldungsfenster)

## Erste Schritte

### Projektdateien herunterladen

Um mit der Erstellung einer neuen Anwendung mithilfe des WebApp-Wrappers
zu beginnen, müssen zunächst die Projektdateien heruntergeladen und die
Abhängigkeiten installiert werden.

Dieser Schritt ist mit den folgenden Befehlen einfach zu
bewerkstelligen:

```bash
# Lädt alle erforderlichen Dateien in den Ordner "AppProjectDir" herunter
git clone https://github.com/hampoelz/WebApp-Wrapper.git AppProjectDir

# Wechselt das Arbeitsverzeichnis in den Ordner "AppProjectDir"
cd AppProjectDir

# Installiert alle Abhängigkeiten des WebApp-Wrappers
npm install
```

### Konfigurationen anpassen

Bevor die neue Anwendung gestartet werden kann, müssen zunächst die
erforderlichen Konfigurationen in der Datei `capacitor.config.json` angepasst werden. Die
folgenden Konfigurationen sind erforderlich:

- `appId`: Eine eindeutige Anwendungs-ID
- `appName`: Der Name der Anwendung
- `appUrl`: Die URL der Webseite, die in der Anwendung angezeigt wird.

Weitere Konfigurationen können im Kapitel [Konfiguration](#Konfiguration) gefunden werden.

### Plattformen hinzufügen

Nachdem die Konfiguration abgeschlossen ist, können Plattformen
hinzugefügt werden, auf denen die Anwendung ausgeführt werden soll.

Die folgenden Befehle können verwendet werden, um Plattformen
hinzuzufügen:

```bash
# Erzeugt die Projektdateien für die Plattformen
npm run build

# Fügt der Anwendung Unterstützung für eine Plattform hinzu
npx cap add <Plattform>

# Synchronisiert die Plattform mit den Projektdateien
npx cap sync <Plattform>
```

Die verfügbaren Plattformen sind `android`, `ios` und `electron`. Die Plattform "Electron"
bezieht sich auf Desktop-Plattformen, also Windows, Linux und macOS.

Wenn die Konfiguration später geändert wird, müssen die folgenden
Befehle erneut ausgeführt werden:

```bash
# Aktualisiert die Projektdateien mit den neuen Konfigurationen
npm run build

# Synchronisiert die angegebenen Plattform mit den Projektdateien
npx cap sync <Plattform>
```

### Node.js Projekt hinzufügen

Um zusätzliche Funktionen in die Anwendung zu integrieren, kann ein
Node.js Projekt in das Verzeichnis `nodejs` hinzugefügt werden. Dieses
Verzeichnis ist bereits vorkonfiguriert, sodass ein Node.js Projekt
einfach integrieren werden kann.

Nach dem Hinzufügen oder Ändern des Node.js Projekts müssen die
folgenden Befehle ausgeführt werden, um die Projektdateien zu
aktualisieren:

```bash
# Aktualisiert die Projektdateien mit dem Node.js Projekt
npm run build

# Synchronisiert die Plattform mit den Projektdateien
npx cap sync <Plattform>
```

### Anwendung starten

Um die Anwendung schließlich zu starten, kann der folgende Befehl
verwendet werden.

```bash
# Öffnet das Projekt für die angegebene Plattform
npx cap open <Plattform>
```

Dieser Befehl öffnet das Projekt für die angegebene Plattform in der
entsprechenden Entwicklungsumgebung. Bei Android und iOS wird Android
Studio bzw. Xcode geöffnet, wenn diese auf dem System installiert sind.
In der Entwicklungsumgebung können weitere Aktionen durchgeführt werden,
wie das Testen im Emulator, das Debuggen oder das Kompilieren.

Alternativ kann das Projekt für eine Plattform auch manuell geöffnet
werden. Die entsprechenden Plattform-Projektdateien befinden sich in
den Verzeichnissen `android` und `ios`.

Bei Electron wird die Anwendung direkt gestartet. Weitere Aktionen
können dabei im Plattform-Projektordner `electron` durchgeführt werden.

## Konfiguration

Die folgenden Konfigurationen sind verfügbar:

| **Prop** | **Type** | **Description** |
|----------|----------|-----------------|
| `appId` | `string` | Ein eindeutiger Bezeichner für die Anwendung. Sie wird auch als Bundle-ID in iOS und als Anwendungs-ID in Android bezeichnet. Sie muss in umgekehrter Domänennamenschreibweise angegeben werden, was im Allgemeinen einen Domänennamen darstellt, der dem Unternehmen gehört. |
| `appName` | `string` | Der benutzerfreundliche Name der Anwendung. Dies sollte der Name sein, der im AppStore angezeigt wird. |
| `appUrl` | `string` | Die Adresse der Webseite, die in der Anwendung angezeigt wird. |
| `primaryColor` | `string` | Die Hauptfarbe der Benutzeroberfläche. Der Standardwert ist `"#BB4747"` |  
| `menuColor` | `string` | Die Hintergrundfarbe der Menüleiste. |
| `menu` | `MenuItem[]` | Eine Liste von Menüelementen. Jedes angegebene Menüelement wird in der Menüleiste angezeigt. Wenn diese Konfiguration nicht festgelegt wurde, wird keine Menüleiste angezeigt. |
| `contactUrl` | `string` | Eine Webseite, unter der ein Fehlerbericht erstellt werden kann, wenn die angegebene Webseite aufgrund eines Serverfehlers nicht geladen werden kann. |

**Beispiele**

In `capacitor.config.json`:

```json
{
  "appId": "com.company.app",
  "appName": "Company App",
  "appUrl": "https://app.company.com/",
  "primaryColor": "#1b66c9",
  "menuColor": "#202124",
  "menu": [
    {
      "id": "test-button",
      "type": "button",
      "text": "Hello World"
    }
  ],
  "contactUrl": "",
  "webDir": "dist"
}
```

> [!WARNING]  
> Die Konfiguration `webDir` darf nicht verändert werden. Capacitor verwendet diese
> Konfiguration, um die Plattformen mit den Projektdateien zu
> synchronisieren. Wenn Sie diese Konfiguration ändern, kann es zu
> Problemen bei der Synchronisierung kommen.

## API - Node.js Projekt

Der WebApp-Wrapper bietet im Node.js Projekt eine API an, um
Konfigurationen zu ändern, die Webseite zu steuern und Nachrichten
zwischen dem Node.js Projekt und der Webseite auszutauschen.

Die API-Methoden sind über das Modul `bridge` verfügbar.
Es verfügt über die folgenden Methoden:

* `channel.send('wrapper:updateColor', ...)`
* `channel.send('wrapper:updateMenuColor', ...)`
* `channel.send('wrapper:enableMenu', ...)`
* `channel.send('wrapper:addMenuItem', ...)`
* `channel.send('wrapper:removeMenuItem', ...)`
* `channel.send('wrapper:openMessageScreen', ...)`
* `channel.send('wrapper:closeMessageScreen')`
* `channel.send('wrapper:sendMessage', ...)`
* `channel.addListener('wrapper:onMessage', ...)`
* `channel.addListener('wrapper:onMenuClick', ...)`
* `channel.send('wrapper:loadUrl', ...)`
* `channel.send('wrapper:reload')`
* `channel.send('wrapper:clearHistory')`
* `channel.send('wrapper:goBack')`
* `channel.send('wrapper:goForward')`
* `channel.send('wrapper:executeJavaScript', ...)`
* `channel.addListener('will-navigate', ...)`
* `channel.addListener('did-start-loading', ...)`
* `channel.addListener('did-finish-load', ...)`
* `channel.addListener('did-fail-load', ...)`
* `channel.addListener('dom-ready', ...)`
* Interfaces

### channel.send('wrapper:updateColor', ...)

```typescript
send: (eventName: 'wrapper:updateColor', color: string) => void
```

Aktualisiert die Hauptfarbe der Benutzeroberfläche.

| **Param** | **Type** | **Description** |
|-----------|----------|-----------------|
| `color` | `string` | Die neue Hauptfarbe im `#RRGGBB`-Format. |

### channel.send('wrapper:updateMenuColor', ...)

```typescript
send: (eventName: 'wrapper:updateMenuColor', color: string) => void
```

Ändert die Hintergrundfarbe der Menüleiste.

| **Param** | **Type** | **Description** |
|-----------|----------|-----------------|
| `color` | `string` | Die neue Hintergrundfarbe im `#RRGGBB`-Format. |

### channel.send('wrapper:enableMenu', ...)

```typescript
send: (eventName: 'wrapper:enableMenu', enable: boolean) => void
```

Aktiviert oder deaktiviert die Menüleiste.

| **Param** | **Type** | **Description** |
|-----------|----------|-----------------|
| `enable` | `boolean` | `true`, um die Menüleiste zu aktivieren. `false`, um sie zu deaktivieren.

### channel.send('wrapper:addMenuItem', ...)

```typescript
send: (eventName: 'wrapper:addMenuItem', item: MenuItem) => void
```

Fügt ein `MenuItem` zur Menüleiste hinzu.

| **Param** | **Type** | **Description** |
|-----------|----------|-----------------|
| `item` | `MenuItem` | Das Menüelement, das hinzugefügt werden soll. |

### channel.send('wrapper:removeMenuItem', ...)

```typescript
send: (eventName: 'wrapper:removeMenuItem', itemId: string) => void
```

Entfernt ein Menüelement mit der eindeutigen ID aus der Menüleiste.

| **Param** | **Type** | **Description** |
|-----------|----------|-----------------|
| `itemId` | `string` | Die ID des Menüelements, das entfernt werden soll. |

### channel.send('wrapper:openMessageScreen', ...)

```typescript
send: (eventName: 'wrapper:openMessageScreen', html: string) => void
```

Öffnet oder aktualisiert das Meldungsfenster. Es kann mit HTML angepasst
werden und wird automatisch mit Styles des PicoCSS Frameworks versehen.

| **Param** | **Type** | **Description** |
|-----------|----------|-----------------|
| `html` | `string` | Der HTML-Code für das Meldungsfenster. |

### channel.send('wrapper:closeMessageScreen')

```typescript
send: (eventName: 'wrapper:closeMessageScreen') => void
```

Schließt das Meldungsfenster.

### channel.send('wrapper:sendMessage', ...)

```typescript
send: (eventName: 'wrapper:updateColor', ...args: any[]) => void
```

Sendet eine Nachricht an die Webseite zusammen mit Argumenten. Die
Argumente werden mit JSON serialisiert.

| **Param** | **Type** | **Description** |
|-----------|----------|-----------------|
| `args` | `any[]` | Eine Liste der Argumente, die gesendet werden sollen. |

### channel.addListener('wrapper:onMessage', ...)

```typescript
addListener: (eventName: 'wrapper:onMessage', listener: (...args: any[]) => void) => void
```

Ruft `listener(args...)` auf, wenn eine neue Nachricht von der Webseite eintrifft.

| **Param** | **Type** | **Description** |
|-----------|----------|-----------------|
| `args` | `any[]` | Eine Liste der Argumente, die empfangenen wurden. |

### channel.addListener('wrapper:onMenuClick', ...)

```typescript
addListener: (eventName: 'wrapper:onMenuClick', listener: (itemId: string) => void) => void
```

Ruft `listener(args...)` auf, wenn auf eine Schaltfläche in der Menüleiste geklickt wurde.

| **Param** | **Type** | **Description** |
|-----------|----------|-----------------|
| `itemId` | `string` | Die ID des Menüelements, das angeklickt wurde. |

<!-- -------------------------------------------------- -->

### channel.send('wrapper:loadUrl', ...)

```typescript
send(eventName: 'wrapper:loadUrl', url: string) => void
```

Lädt die angegebene URL in die Ansicht. Die URL muss einen
Protokollpräfix enthalten, z.B. den `https:// `.

| **Param** | **Type** | **Description** |
|-----------|----------|-----------------|
| `url` | `string` | Die URL einer Webseite. |

### channel.send('wrapper:reload')

```typescript
send(eventName: 'wrapper:reload') => void
```

Lädt die aktuelle Webseite neu.

### channel.send('wrapper:clearHistory')

```typescript
send(eventName: 'wrapper:clearHistory') => void
```

Löscht die interne Liste der Rück- und Vorwärtsnavigation.

### channel.send('wrapper:goBack')

```typescript
send(eventName: 'wrapper:goBack') => void
```

Bringt den WebApp-Wrapper dazu, eine Webseite zurückzugehen.

### channel.send('wrapper:goForward')

```typescript
send(eventName: 'wrapper:goForward') => void
```

Bringt den WebApp-Wrapper dazu, eine Webseite nach vorzugehen.

### channel.send('wrapper:executeJavaScript', ...)

```typescript
send(eventName: 'wrapper:executeJavaScript', code: string) => void
```

Führt JavaScript asynchron im Kontext der aktuell angezeigten Webseite
aus.

| **Param** | **Type** | **Description** |
|-----------|----------|-----------------|
| `code` | `string` | Der JavaScript-Code, der ausgeführt werden soll. |

### channel.addListener('will-navigate', ...)

```typescript
addListener(eventName: 'will-navigate', listenerFunc: (url: string, isExternal: boolean) => void) => void
```

Ruft `listenerFunc(data)` auf, wenn ein Benutzer oder die Webseite eine Navigation starten
will. Dies kann geschehen, wenn das Objekt `window.location` geändert wird oder ein
Benutzer auf einen Link auf der Webseite klickt.

Dieses Ereignis wird nicht ausgelöst, wenn die Navigation
programmgesteuert mit APIs gestartet wird, wie `wrapper:loadUrl` und `wrapper:goBack`, oder
für POST-Anfragen.

Es wird auch nicht für seiteninterne Navigationen ausgelöst, wie das
Anklicken von Ankerlinks oder die Aktualisierung des `window.location.hash`.

| **Param** | **Type** | **Description** |
|-----------|----------|-----------------|
| `url` | `string` | Die URL einer Webseite. |
| `isExternal` | `boolean` | Ob die URL im externen Browser oder im WebApp-Wrapper geöffnet wird. |

### channel.addListener('did-start-loading', ...)

```typescript
addListener(eventName: 'did-start-loading', listenerFunc: () => void) => void
```

Ruft `listenerFunc()` auf, wenn die Webseite mit dem Laden begonnen hat.

### channel.addListener('did-finish-load', ...)

```typescript
addListener(eventName: 'did-finish-load', listenerFunc: () => void) => void
```

Ruft `listenerFunc()` auf, wenn das Laden der Webseite abgeschlossen ist. Dies garantiert
nicht, dass der nächste gezeichnete Frame den Zustand des DOMs zu diesem
Zeitpunkt wiedergibt.

### channel.addListener('did-fail-load', ...)

```typescript
addListener(eventName: 'did-fail-load', listenerFunc: (error: WebResourceError) => void) => void
```

Ruft `listenerFunc(data)` auf, wenn die Webseite nicht geladen werden kann. Diese Fehler
weisen in der Regel darauf hin, dass keine Verbindung zum Server
hergestellt werden kann.

| **Param** | **Type** | **Description** |
|-----------|----------|-----------------|
| `error` | `WebResourceError` | Informationen über den aufgetretenen Fehler. |

### channel.addListener('dom-ready', ...)

```typescript
addListener(eventName: 'dom-ready', listenerFunc: () => void) => void
```

Ruft `listenerFunc()` auf, wenn das Dokument im Frame der obersten Ebene geladen wurde.

### Interfaces

#### MenuItem

Ein Interface, das Informationen über ein Menüelement enthält.

| **Prop** | **Type** | **Description** |
|----------|----------|-----------------|
| `id` | `string` | Eine eindeutige ID für das Menüelement. |
| `type` | `string` | Der Anzeigetyp des Menüelements. Die folgenden Typen sind verfügbar: **`text`**: Ein einfaches Textelement. **`separator`**: Ein Trennstrich. **`button`**: Eine Schaltfläche mit Text. **`button_primary`**: Eine Schaltfläche mit Text und hervorgehobener Farbe. |
| `text` | `string` | Der Text, der in der Menüleiste für dieses Element angezeigt wird. |

#### WebResourceError

Ein Interface, das Informationen über den Fehler enthält, der beim Laden
von Webressourcen aufgetreten ist.

| **Prop** | **Type** | **Description** |
|----------|----------|-----------------|
| `errorCode` | `string` | Der Fehlercode des Fehlers. |
| `errorDescription` | `string` | Eine Zeichenfolge, die den Fehler beschreibt. Beschreibungen sind lokalisiert und können daher verwendet werden, um dem Benutzer das Problem mitzuteilen. |
| `validatedURL` | `string` | Die URL, die nicht geladen werden konnte. |

## API - Webseite

Der WebApp-Wrapper bietet auf der Webseite eine API an, um
Konfigurationen zu ändern und Nachrichten zwischen der Webseite und dem
Node.js Projekt auszutauschen.

Die folgenden Methoden stehen zur Verfügung:

* `CapacitorBrowserView.send('wrapper:updateColor', ...)`
* `CapacitorBrowserView.send('wrapper:updateMenuColor', ...)`
* `CapacitorBrowserView.send('wrapper:enableMenu', ...)`
* `CapacitorBrowserView.send('wrapper:addMenuItem', ...)`
* `CapacitorBrowserView.send('wrapper:removeMenuItem', ...)`
* `CapacitorBrowserView.send('wrapper:openMessageScreen', ...)`
* `CapacitorBrowserView.send('wrapper:closeMessageScreen')`
* `CapacitorBrowserView.send('wrapper:sendMessage', ...)`
* `CapacitorBrowserView.addListener('wrapper:onMessage', ...)`
* `CapacitorBrowserView.addListener('wrapper:onMenuClick', ...)`
* Interfaces

### CapacitorBrowserView.send('wrapper:updateColor', ...)

```typescript
send: (eventName: 'wrapper:updateColor', color: string) => void
```

Aktualisiert die Hauptfarbe der Benutzeroberfläche.

| **Param** | **Type** | **Description** |
|-----------|----------|-----------------|
| `color` | `string` | Die neue Hauptfarbe im `#RRGGBB`-Format. |

### CapacitorBrowserView.send('wrapper:updateMenuColor', ...)

```typescript
send: (eventName: 'wrapper:updateMenuColor', color: string) => void
```

Ändert die Hintergrundfarbe der Menüleiste.

| **Param** | **Type** | **Description** |
|-----------|----------|-----------------|
| `color` | `string` | Die neue Hintergrundfarbe im `#RRGGBB`-Format. |

### CapacitorBrowserView.send('wrapper:enableMenu', ...)

```typescript
send: (eventName: 'wrapper:enableMenu', enable: boolean) => void
```

Aktiviert oder deaktiviert die Menüleiste.

| **Param** | **Type** | **Description** |
|-----------|----------|-----------------|
| `enable` | `boolean` | `true`, um die Menüleiste zu aktivieren. `false`, um sie zu deaktivieren.

### CapacitorBrowserView.send('wrapper:addMenuItem', ...)

```typescript
send: (eventName: 'wrapper:addMenuItem', item: MenuItem) => void
```

Fügt ein `MenuItem` zur Menüleiste hinzu.

| **Param** | **Type** | **Description** |
|-----------|----------|-----------------|
| `item` | `MenuItem` | Das Menüelement, das hinzugefügt werden soll. |

### CapacitorBrowserView.send('wrapper:removeMenuItem', ...)

```typescript
send: (eventName: 'wrapper:removeMenuItem', itemId: string) => void
```

Entfernt ein Menüelement mit der eindeutigen ID aus der Menüleiste.

| **Param** | **Type** | **Description** |
|-----------|----------|-----------------|
| `itemId` | `string` | Die ID des Menüelements, das entfernt werden soll. |

### CapacitorBrowserView.send('wrapper:openMessageScreen', ...)

```typescript
send: (eventName: 'wrapper:openMessageScreen', html: string) => void
```

Öffnet oder aktualisiert das Meldungsfenster. Es kann mit HTML angepasst
werden und wird automatisch mit Styles des PicoCSS Frameworks versehen.

| **Param** | **Type** | **Description** |
|-----------|----------|-----------------|
| `html` | `string` | Der HTML-Code für das Meldungsfenster. |

### CapacitorBrowserView.send('wrapper:closeMessageScreen')

```typescript
send: (eventName: 'wrapper:closeMessageScreen') => void
```

Schließt das Meldungsfenster.

### CapacitorBrowserView.send('wrapper:sendMessage', ...)

```typescript
send: (eventName: 'wrapper:updateColor', ...args: any[]) => void
```

Sendet eine Nachricht an das Node.js Projekt zusammen mit Argumenten. Die
Argumente werden mit JSON serialisiert.

| **Param** | **Type** | **Description** |
|-----------|----------|-----------------|
| `args` | `any[]` | Eine Liste der Argumente, die gesendet werden sollen. |

### CapacitorBrowserView.addListener('wrapper:onMessage', ...)

```typescript
addListener: (eventName: 'wrapper:onMessage', listener: (...args: any[]) => void) => void
```

Ruft `listener(args...)` auf, wenn eine neue Nachricht von dem Node.js Projekt eintrifft.

| **Param** | **Type** | **Description** |
|-----------|----------|-----------------|
| `args` | `any[]` | Eine Liste der Argumente, die empfangenen wurden. |

### CapacitorBrowserView.addListener('wrapper:onMenuClick', ...)

```typescript
  addListener: (
    eventName: 'wrapper:onMenuClick',
    listener: (itemId: string) => void
  ) => void
```

Ruft `listener(args...)` auf, wenn auf eine Schaltfläche in der Menüleiste geklickt wurde.

| **Param** | **Type** | **Description** |
|-----------|----------|-----------------|
| `itemId` | `string` | Die ID des Menüelements, das angeklickt wurde. |


### Interfaces

#### MenuItem

Ein Interface, das Informationen über ein Menüelement enthält.

| **Prop** | **Type** | **Description** |
|----------|----------|-----------------|
| `id` | `string` | Eine eindeutige ID für das Menüelement. |
| `type` | `string` | Der Anzeigetyp des Menüelements. Die folgenden Typen sind verfügbar: **`text`**: Ein einfaches Textelement. **`separator`**: Ein Trennstrich. **`button`**: Eine Schaltfläche mit Text. **`button_primary`**: Eine Schaltfläche mit Text und hervorgehobener Farbe. |
| `text` | `string` | Der Text, der in der Menüleiste für dieses Element angezeigt wird. |

## API - Meldungsfenster

Der WebApp-Wrapper bietet im Meldungsfenster eine API an, um es wieder zu schließen
und um Nachrichten an das Node.js Projekt oder an die Webseite zu senden.

Die folgenden Methoden stehen zur Verfügung:

* `closeMessageScreen()`
* `sendMessage(...)`

### closeMessageScreen()

```typescript
closeMessageScreen: () => void
```

Schließt das Meldungsfenster.

### sendMessage(...)

```typescript
sendMessage: (receiver: 'nodejs' | 'pwa', ...args: any[]) => void
```

Sendet eine Nachricht an das Node.js Projekt oder and die Webseite
zusammen mit Argumenten. Die Argumente werden mit JSON
serialisiert.

- `receiver`: Der Empfänger der Nachricht. Die folgenden Werte werden akzeptiert:  
    - `nodejs`: Sendet die Nachricht an das Node.js Projekt  
    - `pwa`: Sendet die Nachricht an die Webseite
- `args`: Eine Liste der Argumente, die gesendet werden sollen.
