$ = require('jquery')
MiniRouter = require('./modules/mini-router')

# Create the global mediator object
window.CRESSWOOD ?= {}

# ------------------------------------------
# Routes
# ------------------------------------------

configureRoutes = (->
  # Require all routes
  indexRoute = require("./routes/index-route")

  # Define the routes
  routes =  
    '/$': indexRoute

  new MiniRouter(routes);
)()
