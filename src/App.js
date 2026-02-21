import React from 'react';
import ContactForm from './components/ContactForm';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to Our Website</h1>
      </header>
      <main>
        <ContactForm />
      </main>
      <footer>
        <p>&copy; 2023 Our Company. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;