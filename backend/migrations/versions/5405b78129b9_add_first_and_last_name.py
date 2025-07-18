"""add first and last name

Revision ID: 5405b78129b9
Revises: 2f1d7253363a
Create Date: 2025-07-03 09:42:02.092863

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5405b78129b9'
down_revision = '2f1d7253363a'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('first_name', sa.String(length=150), nullable=False))
        batch_op.add_column(sa.Column('last_name', sa.String(length=150), nullable=False))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_column('last_name')
        batch_op.drop_column('first_name')

    # ### end Alembic commands ###
