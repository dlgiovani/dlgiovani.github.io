"""add uid to pokemon_picks

Revision ID: 0003
Revises: 0002
Create Date: 2026-05-25

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0003"
down_revision: Union[str, None] = "0002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("pokemon_picks", sa.Column("uid", sa.String(64), nullable=True))
    op.create_unique_constraint("uq_pokemon_picks_uid", "pokemon_picks", ["uid"])


def downgrade() -> None:
    op.drop_constraint("uq_pokemon_picks_uid", "pokemon_picks", type_="unique")
    op.drop_column("pokemon_picks", "uid")
