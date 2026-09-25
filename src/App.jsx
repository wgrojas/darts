import { useEffect, useState } from "react";
import "./App.css";
import api from "./services/api";
import Form from "./components/form";
import CompraForm from "./components/CompraForm";

const SERVIDOR_URL = "http://localhost:3000";

function formatearPrecio(precio) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(precio);
}

function App() {
  // =========================
  // ESTADOS
  // =========================

  const [pinturas, setPinturas] = useState([]);

  const [pinturaSeleccionada, setPinturaSeleccionada] =
    useState(null);

  const [carrito, setCarrito] = useState([]);

  const [carritoAbierto, setCarritoAbierto] =
    useState(false);

  const [contactoAbierto, setContactoAbierto] =
    useState(false);

  const [compraAbierta, setCompraAbierta] =
    useState(false);

  const [cargando, setCargando] =
    useState(true);

  const [error, setError] =
    useState("");

  // =========================
  // OBTENER PINTURAS
  // =========================

  useEffect(() => {
    const obtenerPinturas = async () => {
      try {
        setCargando(true);
        setError("");

        const respuesta =
          await api.get("/pinturas");

        setPinturas(respuesta.data);

      } catch (err) {
        console.error(
          "Error obteniendo pinturas:",
          err
        );

        setError(
          "No fue posible cargar las pinturas. Verifica que el servidor backend esté funcionando."
        );

      } finally {
        setCargando(false);
      }
    };

    obtenerPinturas();
  }, []);

  // =========================
  // IMAGEN
  // =========================

  const obtenerImagen = (imagen) => {
    if (!imagen) {
      return "";
    }

    if (imagen.startsWith("http")) {
      return imagen;
    }

    return `${SERVIDOR_URL}/uploads/pinturas/${imagen}`;
  };

  // =========================
  // AGREGAR AL CARRITO
  // =========================

  const agregarAlCarrito = (pintura) => {
    const existe = carrito.some(
      (item) => item.id === pintura.id
    );

    if (existe) {
      alert(
        "Esta pintura ya está en el carrito."
      );
      return;
    }

    setCarrito([
      ...carrito,
      pintura,
    ]);

    setPinturaSeleccionada(null);

    setCarritoAbierto(true);
  };

  // =========================
  // COMPRAR AHORA
  // =========================

  const comprarAhora = (pintura) => {
    setCarrito([pintura]);

    setPinturaSeleccionada(null);

    setCarritoAbierto(true);
  };

  // =========================
  // ELIMINAR DEL CARRITO
  // =========================

  const eliminarDelCarrito = (id) => {
    setCarrito(
      carrito.filter(
        (item) => item.id !== id
      )
    );
  };

  // =========================
  // TOTAL CARRITO
  // =========================

  const totalCarrito =
    carrito.reduce(
      (total, pintura) =>
        total + Number(pintura.precio),
      0
    );

  // =========================
  // ABRIR FORMULARIO COMPRA
  // =========================

  const abrirFormularioCompra = () => {
    if (carrito.length === 0) {
      alert(
        "Tu carrito está vacío."
      );
      return;
    }

    setCarritoAbierto(false);

    setCompraAbierta(true);
  };

  // =========================
  // CERRAR FORMULARIO COMPRA
  // =========================

  const cerrarFormularioCompra = () => {
    setCompraAbierta(false);
  };

  // =========================
  // RENDER
  // =========================

  return (
    <div className="app">

      {/* ==================================================
          HEADER
      ================================================== */}

      <header className="header">

        <div className="logo">

          <h1>
            dartsGallery
          </h1>

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
          🛒 Carrito (
          {carrito.length}
          )
        </button>

      </header>

      {/* ==================================================
          HERO
      ================================================== */}

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
            Descubre nuestra colección
            de pinturas originales
            creadas para quienes
            valoran el arte.
          </p>

          <a
            href="#galeria"
            className="hero-button"
          >
            Explorar galería
          </a>

        </div>

      </section>

      {/* ==================================================
          GALERÍA
      ================================================== */}

      <section
        id="galeria"
        className="gallery-section"
      >

        <div className="section-title">

          <p>
            COLECCIÓN
          </p>

          <h2>
            Nuestras pinturas
          </h2>

          <span>
            Descubre piezas únicas para
            darle personalidad a tus
            espacios.
          </span>

        </div>

        {/* CARGANDO */}

        {cargando && (

          <div className="mensaje-carga">

            Cargando pinturas...

          </div>

        )}

        {/* ERROR */}

        {!cargando && error && (

          <div className="mensaje-error">

            {error}

          </div>

        )}

        {/* PINTURAS */}

        {!cargando &&
          !error &&
          pinturas.length > 0 && (

            <div className="gallery-grid">

              {pinturas.map(
                (pintura) => (

                  <article
                    className="painting-card"
                    key={pintura.id}
                  >

                    <div className="image-container">

                      <img
                        src={obtenerImagen(
                          pintura.imagen
                        )}
                        alt={
                          pintura.titulo
                        }
                      />

                      <button
                        className="favorite"
                        type="button"
                        aria-label="Agregar a favoritos"
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

                )
              )}

            </div>

          )}

        {/* SIN PINTURAS */}

        {!cargando &&
          !error &&
          pinturas.length === 0 && (

            <div className="mensaje-carga">

              No hay pinturas
              disponibles.

            </div>

          )}

      </section>

      {/* ==================================================
          NOSOTROS
      ================================================== */}

      <section
        id="nosotros"
        className="about"
      >

        <p>
          SOBRE NOSOTROS
        </p>

        <h2>
          Arte creado para ser
          parte de tu historia
        </h2>

        <p>
          En dRojasGalery buscamos
          conectar a las personas
          con pinturas únicas,
          creadas con pasión
          y dedicación.
        </p>

      </section>

      {/* ==================================================
          FOOTER
      ================================================== */}

      <footer
        id="contacto"
      >

        <h2>
          dartsGallery
        </h2>

        <p>
          Galería de pinturas
          originales
        </p>

        <p>
          © 2026 dartsGallery
        </p>

      </footer>

      {/* ==================================================
          MODAL DETALLE DE PINTURA
      ================================================== */}

      {pinturaSeleccionada && (

        <div
          className="modal-overlay"
          onClick={() =>
            setPinturaSeleccionada(
              null
            )
          }
        >

          <div
            className="painting-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* CERRAR */}

            <button
              className="close-modal"
              onClick={() =>
                setPinturaSeleccionada(
                  null
                )
              }
              aria-label="Cerrar"
            >
              ×
            </button>

            {/* IMAGEN */}

            <div className="modal-image-container">

              <img
                src={obtenerImagen(
                  pinturaSeleccionada.imagen
                )}
                alt={
                  pinturaSeleccionada.titulo
                }
              />

            </div>

            {/* INFORMACIÓN */}

            <div className="modal-info">

              <p className="modal-category">
                PINTURA ORIGINAL
              </p>

              <h2>
                {pinturaSeleccionada.titulo}
              </h2>

              <p className="modal-description">

                {pinturaSeleccionada.descripcion ||
                  "Obra original disponible para compra. Cada pintura es una pieza única creada para darle personalidad y estilo a tus espacios."}

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

      {/* ==================================================
          CARRITO
      ================================================== */}

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

            {/* CABECERA */}

            <div className="cart-header">

              <h2>
                Mi carrito
              </h2>

              <button
                className="close-cart"
                onClick={() =>
                  setCarritoAbierto(false)
                }
                aria-label="Cerrar carrito"
              >
                ×
              </button>

            </div>

            {/* CARRITO VACÍO */}

            {carrito.length === 0 ? (

              <div className="cart-empty">

                <div className="cart-icon">
                  🛒
                </div>

                <h3>
                  Tu carrito está vacío
                </h3>

                <p>
                  Agrega una obra de
                  nuestra colección.
                </p>

              </div>

            ) : (

              <>

                {/* PRODUCTOS */}

                <div className="cart-items">

                  {carrito.map(
                    (pintura) => (

                      <div
                        className="cart-item"
                        key={pintura.id}
                      >

                        <img
                          src={obtenerImagen(
                            pintura.imagen
                          )}
                          alt={
                            pintura.titulo
                          }
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

                    )
                  )}

                </div>

                {/* TOTAL */}

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
                    onClick={
                      abrirFormularioCompra
                    }
                  >
                    Continuar compra
                  </button>

                </div>

              </>

            )}

          </aside>

        </div>

      )}

      {/* ==================================================
          MODAL CONTACTO
      ================================================== */}

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

            {/* CERRAR */}

            <button
              className="contact-close"
              onClick={() =>
                setContactoAbierto(false)
              }
              aria-label="Cerrar formulario de contacto"
            >
              ×
            </button>

            {/* ENCABEZADO */}

            <div className="contact-modal-header">

              <p>
                CONTACTO
              </p>

              <h2>
                Hablemos de arte
              </h2>

              <span>
                ¿Tienes alguna pregunta
                sobre nuestras obras?
                Estamos aquí para
                ayudarte.
              </span>

            </div>

            {/* FORMULARIO */}

            <Form />

          </div>

        </div>

      )}

      {/* ==================================================
          MODAL COMPRA
      ================================================== */}

      {compraAbierta &&
        carrito.length > 0 && (

          <CompraForm
            pintura={carrito[0]}
            onCerrar={
              cerrarFormularioCompra
            }
          />

        )}

    </div>
  );
}

export default App;