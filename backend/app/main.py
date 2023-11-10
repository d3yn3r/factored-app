import fastapi
import fastapi.security 
import sqlalchemy.orm as sql_orm
import services , schemas
from typing import List
from fastapi.middleware.cors import CORSMiddleware

app = fastapi.FastAPI()

app.add_middleware(CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#endpoint to test
@app.get("/api")
async def root():
    return {"Welcome,the API is running"}

@app.post("/api/users")
async def create_user(user: schemas.UserCreate, data_base: sql_orm.Session = fastapi.Depends(services.get_db)):
    database_user = await services.get_user_email(user.email, data_base)

    if database_user:
        raise fastapi.HTTPException(status_code=400, detail="Email already in use")
    
    loading = await services.create_user(user, data_base)

    return await services.create_token(loading)


@app.post("/api/token")
async def generate_token(form_data: fastapi.security.OAuth2PasswordRequestForm = fastapi.Depends(), data_base: sql_orm.Session = fastapi.Depends(services.get_db)):
    user = await services.authenticate_user(form_data.username, form_data.password, data_base)

    if not user:
        raise fastapi.HTTPException(status_code=401, detail="Invalid credentials")
    
    return await services.create_token(user)

@app.get("/api/users/profile", response_model=schemas.User)
async def get_user(user: schemas.User = fastapi.Depends(services.get_current_user)):
    return user
#create a skill
@app.post("/api/skills", response_model=schemas.Skill)
async def create_skill(skill: schemas.SkillCreate, 
                       user: schemas.User = fastapi.Depends(services.get_current_user), 
                       data_base: sql_orm.Session = fastapi.Depends(services.get_db)):
    return await services.create_skill(user, data_base, skill)

@app.get("/api/skills", response_model=List[schemas.Skill])
async def get_skills(user: schemas.User = fastapi.Depends(services.get_current_user), data_base: sql_orm.Session = fastapi.Depends(services.get_db)):
    return await services.get_skills(user, data_base)

@app.get("/api/skills/{skill_id}", response_model=schemas.Skill)
async def get_skill(skill_id: int,
                     user: schemas.User = fastapi.Depends(services.get_current_user),
                     db: sql_orm.Session = fastapi.Depends(services.get_db)):
    return await services._skill_selector(skill_id, user, db)

@app.put("/api/skills/{skill_id}", status_code=204)
async def update_skill(skill_id: int, 
                       skill: schemas.SkillCreate,
                       user: schemas.User = fastapi.Depends(services.get_current_user), 
                       db: sql_orm.Session = fastapi.Depends(services.get_db)):
    await services.update_skill(skill_id, skill, db, user)

    return {"Updated"}
