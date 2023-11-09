import fastapi
import sqlalchemy.orm as sql_orm
import services
import schemas

app = fastapi.FastAPI()

#endpoint to create a user
@app.post("/api/users")
async def create_user(user: schemas.UserCreate, data_base: sql_orm.Session = fastapi.Depends(services.get_database)):
    data_base_user = await services.user_email(user.email,data_base)

    if data_base_user:
        raise fastapi.HTTPException(status_code=400, detail="This email is already in use, please use another email")
    else:
        return await services.create_access_token(await services.create_user(user,data_base))

#get user profile
@app.get("/api/users/profile", response_model= schemas.User)
async def get_profile(user: schemas.User = fastapi.Depends(services.get_current_user)):
    return user

