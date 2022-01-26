from bottle import route, run, app
from bottle_cors_plugin import cors_plugin


@route('/hello')
def hello():
    return "Hello World!"


# Confugure the server
app = app()
app.install(cors_plugin('*'))

run(host='localhost', port=8080, debug=True)
