import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { MantineProvider } from '@mantine/core'
import { BrowserRouter } from 'react-router-dom'
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

createRoot( document.getElementById( 'root' ) ).render(
  <MantineProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </MantineProvider>,
)
