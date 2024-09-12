import { RouteObject } from "react-router-dom";
import MinimalLayout from "../layout/MinimalLayOut/MinimalLayOut";
import Login from "../pages/Authentication/Login/Login";
const MainRoutes = (): RouteObject => {
    return {
        path: "/",

        element: <MinimalLayout />,

        children: [

            {
                path: "/Login",

                element: <Login />,
            },
            {
                path: "*",

                element: <Login />,
            },
        ],
    };
};

export default MainRoutes;
