import { IGameData, IGameStatistics, IGameWinData, ISettings } from '../models/models';

const DEFAULT_SETTINGS: ISettings = {
  width: 6,
  height: 4,
  delay: 5,
  theme: 'light',
  soundOn: true,
  musicOn: true,
  soundsVolume: 0.2,
  musicVolume: 0.2,
};

const SETTINGS_KEY = 'MEMORY_GAME_SETTINGS';
const GAME_KEY = 'MEMORY_GAME_GAME_DATA';
const STATISTICS_GAME_KEY = 'MEMORY_GAME_STATISTICS_GAME_DATA';

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

  public soundsToggle(soundToggle: boolean) {
    const newSettings: ISettings = { ...this.settingsObj, soundOn: soundToggle };
    this.saveSettings({ ...newSettings });
    this.settingsObj = { ...newSettings };
  }

  public musicToggle(musicToggle: boolean) {
    const newSettings: ISettings = { ...this.settingsObj, soundOn: musicToggle };
    this.saveSettings({ ...newSettings });
    this.settingsObj = { ...newSettings };
  }

  public saveGame(game: IGameData): void {
    localStorage.setItem(GAME_KEY, JSON.stringify(game));
  }

  public loadGame(): IGameData | null {
    const gameData = localStorage.getItem(GAME_KEY);
    if (gameData) {
      return JSON.parse(gameData);
    }
    return null;
  }

  public onWin(data: IGameWinData): void {
    this.clearSavedGame();
    const statisticsData: IGameStatistics = {
      ...data,
      createAt: new Date().toISOString(),
      playerName: 'player',
    }
    this.addDataToStatistics(statisticsData);
  }

  public getStatisticsData(): IGameStatistics[] | null {
    const statisticsData = localStorage.getItem(STATISTICS_GAME_KEY);
    if (statisticsData) {
      return JSON.parse(statisticsData);
    }
    return null;
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

  private clearSavedGame(): void {
    localStorage.removeItem(GAME_KEY);
  }

  private addDataToStatistics(data: IGameStatistics): void {
    let statisticsData: IGameStatistics[];
    try {
      statisticsData = JSON.parse(localStorage.getItem(STATISTICS_GAME_KEY) as string);
      if (!statisticsData) {
        throw Error();
      }
    } catch (e) {
      statisticsData = [];
    }

    statisticsData.push(data);
    localStorage.setItem(STATISTICS_GAME_KEY, JSON.stringify(statisticsData));
  }
}
