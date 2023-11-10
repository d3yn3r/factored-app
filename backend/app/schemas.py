from pydantic import BaseModel 

class UserBase(BaseModel):
    name: str
    email: str
    company_position: str

class UserCreate(UserBase):
    hashed_password: str

    class Config:
        orm_mode = True
        from_orm = True
        from_attributes = True

class User(UserBase):
    id: int
    
    class Config:
        orm_mode = True
        from_attributes = True

class SkillBase(BaseModel):
    name: str
    level: int

class SkillCreate(SkillBase):
    pass

class Skill(SkillBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True
        from_attributes = True

