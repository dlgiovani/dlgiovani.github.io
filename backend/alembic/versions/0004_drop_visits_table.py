"""drop visits table — stats derived from guestbook and picks

Revision ID: 0004
Revises: 0003
Create Date: 2026-05-26

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0004"
down_revision: Union[str, None] = "0003"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_table("visits")


def downgrade() -> None:
    op.create_table(
        "visits",
        sa.Column("id", sa.BigInteger(), autoincrement=True, nullable=False),
        sa.Column("city", sa.Text(), nullable=True),
        sa.Column("country", sa.Text(), nullable=True),
        sa.Column("country_code", sa.String(2), nullable=True),
        sa.Column("lat", sa.Float(), nullable=True),
        sa.Column("lon", sa.Float(), nullable=True),
        sa.Column("visited_at", sa.TIMESTAMP(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
