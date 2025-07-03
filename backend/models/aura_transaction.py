from datetime import datetime, timezone

from db.db import db


class AuraTransaction(db.Model):
    __tablename__ = 'aura_transaction'
    id = db.Column(db.Integer, primary_key=True)
    group_id = db.Column(db.Integer, db.ForeignKey('group.id'), nullable=False)
    giver_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    target_user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    amount = db.Column(db.Integer, nullable=False)
    reason = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(20), default='pending')  # pending, approved, rejected
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    approvals_count = db.Column(db.Integer, default=0)
    rejections_count = db.Column(db.Integer, default=0)

    approvals = db.relationship('AuraTransactionVote', back_populates='transaction')
    group = db.relationship('Group', backref=db.backref('transactions', lazy=True))
    giver = db.relationship('User', foreign_keys=[giver_id])
    target_user = db.relationship('User', foreign_keys=[target_user_id])
