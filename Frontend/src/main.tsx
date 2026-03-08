import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { StrictMode } from 'react';
import GlobalContext from './hooks/GlobalContextProvider';
import { BrowserRouter } from 'react-router-dom';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <GlobalContext>
        <App />
      </GlobalContext>
    </BrowserRouter>
  </StrictMode>
);
