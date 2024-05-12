from fastapi import FastAPI, HTTPException, Depends
from typing import Annotated, List
from sqlalchemy.orm import Session
from pydantic import BaseModel, validator
from config.database import SessionLocal, engine
import models
from fastapi.middleware.cors import CORSMiddleware
from datetime import date

# Creando una instancia de aplicación FastAPI
app = FastAPI()

origins = {
    'http://localhost:3000',
}

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Definir un modelo Pydantic
class TareaBase(BaseModel):
    titulo: str
    descripcion: str
    fecha_vencimiento: date  # Cambiado a date en lugar de datetime
    estado: bool

    @validator("titulo", "descripcion")
    def check_empty_string(cls, v):
        if not v.strip():  
            raise ValueError("El campo no puede estar vacío")
        return v

    @validator("fecha_vencimiento")
    def check_valid_date(cls, v):
        if not isinstance(v, date):  # Cambiado a date en lugar de datetime
            raise ValueError("La fecha debe ser un objeto date")
        return v
# Definir un modelo Pydantic con id
class TareaModel(TareaBase):
    id: int
    #class Config:
     #   orm_mode = True
  
# Definiendo una función para obtener una sesión de base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Definiendo una función para obtener una instancia de base de datos
def get_db():
    return SessionLocal()

db_dependency = Annotated[Session, Depends(get_db)]

# Database conexion
models.Base.metadata.create_all(bind=engine)

# POST
@app.post("/tareas/", response_model=TareaModel)
async def create_tarea(tarea: TareaBase, db: db_dependency):
    db_tarea = models.Tarea(**tarea.dict())
    db.add(db_tarea)
    db.commit()
    db.refresh(db_tarea)
    return db_tarea
    
# GET    
@app.get("/tareas/", response_model=List[TareaModel])
async def read_tarea(db: db_dependency, skip: int = 0, limit: int = 100):
    db_tareas = db.query(models.Tarea).offset(skip).limit(limit).all()
    return db_tareas

# PUT
@app.put("/tareas/{tarea_id}", response_model=TareaModel)
async def update_tarea(tarea_id: int, tarea: TareaBase, db: db_dependency):
    db_tarea = db.query(models.Tarea).filter(models.Tarea.id == tarea_id).first()
    if not db_tarea:
        raise HTTPException(status_code=404, detail="Tarea not found")
    db_tarea.titulo = tarea.titulo
    db_tarea.descripcion = tarea.descripcion
    db_tarea.fecha_vencimiento = tarea.fecha_vencimiento
    if hasattr(tarea, 'estado'):
        db_tarea.estado = tarea.estado
    db.commit()
    db.refresh(db_tarea)
    return db_tarea

# DELETE
@app.delete("/tareas/{tarea_id}")
async def delete_tarea(tarea_id: int, db: db_dependency):
    db_tarea = db.query(models.Tarea).filter(models.Tarea.id == tarea_id).first()
    if not db_tarea:
        raise HTTPException(status_code=404, detail="Tarea not found")
    db.delete(db_tarea)
    db.commit()
    return {"detail": "Tarea deleted"}
