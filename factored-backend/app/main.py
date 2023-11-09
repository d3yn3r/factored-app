from typing import List
import fastapi
import fastapi.security
import sqlalchemy.orm as sql_orm
import services
import schemas

app = fastapi.FastAPI()

#test endpoint
@app.get("/api")
def root():
    return {"message", "Welcome, Connected successfully"}

#endpoint to create a user
@app.post("/api/users")
async def create_user(user: schemas.UserCreate, data_base: sql_orm.Session = fastapi.Depends(services.get_database)):
    data_base_user = await services.user_email(user.email,data_base)

    if data_base_user:
        raise fastapi.HTTPException(status_code=400, detail="This email is already in use, please use another email")
    
    return await services.create_access_token(await services.create_user(user,data_base))

#get user profile
@app.get("/api/users/profile", response_model= schemas.User)
async def get_profile(user: schemas.User = fastapi.Depends(services.get_current_user)):
    return user

#get token
@app.post("/api/token")
async def token(data: fastapi.security.OAuth2PasswordRequestForm = fastapi.Depends(),data_base: sql_orm.Session = fastapi.Depends(services.get_database)):
    user = await services.auth_user(data.username,data.password,data_base)

    if not user:
        raise fastapi.HTTPException(status_code=401,detail="Invalid credentials")
    
    return await services.create_access_token(user)

#get user skills
@app.get("/api/skills", response_model=List[schemas.Skill])
async def get_skills(user: schemas.User = fastapi.Depends(services.get_current_user), data_base: sql_orm.Session = fastapi.Depends(services.get_database)):
    return await services.get_skills(user, data_base)

@app.post("/api/skills", response_model=schemas.Skill)
async def create_skill(skill: schemas.SkillCreate, 
                       user: schemas.User = fastapi.Depends(services.get_current_user), 
                       db: sql_orm.Session = fastapi.Depends(services.get_database)):
    return await services.create_skill(user, db, skill)

@app.get("/api/skills/{skill_id}", response_model=schemas.Skill)
async def get_skill(skill_id: int,
                     user: schemas.User = fastapi.Depends(services.get_current_user),
                     db: sql_orm.Session = fastapi.Depends(services.get_database)):
    return await services.selector(skill_id, user, db)

@app.put("/api/skills/{skill_id}", status_code=204)
async def update_skill(skill_id: int, 
                       skill: schemas.SkillCreate,
                       user: schemas.User = fastapi.Depends(services.get_current_user), 
                       db: sql_orm.Session = fastapi.Depends(services.get_database)):
    await services.update_skill(skill_id, skill, db, user)

    return {"message", "Successfully Updated"}