import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import "./CSS/styles.scss"
import "./CSS/fonts.css"

ReactDOM.createRoot(document.querySelector('#root')).render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>,
  // <App />
)
