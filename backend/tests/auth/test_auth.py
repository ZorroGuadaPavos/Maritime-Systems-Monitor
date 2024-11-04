from sqlmodel import Session

from src.auth.services import authenticate
from src.users.schemas import UserCreate
from src.users.services import create_user
from tests.utils.utils import random_email, random_lower_string


def test_authenticate_user(db: Session) -> None:
    email = random_email()
    password = random_lower_string()
    user_in = UserCreate(email=email, password=password)
    user = create_user(session=db, user_create=user_in)
    authenticated_user = authenticate(session=db, email=email, password=password)
    assert authenticated_user
    assert user.email == authenticated_user.email


def test_not_authenticate_user(db: Session) -> None:
    email = random_email()
    password = random_lower_string()
    user = authenticate(session=db, email=email, password=password)
    assert user is None
