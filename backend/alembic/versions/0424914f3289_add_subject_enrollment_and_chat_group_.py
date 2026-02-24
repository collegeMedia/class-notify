"""add_subject_enrollment_and_chat_group_members

Revision ID: 0424914f3289
Revises: bee59f8c1905
Create Date: 2026-02-24 21:25:16.230366

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0424914f3289'
down_revision: Union[str, None] = 'bee59f8c1905'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Check and create subject_enrollments table if it doesn't exist
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    
    if 'subject_enrollments' not in inspector.get_table_names():
        op.create_table(
            'subject_enrollments',
            sa.Column('student_id', sa.String(), nullable=False),
            sa.Column('subject_id', sa.String(), nullable=False),
            sa.Column('enrolled_at', sa.DateTime(), nullable=True),
            sa.ForeignKeyConstraint(['student_id'], ['users.id'], ),
            sa.ForeignKeyConstraint(['subject_id'], ['subjects.id'], ),
            sa.PrimaryKeyConstraint('student_id', 'subject_id')
        )
    
    if 'chat_group_members' not in inspector.get_table_names():
        op.create_table(
            'chat_group_members',
            sa.Column('user_id', sa.String(), nullable=False),
            sa.Column('chat_group_id', sa.String(), nullable=False),
            sa.Column('joined_at', sa.DateTime(), nullable=True),
            sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
            sa.ForeignKeyConstraint(['chat_group_id'], ['chat_groups.id'], ),
            sa.PrimaryKeyConstraint('user_id', 'chat_group_id')
        )
    
    # Check if is_active column exists before adding
    columns = [col['name'] for col in inspector.get_columns('chat_groups')]
    if 'is_active' not in columns:
        op.add_column('chat_groups', sa.Column('is_active', sa.Boolean(), server_default='true', nullable=False))
    
    # Check if unique constraint exists before adding
    constraints = inspector.get_unique_constraints('chat_groups')
    constraint_names = [c['name'] for c in constraints]
    if 'uq_chat_groups_subject_id' not in constraint_names:
        op.create_unique_constraint('uq_chat_groups_subject_id', 'chat_groups', ['subject_id'])


def downgrade() -> None:
    op.drop_constraint('uq_chat_groups_subject_id', 'chat_groups', type_='unique')
    op.drop_column('chat_groups', 'is_active')
    op.drop_table('chat_group_members')
    op.drop_table('subject_enrollments')
