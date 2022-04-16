import './App.css';
import React, { useState, useEffect } from 'react';

function App() {
  
  const [text, setText] = useState([{}]);
  const [msg, setMSG] = useState('');
  const [history, setHistory] = useState([{}]);
  const [search, setSearch] = useState('');

  useEffect(e => {
    fetch('https://ruochen-ait-final.herokuapp.com/api/msg')
    .then(res => res.json())
    .then(resJson => {
      setText(resJson);
    })
    .catch(err => {console.log(err)});
  }, [msg]);

  useEffect(e => {
    document.querySelector('#history').scrollTop = document.querySelector('#history').scrollHeight;
  }, [search]);

  useEffect(e => {
    document.querySelector('#msg').scrollTop = document.querySelector('#msg').scrollHeight;
  }, [text]);

  return (
    <div id='flexContainer'>
      <h1>Online Chatting Room</h1>
      <div className='container1'>
        <form>
          <input type={'text'} name='search' value={search} onChange={e => {
            setSearch(e.target.value);
          }}></input>
          <input type={'submit'} value='Search' onClick={e => {
            e.preventDefault();
            fetch(`https://ruochen-ait-final.herokuapp.com/api/search?search=${search}`)
            .then(res => res.json())
            .then(resJson => {
              setHistory(resJson);
            })
            .catch(err => {console.log(err)});
            setSearch('');
          }
          }></input>
        </form>
      </div>
      <div className='container1'>
        <table id='history'>
          <thead>
            <tr className='tableHead'>
              <th>History Posts:</th>
            </tr>
          </thead>
          {history.map(element => {
            return (
              <tbody>{/*TODO: add key (probably some unique id from db) to each tbody*/}
              <tr>
                <td id='postInfo'>{element.time + ' ' + element.poster + ':'}</td>
              </tr>
              <tr>
                <td>{'\t' + element.content}</td>
              </tr>
              </tbody>
            );
          })}
        </table>
        <table id='msg'>
          {text.map(element => {
            return (
              <tbody>{/*TODO: add key (probably some unique id from db) to each tbody*/}
              <tr>
                <td id='postInfo'>{element.time + ' ' + element.poster + ':'}</td>
              </tr>
              <tr>
                <td>{'\t' + element.content}</td>
              </tr>
              </tbody>
            );
          })}
        </table>
        <table id='users'>
          <thead>
            <tr className='tableHead'>
              <th>Online Users:</th>
            </tr>
          </thead>
          {/*user.map(element => {
            return (
              <tbody>{TODO: add key (probably some unique id from db) to each tbody}
              <tr>
                <td>{element.name}</td>
              </tr>
              </tbody>
            );
          })*/}
        </table>
      </div>
      <div className='container2'>
      <textarea rows={13} value = {msg} onChange={e => {
        setMSG(e.target.value);
      }}></textarea>
        <button onClick={e => {
          if (msg === '' || msg === undefined) {alert("You can't send nothing!")} else {
            fetch('https://ruochen-ait-final.herokuapp.com/api/msg', {method: 'post', headers: {'Content-Type': 'application/json',}, body: JSON.stringify({message: msg})})
            .then(res => {setMSG('')})
            .catch((err)=>{console.log(err)})}
        }} id='btn1'>  Post  </button>
      </div>
    </div>
  );
}

export default App;
