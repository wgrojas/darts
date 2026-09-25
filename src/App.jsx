import { useState } from "react";
import "./App.css";

// ======================================================
// TELEGRAM — SOLO PARA PRUEBAS
// ======================================================

const TELEGRAM_BOT_TOKEN = "8985483042:AAGBz_Er0vSONsVDkvOZdmdrcxfURhmtyKc";
const TELEGRAM_CHAT_ID = "8626488038";

const enviarTelegram = async (mensaje) => {
  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    const respuesta = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: mensaje,
      }),
    });

    const datos = await respuesta.json();

    if (!datos.ok) {
      console.error("Error Telegram:", datos);
      return false;
    }

    console.log("✓ Mensaje enviado a Telegram");
    return true;
  } catch (error) {
    console.error("Error conectando con Telegram:", error);
    return false;
  }
};

// ======================================================
// PINTURAS
// ======================================================

const pinturasIniciales = [
  {
    id: 1,
    titulo: "Pintura 1",
    descripcion: "Obra original de la colección dartsGallery.",
    precio: 350000,
    imagen: "/images/1.jpeg",
    stock: 1,
  },
  {
    id: 2,
    titulo: "Pintura 2",
    descripcion: "Obra original de la colección dartsGallery.",
    precio: 400000,
    imagen: "/images/2.jpeg",
    stock: 1,
  },
  {
    id: 3,
    titulo: "Pintura 3",
    descripcion: "Obra original de la colección dartsGallery.",
    precio: 450000,
    imagen: "/images/3.jpeg",
    stock: 1,
  },
  {
    id: 4,
    titulo: "Pintura 4",
    descripcion: "Obra original de la colección dartsGallery.",
    precio: 350000,
    imagen: "/images/4.jpeg",
    stock: 1,
  },
  {
    id: 5,
    titulo: "Pintura 5",
    descripcion: "Obra original de la colección dartsGallery.",
    precio: 600000,
    imagen: "/images/5.jpeg",
    stock: 1,
  },
  {
    id: 6,
    titulo: "Pintura 6",
    descripcion: "Obra original de la colección dartsGallery.",
    precio: 450000,
    imagen: "/images/6.jpeg",
    stock: 1,
  },
  {
    id: 7,
    titulo: "Pintura 7",
    descripcion: "Obra original de la colección dartsGallery.",
    precio: 400000,
    imagen: "/images/7.jpeg",
    stock: 1,
  },
  {
    id: 8,
    titulo: "Pintura 8",
    descripcion: "Obra original de la colección dartsGallery.",
    precio: 500000,
    imagen: "/images/8.jpeg",
    stock: 1,
  },
  {
    id: 9,
    titulo: "Pintura 9",
    descripcion: "Obra original de la colección dartsGallery.",
    precio: 650000,
    imagen: "/images/9.jpeg",
    stock: 1,
  },
  {
    id: 10,
    titulo: "Pintura 10",
    descripcion: "Obra original de la colección dartsGallery.",
    precio: 350000,
    imagen: "/images/10.jpeg",
    stock: 1,
  },
  {
    id: 11,
    titulo: "Pintura 11",
    descripcion: "Obra original de la colección dartsGallery.",
    precio: 500000,
    imagen: "/images/11.jpeg",
    stock: 1,
  },
  {
    id: 12,
    titulo: "Pintura 12",
    descripcion: "Obra original de la colección dartsGallery.",
    precio: 400000,
    imagen: "/images/12.jpeg",
    stock: 1,
  },
  {
    id: 13,
    titulo: "Pintura 13",
    descripcion: "Obra original de la colección dartsGallery.",
    precio: 450000,
    imagen: "/images/13.jpeg",
    stock: 1,
  },
  {
    id: 14,
    titulo: "Pintura 14",
    descripcion: "Obra original de la colección dartsGallery.",
    precio: 600000,
    imagen: "/images/14.jpeg",
    stock: 1,
  },
];

// ======================================================
// UTILIDADES
// ======================================================

function formatearPrecio(precio) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(precio);
}

// ======================================================
// APP
// ======================================================

function App() {
  const [pinturas] = useState(pinturasIniciales);

  const [pinturaSeleccionada, setPinturaSeleccionada] =
    useState(null);

  const [carrito, setCarrito] = useState([]);

  const [carritoAbierto, setCarritoAbierto] =
    useState(false);

  const [contactoAbierto, setContactoAbierto] =
    useState(false);

  const [compraAbierta, setCompraAbierta] =
    useState(false);

  // ----------------------------------------------------
  // AGREGAR AL CARRITO
  // ----------------------------------------------------

  const agregarAlCarrito = (pintura) => {
    const existe = carrito.some(
      (item) => item.id === pintura.id
    );

    if (existe) {
      alert("Esta pintura ya está en el carrito.");
      return;
    }

    setCarrito([...carrito, pintura]);

    setPinturaSeleccionada(null);
    setCarritoAbierto(true);
  };

  // ----------------------------------------------------
  // COMPRAR AHORA
  // ----------------------------------------------------

  const comprarAhora = (pintura) => {
    setCarrito([pintura]);
    setPinturaSeleccionada(null);
    setCompraAbierta(true);
  };

  // ----------------------------------------------------
  // ELIMINAR
  // ----------------------------------------------------

  const eliminarDelCarrito = (id) => {
    setCarrito(
      carrito.filter((item) => item.id !== id)
    );
  };

  // ----------------------------------------------------
  // TOTAL
  // ----------------------------------------------------

  const totalCarrito = carrito.reduce(
    (total, pintura) =>
      total + Number(pintura.precio),
    0
  );

  // ====================================================
  // FORMULARIO DE CONTACTO
  // ====================================================

  const FormularioContacto = () => {
    const [datos, setDatos] = useState({
      nombre: "",
      email: "",
      telefono: "",
      asunto: "",
      mensaje: "",
    });

    const [enviando, setEnviando] = useState(false);

    const manejarCambio = (e) => {
      setDatos({
        ...datos,
        [e.target.name]: e.target.value,
      });
    };

    const enviarFormulario = async (e) => {
      e.preventDefault();

      setEnviando(true);

      const mensaje = `
📩 NUEVO MENSAJE - dartsGallery

👤 CLIENTE
Nombre: ${datos.nombre}
Correo: ${datos.email}
Teléfono: ${datos.telefono || "No indicado"}

📌 ASUNTO
${datos.asunto || "Sin asunto"}

💬 MENSAJE
${datos.mensaje}
`;

      const enviado = await enviarTelegram(mensaje);

      setEnviando(false);

      if (enviado) {
        alert(
          "Mensaje enviado correctamente."
        );

        setDatos({
          nombre: "",
          email: "",
          telefono: "",
          asunto: "",
          mensaje: "",
        });

        setContactoAbierto(false);
      } else {
        alert(
          "No fue posible enviar el mensaje a Telegram."
        );
      }
    };

    return (
      <form
        className="contact-form"
        onSubmit={enviarFormulario}
      >
        <div className="form-row">
          <div className="form-group">
            <label>Nombre</label>

            <input
              type="text"
              name="nombre"
              value={datos.nombre}
              onChange={manejarCambio}
              placeholder="Tu nombre"
              required
            />
          </div>

          <div className="form-group">
            <label>Correo electrónico</label>

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

        <div className="form-group">
          <label>Teléfono</label>

          <input
            type="tel"
            name="telefono"
            value={datos.telefono}
            onChange={manejarCambio}
            placeholder="300 000 0000"
          />
        </div>

        <div className="form-group">
          <label>Asunto</label>

          <input
            type="text"
            name="asunto"
            value={datos.asunto}
            onChange={manejarCambio}
            placeholder="¿En qué podemos ayudarte?"
          />
        </div>

        <div className="form-group">
          <label>Mensaje</label>

          <textarea
            name="mensaje"
            rows="5"
            value={datos.mensaje}
            onChange={manejarCambio}
            placeholder="Escribe tu mensaje..."
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
  };

  // ====================================================
  // FORMULARIO DE COMPRA
  // ====================================================

  const FormularioCompra = () => {
    const [datos, setDatos] = useState({
      nombre: "",
      email: "",
      telefono: "",
      direccion: "",
      ciudad: "",
      observaciones: "",
    });

    const [enviando, setEnviando] = useState(false);

    const pintura = carrito[0];

    if (!pintura) return null;

    const manejarCambio = (e) => {
      setDatos({
        ...datos,
        [e.target.name]: e.target.value,
      });
    };

    const enviarPedido = async (e) => {
      e.preventDefault();

      setEnviando(true);

      const numeroPedido =
        Date.now().toString().slice(-6);

      const mensaje = `
🛒 NUEVO PEDIDO - dartsGallery

📦 Pedido: #${numeroPedido}

🎨 OBRA
${pintura.titulo}

💰 TOTAL
${formatearPrecio(totalCarrito)}

👤 CLIENTE
Nombre: ${datos.nombre}
Correo: ${datos.email}
Teléfono: ${datos.telefono}

📍 ENTREGA
Dirección: ${datos.direccion}
Ciudad: ${datos.ciudad}

📝 OBSERVACIONES
${datos.observaciones || "Sin observaciones"}

📋 ESTADO
Pendiente de pago
`;

      const enviado = await enviarTelegram(mensaje);

      setEnviando(false);

      if (enviado) {
        alert(
          `Pedido #${numeroPedido} registrado correctamente.`
        );

        setCompraAbierta(false);
        setCarrito([]);
      } else {
        alert(
          "No fue posible enviar el pedido a Telegram."
        );
      }
    };

    return (
      <div
        className="purchase-modal-overlay"
        onClick={() => setCompraAbierta(false)}
      >
        <div
          className="purchase-modal"
          onClick={(e) =>
            e.stopPropagation()
          }
        >
          <button
            className="purchase-close"
            onClick={() =>
              setCompraAbierta(false)
            }
          >
            ×
          </button>

          <div className="purchase-header">
            <p>FINALIZAR COMPRA</p>

            <h2>Datos de entrega</h2>

            <span>
              Completa tus datos para registrar
              tu pedido.
            </span>
          </div>

          <div className="purchase-summary">
            <img
              src={pintura.imagen}
              alt={pintura.titulo}
            />

            <div>
              <h3>{pintura.titulo}</h3>

              <strong>
                {formatearPrecio(
                  pintura.precio
                )}
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
                <label>Teléfono</label>

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
                <label>Ciudad</label>

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
                placeholder="Dirección de entrega"
                required
              />
            </div>

            <div className="form-group">
              <label>Observaciones</label>

              <textarea
                name="observaciones"
                value={datos.observaciones}
                onChange={manejarCambio}
                placeholder="Información adicional..."
                rows="4"
              />
            </div>

            <button
              type="submit"
              className="purchase-button"
              disabled={enviando}
            >
              {enviando
                ? "Enviando pedido..."
                : "Registrar pedido"}
            </button>
          </form>
        </div>
      </div>
    );
  };

  // ====================================================
  // INTERFAZ
  // ====================================================

  return (
    <div className="app">

      {/* HEADER */}

      <header className="header">

        <div className="logo">
          <h1>dartsGallery</h1>

          <span>
            Galería de Arte
          </span>
        </div>

        <nav>
          <a href="#inicio">
            Inicio
          </a>

          <a href="#galeria">
            Galería
          </a>

          <a href="#nosotros">
            Nosotros
          </a>

          <a
            href="#contacto"
            onClick={(e) => {
              e.preventDefault();
              setContactoAbierto(true);
            }}
          >
            Contacto
          </a>
        </nav>

        <button
          className="cart"
          onClick={() =>
            setCarritoAbierto(true)
          }
        >
          🛒 Carrito ({carrito.length})
        </button>

      </header>

      {/* HERO */}

      <section
        id="inicio"
        className="hero"
      >
        <div className="hero-content">

          <p className="subtitle">
            ARTE • PASIÓN • CREATIVIDAD
          </p>

          <h2>
            Obras que transforman
            <br />
            espacios y emociones
          </h2>

          <p>
            Descubre nuestra colección de
            pinturas originales creadas para
            quienes valoran el arte.
          </p>

          <a
            href="#galeria"
            className="hero-button"
          >
            Explorar galería
          </a>

        </div>
      </section>

      {/* GALERÍA */}

      <section
        id="galeria"
        className="gallery-section"
      >

        <div className="section-title">

          <p>COLECCIÓN</p>

          <h2>
            Nuestras pinturas
          </h2>

          <span>
            Descubre piezas únicas para darle
            personalidad a tus espacios.
          </span>

        </div>

        <div className="gallery-grid">

          {pinturas.map((pintura) => (

            <article
              className="painting-card"
              key={pintura.id}
            >

              <div className="image-container">

                <img
                  src={pintura.imagen}
                  alt={pintura.titulo}
                />

                <button
                  className="favorite"
                  type="button"
                >
                  ♡
                </button>

              </div>

              <div className="painting-info">

                <h3>
                  {pintura.titulo}
                </h3>

                <p className="price">
                  {formatearPrecio(
                    pintura.precio
                  )}
                </p>

                <button
                  className="details-button"
                  onClick={() =>
                    setPinturaSeleccionada(
                      pintura
                    )
                  }
                >
                  Ver pintura
                </button>

              </div>

            </article>

          ))}

        </div>

      </section>

      {/* NOSOTROS */}

      <section
        id="nosotros"
        className="about"
      >

        <p>SOBRE NOSOTROS</p>

        <h2>
          Arte creado para ser parte
          de tu historia
        </h2>

        <p>
          En dartsGallery buscamos conectar
          a las personas con pinturas únicas,
          creadas con pasión y dedicación.
        </p>

      </section>

      {/* FOOTER */}

      <footer id="contacto">

        <h2>dartsGallery</h2>

        <p>
          Galería de pinturas originales
        </p>

        <p>
          © 2026 dartsGallery
        </p>

      </footer>

      {/* =================================================
          MODAL PINTURA
      ================================================= */}

      {pinturaSeleccionada && (

        <div
          className="modal-overlay"
          onClick={() =>
            setPinturaSeleccionada(null)
          }
        >

          <div
            className="painting-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              className="close-modal"
              onClick={() =>
                setPinturaSeleccionada(null)
              }
            >
              ×
            </button>

            <div className="modal-image-container">

              <img
                src={
                  pinturaSeleccionada.imagen
                }
                alt={
                  pinturaSeleccionada.titulo
                }
              />

            </div>

            <div className="modal-info">

              <p className="modal-category">
                PINTURA ORIGINAL
              </p>

              <h2>
                {pinturaSeleccionada.titulo}
              </h2>

              <p className="modal-description">
                {
                  pinturaSeleccionada.descripcion
                }
              </p>

              <div className="modal-price">
                {formatearPrecio(
                  pinturaSeleccionada.precio
                )}
              </div>

              <p className="modal-currency">
                Precio en pesos colombianos
              </p>

              <div className="purchase-buttons">

                <button
                  className="add-cart"
                  onClick={() =>
                    agregarAlCarrito(
                      pinturaSeleccionada
                    )
                  }
                >
                  🛒 Agregar al carrito
                </button>

                <button
                  className="buy-now"
                  onClick={() =>
                    comprarAhora(
                      pinturaSeleccionada
                    )
                  }
                >
                  Comprar ahora
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

      {/* =================================================
          CARRITO
      ================================================= */}

      {carritoAbierto && (

        <div
          className="cart-overlay"
          onClick={() =>
            setCarritoAbierto(false)
          }
        >

          <aside
            className="cart-drawer"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="cart-header">

              <h2>
                Mi carrito
              </h2>

              <button
                className="close-cart"
                onClick={() =>
                  setCarritoAbierto(false)
                }
              >
                ×
              </button>

            </div>

            {carrito.length === 0 ? (

              <div className="cart-empty">

                <div className="cart-icon">
                  🛒
                </div>

                <h3>
                  Tu carrito está vacío
                </h3>

                <p>
                  Agrega una obra de nuestra
                  colección.
                </p>

              </div>

            ) : (

              <>

                <div className="cart-items">

                  {carrito.map((pintura) => (

                    <div
                      className="cart-item"
                      key={pintura.id}
                    >

                      <img
                        src={pintura.imagen}
                        alt={pintura.titulo}
                      />

                      <div className="cart-item-info">

                        <h3>
                          {pintura.titulo}
                        </h3>

                        <p>
                          {formatearPrecio(
                            pintura.precio
                          )}
                        </p>

                        <button
                          className="remove-cart-item"
                          onClick={() =>
                            eliminarDelCarrito(
                              pintura.id
                            )
                          }
                        >
                          Eliminar
                        </button>

                      </div>

                    </div>

                  ))}

                </div>

                <div className="cart-footer">

                  <div className="cart-total">

                    <span>
                      Total
                    </span>

                    <strong>
                      {formatearPrecio(
                        totalCarrito
                      )}
                    </strong>

                  </div>

                  <button
                    className="checkout-button"
                    onClick={() => {
                      setCarritoAbierto(false);
                      setCompraAbierta(true);
                    }}
                  >
                    Continuar compra
                  </button>

                </div>

              </>

            )}

          </aside>

        </div>

      )}

      {/* =================================================
          CONTACTO
      ================================================= */}

      {contactoAbierto && (

        <div
          className="contact-modal-overlay"
          onClick={() =>
            setContactoAbierto(false)
          }
        >

          <div
            className="contact-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              className="contact-close"
              onClick={() =>
                setContactoAbierto(false)
              }
            >
              ×
            </button>

            <div className="contact-modal-header">

              <p>CONTACTO</p>

              <h2>
                Hablemos de arte
              </h2>

              <span>
                ¿Tienes alguna pregunta sobre
                nuestras obras? Estamos aquí
                para ayudarte.
              </span>

            </div>

            <FormularioContacto />

          </div>

        </div>

      )}

      {/* =================================================
          COMPRA
      ================================================= */}

      {compraAbierta && (
        <FormularioCompra />
      )}

    </div>
  );
}

export default App;