import database , models, schemas
import sqlalchemy.orm as sql_orm
import passlib.hash
import jwt
import fastapi
import fastapi.security
from sqlalchemy.exc import IntegrityError

oauth2schema = fastapi.security.OAuth2PasswordBearer(tokenUrl="/api/token")
SECRET_KEY = "factored"

def create_database():
    return database.Base.metadata.create_all(bind=database.engine)

def get_db():
    data_base = database.SessionLocal()

    try:
        yield data_base
    finally:
        data_base.close()

async def get_user_email(email: str, data_base: sql_orm.Session):
    return data_base.query(models.User).filter(models.User.email == email).first()

async def create_user(user: schemas.UserCreate, data_base: sql_orm.Session):
    user_obj = models.User(
        email=user.email, 
        hashed_password=passlib.hash.bcrypt.hash(user.hashed_password), 
        name=user.name, 
        company_position=user.company_position
    )


    data_base.add(user_obj)
    data_base.commit()
    data_base.refresh(user_obj)

    return user_obj

async def authenticate_user(email: str, password: str, data_base: sql_orm.Session):
    user = await get_user_email(email, data_base)

    if not user:
        return False

    if not user.verify_password(password):
        return False
    
    return user

async def create_token(user: models.User):
    user_obj = schemas.User.from_orm(user) 
    token = jwt.encode(user_obj.dict(), SECRET_KEY)
    return dict(access_token=token, token_type="bearer")

async def get_current_user( data_base: sql_orm.Session = fastapi.Depends(get_db), token: str = fastapi.Depends(oauth2schema)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user = data_base.query(models.User).get(payload["id"])
    except:
        raise fastapi.HTTPException(status_code=401, detail="Invalid Email or Password")

    return schemas.User.from_orm(user)

async def create_skill(user: schemas.User, data_base: sql_orm.Session, skill: schemas.SkillCreate):
    try:
        skill = models.Skill(**skill.dict(), user_id=user.id)
        data_base.add(skill)
        data_base.commit()
        data_base.refresh(skill)
    except IntegrityError as e:
        data_base.rollback()
        return {"error": "Skill with the same name already exists"}
    return schemas.Skill.from_orm(skill)

async def get_skills(user: schemas.User, data_base: sql_orm.Session):
    skills = data_base.query(models.Skill).filter_by(user_id=user.id)
    return list(map(schemas.Skill.from_orm, skills))

async def _skill_selector(skill_id: int, user: schemas.User, data_base: sql_orm.Session):
    skill = (
        data_base.query(models.Skill).filter_by(user_id=user.id).filter(models.Skill.id == skill_id).first()
    )

    if skill is None:
        raise fastapi.HTTPException(status_code=404, detail="Skill does not exist")
    
    return skill

async def update_skill(skill_id: int, skill: schemas.SkillCreate, data_base: sql_orm.Session, user: schemas.User):
    skill_data_base = await _skill_selector(skill_id, user, data_base)

    skill_data_base.name = skill.name
    skill_data_base.level = skill.level

    data_base.commit()
    data_base.refresh(skill_data_base)

    return schemas.Skill.from_orm(skill_data_base)