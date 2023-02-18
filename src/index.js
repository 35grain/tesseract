import * as React from 'react';
import './scss/style.scss';
import { createTheme, NextUIProvider } from '@nextui-org/react';
import { createRoot } from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
const theme = createTheme({
  type: "dark",
  theme: {
    colors: {
      // brand colors
      primaryLight: '$green200',
      primaryLightHover: '$green300',
      primaryLightActive: '$green400',
      primaryLightContrast: '$green600',
      primaryBorder: '$green500',
      primaryBorderHover: '$green600',
      primarySolidHover: '$green700',
      primarySolidContrast: '$white',
      primaryShadow: '$green500',

      gradient: 'linear-gradient(112deg, $blue100 -25%, $pink500 -10%, $purple500 80%)',
      link: '#5E1DAD',
    },
  }
})

createRoot(rootElement).render(
  <NextUIProvider theme={theme}>
    <App />
  </NextUIProvider>
);