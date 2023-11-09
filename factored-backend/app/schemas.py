import pydantic

#parent class of user
class User_Base(pydantic.BaseModel):
    name: str
    email: str
    company_position: str

#to POST a user
class UserCreate(User_Base):
    password:str

    class config:
        orm_mode = True

#to get a user by id
class User(User_Base):
    id:int

    class config:
        orm_mode : True
