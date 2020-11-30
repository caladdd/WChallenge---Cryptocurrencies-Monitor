# WChallenge - Cryptocurrencies Monitor

### (Project setup)

  *  Install [Node](https://nodejs.org/en/download/)
  *  Install package.json
  
     ```
       npm install
     ```
    
  * Configure environment variables
                            
     ```
    # Server
    PORT=
    
    # Data Base
    MONGO_URL=
    
    # Auth
    TOKEN_KEY=
    
     ```
    
  * Start project
  
       ```
        npm run start
       ```
    
 
### Authentication
  Authentication with JWT

  * create user 
    * It needs { name:"", lastName:"" userName:"", password:"", favoriteCoin: usd-eur-ars }
  * login to get token 
    * It needs {userName:"", password:""}
  * use the token in Authorization header in this way ==>      Bearer {token}

### Services
  * Get coins -- Method GET 
     * {{host}}/api/coins?limit=10&page=1
     * limit => amount of coins by page
     * page => number of page
  *  Add coin -- Method POST
     * {{host}}/api/addcoin
     * It needs {"coinId": ""}
  * Get top coins -- Method GET
     * {{host}}/api/topcoins  
