import fastapi
import sqlalchemy.orm as sql_orm
import database
import schemas
import models

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
        password = user.password,
        company_position = user.company_position
    )

    data_base.add(user_data)
    data_base.commit()
    data_base.refresh(user_data)

    return user_data
