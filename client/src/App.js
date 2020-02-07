import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {

  const [data, setData] = useState([])

  useEffect(() => {
    fetch('http://localhost:8080/avocado-sales?start=2015-01-01&end=2015-02-01')
    .then(res => res.json())
    .then(json => {
      console.log(json)
      setData(json.data)
    })
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        
       {data.map(item => item.region)}
      </header>
    </div>
  );
}

export default App;
