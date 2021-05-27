import * as fcl from '@onflow/fcl'

const initAccount = async () => {
  const txId = await fcl
    .send([
      fcl.transaction`
        import Profile from 0xProfile

        transaction {
          // keep address for later to verify if the account was initialized properly
          let address: Address

          prepare(account: AuthAccount) {
            // save the address for post check
            self.address = account.address

            // only init the account if it hasn't been initialized yet
            if (!Profile.check(self.address)) {
              // creates and stores the new profile in the user's account
              account.save(<- Profile.new(), to: Profile.privatePath)
    
              // This creates the public capability that lets apps read the profile info
              account.link<&Profile.Base{Profile.Public}>(Profile.publicPath, target: Profile.privatePath)
            }
          }

          // verify that the account has been initialized
          post {
            Profile.check(self.address): "Account was not initialized"
          }
        }
      `,
      fcl.payer(fcl.authz), // current user is responsible for paying
      fcl.proposer(fcl.authz), // also proposer / "nonce"?
      fcl.authorizations([fcl.authz]), // current user is first AuthAccount
      fcl.limit(35), // compute limit
    ])
    .then(fcl.decode)
  // fct.tx(txId) keeps track of transaction status
  // onceCealed() is a promise that resolves once the change
  // is permanently represented by the blockchain, or rejects an error
  console.log('txId:', txId)
  console.log('fcl.tx(txId).onceSealed():', fcl.tx(txId).onceSealed())
  return fcl.tx(txId).onceSealed()
}

export {initAccount}
