"""add pokemon_translations table

Revision ID: 0005
Revises: 0004
Create Date: 2026-07-01

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0005"
down_revision: Union[str, None] = "0004"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "pokemon_translations",
        sa.Column("id", sa.BigInteger(), primary_key=True),
        sa.Column("name_en", sa.Text(), nullable=False),
        sa.Column("name_pt_br", sa.Text(), nullable=False),
        sa.Column("updated_at", sa.TIMESTAMP(timezone=True), server_default=sa.func.now()),
    )


def downgrade() -> None:
    op.drop_table("pokemon_translations")
