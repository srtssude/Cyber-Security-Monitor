import { PanelPlugin } from '@grafana/data';
import { SimpleOptions } from './types';
import { SimplePanel } from './components/SimplePanel';

export const plugin = new PanelPlugin<SimpleOptions>(SimplePanel).setPanelOptions((builder) => {
  return builder
    .addTextInput({
      path: 'panelTitle',
      name: 'Panel Title',
      description: 'Main header text',
      defaultValue: 'Cyber Security Monitor',
    })
    .addNumberInput({
      path: 'alertThreshold',
      name: 'Critical Threshold (%)',
      description: 'Trigger red alert at this value.',
      defaultValue: 75,
    })
    .addBooleanSwitch({
      path: 'enableBlinking',
      name: 'Enable Critical Blinking',
      description: 'Flash the panel when critical threshold is met.',
      defaultValue: true,
    })
    .addNumberInput({
      path: 'baseFontSize',
      name: 'Base Font Size (px)',
      defaultValue: 36,
    })
    .addNumberInput({
  path: 'headerFontSize',
  name: 'Header Font Size',
  description: 'Adjust the title size',
  defaultValue: 14, 
    })
    .addBooleanSwitch({
      path: 'showStats',
      name: 'Show Session Stats',
      description: 'Display Min/Max values for the current session.',
      defaultValue: true,
    })
   .addSliderInput({
    path: 'headerFontSize',
    name: 'Header Font Size',
    defaultValue: 14,
    settings: {
    min: 10,   
    max: 100,  
    step: 2,   
   },
    })
    .addBooleanSwitch({
      path: 'enableAI',
      name: 'Enable AI Detection',
      defaultValue: true,
    })
    .addSliderInput({
      path: 'aiSensitivity',
      name: 'AI Sensitivity',
      defaultValue: 0.5,
      settings: { min: 0.1, max: 1.0, step: 0.1 },
      showIf: (config) => config.enableAI,
    })
    .addBooleanSwitch({
      path: 'showTrendGraph',
      name: 'Show External Data Graph',
      defaultValue: true,
    })
    .addTextInput({
      path: 'apiUrl',
      name: 'External API URL',
      defaultValue: 'https://jsonplaceholder.typicode.com/todos/', 
    });
});