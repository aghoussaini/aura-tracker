from . import db
from datetime import datetime, timezone


class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), nullable=False, unique=True)
    password = db.Column(db.String(150), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))

    # relationships
    groups = db.relationship('GroupMember', back_populates='user')
    sent_invitations = db.relationship(
        'Invitation',
        foreign_keys='Invitation.inviter_id',
        back_populates='inviter')

    received_invitations = db.relationship(
        'Invitation',
        foreign_keys='Invitation.invited_user_id',
        back_populates='invited_user')
