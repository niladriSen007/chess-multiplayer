import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from './App.tsx';
import './index.css';
import Home from './pages/Home.tsx';
import Game from './pages/Game.tsx';



const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,

    children: [
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/game",
        element: <Game />,
      }
    ],
  },
]);


ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)
