import { useState } from "react";
import api from "../services/api";

function CompraForm({
  pintura,
  onCerrar,
}) {
  const [datos, setDatos] = useState({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    observaciones: "",
  });

  const [enviando, setEnviando] = useState(false);

  const manejarCambio = (e) => {
    const { name, value } = e.target;

    setDatos({
      ...datos,
      [name]: value,
    });
  };

  const enviarPedido = async (e) => {
    e.preventDefault();

    try {
      setEnviando(true);

      const respuesta = await api.post(
        "/pedidos",
        {
          ...datos,
          pintura_id: pintura.id,
        }
      );

      alert(
        `Pedido #${respuesta.data.pedidoId} registrado correctamente.\n\nEn breve podrás continuar con el pago.`
      );

      onCerrar();

    } catch (error) {

      console.error(
        "Error registrando pedido:",
        error
      );

      alert(
        error.response?.data?.mensaje ||
        "No fue posible registrar el pedido."
      );

    } finally {
      setEnviando(false);
    }
  };

  return (
    <div
      className="purchase-modal-overlay"
      onClick={onCerrar}
    >

      <div
        className="purchase-modal"
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        <button
          className="purchase-close"
          onClick={onCerrar}
        >
          ×
        </button>


        <div className="purchase-header">

          <p>FINALIZAR COMPRA</p>

          <h2>
            Datos de entrega
          </h2>

          <span>
            Completa tus datos para registrar
            tu pedido.
          </span>

        </div>


        {/* RESUMEN */}

        <div className="purchase-summary">

          <img
            src={`http://localhost:3000/uploads/pinturas/${pintura.imagen}`}
            alt={pintura.titulo}
          />

          <div>

            <h3>
              {pintura.titulo}
            </h3>

            <strong>
              {new Intl.NumberFormat(
                "es-CO",
                {
                  style: "currency",
                  currency: "COP",
                  maximumFractionDigits: 0,
                }
              ).format(pintura.precio)}
            </strong>

          </div>

        </div>


        <form
          className="purchase-form"
          onSubmit={enviarPedido}
        >

          <div className="form-row">

            <div className="form-group">

              <label>
                Nombre completo
              </label>

              <input
                type="text"
                name="nombre"
                value={datos.nombre}
                onChange={manejarCambio}
                placeholder="Tu nombre completo"
                required
              />

            </div>


            <div className="form-group">

              <label>
                Correo electrónico
              </label>

              <input
                type="email"
                name="email"
                value={datos.email}
                onChange={manejarCambio}
                placeholder="tu@email.com"
                required
              />

            </div>

          </div>


          <div className="form-row">

            <div className="form-group">

              <label>
                Teléfono
              </label>

              <input
                type="tel"
                name="telefono"
                value={datos.telefono}
                onChange={manejarCambio}
                placeholder="300 000 0000"
                required
              />

            </div>


            <div className="form-group">

              <label>
                Ciudad
              </label>

              <input
                type="text"
                name="ciudad"
                value={datos.ciudad}
                onChange={manejarCambio}
                placeholder="Bucaramanga"
                required
              />

            </div>

          </div>


          <div className="form-group">

            <label>
              Dirección de entrega
            </label>

            <input
              type="text"
              name="direccion"
              value={datos.direccion}
              onChange={manejarCambio}
              placeholder="Dirección donde recibirás la obra"
              required
            />

          </div>


          <div className="form-group">

            <label>
              Observaciones
            </label>

            <textarea
              name="observaciones"
              value={datos.observaciones}
              onChange={manejarCambio}
              placeholder="Información adicional para la entrega..."
              rows="4"
            />

          </div>


          <button
            type="submit"
            className="purchase-button"
            disabled={enviando}
          >

            {enviando
              ? "Registrando pedido..."
              : "Registrar pedido y continuar"}

          </button>

        </form>

      </div>

    </div>
  );
}

export default CompraForm;