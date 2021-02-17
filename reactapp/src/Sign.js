import React, {useState, useEffect} from 'react';
import {Button, Input, Alert} from 'reactstrap'
import './App.css';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';

function Sign(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [emailSignup, setEmailSignup] = useState('');
    const [passwordSignup, setPasswordSignup] = useState('');
    const[valid, setValid] = useState(false);
    const[errorSignIn, setErrorSignIn] = useState('');
    const[errorSignUp, setErrorSignUp] = useState('');

    var Signup = async () => {
        if(username !== '' && emailSignup !== '' && passwordSignup !== ''){
          var rawResponse = await fetch('/signup', {
          method: 'POST',
          headers: {'Content-Type':'application/x-www-form-urlencoded'},
          body: `username=${username}&email=${emailSignup}&password=${passwordSignup}`
          });
          var response = await rawResponse.json();
          if(response.result){
            setValid(true)
            props.saveToken(response.token);
          }else{
            setErrorSignUp(<Alert style={{marginTop: 15}} color="danger">Email already exists</Alert>)
          };
    
        }else{
          setErrorSignUp(<Alert style={{marginTop: 15}} color="danger">Invalid Input</Alert>)
        }
      }

      var Signin = async () => {
        if(email !== '' && password !== ''){
          var rawResponse = await fetch('/signin', {
          method: 'POST',
          headers: {'Content-Type':'application/x-www-form-urlencoded'},
          body: `email=${email}&password=${password}`
          });
          var response = await rawResponse.json();
          if(response.result){
            props.saveToken(response.token);
            setValid(true);
          }else{
            setValid(false)
            setErrorSignIn(<Alert style={{marginTop: 15}} color="danger">Wrong email or password</Alert>)
          };
    
        }else{
          setValid(false)
          setErrorSignIn(<Alert style={{marginTop: 15}} color="danger">Invalid Input</Alert>)
        }
      }
    
      if(valid){
        return <Redirect to='/home' />
        
      }else{

        return(
            <div style={{display:'flex', width:'100%', height:'100vh', justifyContent:'center', alignItems:'center'}}> 
                <div style={{display:'flex', width:'100%', height:'100vh', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
                    <p>Sign Up</p>
                    <Input style={{width:300}} placeholder='Username' onChange={(e)=>setUsername(e.target.value)} value={username}/>
                    <Input style={{width:300}} placeholder='Email' onChange={(e)=>setEmailSignup(e.target.value)} value={emailSignup}/>
                    <Input style={{width:300}}  type='password' placeholder='Password' onChange={(e)=>setPasswordSignup(e.target.value)} value={passwordSignup}/>
                    {errorSignUp}
                    <Button style={{marginTop: 15}} color='warning' onClick={()=>Signup()}>Sign Up</Button>
                </div>
                <div style={{display:'flex', width:'100%', height:'100vh', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
                    <p>Sign In</p>
                    <Input style={{width:300}} placeholder='Email' onChange={(e)=>setEmail(e.target.value)} value={email}/>
                    <Input style={{width:300}} type='password' placeholder='Password' onChange={(e)=>setPassword(e.target.value)} value={password}/>
                    {errorSignIn}
                    <Button style={{marginTop: 15}} color='secondary' onClick={()=>Signin()}>Sign In</Button>
                </div>
            </div>
        );
      }
}

function mapDispatchToProps(dispatch) {
    return {
        saveToken: function(token) {
            dispatch( {type: 'token', token: token} )
        }
    }
}
    
export default connect(
    null,
    mapDispatchToProps
)(Sign);