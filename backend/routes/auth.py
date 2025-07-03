from flask import Blueprint, jsonify, request
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt,
)
from app import jwt

from db.db import db
from models.user import User

auth_bp = Blueprint('auth_routes', __name__)
bcrypt = Bcrypt()
jwt_blacklist = set()


@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    return jwt_payload['jti'] in jwt_blacklist


@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    device_id = data.get('device_id')
    password = data.get('password')
    confirm_password = data.get('confirm_password')

    if not username or not first_name or not last_name or not device_id or not password or not confirm_password:
        return jsonify({'error': 'All fields are required'}), 400

    if password != confirm_password:
        return jsonify({'error': 'Passwords do not match'}), 400

    user = User.query.filter_by(username=username).first()
    if user:
        return jsonify({'error': 'User already exists'}), 400

    if User.query.filter_by(device_id=device_id).first():
        return jsonify({'error': 'Device already registered'}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(
        username=username,
        first_name=first_name,
        last_name=last_name,
        device_id=device_id,
        password=hashed_password,
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User created successfully'}), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'All fields are required'}), 400

    user = User.query.filter_by(username=username).first()
    if user and bcrypt.check_password_hash(user.password, password):
        access_token = create_access_token(identity=username)
        return jsonify({'access_token': access_token}), 200

    return jsonify({'error': 'Invalid credentials'}), 401


@auth_bp.route('/signout', methods=['POST'])
@jwt_required()
def signout():
    jti = get_jwt()['jti']
    jwt_blacklist.add(jti)
    return jsonify({'message': 'User signed out successfully'}), 200
