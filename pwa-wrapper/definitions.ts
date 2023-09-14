import { CapacitorConfig } from '@capacitor/cli';

export interface Config extends CapacitorConfig {
    appUrl: string;
    menu?: MenuItem[];
    menuColor?: string;
    primaryColor?: string;
    contactUrl?: string;
    allowNavigation?: string[];
    overrideUserAgent?: string;
    appendUserAgent?: string;
}

export interface MenuItem {
    id?: string;
    type: MenuItemType;
    text?: string;
}

export type MenuItemType = 'text' | 'separator' | 'button' | 'button_primary';