![Ironhack logo](https://i.imgur.com/1QgrNNw.png)


# Project2 | MyProperty

![your new property](https://media.giphy.com/media/l0IylQoMkcbZUbtKw/giphy.gif)


## User stories

As a landlord I want to:
- LOGIN - access the plattform in order to visualize the cash flow of my different rented properties
- SIGNUP - signup and login to the plattform with my mail so I have a personal access.
- LIST - list my properties so that I can log transactions and view the datails
- ADD - add and edit my properties to have a complete overview.
- VIEW - view single property details with financials and tenants information to optimize my returns.
- ADD TRANSACTION - 


## Views (EJS)

- LogIn. Links to URL(SignUp) [GET,POST]
- SignUp. Links to URL(LogIn) [GET,POST]
- MyProperties: Listing of my properties. Links to URL(NewProperty), URL(EditProperty),URL(Home),URL(Logout) [GET]
- NewProperty: Set basic details and save to DB. Links to URL(Home),URL(Logout) [GET,POST]
- EditProperty: Edit existing details, add accounting records to the property and save to DB. Links to URL(Home),URL(Logout) [GET,POST]
- MyPropertyView: View details of an existing property [GET]


## Models (Schema)

User model:
- _id
- username
- email
- password
- timestamps
-----------------------------------------
Property model:
- _id:
- owner : objectId/User
- name
- Location:
 - Street
 - Nr
 - ZIP Code
 - City
 - Country
- AccountingBook: [transaction schema]
----------------------------------------
Transaction schema:
- type:[Rent,TenantFees,Gas,Electricity,Community]
- value:Number
- date: DATE


### Control (Routes)

- AuthenticationControl: `/auth`
 - Login:
  - GET /login
  - POST /login
 - SignUp:
  - GET /signup
  - POST /signup
 - Logout:
  - POST /logout

- MyProperties: `/properties`
  - MyProperties:
   - GET /
  - NewProperty:
   - GET /create
   - POST /create 
  - EditProperty
   - GET /edit/:id
   - POST /edit/:id
  - MyPropertyView
   - GET /view/:id


### Backlog

- EDIT - edit a property details so that I can ...
- GEOLOCALICATION - of my properties
- UPLOAD - of tenant contracts
- INCIDENT- management of tenants issues
- TENANTACCOUNT - tenant login to access property and contract details
- ALERT/FORECAST - enter contract data for cost and revenue to check against transactions
- TOTALView - overview of all properties cashflow


/Have fun with this project!
