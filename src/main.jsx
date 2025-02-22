import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from "./components/app/App.jsx";

import './style/style.scss'

createRoot(document.getElementById('root')).render(
    <App />
)
