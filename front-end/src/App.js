import './App.css';
import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import socketIOClient from 'socket.io-client';
import axios from "axios"


const dev = (bool) => {if (bool){return 'http://localhost:3000'}else{return 'https://ruochen-ait-final.herokuapp.com'}}
const devBool = true;
const socket = socketIOClient(dev(devBool));

function App() {
  
  const [text, setText] = useState([{"time": '', "poster": '', "content": ''}]);
  const [history, setHistory] = useState([{"time": '', "poster": '', "content": ''}]);
  const [userList, setUserList] = useState([]);
  
  const [msg, setMSG] = useState('');
  const [search, setSearch] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRepassword] = useState('');
  const [usn, setUsn] = useState('');
  const [pwd, setPwd] = useState('');

  const [modal, setModal] = useState(false);
  const [msgTrigger, setMsgTrigger] = useState(0);
  const [logged, setLogged] = useState(false);

  const handleClose = () => setModal(false);
  const handleShow = () => setModal(true);

  function updateMsgTrigger(){
    setMsgTrigger(t => t+1);
  }

  function updateUserList(user){
    setUserList(prev => user[0]);
  }

  useEffect(() => {
    socket.on('update', updateMsgTrigger);
    socket.on('user', updateUserList);
  }, []);

  useEffect(e => {
    fetch(`${dev(devBool)}/api/msg`, {headers: {'Authorization': `Bearer ${sessionStorage.getItem("jwt")}`}})
    .then(res => res.json())
    .then(resJson => {
      setText(resJson);
    })
    .catch(err => {console.log(err)});
  }, [msgTrigger]);

  useEffect(e => {
    document.querySelector('#history').scrollTop = document.querySelector('#history').scrollHeight;
  }, [history]);

  useEffect(e => {
    document.querySelector('#msg').scrollTop = document.querySelector('#msg').scrollHeight;
  }, [text]);

  return (
    <div id='flexContainer'>
      
      {logged &&
        <button onClick={() => {
          sessionStorage.removeItem('jwt');
          setLogged(false);
          socket.emit('logout');
          setText([{"time": '', "poster": '', "content": ''}]);
          setHistory([{"time": '', "poster": '', "content": ''}]);
          setUserList([]);
        }} id='btnLogin'>
          logout
        </button>
      }

      {!logged &&
        <button onClick={handleShow} id='btnLogin'>
          login / register
        </button>
      }

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
                  <li>Username: <input type='text' value={usn} onChange={e => {setUsn(e.target.value)}}/></li>
                  <li>Password: <input type='password' value={pwd} onChange={e => {setPwd(e.target.value)}}/></li>
                  <li><input type='submit' value='Log In' onClick={async (e) => {
                    const res = await fetch(`${dev(devBool)}/auth/log`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body:JSON.stringify({username: usn, password: pwd}),
                    });
                    if (res.status === 200) {const resJson = await res.json(); sessionStorage.setItem("jwt", JSON.parse(resJson).jwt); handleClose(); socket.emit('login', [usn]);setLogged(true);}
                    else {alert("Failed to log in.")}
                    setUsn('');setPwd('');
                  }}/></li>
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
                  <li><input type='submit' value='Register' onClick={e => {
                      fetch(`${dev(devBool)}/auth/reg`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body:JSON.stringify({username: username, password: password, repassword: repassword}),
                      })
                      .then(res => res.json()).then(resJson => {alert(resJson.msg)}).catch();
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
            fetch(`${dev(devBool)}/api/search?search=${search}`, {headers: {'Authorization': `Bearer ${sessionStorage.getItem("jwt")}`}})
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
          {history.map((element, i) => {
            return (
              <tbody key={`history${i}`}>
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
          {text.map((element, i) => {
            if (!element.image){
              return (
                <tbody key={`msg${i}`}>
                <tr>
                  <td id='postInfo'>{element.time + ' ' + element.poster}</td>
                </tr>
                <tr>
                  <td>{'\t' + element.content}</td>
                </tr>
                </tbody>
              );
            } else {
              const src = `${dev(devBool)}/${element.content}`;
              return (
                <tbody key={`msg${i}`}>
                <tr>
                  <td id='postInfo'>{element.time + ' ' + element.poster}</td>
                </tr>
                <tr>
                  <td><img src={src} height='200'/></td>
                </tr>
                </tbody>
              )
            }
          })}
        </table>
        <table id='users'>
          <thead>
            <tr className='tableHead'>
              <th>Online Users:</th>
            </tr>
          </thead>
          {userList.map(element => {
            return (
              <tbody>
              <tr>
                <td>{element}</td>
              </tr>
              </tbody>
            );
          })}
        </table>
      </div>
      <div className='container2'>
        <textarea rows={10} value = {msg} onChange={e => {
          setMSG(e.target.value);
        }}></textarea>
        <button onClick={e => {
          if (msg === '' || msg === undefined) {alert("You can't send nothing!")} else {
            fetch(`${dev(devBool)}/api/msg`, {
              method: 'post',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("jwt")}`
              },
              body: JSON.stringify({message: msg, image: false})
            })
            .then(res => {setMSG(''); socket.emit('post');})
            .catch((err)=>{console.log(err)})}
        }} id='btn1'>  Post  </button>
        <div>
          Send Image
          <input type='file' onChange={e => {
            const image = new FormData();
            image.append('file', e.target.files[0]);
            axios.post(`${dev(devBool)}/api/upload`, image, {headers: {'Authorization': `Bearer ${sessionStorage.getItem("jwt")}`, 'Content-Type': `multipart/form-data`}})
            .then(resJson => {
              fetch(`${dev(devBool)}/api/msg`, {
                method: 'post',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${sessionStorage.getItem("jwt")}`
                },
                body: JSON.stringify({message: resJson.data.name, image: true})
              }).then(() => {socket.emit('post');}).catch(err => {console.log(err)});
            })
            .catch(err => {console.log(err)});
          }}/>
        </div>
      </div>
    </div>
  );
}

export default App;
