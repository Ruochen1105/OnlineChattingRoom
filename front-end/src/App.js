import './App.css';
import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  
  const [text, setText] = useState([{}]);
  const [msg, setMSG] = useState('');
  const [history, setHistory] = useState([{"time": '', "poster": '', "content": ''}]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRepassword] = useState('');

  const handleClose = () => setModal(false);
  const handleShow = () => setModal(true);

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
  }, [history]);

  useEffect(e => {
    document.querySelector('#msg').scrollTop = document.querySelector('#msg').scrollHeight;
  }, [text]);

  return (
    <div id='flexContainer'>

      <button onClick={handleShow} id='btn1'>
        login / register
      </button>

      <Modal size="lg"  backdrop="static" aria-labelledby="contained-modal-title-vcenter" centered show={modal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Log In / Register</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='container3'>
            <div>
              <center>
              <form onClick={e => {e.preventDefault()}} className='container4'>
                <ul>
                  <li>Username: <input type='text'/></li>
                  <li>Password: <input type='password'/></li>
                  <li><input type='submit' value='Log In'/></li>
                </ul>
              </form>
              </center>
            </div>
            <hr width="1" size="200"/>
            <div>
              <center>
              <form onClick={e => {e.preventDefault()}} className='container4' id='reg'>
                <ul>
                  <li>Username: <input type='text' value={username} onChange={e => {setUsername(e.target.value)}}/></li>
                  <li>Password: <input type='password' value={password} onChange={e => {setPassword(e.target.value)}}/></li>
                  <li>Re-enter Password: <input type='password' value={repassword} onChange={e => {setRepassword(e.target.value)}}/></li>
                  <li><input type='submit' value='Register' onClick={(e) => {
                      fetch('http://localhost:3000/auth/reg', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body:JSON.stringify({username: username, password: password, repassword: repassword}),
                      })
                      .then(res => res.json()).then(resJson => {alert(resJson.msg)}).catch(err => {/*console.log(err.message);*/});
                      setUsername('');setPassword('');setRepassword('');
                    }
                  }/></li>
                </ul>
              </form>
              </center>
            </div>
          </div>
        </Modal.Body>
      </Modal>

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
                <td id='postInfo'>{element.time + ' ' + element.poster}</td>
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
                <td id='postInfo'>{element.time + ' ' + element.poster}</td>
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
      <textarea rows={10} value = {msg} onChange={e => {
        setMSG(e.target.value);
      }}></textarea>
        <button onClick={e => {
          if (msg === '' || msg === undefined) {alert("You can't send nothing!")} else {
            fetch('https://ruochen-ait-final.herokuapp.com/api/msg', {
              method: 'post',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({message: msg})
            })
            .then(res => {setMSG('')})
            .catch((err)=>{console.log(err)})}
        }} id='btn1'>  Post  </button>
      </div>
    </div>
  );
}

export default App;
