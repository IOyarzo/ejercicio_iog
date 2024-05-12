## Backend:
## Requisitos previos
- Python instalado en tu sistema.
- Instalación de pipenv (opcional pero recomendado).

## Instalación
1. Clona este repositorio en tu computadora.
2. Abre una terminal y navega hasta el directorio del repositorio clonado.
3. Crea un entorno virtual (opcional pero recomendado):
4. Instala las dependencias:
pipenv shell
pip install -r requirements.txt


## Cómo ejecutar
1. Asegúrate de tener una instancia de base de datos configurada y funcionando. Puedes consultar el archivo `config/database.py` para configurar la base de datos.
2. Ejecuta la aplicación: uvicorn main:app --reload
3. Abre tu navegador web y ve a `http://localhost:8000/docs` para ver la documentación interactiva de la API y probar los endpoints.



## Frontend:
## Instalación
1. Clona este repositorio en tu computadora.
2. Abre una terminal y navega hasta el directorio del repositorio clonado.
3. Instala las dependencias correspondientes utilizando npm:


## Cómo ejecutar
1. Asegúrate de que la API esté en funcionamiento y configurada correctamente.
2. Ejecuta la aplicación utilizando el siguiente comando:
3. Abre tu navegador web y visita la URL `http://localhost:3000` para ver la aplicación en funcionamiento.

