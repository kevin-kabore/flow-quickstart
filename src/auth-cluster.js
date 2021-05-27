import * as React from 'react'
import * as fcl from '@onflow/fcl'
import {isInitialized} from './flow/scripts/is-initialized'
import {initAccount} from './flow/transactions/init-account'

function AuthCluster() {
  const [user, setUser] = React.useState({loggedIn: null})
  const [isInit, setIsInit] = React.useState(null)
  const [error, setError] = React.useState(null)
  React.useEffect(() => {
    return fcl.currentUser().subscribe(setUser)
  }, [])

  React.useEffect(() => {
    if (!user || !user.addr) return
    isInitialized(user.addr).then(
      isInitialized => setIsInit(isInitialized),
      error => setError(error),
    )
  }, [user])

  React.useEffect(() => {
    if (isInit || !user.addr) return
    async function initialize() {
      await initAccount()
    }
    initialize()
  }, [isInit, user.addr])

  return (
    <div>
      {user.loggedIn ? (
        <>
          <span>{user?.addr ?? 'No Address'}</span>
          <button onClick={fcl.unauthenticate}>Log Out</button>
        </>
      ) : (
        <>
          <button onClick={fcl.logIn}>Log In</button>
          <button onClick={fcl.signUp}>Sign Up</button>
        </>
      )}
    </div>
  )
}

export {AuthCluster}
