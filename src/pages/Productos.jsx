import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { ShoppingBag, Loader, AlertCircle, LogOut, CheckCircle } from 'lucide-react';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    stock: '',
    id_categoria: '',
    imagen_url: ''
  });
  const navigate = useNavigate();
  
// Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    console.log("Componente Productos montado");
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      console.log("Iniciando carga de productos...");
      const data = await api.get('/productos/getProductos');
      console.log("Datos recibidos:", data);
      setProductos(data);
    } catch (err) {
      console.error("Error detallado:", err);
      setError("No se pudo conectar con el servidor. ¿Está encendido?");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateProducto = async (e) => {
    e.preventDefault();
    try {
      await api.post('/productos/', {
        nombre: formData.nombre,
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock) || 10,
        id_categoria: parseInt(formData.id_categoria) || 1,
        imagen_url: formData.imagen_url
      });
      setFormData({ nombre: '', precio: '', stock: '', id_categoria: '', imagen_url: '' });
      setSuccess(`✓ Producto "${formData.nombre}" creado exitosamente`);
      setError(null);
      
      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(null), 3000);
      
      cargarProductos();
    } catch (err) {
      console.error("Error al crear producto:", err);
      setError("No se pudo crear el producto. Intenta de nuevo.");
      setSuccess(null);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <Loader className="animate-spin text-blue-600" size={48} />
    </div>
  );

  if (error) return (
    <div className="bg-red-100 text-red-700 p-4 rounded-lg flex items-center gap-2">
      <AlertCircle /> {error}
    </div>
  );

  return (
    <div>
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
          <ShoppingBag className="text-blue-600" /> Inventario
        </h1>
        <div className="flex items-center gap-4">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
            {productos.length} items
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            <LogOut size={18} /> Salir
          </button>
        </div>
      </header>

      {success && (
        <div className="bg-green-100 text-green-700 p-4 rounded-lg flex items-center gap-2 mb-6 border border-green-300">
          <CheckCircle size={20} /> {success}
        </div>
      )}

      {/* Formulario simple */}
      <form onSubmit={handleCreateProducto} className="bg-white p-6 rounded-lg shadow mb-8 border border-slate-200">
        <h2 className="text-xl font-bold mb-4 text-slate-800">Crear Nuevo Producto</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            required
            className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            name="precio"
            placeholder="Precio"
            step="0.01"
            value={formData.precio}
            onChange={handleInputChange}
            required
            className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleInputChange}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            name="id_categoria"
            placeholder="ID Categoría"
            value={formData.id_categoria}
            onChange={handleInputChange}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="imagen_url"
            placeholder="URL imagen"
            value={formData.imagen_url}
            onChange={handleInputChange}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-colors"
          >
            Guardar
          </button>
        </div>
      </form>

      {/* Grid Responsivo: 1 col móvil, 2 tablet, 3 desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {productos.map((prod) => (
          <div key={prod.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-100 overflow-hidden flex flex-col">
            
            {/* Imagen del producto */}
            <div className="h-48 p-4 bg-white flex items-center justify-center border-b border-slate-50">
              <img 
                src={prod.imagen_url || "https://via.placeholder.com/150"} 
                alt={prod.nombre} 
                className="max-h-full object-contain"
              />
            </div>

            {/* Cuerpo de la tarjeta */}
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-slate-800 line-clamp-1" title={prod.nombre}>
                  {prod.nombre}
                </h3>
                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-bold">
                  ${prod.precio}
                </span>
              </div>
              
              <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-1">
                {prod.descripcion || "Sin descripción disponible."}
              </p>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                <span className="text-xs font-medium text-slate-400">
                  Stock: <span className={prod.stock < 10 ? "text-red-500 font-bold" : "text-slate-600"}>{prod.stock}</span>
                </span>
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  Editar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Productos;