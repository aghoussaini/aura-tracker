from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from db.db import db
from models import User, Group, GroupMember, Invitation, AuraTransaction, AuraTransactionVote


group_bp = Blueprint('group_routes', __name__)


@group_bp.route('/groups', methods=['POST'])
@jwt_required()
def create_group():
    data = request.get_json()
    name = data.get('name')
    invitees = data.get('invitees', [])

    if not name:
        return jsonify({'error': 'Group name required'}), 400

    current_user = User.query.filter_by(username=get_jwt_identity()).first()
    if not current_user:
        return jsonify({'error': 'Invalid user'}), 400

    total_members = len(set(invitees + [current_user.username]))
    if total_members < 3:
        return jsonify({'error': 'Group must have at least 3 members including invites'}), 400

    group = Group(name=name, creator_id=current_user.id)
    db.session.add(group)
    db.session.flush()

    db.session.add(GroupMember(user_id=current_user.id, group_id=group.id))

    for username in invitees:
        user = User.query.filter_by(username=username).first()
        if user:
            invitation = Invitation(group_id=group.id, invited_user_id=user.id, inviter_id=current_user.id)
            db.session.add(invitation)

    db.session.commit()
    return jsonify({'message': 'Group created', 'group_id': group.id}), 201


@group_bp.route('/groups/<int:group_id>/invite', methods=['POST'])
@jwt_required()
def invite_user(group_id):
    data = request.get_json()
    username = data.get('username')

    if not username:
        return jsonify({'error': 'Username required'}), 400

    current_user = User.query.filter_by(username=get_jwt_identity()).first()
    group = Group.query.get(group_id)
    if not group or not GroupMember.query.filter_by(group_id=group_id, user_id=current_user.id).first():
        return jsonify({'error': 'Invalid group or permissions'}), 404

    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    existing = Invitation.query.filter_by(group_id=group_id, invited_user_id=user.id, status='pending').first()
    if existing:
        return jsonify({'error': 'Invitation already pending'}), 400

    invitation = Invitation(group_id=group_id, invited_user_id=user.id, inviter_id=current_user.id)
    db.session.add(invitation)
    db.session.commit()
    return jsonify({'message': 'Invitation sent'}), 201


@group_bp.route('/invitations/<int:invitation_id>', methods=['POST'])
@jwt_required()
def respond_invitation(invitation_id):
    data = request.get_json()
    action = data.get('action')

    user = User.query.filter_by(username=get_jwt_identity()).first()
    invitation = Invitation.query.get(invitation_id)
    if not invitation or invitation.invited_user_id != user.id:
        return jsonify({'error': 'Invitation not found'}), 404

    if invitation.status != 'pending':
        return jsonify({'error': 'Invitation already responded to'}), 400

    if action == 'accept':
        invitation.status = 'accepted'
        db.session.add(GroupMember(user_id=user.id, group_id=invitation.group_id))
    elif action == 'reject':
        invitation.status = 'declined'
    else:
        return jsonify({'error': 'Invalid action'}), 400

    db.session.commit()
    return jsonify({'message': 'Invitation updated'}), 200


@group_bp.route('/aura/give', methods=['POST'])
@jwt_required()
def give_aura():
    data = request.get_json()
    group_id = data.get('group_id')
    target_username = data.get('target_username')
    amount = data.get('amount')
    reason = data.get('reason')

    allowed = {5, 10, 25, 50, 100}
    if not reason or not isinstance(amount, int) or abs(amount) not in allowed:
        return jsonify({'error': 'Amount must be one of +/-5,10,25,50,100 and reason required'}), 400

    giver = User.query.filter_by(username=get_jwt_identity()).first()
    target_user = User.query.filter_by(username=target_username).first()
    if not giver or not target_user:
        return jsonify({'error': 'Invalid users'}), 404

    if not GroupMember.query.filter_by(group_id=group_id, user_id=giver.id).first() or not GroupMember.query.filter_by(group_id=group_id, user_id=target_user.id).first():
        return jsonify({'error': 'Both users must be in the group'}), 400

    transaction = AuraTransaction(
        group_id=group_id,
        giver_id=giver.id,
        target_user_id=target_user.id,
        amount=amount,
        reason=reason,
    )
    db.session.add(transaction)
    db.session.commit()
    return jsonify({'message': 'Aura transaction created', 'transaction_id': transaction.id}), 201


@group_bp.route('/aura/transactions/<int:transaction_id>/vote', methods=['POST'])
@jwt_required()
def vote_transaction(transaction_id):
    data = request.get_json()
    approval = data.get('approval')

    if approval is None:
        return jsonify({'error': 'Approval required'}), 400

    user = User.query.filter_by(username=get_jwt_identity()).first()
    transaction = AuraTransaction.query.get(transaction_id)
    if not transaction:
        return jsonify({'error': 'Transaction not found'}), 404

    if transaction.status != 'pending':
        return jsonify({'error': 'Transaction already resolved'}), 400

    if not GroupMember.query.filter_by(group_id=transaction.group_id, user_id=user.id).first():
        return jsonify({'error': 'Not a group member'}), 403

    existing = AuraTransactionVote.query.filter_by(transaction_id=transaction_id, user_id=user.id).first()
    if existing:
        return jsonify({'error': 'Already voted'}), 400

    vote = AuraTransactionVote(transaction_id=transaction_id, user_id=user.id, approval=bool(approval))
    db.session.add(vote)
    db.session.flush()

    approvals = AuraTransactionVote.query.filter_by(transaction_id=transaction_id, approval=True).count()
    rejections = AuraTransactionVote.query.filter_by(transaction_id=transaction_id, approval=False).count()

    transaction.approvals_count = approvals
    transaction.rejections_count = rejections

    group_size = GroupMember.query.filter_by(group_id=transaction.group_id).count()

    if approvals > group_size / 2:
        transaction.status = 'approved'
        target = User.query.get(transaction.target_user_id)
        target.aura_points += transaction.amount
    elif rejections >= group_size / 2:
        transaction.status = 'rejected'

    db.session.commit()
    return jsonify({'status': transaction.status, 'approvals': approvals, 'rejections': rejections}), 200

