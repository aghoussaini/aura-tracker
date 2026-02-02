from dotenv import load_dotenv
from flask import Flask

from config import Config
from db.db import db
from extensions import bcrypt, jwt, migrate, cors

load_dotenv()


def create_app(config_class=Config):
    app_ = Flask(__name__)
    app_.config.from_object(config_class)
    app_.config.from_pyfile('config.py', silent=True)

    db.init_app(app_)
    bcrypt.init_app(app_)
    jwt.init_app(app_)
    migrate.init_app(app_, db)
    cors.init_app(app_, resources={r"/*": {"origins": "*"}})

    from routes import blueprints
    for blueprint in blueprints:
        app_.register_blueprint(blueprint)

    return app_


# Create app instance for gunicorn
app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
