import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './Components/App'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

interface Book {
  id: number;
  author_id: string;
  title: string;
  pub_year: string;
  genre: string;
}

interface Error {
  error: string;
}

type BookResponse = Book[] | Error;

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)
