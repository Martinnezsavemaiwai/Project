import { RouteObject } from "react-router-dom";

import MinimalLayout from "../layout/MinimalLayOut/MinimalLayOut";
import Login from "../pages/Authentication/Login/Login";
import ProductList from "../pages/ProductList";
import ProductCreate from "../pages/create/ProductCreate";
import ProductEdit from "../pages/edit/ProductEdit";

const OwnerRoutes = (): RouteObject => {

    return {

        path: "/",

        element: <MinimalLayout/>,

        children: [

            {
                path: "/",
                element: <ProductList />
            },

            {
                path: "/Login",

                element: <Login />,
            },
   
            {
                path: "/Product/Create",
                element: <ProductCreate />
            },
            {
                path: "Product/Edit/:id",
                element: <ProductEdit />
            },

        ],

    };

};


export default OwnerRoutes;