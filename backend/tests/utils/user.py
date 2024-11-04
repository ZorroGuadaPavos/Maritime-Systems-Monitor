from fastapi.testclient import TestClient
from sqlmodel import Session

from src.core.config import settings
from src.users import services
from src.users.models import User
from src.users.schemas import (
    UserCreate,
)
from tests.utils.utils import random_email, random_lower_string


def user_authentication_headers(*, client: TestClient, email: str, password: str) -> dict[str, str]:
    data = {'username': email, 'password': password}

    r = client.post(f'{settings.API_V1_STR}/login/access-token', data=data)
    response = r.json()
    auth_token = response['access_token']
    headers = {'Authorization': f'Bearer {auth_token}'}
    return headers


def create_random_user(db: Session) -> User:
    email = random_email()
    password = random_lower_string()
    user_in = UserCreate(email=email, password=password)
    user = services.create_user(session=db, user_create=user_in)
    return user
