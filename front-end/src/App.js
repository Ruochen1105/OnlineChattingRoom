import './App.css';
import React, { useState, useEffect } from 'react';

function App() {
  
  const [text, setText] = useState([{}]);
  const [msg, setMSG] = useState();

  useEffect((e => {
    fetch('http://localhost:8080/')
    .then(res => res.json())
    .then(resJson => {
      setText(resJson);
    })
    .catch(err => {console.log(err)})
  }), [msg])

  return (
    <>
      <table><thead>
        <tr>
          <td>content</td>
          <td>poster</td>
          <td>time</td>
        </tr></thead>
        {text.map(element => {
          return (
            <tr>
              <td>{element.content}</td>
              <td>{element.poster}</td>
              <td>{element.time}</td>
            </tr>
          )
        })}
      </table>
      <form onSubmit={e => e.preventDefault()}>
        <input type = 'text' value={msg} onChange={e => {setMSG(e.target.value)}}/>
        <input type = 'submit' value = 'Post' onClick={e => {
          if (msg === '') {alert("You can't send nothing!")} else {
          fetch('http://localhost:8080/', {method: 'post', headers: {'Content-Type': 'application/json',}, body: JSON.stringify({message: msg})})
          .then(res => {setMSG('')})
          .catch((err)=>{console.log(err)})}
        }}/>
      </form>
    </>
  );
}

export default App;
