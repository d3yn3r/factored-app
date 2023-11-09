import fastapi
from fastapi import security
import sqlalchemy.orm as sql_orm
import database
import schemas
import models
from dotenv import load_dotenv
import os
import jwt
import passlib.hash

load_dotenv()
security_schema = security.OAuth2PasswordBearer(tokenUrl="/api/token")

def create_database():
    return database.Base.metadata.create_all(bind = database.engine)

def get_database():
    data_base = database.SessionLocal()

    try:
        yield data_base
    finally:
        data_base.close()

#to create a user
async def create_user(user: schemas.UserCreate, data_base: sql_orm.Session):
    user_data = models.User( 
        name = user.name,
        email = user.email,
        password = passlib.hash.bcrypt.hash(user.password),
        company_position = user.company_position
    )

    data_base.add(user_data)
    data_base.commit()
    data_base.refresh(user_data)

    return user_data

#to validate if a user have a account created
async def user_email(email:str,data_base:sql_orm.Session):
    return data_base.query(models.User).filter(models.User.email == email).first()

async def auth_user(email:str, password:str, data_base:sql_orm.Session):
    user = await user_email(email,data_base)
    
    if not user:
        return False
    if not user.verify_password(password):
        return False
    return user

async def create_access_token(user: models.User):
    user_data = schemas.User.model_validate(user)
    secret_key = os.getenv('SECRET_KEY')
    
    if not secret_key:
        raise fastapi.HTTPException(status_code=500, detail="Internal Server Error: Secret key not found.")
    
    token = jwt.encode(user_data.model_dump(), secret_key)

    return dict(access_token=token, token_type="bearer")

async def get_current_user(data_base: sql_orm.Session = fastapi.Depends(get_database), access_token = fastapi.Depends(security_schema)):
    secret_key = os.getenv('SECRET_KEY')
    algorithms = os.getenv('ALGORITHM')
    try:
        payload = jwt.decode(access_token, secret_key, algorithms)
        user = data_base.query(models.User).filter(models.User.id == payload["id"]).first()
        if not user:
            raise fastapi.HTTPException(status_code=401, detail="User not found")
    except jwt.InvalidTokenError as e:
        raise fastapi.HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")
    except Exception as e:
        raise fastapi.HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
    
    return schemas.User.model_validate(user)
    

async def create_skill(user: schemas.User, data_base: sql_orm.Session, skill: schemas.SkillCreate):
    skill = models.Skills(**skill.model_dump(),user_id = user.id)
    data_base.add(skill)
    data_base.commit()
    data_base.refresh(skill)

    return await schemas.Skill.model_validate(skill)


async def get_skills(user: schemas.User, data_base: sql_orm.Session):
    skills = data_base.query(models.Skills).filter_by(user_id=user.id)

    return list(map(schemas.Skill.model_validate, skills))


async def selector(id_skill: int, user: schemas.User, data_base: sql_orm.Session):
    skill = (
        data_base.query(models.Skills).filter_by(user_id=user.id).filter(models.Skills.skill_id == id_skill).first()
    )
    if skill is None:
        raise fastapi.HTTPException(status_code=404, detail="Skill does not exist")
    
    return skill

async def update_skill(skill_id: int, skill: schemas.SkillCreate, data_base: sql_orm.Session, user: schemas.User):
    skill_data_base = await selector(skill_id, user, data_base)

    skill_data_base.name = skill.name
    skill_data_base.level = skill.level

    data_base.commit()
    data_base.refresh(skill_data_base)

    return schemas.Skill.model_validate(skill_data_base)
