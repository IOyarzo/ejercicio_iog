import React, { useState, useEffect } from 'react';
import api from './api';
import 'bootstrap/dist/css/bootstrap.min.css';
import './estilo.css'; 
import { FaTrash, FaEdit, FaBook, FaPencilAlt, FaCalendarAlt } from 'react-icons/fa';





const App = () => {
  const [tareas, setTareas] = useState([]);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    fecha_vencimiento: '',
    estado: false
  });
  const [idEdicionTarea, setIdEdicionTarea] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [mostrarErrorTitulo, setMostrarErrorTitulo] = useState(false);
  const [mostrarErrorDescripcion, setMostrarErrorDescripcion] = useState(false);
  const [mostrarErrorFecha, setMostrarErrorFecha] = useState(false);

  useEffect(() => {
    fetchTareas();
  }, []);

  const fetchTareas = async () => {
    try {
      const response = await api.get('/tareas/');
      setTareas(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData({
      ...formData,
      [event.target.name]: value,
    });
  }

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    // Validar que los campos requeridos no estén vacíos
    if (!formData.titulo.trim() || !formData.descripcion.trim() || !formData.fecha_vencimiento) {
      setMensaje('Por favor completa todos los campos.');
      setMostrarErrorTitulo(!formData.titulo.trim());
      setMostrarErrorDescripcion(!formData.descripcion.trim());
      setMostrarErrorFecha(!formData.fecha_vencimiento);
      return;
    }
    try {
      if (idEdicionTarea) {
        await api.put(`/tareas/${idEdicionTarea}`, formData);
        setTareas(tareas.map(tarea => tarea.id === idEdicionTarea ? formData : tarea));
        setMensaje('Tarea actualizada exitosamente.');
      } else {
        const response = await api.post('/tareas/', formData);
        setTareas([...tareas, response.data]);
        setMensaje('Tarea agregada exitosamente.');
      }
      setFormData({
        titulo: '',
        descripcion: '',
        fecha_vencimiento: '',
        estado: false
      });
      setIdEdicionTarea(null);
      setMostrarErrorTitulo(false);
      setMostrarErrorDescripcion(false);
      setMostrarErrorFecha(false);
      setTimeout(() => {
        setMensaje(null);
      }, 3000);
    } catch (error) {
      console.error('Error:', error);
      setMensaje('Error al realizar la acción.');
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      await api.delete(`/tareas/${id}`);
      setTareas(tareas.filter((tarea) => tarea.id !== id));
      setMensaje('Tarea eliminada exitosamente.');
      setTimeout(() => {
        setMensaje(null);
      }, 3000);
    } catch (error) {
      console.error('Error:', error);
      setMensaje('Error al eliminar la tarea.');
    }
  };

  const handleEditClick = (tarea) => {
    setFormData(tarea);
    setIdEdicionTarea(tarea.id);
  };

  const toggleCompletion = async (id) => {
    try {
      const tareaActualizar = tareas.find(tarea => tarea.id === id);
      const response = await api.put(`/tareas/${id}`, { ...tareaActualizar, estado: !tareaActualizar.estado });
      setTareas(tareas.map(tarea => tarea.id === id ? response.data : tarea));
      setMensaje('Estado de la tarea actualizado exitosamente.');
      setTimeout(() => {
        setMensaje(null);
      }, 3000);
    } catch (error) {
      console.error('Error:', error);
      setMensaje('Error al actualizar el estado de la tarea.');
    }
  };

  return (
    <div className="container">
      <div className="app-container">
        <nav className='navbar navbar-dark bg-primary'>
          <div className='container-fluid'>
            <a className='navbar-brand' href='/'>
              Lista de Tareas
            </a>
          </div>
        </nav>

        {mensaje && <div className={`alert ${mensaje.includes('Error') ? 'alert-danger' : 'alert-success'}`} role="alert">{mensaje}</div>}

        <div className='container'>
          <form onSubmit={handleFormSubmit}>
          <div className='form-group'>
  <label htmlFor='titulo'>
  <FaBook /> {/* Icono alternativo para título */}
    Título
  </label>
  <input type='text' className='form-control' id='titulo' name='titulo' onChange={handleInputChange} value={formData.titulo}/>
  {mostrarErrorTitulo && <span className="text-danger">Por favor coloca un título</span>}
</div>

<div className='form-group'>
  <label htmlFor='descripcion'>
    <FaPencilAlt /> {/* Icono para descripción */}
    Descripción
  </label>
  <input type='text' className='form-control' id='descripcion' name='descripcion' onChange={handleInputChange} value={formData.descripcion}/>
  {mostrarErrorDescripcion && <span className="text-danger">Por favor coloca una descripción</span>}
</div>

<div className='form-group'>
  <label htmlFor='fecha_vencimiento'>
    <FaCalendarAlt /> {/* Icono para fecha de vencimiento */}
    Fecha de vencimiento
  </label>
  <input type='date' className='form-control' id='fecha_vencimiento' name='fecha_vencimiento' onChange={handleInputChange} value={formData.fecha_vencimiento}/>
  {mostrarErrorFecha && <span className="text-danger">Por favor selecciona una fecha</span>}
</div>



            <button type='submit' className='btn btn-primary'>
              {idEdicionTarea ? 'Actualizar' : 'Agregar'}
            </button>
          </form>

          <table className='table table-striped table-bordered table-hover'>
            <thead>
              <tr>
                <th>Título</th>
                <th>Descripción</th>
                <th>Fecha de vencimiento</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tareas.map((tarea) => (
                <tr key={tarea.id}>
                  <td>{tarea.titulo}</td>
                  <td>{tarea.descripcion}</td>
                  <td>{tarea.fecha_vencimiento}</td>
                  <td>
                    {tarea.estado ? <span className="badge bg-success">Completada</span> : <span className="badge bg-warning text-dark">Pendiente</span>}
                  </td>
                  <td>
                  <button className='btn btn-primary' onClick={() => handleEditClick(tarea)}>
  <FaEdit /> {/* Icono de lápiz */}
</button>
<button className='btn btn-danger' onClick={() => handleDeleteClick(tarea.id)}>
  <FaTrash /> {/* Icono de basurero */}
</button>
                    <button className='btn btn-success' onClick={() => toggleCompletion(tarea.id)}>
                      {tarea.estado ? 'Marcar como Pendiente' : 'Marcar como Completada'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default App;
