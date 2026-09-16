import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './styles/index.css';
import { ThemeProvider } from './hooks/useTheme';
import { Home } from './routes/Home';
import { ProjectDetail } from './routes/ProjectDetail';

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/projects/:id', element: <ProjectDetail /> },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
);
