from db.db import db


class AuraTransactionVote(db.Model):
    __tablename__ = 'aura_transaction_vote'
    id = db.Column(db.Integer, primary_key=True)
    transaction_id = db.Column(db.Integer, db.ForeignKey('aura_transaction.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    approval = db.Column(db.Boolean, nullable=False)

    transaction = db.relationship('AuraTransaction', back_populates='approvals')
    user = db.relationship('User')

    __table_args__ = (db.UniqueConstraint('transaction_id', 'user_id', name='unique_vote'),)
