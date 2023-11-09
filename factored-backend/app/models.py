import sqlalchemy
import sqlalchemy.orm as sql_orm
import database
from passlib import hash

class User(database.Base):
    __tablename__ = "users"

    #user basic data
    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key = True, index = True)
    name = sqlalchemy.Column(sqlalchemy.String)
    email = sqlalchemy.Column(sqlalchemy.String,unique = True, index = True)
    password = sqlalchemy.Column(sqlalchemy.String)
    company_position = sqlalchemy.Column(sqlalchemy.String)

    skills = sql_orm.relationship("Skill",back_populates = "user")

    def verify_password(self, password: str):
        return hash.bcrypt.verify(password, self.hashed_password)

class Skills(database.Base):
    __tablename__ = "skills"
    
    #skills data
    skill_id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True, index = True)
    name = sqlalchemy.Column(sqlalchemy.String, unique = True, index = True)
    user_id = sqlalchemy.Column(sqlalchemy.Integer, sqlalchemy.ForeignKey("users.id"))
    skill_level = sqlalchemy.Column(sqlalchemy.Integer)

    user = sql_orm.relationship("User", back_populates = "skills")
    