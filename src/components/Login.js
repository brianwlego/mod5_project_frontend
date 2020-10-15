import React, {useState} from 'react';
import { connect } from 'react-redux';
import { loginUser, setSignUp } from '../redux/actions'

function Login (props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = (e) => {
    e.preventDefault()
    const user = {
      email: email,
      password: password
    }
    props.loginUser(user, props.history)
    setEmail("")
    setPassword("")
  }


  return(
    <div id="login">
      {props.error !== "" ? <p>{props.error}</p> : null}
      <form onSubmit={submitHandler}>
        <input 
          type="text"
          placeholder="Email..."
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="text"
          name="password"
          placeholder="Password..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input 
          type="submit"
        />
      </form>
      <div>
        <button onClick={props.setSignUp} >Click To Sign Up</button>
      </div>
    </div>
  )
}

const msp = (state) => {
  return {
    user: state.user,
    signup: state.signup,
    error: state.error
  }
}
const mdp = (dispatch) => {
  return {
    loginUser: (user, history) => dispatch(loginUser(user, history)),
    setSignUp: () => dispatch(setSignUp())
  }
}


export default connect(msp, mdp)(Login)