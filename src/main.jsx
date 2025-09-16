import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "@mantine/core/styles.css";
import "@mantine/charts/styles.css";
import "@mantine/dates/styles.css";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import {
  useParams,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import LoginPage from "./LoginPage.jsx";
import AdminMainPage from "./AdminSide/AdminMainPage.jsx";
import Analytics from "./pages/Analytics.jsx";
import Employees from "./AdminSide/Employees.jsx";
import Masterlist from "./AdminSide/MasterList.jsx"
import Maintenance from "./AdminSide/Maintenance.jsx";
import { DrawerProvider } from "./context/DrawerContext.jsx";
import Security from "./components/Security.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

const routers = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/reset-password/:token",
    element: <ResetPassword />,
  },
  {
    path: "admin",
    element: <AdminMainPage />,
    children: [
      {
        path: "analytic",
        element: (
          <Security
            page='analytic'
            children={<Analytics />}
          />
        ),
      },
      {
        path: "maintenance",
        element: (
          <Security
            page='maintenance'
            children={<Maintenance />}
          />
        ),
      },
      {
        path: "Employees",
        element: (
          <Security
            page='Employees'
            children={<Employees />}
          />
        ),
      },
      {
        path: "masterlist",
        element: (
          <Security
            page='masterlist'
            children={<Masterlist />}
          />
        ),
      },
    ],
  },
  {
    path: "login",
    element: <LoginPage />,
  },
]);

createRoot(document.getElementById("root")).render(
  <MantineProvider>
    <ModalsProvider>
      <DrawerProvider>
        <RouterProvider router={routers} />
      </DrawerProvider>
    </ModalsProvider>
  </MantineProvider>,
);
