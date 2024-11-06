from db.db import db


class GroupMember(db.Model):
    __tablename__ = 'group_member'
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    group_id = db.Column(db.Integer, db.ForeignKey('group.id'), primary_key=True)
    aura_points = db.Column(db.Integer, default=0)

    # Relationships
    user = db.relationship('User', back_populates='groups')
    group = db.relationship('Group', back_populates='members')
