from dotenv import load_dotenv
from flask import Flask
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate

from config import Config
from db.db import db

bcrypt = Bcrypt()
jwt = JWTManager()
migrate = Migrate()
cors = CORS()

load_dotenv()


def create_app(config_class=Config):
    app_ = Flask(__name__)
    app_.config.from_object(config_class)
    app_.config.from_pyfile('config.py', silent=True)

    db.init_app(app_)
    bcrypt.init_app(app_)
    jwt.init_app(app_)
    migrate.init_app(app_, db)
    cors.init_app(app_)

    from routes import blueprints
    for blueprint in blueprints:
        app_.register_blueprint(blueprint)

    return app_


if __name__ == '__main__':
    app = create_app()
    app.run()
