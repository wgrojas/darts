import { useState } from "react";
import api from "../services/api";

function Form() {
  const [contacto, setContacto] = useState({
    nombre: "",
    email: "",
    telefono: "",
    asunto: "",
    mensaje: "",
  });

  const [enviando, setEnviando] = useState(false);

  const manejarCambio = (e) => {
    const { name, value } = e.target;

    setContacto({
      ...contacto,
      [name]: value,
    });
  };

  const enviarFormulario = async (e) => {
    e.preventDefault();

    try {
      setEnviando(true);

      const respuesta = await api.post(
        "/contacto",
        contacto
      );

      alert(
        respuesta.data.mensaje ||
        "Mensaje enviado correctamente."
      );

      setContacto({
        nombre: "",
        email: "",
        telefono: "",
        asunto: "",
        mensaje: "",
      });

    } catch (error) {
      console.error(
        "Error enviando mensaje:",
        error
      );

      alert(
        error.response?.data?.mensaje ||
        "No fue posible enviar el mensaje."
      );

    } finally {
      setEnviando(false);
    }
  };

  return (
    <form
      className="contact-form"
      onSubmit={enviarFormulario}
    >

      <div className="form-row">

        <div className="form-group">

          <label>
            Nombre
          </label>

          <input
            type="text"
            name="nombre"
            placeholder="Tu nombre"
            value={contacto.nombre}
            onChange={manejarCambio}
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
            placeholder="tu@email.com"
            value={contacto.email}
            onChange={manejarCambio}
            required
          />

        </div>

      </div>


      <div className="form-group">

        <label>
          Teléfono
        </label>

        <input
          type="tel"
          name="telefono"
          placeholder="Tu número de teléfono"
          value={contacto.telefono}
          onChange={manejarCambio}
        />

      </div>


      <div className="form-group">

        <label>
          Asunto
        </label>

        <input
          type="text"
          name="asunto"
          placeholder="¿En qué podemos ayudarte?"
          value={contacto.asunto}
          onChange={manejarCambio}
        />

      </div>


      <div className="form-group">

        <label>
          Mensaje
        </label>

        <textarea
          name="mensaje"
          rows="5"
          placeholder="Escribe tu mensaje..."
          value={contacto.mensaje}
          onChange={manejarCambio}
          required
        />

      </div>


      <button
        type="submit"
        className="contact-button"
        disabled={enviando}
      >
        {enviando
          ? "Enviando..."
          : "Enviar mensaje"}
      </button>

    </form>
  );
}

export default Form;