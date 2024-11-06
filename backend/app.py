from dotenv import load_dotenv
from flask import Flask
from flask_migrate import Migrate

from config import Config

load_dotenv()

app = Flask(__name__)
app.config.from_object("config.Config")

from models import db

db.init_app(app)
migrate = Migrate(app, db)

from routes import blueprints

for blueprint in blueprints:
    app.register_blueprint(blueprint)

if __name__ == "__main__":
    app.run()
