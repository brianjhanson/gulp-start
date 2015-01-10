module.exports = class MiniRouter
  constructor: (@routes) ->
    # Params:
    # routes:           An object with key of URL path and value of callback
    #                   (required)

    @_route()

  _route: =>
    currentUrl = document.URL

    for routeUrl, callback of @routes
      re = new RegExp(routeUrl, 'i')
      matchResult = currentUrl.match(routeUrl)
      callback() if matchResult