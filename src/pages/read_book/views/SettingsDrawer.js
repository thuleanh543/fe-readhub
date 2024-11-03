import React from 'react'
import {
  Drawer,
  Typography,
  FormControl,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Slider,
  Button,
} from '@mui/material'

const SettingsDrawer = ({
  open,
  onClose,
  settings,
  updateSettings,
  themes,
  fontFamilies,
  onResetSettings,
}) => (
  <Drawer anchor='right' open={open} onClose={onClose}>
    <div
      style={{
        width: 350,
        paddingTop: 15,
        paddingLeft: 25,
        paddingRight: 25,
      }}>
      <Typography variant='h6' gutterBottom style={{marginBottom: -5}}>
        Settings
      </Typography>
      <FormControl fullWidth margin='normal'>
        <Typography gutterBottom>Theme</Typography>
        <Select
          value={settings.theme}
          onChange={e => updateSettings('theme', e.target.value)}>
          {themes.map((t, index) => (
            <MenuItem key={index} value={t}>
              <div
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: t,
                  border: '1px solid #000',
                  display: 'inline-block',
                  marginRight: 10,
                  marginBottom: -5,
                }}
              />
              {t === '#FFFFFF'
                ? 'White'
                : t === '#F5F5F5'
                ? 'Light Gray'
                : t === '#E0E0E0'
                ? 'Gray'
                : 'Dark'}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth margin='normal'>
        <Typography gutterBottom style={{marginBottom: -5}}>
          Page View
        </Typography>
        <RadioGroup
          row
          value={settings.pageView}
          style={{marginBottom: -10}}
          onChange={e => updateSettings('pageView', e.target.value)}>
          <FormControlLabel value='single' control={<Radio />} label='Single' />
          <FormControlLabel value='double' control={<Radio />} label='Double' />
        </RadioGroup>
      </FormControl>
      <FormControl fullWidth margin='normal'>
        <Typography gutterBottom>Font Family</Typography>
        <Select
          value={settings.fontFamily}
          onChange={e => updateSettings('fontFamily', e.target.value)}>
          {fontFamilies.map((font, index) => (
            <MenuItem key={index} value={font} style={{fontFamily: font}}>
              {font}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth margin='normal'>
        <Typography gutterBottom>Line Height: {settings.lineHeight}</Typography>
        <Slider
          value={settings.lineHeight}
          onChange={(_, newValue) => updateSettings('lineHeight', newValue)}
          min={1.2}
          max={2.0}
          marks={[
            {value: 1.2, label: '1.2'},
            {value: 1.4, label: '1.4'},
            {value: 1.6, label: '1.6'},
            {value: 1.8, label: '1.8'},
            {value: 2.0, label: '2.0'},
          ]}
          step={null}
        />
      </FormControl>

      <FormControl fullWidth margin='normal'>
        <Typography gutterBottom>Font Size: {settings.fontSize}px</Typography>
        <Slider
          value={settings.fontSize}
          onChange={(_, newValue) => updateSettings('fontSize', newValue)}
          min={12}
          max={24}
          marks={[
            {value: 12, label: '12px'},
            {value: 14, label: '14px'},
            {value: 16, label: '16px'},
            {value: 18, label: '18px'},
            {value: 20, label: '20px'},
            {value: 22, label: '22px'},
            {value: 24, label: '24px'},
          ]}
          step={null}
        />
      </FormControl>

      <FormControl fullWidth margin='normal'>
        <Typography gutterBottom>Font Weight: {settings.fontWeight}</Typography>
        <Slider
          value={settings.fontWeight}
          onChange={(_, newValue) => updateSettings('fontWeight', newValue)}
          min={400}
          max={700}
          marks={[
            {value: 400, label: 'Normal'},
            {value: 700, label: 'Bold'},
          ]}
          step={null}
        />
      </FormControl>
      <FormControl fullWidth margin='normal'>
        <Typography gutterBottom>Zoom: {settings.zoom}%</Typography>
        <Slider
          value={settings.zoom}
          onChange={(_, newValue) => updateSettings('zoom', newValue)}
          min={100}
          max={150}
          step={10}
        />
      </FormControl>
      <Button
        variant='contained'
        color='secondary'
        fullWidth
        onClick={onResetSettings}
        style={{marginTop: 5}}>
        Reset Settings
      </Button>
    </div>
  </Drawer>
)
export default SettingsDrawer
