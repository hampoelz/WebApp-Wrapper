import { BrowserView as CapacitorBrowserView, CreateOptions, Rectangle, UrlPayloadData } from 'capacitor-browserview';

const BAR_HEIGHT = 3;
const MENU_HEIGHT = 36;

export class BrowserView extends CapacitorBrowserView {
    private isHidden = false;
    
    private hideBrowserView = false;
    private showLoadingScreen = false;
    private showLoadingBar = false;
    private showMenu = false;

    constructor(uuid: string) {
        super({ uuid });

        super.addListener('will-navigate', event => {
            if (event.isExternal) return;
            this.showLoadingBar = true;
            this.updateBounds();
        });

        super.addListener('did-finish-load', () => {
            this.showLoadingBar = false;
            this.showLoadingScreen = false;
            this.updateBounds();
        });

        window.addEventListener('resize', () => {
            this.updateBounds();
        });

        this.updateBounds();
    }

    static override async create(options?: CreateOptions | undefined): Promise<BrowserView> {
        const browserView = await CapacitorBrowserView.create(options);

        // workaround to get private uuid property
        // ? change browserViewUUID modifier to protected
        const browserViewUUID = (browserView as any).browserViewUUID;

        const uuid = browserViewUUID.uuid;
        return new BrowserView(uuid);
    }

    public override loadUrl(args: UrlPayloadData): Promise<void> {
        this.showLoadingScreen = true;
        return super.loadUrl(args);

    }

    public setMenuEnabled(enabled: boolean) {
        this.showMenu = enabled;
        this.updateBounds();
    }

    public hide(): void {
        this.hideBrowserView = true;
        this.updateBounds();
    }

    public show(): void {
        this.hideBrowserView = false;
        this.updateBounds();
    }

    private updateBounds(): void {
        const shouldHide = this.showLoadingScreen || this.hideBrowserView;

        if (this.isHidden) {
            if (shouldHide) {
                return;
            }

            this.isHidden = false;
        }

        // if the Capacitor html page is completely covered by the
        // BrowserView, the resize event does not work correctly.
        const border = 1;

        let x = border;
        let y = border;
        let width = window.innerWidth - border;
        let height = window.innerHeight - border;

        if (shouldHide) {
            this.isHidden = true;

            width = 0;
            height = 0;
        } else {
            if (this.showMenu) {
                y += MENU_HEIGHT;
                height -= MENU_HEIGHT;
            }
                
            if (this.showLoadingBar) {
                // keep space for loading bar
                y += BAR_HEIGHT;
                height -= BAR_HEIGHT;
            }
        }

        const bounds: Rectangle = { x, y, height, width };
        super.setBounds({ bounds });
    }
}