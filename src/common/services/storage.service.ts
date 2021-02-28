import { ISettings } from '../models/models';

const DEFAULT_SETTINGS: ISettings = {
  width: 6,
  height: 4,
  delay: 5,
  theme: 'light',
};

const SETTINGS_KEY = 'MEMORY_GAME_SETTINGS';

export default class StorageService {
  settingsObj: ISettings = DEFAULT_SETTINGS;

  constructor() {
    const savedSettings: ISettings | null = this.loadSettings();
    if (savedSettings) {
      this.settingsObj = { ...savedSettings };
    }
  }

  get settings(): ISettings {
    return this.settingsObj;
  }

  public updateSettings(newSettings: ISettings) {
    if (!newSettings) {
      return;
    }

    this.saveSettings(newSettings);
    this.settingsObj = { ...newSettings };
  }

  private loadSettings(): ISettings | null {
    const settings = localStorage.getItem(SETTINGS_KEY);
    if (settings) {
      return JSON.parse(settings);
    }
    return null;
  }

  private saveSettings(newSettings: ISettings): void {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
  }
}
