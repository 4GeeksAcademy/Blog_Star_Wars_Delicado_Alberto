import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'  // Global styles for your application
import { RouterProvider } from "react-router-dom";  // Import RouterProvider to use the router
import { router } from "./routes.jsx";  // Import the router configuration
import { StoreProvider } from './hooks/useGlobalReducer'

const root = createRoot(document.querySelector("#root"))

root.render(
    <React.StrictMode>
        <StoreProvider>
            <RouterProvider router={router} />
        </StoreProvider>
    </React.StrictMode>
)
