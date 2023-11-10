import sqlalchemy
import sqlalchemy.orm as sql_orm
import passlib.hash

import database as _database 

class User(_database.Base):
    __tablename__ = "users"

    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True, index=True)
    name = sqlalchemy.Column(sqlalchemy.String)
    email = sqlalchemy.Column(sqlalchemy.String, unique=True, index=True)
    company_position = sqlalchemy.Column(sqlalchemy.String)
    hashed_password = sqlalchemy.Column(sqlalchemy.String)
    
    skills = sql_orm.relationship("Skill", back_populates="user")

    def verify_password(self, password: str):
        return passlib.hash.bcrypt.verify(password, self.hashed_password) 

class Skill(_database.Base):
    __tablename__ = "skills"

    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True, index=True)
    user_id = sqlalchemy.Column(sqlalchemy.Integer, sqlalchemy.ForeignKey("users.id"))
    name = sqlalchemy.Column(sqlalchemy.String, unique=True, index=True)
    level = sqlalchemy.Column(sqlalchemy.Integer)
    
    user = sql_orm.relationship("User", back_populates="skills")