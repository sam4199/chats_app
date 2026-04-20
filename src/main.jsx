import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './test.css'

// FORCE DARK MODE BY DEFAULT (This fixes the white background issue)
document.documentElement.classList.add('dark');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)