"""test

Revision ID: 84acca45d94e
Revises:
Create Date: 2026-08-06 11:07:38.864801

"""

from collections.abc import Sequence

# revision identifiers, used by Alembic.
revision: str = "84acca45d94e"
down_revision: str | Sequence[str] | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Upgrade schema."""


def downgrade() -> None:
    """Downgrade schema."""
