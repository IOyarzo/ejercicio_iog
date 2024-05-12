from config.database import Base
from sqlalchemy import Column, Integer, String, Boolean, Date  

# Definición del modelo de datos
class Tarea(Base):
    __tablename__ = "tareas"
    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String, index=True)
    descripcion = Column(String)
    fecha_vencimiento = Column(Date)  # Cambiado a Date
    estado = Column(Boolean, default=False)