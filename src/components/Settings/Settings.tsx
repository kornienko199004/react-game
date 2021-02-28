import { Button, createStyles, FormControl, InputBase, InputLabel, MenuItem, Select, Theme, withStyles } from '@material-ui/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { ISettings } from '../../common/models/models';
import StorageService from '../../common/services/storage.service';
import './settings.scss';

const BootstrapInput = withStyles((theme: Theme) =>
  createStyles({
    root: {
      'label + &': {
        marginTop: theme.spacing(3),
      },
    },
    input: {
      borderRadius: 4,
      position: 'relative',
      backgroundColor: theme.palette.background.paper,
      border: '1px solid #ced4da',
      fontSize: 16,
      padding: '10px 26px 10px 12px',
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      // Use the system font instead of the default Roboto font.
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      '&:focus': {
        borderRadius: 4,
        borderColor: '#80bdff',
        boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
      },
    },
  }),
)(InputBase);

const fieldsSettings: string[] = ['6x2', '6x3', '6x4'];
const fieldsSettingsList = () => fieldsSettings.map((option: string) => (
  <MenuItem value={option} key={option}>{option}</MenuItem>
));

const timeSettings: string[] = ['2', '3', '4', '5'];
const timeSettingsList = () => timeSettings.map((option: string) => (
  <MenuItem value={option} key={option}>{option}</MenuItem>
));

const themeSettings: string[] = ['dark', 'light'];
const themeSettingsList = () => themeSettings.map((option: string) => (
  <MenuItem value={option} key={option}>{option}</MenuItem>
));

interface IProps {
  storageService: StorageService;
  updateSettings(settings: ISettings): void;
}
export default function Settings(props: IProps) {
  const { storageService, updateSettings } = props;
  const settings = storageService.settings;

  const size: string = `${settings.width}x${settings.height}`;

  const [fieldSize, setFieldSize] = React.useState(size);
  const [showTime, setShowTime] = React.useState(settings.delay);
  const [theme, setTheme] = React.useState(settings.theme);
  const history = useHistory();

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {

    switch ((event.target as any).name) {
      case 'fieldSize':
        setFieldSize(event.target.value as string);
        break;
      case 'showTime':
        setShowTime(event.target.value as number);
        break;
      case 'theme':
        setTheme(event.target.value as string);
        break;
      default:
        return;
    }
  };

  const saveHandler = () => {
    const [width, height] = fieldSize.split('x').map((item) => Number(item));
    const newSettings: ISettings = {
      ...settings,
      width,
      height,
      delay: showTime,
      theme,
    };
    updateSettings(newSettings);
    history.push('/');
  };

  return (
    <div className="settings">
      <h2 className="settings__title">Settings</h2>
      <p className="settings__caption">Choose the field size</p>
      <FormControl className="settings__form-control">
        <InputLabel id="demo-simple-select-label">Field</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={fieldSize}
          onChange={handleChange}
          name="fieldSize"
          input={<BootstrapInput />}
        >
          {fieldsSettingsList()}
        </Select>
      </FormControl>
      <p className="settings__caption">Choose time (sec) of the cards' being opened in the beginning</p>
      <FormControl className="settings__form-control">
        <InputLabel id="demo-simple-select-label">Time</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={showTime}
          onChange={handleChange}
          name="showTime"
          input={<BootstrapInput />}
        >
          {timeSettingsList()}
        </Select>
      </FormControl>
      <p className="settings__caption">Choose the theme</p>
      <FormControl className="settings__form-control">
        <InputLabel id="demo-simple-select-label">Theme</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={theme}
          onChange={handleChange}
          name="theme"
          input={<BootstrapInput />}
        >
          {themeSettingsList()}
        </Select>
      </FormControl>
      <div className="settings__controls">
        <Button variant="contained" color="primary" onClick={saveHandler}>
          Save
        </Button>
      </div>
    </div>
  );
}
