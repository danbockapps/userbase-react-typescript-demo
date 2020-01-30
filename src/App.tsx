import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import userbase, { Item, UserResult } from 'userbase-js'

const App: React.FC = () => {
  const DATABASE_NAME = 'blueButton'

  const [user, setUser] = useState<UserResult>()

  useEffect(() => {
    userbase
      .init({ appId: process.env.REACT_APP_USERBASE_APP_ID as string })
      .then(session => session.user && setUser(session.user))
  }, [])

  useEffect(() => {
    if (user)
      userbase.openDatabase({ databaseName: DATABASE_NAME, changeHandler })
  }, [user])

  const [regForm, setRegForm] = useState<{
    username?: string
    password?: string
  }>({ username: '', password: '' })

  const [loginForm, setLoginForm] = useState<{
    username?: string
    password?: string
  }>({ username: '', password: '' })

  const [numClicks, setNumCicks] = useState<number>()

  const handleRegInputChange = (event: ChangeEvent<HTMLInputElement>) =>
    setRegForm({ ...regForm, [event.target.name]: event.target.value })

  const handleLoginInputChange = (event: ChangeEvent<HTMLInputElement>) =>
    setLoginForm({ ...loginForm, [event.target.name]: event.target.value })

  const handleRegSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (regForm.username && regForm.password)
      userbase
        .signUp({
          username: regForm.username,
          password: regForm.password,
          rememberMe: 'local'
        })
        .then((ur: UserResult) => setUser(ur))
        .catch(err => alert(err))
  }

  const handleLoginSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (loginForm.username && loginForm.password)
      userbase
        .signIn({
          username: loginForm.username,
          password: loginForm.password,
          rememberMe: 'local'
        })
        .then((ur: UserResult) => setUser(ur))
        .catch(err => alert(err))
  }

  const handleLogout = () => {
    userbase
      .signOut()
      .then(() => setUser(undefined))
      .catch(err => alert(err))
  }

  const handleBlueButtonClick = () => {
    userbase.insertItem({ databaseName: DATABASE_NAME, item: new Date() })
  }

  const changeHandler = (items: Item[]) => {
    setNumCicks(items.length)
  }

  return (
    <div>
      {user ? (
        <div>
          <div>
            Signed in as {user.username}.{' '}
            <button onClick={handleLogout}>Log out</button>
          </div>

          <div>
            <h2>Click the blue button</h2>
            <button
              style={{
                fontSize: '25px',
                backgroundColor: 'blue',
                color: 'white'
              }}
              onClick={handleBlueButtonClick}
            >
              The Blue Button
            </button>
            <div style={{ marginTop: '25px' }}>
              You have clicked: {numClicks} times.
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h2>Register</h2>
          <form onSubmit={handleRegSubmit}>
            <label>
              Username:
              <input
                type="text"
                name="username"
                value={regForm?.username}
                onChange={handleRegInputChange}
              />
            </label>

            <label>
              Password:
              <input
                type="password"
                name="password"
                value={regForm?.password}
                onChange={handleRegInputChange}
              />
            </label>
            <input type="submit" value="Submit" />
          </form>

          <h2>Log in</h2>
          <form onSubmit={handleLoginSubmit}>
            <label>
              Username:
              <input
                type="text"
                name="username"
                value={loginForm?.username}
                onChange={handleLoginInputChange}
              />
            </label>

            <label>
              Password:
              <input
                type="password"
                name="password"
                value={loginForm?.password}
                onChange={handleLoginInputChange}
              />
            </label>
            <input type="submit" value="Submit" />
          </form>
        </div>
      )}
    </div>
  )
}

export default App
