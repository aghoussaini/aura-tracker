from datetime import datetime, timezone

from db.db import db


class Group(db.Model):
    __tablename__ = 'group'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    creator_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))

    # Relationships
    members = db.relationship('GroupMember', back_populates='group')
    invitations = db.relationship('Invitation', back_populates='group')
