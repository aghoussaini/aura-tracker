from datetime import datetime, timezone

from db.db import db


class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(150), nullable=False)
    last_name = db.Column(db.String(150), nullable=False)
    username = db.Column(db.String(150), nullable=False, unique=True)
    device_id = db.Column(db.String(150), nullable=False, unique=True)
    password = db.Column(db.String(150), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    aura_points = db.Column(db.Integer, default=0)

    # Relationships
    groups = db.relationship('GroupMember', back_populates='user')
    sent_invitations = db.relationship(
        'Invitation',
        foreign_keys='Invitation.inviter_id',
        back_populates='inviter')

    received_invitations = db.relationship(
        'Invitation',
        foreign_keys='Invitation.invited_user_id',
        back_populates='invited_user')

