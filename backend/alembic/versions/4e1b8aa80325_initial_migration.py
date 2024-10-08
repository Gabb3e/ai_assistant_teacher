"""Initial migration

Revision ID: 4e1b8aa80325
Revises: 
Create Date: 2024-09-04 22:24:50.395560

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4e1b8aa80325'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('chat_requests',
    sa.Column('user_input', sa.Text(), nullable=False),
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('chat_responses',
    sa.Column('ai_response', sa.Text(), nullable=False),
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('quizzes',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('topic', sa.String(length=100), nullable=False),
    sa.Column('num_questions', sa.Integer(), nullable=False),
    sa.Column('difficulty', sa.String(length=50), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_quizzes_id'), 'quizzes', ['id'], unique=False)
    op.create_table('subjects',
    sa.Column('subject_id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.PrimaryKeyConstraint('subject_id', 'id'),
    sa.UniqueConstraint('name')
    )
    op.create_index(op.f('ix_subjects_subject_id'), 'subjects', ['subject_id'], unique=False)
    op.create_table('users',
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('email', sa.String(length=255), nullable=False),
    sa.Column('password_hash', sa.String(length=255), nullable=False),
    sa.Column('created_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.Column('first_name', sa.String(length=255), nullable=False),
    sa.Column('last_name', sa.String(length=255), nullable=False),
    sa.Column('gender', sa.Boolean(), nullable=False),
    sa.Column('age', sa.BigInteger(), nullable=False),
    sa.Column('activated', sa.Boolean(), nullable=False),
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.PrimaryKeyConstraint('user_id', 'id'),
    sa.UniqueConstraint('email')
    )
    op.create_index(op.f('ix_users_user_id'), 'users', ['user_id'], unique=False)
    op.create_table('quiz_questions',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('quiz_id', sa.Integer(), nullable=False),
    sa.Column('question', sa.Text(), nullable=False),
    sa.Column('options', sa.Text(), nullable=False),
    sa.Column('correct_answer', sa.String(length=100), nullable=False),
    sa.ForeignKeyConstraint(['quiz_id'], ['quizzes.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_quiz_questions_id'), 'quiz_questions', ['id'], unique=False)
    op.create_table('tests',
    sa.Column('test_id', sa.Integer(), nullable=False),
    sa.Column('subject_id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=False),
    sa.Column('difficulty', sa.String(length=50), nullable=True),
    sa.Column('time_limit', sa.Integer(), nullable=True),
    sa.Column('created_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.ForeignKeyConstraint(['subject_id'], ['subjects.subject_id'], ),
    sa.PrimaryKeyConstraint('test_id', 'id')
    )
    op.create_index(op.f('ix_tests_test_id'), 'tests', ['test_id'], unique=False)
    op.create_table('questions',
    sa.Column('question_id', sa.Integer(), nullable=False),
    sa.Column('test_id', sa.Integer(), nullable=False),
    sa.Column('question_text', sa.Text(), nullable=False),
    sa.Column('correct_answer', sa.Text(), nullable=True),
    sa.Column('points', sa.Numeric(), nullable=False),
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.ForeignKeyConstraint(['test_id'], ['tests.test_id'], ),
    sa.PrimaryKeyConstraint('question_id', 'id')
    )
    op.create_index(op.f('ix_questions_question_id'), 'questions', ['question_id'], unique=False)
    op.create_table('test_attempts',
    sa.Column('attempt_id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('test_id', sa.Integer(), nullable=False),
    sa.Column('start_time', sa.TIMESTAMP(timezone=True), nullable=True),
    sa.Column('end_time', sa.TIMESTAMP(timezone=True), nullable=True),
    sa.Column('score', sa.Numeric(), nullable=True),
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.ForeignKeyConstraint(['test_id'], ['tests.test_id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.user_id'], ),
    sa.PrimaryKeyConstraint('attempt_id', 'id')
    )
    op.create_index(op.f('ix_test_attempts_attempt_id'), 'test_attempts', ['attempt_id'], unique=False)
    op.create_table('question_options',
    sa.Column('option_id', sa.Integer(), nullable=False),
    sa.Column('question_id', sa.Integer(), nullable=False),
    sa.Column('option_text', sa.Text(), nullable=False),
    sa.Column('is_correct', sa.Boolean(), nullable=True),
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.ForeignKeyConstraint(['question_id'], ['questions.question_id'], ),
    sa.PrimaryKeyConstraint('option_id', 'id')
    )
    op.create_index(op.f('ix_question_options_option_id'), 'question_options', ['option_id'], unique=False)
    op.create_table('submitted_answers',
    sa.Column('answer_id', sa.Integer(), nullable=False),
    sa.Column('attempt_id', sa.Integer(), nullable=False),
    sa.Column('question_id', sa.Integer(), nullable=False),
    sa.Column('submitted_option_id', sa.Integer(), nullable=True),
    sa.Column('submitted_text', sa.Text(), nullable=True),
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.ForeignKeyConstraint(['attempt_id'], ['test_attempts.attempt_id'], ),
    sa.ForeignKeyConstraint(['question_id'], ['questions.question_id'], ),
    sa.ForeignKeyConstraint(['submitted_option_id'], ['question_options.option_id'], ),
    sa.PrimaryKeyConstraint('answer_id', 'id')
    )
    op.create_index(op.f('ix_submitted_answers_answer_id'), 'submitted_answers', ['answer_id'], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_submitted_answers_answer_id'), table_name='submitted_answers')
    op.drop_table('submitted_answers')
    op.drop_index(op.f('ix_question_options_option_id'), table_name='question_options')
    op.drop_table('question_options')
    op.drop_index(op.f('ix_test_attempts_attempt_id'), table_name='test_attempts')
    op.drop_table('test_attempts')
    op.drop_index(op.f('ix_questions_question_id'), table_name='questions')
    op.drop_table('questions')
    op.drop_index(op.f('ix_tests_test_id'), table_name='tests')
    op.drop_table('tests')
    op.drop_index(op.f('ix_quiz_questions_id'), table_name='quiz_questions')
    op.drop_table('quiz_questions')
    op.drop_index(op.f('ix_users_user_id'), table_name='users')
    op.drop_table('users')
    op.drop_index(op.f('ix_subjects_subject_id'), table_name='subjects')
    op.drop_table('subjects')
    op.drop_index(op.f('ix_quizzes_id'), table_name='quizzes')
    op.drop_table('quizzes')
    op.drop_table('chat_responses')
    op.drop_table('chat_requests')
    # ### end Alembic commands ###
