from datetime import timezone, datetime

from db.db import db


class Invitation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    group_id = db.Column(db.Integer, db.ForeignKey('group.id'), nullable=False)
    invited_user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    inviter_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    status = db.Column(db.String(10), default='pending')  # 'pending', 'accepted', 'declined'
    timestamp = db.Column(db.DateTime, default=datetime.now(timezone.utc))

    # Relationships
    group = db.relationship('Group', back_populates='invitations')
    invited_user = db.relationship('User', foreign_keys=[invited_user_id], back_populates='received_invitations')
    inviter = db.relationship('User', foreign_keys=[inviter_id], back_populates='sent_invitations')
