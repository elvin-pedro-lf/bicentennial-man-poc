import { Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import RootContainer from "./pages/RootContainer";
import Error404 from "./pages/Error404";
import Home from "./pages/Home";

import "./assets/css/default.scss";
import NewClient from "./pages/NewClient";
import Welcome from "./pages/Welcome";
import NewClientPlan from "./pages/NewClientPlan";
import MyWorkouts from "./pages/MyWorkouts";
import CoachThumbnail from "./pages/CoachThumbnail";
import MyHistory from "./pages/MyHistory";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootContainer />,
    errorElement: <Error404 />,
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<p>Loading...</p>}>
            <Welcome />
          </Suspense>
        ),
      },
      {
        path: "/home",
        element: (
          <Suspense fallback={<p>Loading...</p>}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: "/client",
        element: <CoachThumbnail />,
        children: [
          {
            path: "/client/new",
            element: (
              <Suspense fallback={<p>Loading...</p>}>
                <NewClient />
              </Suspense>
            ),
          },
          {
            path: "/client/new/plan",
            element: (
              <Suspense fallback={<p>Loading...</p>}>
                <NewClientPlan />
              </Suspense>
            ),
          },
          {
            path: "/client/change/plan",
            element: (
              <Suspense fallback={<p>Loading...</p>}>
                <NewClientPlan changePlan={true} />
              </Suspense>
            ),
          },
          {
            path: "/client/workouts",
            element: (
              <Suspense fallback={<p>Loading...</p>}>
                <MyWorkouts />
              </Suspense>
            ),
          },
          {
            path: "/client/history",
            element: (
              <Suspense fallback={<p>Loading...</p>}>
                <MyHistory />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
