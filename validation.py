from enum import Enum
from uuid import UUID

from pydantic import BaseModel, EmailStr, constr, condecimal


class UserStatus(str, Enum):
    student = "student"
    staff = "staff"
    outsider = "outsider"


class Gender(str, Enum):
    male = "male"
    female = "female"
    non_binary = "non_binary"
    other = "other"
    prefer_not_to_say = "prefer_not_to_say"


PhoneNumber = constr(pattern=r"^\+?[0-9]{7,15}$")  # simple E.164-like check
NameStr = constr(strip_whitespace=True, min_length=1, max_length=50)
UsernameStr = constr(strip_whitespace=True, min_length=3, max_length=50)


class UserProfileCreate(BaseModel):
    first_name: NameStr | None = None # type: ignore
    last_name: NameStr | None = None # type: ignore
    phone_number: PhoneNumber | None = None # type: ignore
    gender: Gender | None = None
    university_username: UsernameStr # type: ignore
    status: UserStatus = UserStatus.student


class UserProfileUpdate(BaseModel):
    first_name: NameStr | None = None # type: ignore
    last_name: NameStr | None = None # type: ignore
    phone_number: PhoneNumber | None = None # type: ignore
    gender: Gender | None = None
    university_username: UsernameStr | None = None # pyright: ignore[reportInvalidTypeForm]
    status: UserStatus | None = None


class UserProfileOut(BaseModel):
    id: UUID
    first_name: str
    last_name: str
    email: EmailStr
    phone_number: str | None
    gender: Gender | None
    university_username: str
    status: UserStatus
    rating: condecimal(ge=0, le=5, max_digits=2, decimal_places=1) # type: ignore
