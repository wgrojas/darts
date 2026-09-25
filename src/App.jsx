import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

// =====================================================
// CONFIGURACIÓN DEL BACKEND
// =====================================================

const API_URL = "http://localhost:3000";

// =====================================================
// APLICACIÓN
// =====================================================

function App() {
  // ===================================================
  // ESTADOS
  // ===================================================

  const [pinturas, setPinturas] = useState([]);

  const [cargando, setCargando] = useState(true);

  const [error, setError] = useState("");

  const [pinturaSeleccionada, setPinturaSeleccionada] =
    useState(null);

  const [favoritos, setFavoritos] = useState([]);

  const [carrito, setCarrito] = useState([]);

  const [mostrarCarrito, setMostrarCarrito] =
    useState(false);

  // ===================================================
  // CARGAR PINTURAS DESDE MYSQL
  // ===================================================

  useEffect(() => {
    obtenerPinturas();
  }, []);

  const obtenerPinturas = async () => {
    try {
      setCargando(true);
      setError("");

      const respuesta = await axios.get(
        `${API_URL}/api/pinturas`
      );

      setPinturas(respuesta.data);
    } catch (error) {
      console.error(
        "Error obteniendo las pinturas:",
        error
      );

      setError(
        "No fue posible conectar con el servidor."
      );
    } finally {
      setCargando(false);
    }
  };

  // ===================================================
  // FORMATEAR PRECIO
  // ===================================================

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(Number(precio));
  };

  // ===================================================
  // OBTENER URL DE IMAGEN
  // ===================================================

  const obtenerImagen = (imagen) => {
    return `${API_URL}/uploads/pinturas/${imagen}`;
  };

  // ===================================================
  // FAVORITOS
  // ===================================================

  const alternarFavorito = (id) => {
    setFavoritos((actuales) => {
      if (actuales.includes(id)) {
        return actuales.filter(
          (favorito) => favorito !== id
        );
      }

      return [...actuales, id];
    });
  };

  // ===================================================
  // AGREGAR AL CARRITO
  // ===================================================

  const agregarAlCarrito = (pintura) => {
    if (pintura.estado !== "disponible") {
      alert("Esta pintura no está disponible.");
      return;
    }

    if (Number(pintura.stock) <= 0) {
      alert("Esta pintura está agotada.");
      return;
    }

    const existe = carrito.find(
      (item) => item.id === pintura.id
    );

    if (existe) {
      alert(
        "Esta pintura ya se encuentra en el carrito."
      );
      return;
    }

    const nuevaPintura = {
      id: pintura.id,
      titulo: pintura.titulo,
      descripcion: pintura.descripcion,
      precio: Number(pintura.precio),
      imagen: pintura.imagen,
      stock: Number(pintura.stock),
      estado: pintura.estado,
      cantidad: 1,
    };

    setCarrito((actual) => [
      ...actual,
      nuevaPintura,
    ]);

    alert("Pintura agregada al carrito.");
  };

  // ===================================================
  // ELIMINAR DEL CARRITO
  // ===================================================

  const eliminarDelCarrito = (id) => {
    setCarrito((actual) =>
      actual.filter((item) => item.id !== id)
    );
  };

  // ===================================================
  // TOTAL DEL CARRITO
  // ===================================================

  const calcularTotal = () => {
    return carrito.reduce(
      (total, item) =>
        total +
        Number(item.precio) *
          Number(item.cantidad),
      0
    );
  };

  // ===================================================
  // CANTIDAD DE PRODUCTOS
  // ===================================================

  const cantidadCarrito = carrito.reduce(
    (total, item) =>
      total + Number(item.cantidad),
    0
  );

  // ===================================================
  // COMPRAR AHORA
  // ===================================================

  const comprarAhora = (pintura) => {
    if (pintura.estado !== "disponible") {
      alert("Esta pintura no está disponible.");
      return;
    }

    if (Number(pintura.stock) <= 0) {
      alert("Esta pintura está agotada.");
      return;
    }

    const producto = {
      id: pintura.id,
      titulo: pintura.titulo,
      descripcion: pintura.descripcion,
      precio: Number(pintura.precio),
      imagen: pintura.imagen,
      stock: Number(pintura.stock),
      estado: pintura.estado,
      cantidad: 1,
    };

    setCarrito([producto]);

    setPinturaSeleccionada(null);

    setMostrarCarrito(true);
  };

  // ===================================================
  // IR A GALERÍA
  // ===================================================

  const irAGaleria = () => {
    const galeria =
      document.getElementById("galeria");

    if (galeria) {
      galeria.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="app">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="header">

        <div className="logo">
          <span>dRojas</span>
          <strong>Galery</strong>
        </div>

        <nav className="nav">

          <a href="#inicio">
            Inicio
          </a>

          <a href="#galeria">
            Galería
          </a>

          <a href="#nosotros">
            Nosotros
          </a>

          <button
            className="cart-button"
            onClick={() =>
              setMostrarCarrito(true)
            }
          >
            🛒 Carrito

            {cantidadCarrito > 0 && (
              <span className="cart-count">
                {cantidadCarrito}
              </span>
            )}
          </button>

        </nav>

      </header>

      {/* =================================================
          HERO
      ================================================= */}

      <section
        id="inicio"
        className="hero"
      >

        <img
          src={obtenerImagen("1.jpeg")}
          alt="Obra original de Duvan Rojas"
          className="hero-image"
        />

        <div className="hero-overlay"></div>

        <div className="hero-content">

          <p className="hero-subtitle">
            ARTE ORIGINAL
          </p>

          <h1>
            Obras originales
            <br />
            de Duvan Rojas
          </h1>

          <p>
            Descubre una colección de pinturas
            originales creadas para quienes
            buscan expresar su personalidad
            a través del arte.
          </p>

          <button
            className="hero-button"
            onClick={irAGaleria}
          >
            Explorar colección
          </button>

        </div>

      </section>

      {/* =================================================
          NOSOTROS
      ================================================= */}

      <section
        id="nosotros"
        className="intro"
      >

        <p className="section-label">
          D ROJAS GALERY
        </p>

        <h2>
          Arte que transforma espacios
        </h2>

        <p>
          Cada obra es una pieza original de
          Duvan Rojas, creada para quienes
          buscan expresar su personalidad
          a través del arte.
        </p>

      </section>

      {/* =================================================
          GALERÍA
      ================================================= */}

      <section
        id="galeria"
        className="gallery-section"
      >

        <div className="section-header">

          <div>

            <p className="section-label">
              COLECCIÓN
            </p>

            <h2>
              Obras disponibles
            </h2>

          </div>

          <p className="gallery-description">
            Explora nuestra colección de obras
            originales de Duvan Rojas.
          </p>

        </div>

        {/* =================================================
            CARGANDO
        ================================================= */}

        {cargando && (

          <div className="status-message">

            <div className="spinner"></div>

            <p>
              Cargando obras...
            </p>

          </div>

        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {!cargando && error && (

          <div className="error-message">

            <p>
              {error}
            </p>

            <button
              onClick={obtenerPinturas}
            >
              Intentar nuevamente
            </button>

          </div>

        )}

        {/* =================================================
            PINTURAS
        ================================================= */}

        {!cargando &&
          !error &&
          pinturas.length > 0 && (

            <div className="gallery-grid">

              {pinturas.map((pintura) => (

                <article
                  className="painting-card"
                  key={pintura.id}
                >

                  {/* IMAGEN */}

                  <div className="painting-image-container">

                    <img
                      src={obtenerImagen(
                        pintura.imagen
                      )}
                      alt={pintura.titulo}
                      className="painting-image"
                    />

                    {/* FAVORITO */}

                    <button
                      className={`favorite-button ${
                        favoritos.includes(
                          pintura.id
                        )
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        alternarFavorito(
                          pintura.id
                        )
                      }
                    >
                      {favoritos.includes(
                        pintura.id
                      )
                        ? "♥"
                        : "♡"}
                    </button>

                    {/* ORIGINAL */}

                    <span className="original-badge">
                      ORIGINAL
                    </span>

                  </div>

                  {/* INFORMACIÓN */}

                  <div className="painting-info">

                    <h3>
                      {pintura.titulo}
                    </h3>

                    <p className="artist">
                      Duvan Rojas
                    </p>

                    <p className="description">
                      {pintura.descripcion}
                    </p>

                    <div className="painting-bottom">

                      <strong className="price">
                        {formatearPrecio(
                          pintura.precio
                        )}
                      </strong>

                      <span
                        className={
                          pintura.estado ===
                            "disponible" &&
                          Number(
                            pintura.stock
                          ) > 0
                            ? "available"
                            : "sold"
                        }
                      >
                        {pintura.estado ===
                            "disponible" &&
                        Number(
                          pintura.stock
                        ) > 0
                          ? "Disponible"
                          : "No disponible"}
                      </span>

                    </div>

                    {/* BOTONES */}

                    <div className="card-buttons">

                      <button
                        className="view-button"
                        onClick={() =>
                          setPinturaSeleccionada(
                            pintura
                          )
                        }
                      >
                        Ver pintura
                      </button>

                      <button
                        className="add-button"
                        onClick={() =>
                          agregarAlCarrito(
                            pintura
                          )
                        }
                        disabled={
                          pintura.estado !==
                            "disponible" ||
                          Number(
                            pintura.stock
                          ) <= 0
                        }
                      >
                        Agregar
                      </button>

                    </div>

                  </div>

                </article>

              ))}

            </div>

          )}

        {/* =================================================
            SIN PINTURAS
        ================================================= */}

        {!cargando &&
          !error &&
          pinturas.length === 0 && (

            <div className="status-message">

              <p>
                No hay pinturas disponibles.
              </p>

            </div>

          )}

      </section>

      {/* =================================================
          MODAL DE PINTURA
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
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              className="modal-close"
              onClick={() =>
                setPinturaSeleccionada(null)
              }
            >
              ×
            </button>

            <div className="modal-image-container">

              <img
                src={obtenerImagen(
                  pinturaSeleccionada.imagen
                )}
                alt={
                  pinturaSeleccionada.titulo
                }
                className="modal-image"
              />

            </div>

            <div className="modal-info">

              <span className="modal-label">
                PINTURA ORIGINAL
              </span>

              <h2>
                {pinturaSeleccionada.titulo}
              </h2>

              <p className="modal-artist">
                Duvan Rojas
              </p>

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

              <p className="modal-stock">

                {pinturaSeleccionada.estado ===
                    "disponible" &&
                Number(
                  pinturaSeleccionada.stock
                ) > 0
                  ? "✓ Disponible"
                  : "✕ No disponible"}

              </p>

              <div className="modal-buttons">

                <button
                  className="add-button large"
                  onClick={() =>
                    agregarAlCarrito(
                      pinturaSeleccionada
                    )
                  }
                  disabled={
                    pinturaSeleccionada.estado !==
                      "disponible" ||
                    Number(
                      pinturaSeleccionada.stock
                    ) <= 0
                  }
                >
                  Agregar al carrito
                </button>

                <button
                  className="buy-button"
                  onClick={() =>
                    comprarAhora(
                      pinturaSeleccionada
                    )
                  }
                  disabled={
                    pinturaSeleccionada.estado !==
                      "disponible" ||
                    Number(
                      pinturaSeleccionada.stock
                    ) <= 0
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

      {mostrarCarrito && (

        <div
          className="cart-overlay"
          onClick={() =>
            setMostrarCarrito(false)
          }
        >

          <aside
            className="cart-panel"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="cart-header">

              <h2>
                Mi carrito
              </h2>

              <button
                className="cart-close"
                onClick={() =>
                  setMostrarCarrito(false)
                }
              >
                ×
              </button>

            </div>

            {/* CARRITO VACÍO */}

            {carrito.length === 0 ? (

              <div className="empty-cart">

                <div className="empty-cart-icon">
                  🛒
                </div>

                <h3>
                  Tu carrito está vacío
                </h3>

                <p>
                  Agrega una obra de nuestra
                  colección.
                </p>

                <button
                  className="hero-button"
                  onClick={() =>
                    setMostrarCarrito(false)
                  }
                >
                  Ver colección
                </button>

              </div>

            ) : (

              <>

                {/* PRODUCTOS */}

                <div className="cart-items">

                  {carrito.map((item) => (

                    <div
                      className="cart-item"
                      key={item.id}
                    >

                      <img
                        src={obtenerImagen(
                          item.imagen
                        )}
                        alt={item.titulo}
                      />

                      <div className="cart-item-info">

                        <h3>
                          {item.titulo}
                        </h3>

                        <p>
                          Duvan Rojas
                        </p>

                        <strong>
                          {formatearPrecio(
                            item.precio
                          )}
                        </strong>

                        <button
                          className="remove-button"
                          onClick={() =>
                            eliminarDelCarrito(
                              item.id
                            )
                          }
                        >
                          Eliminar
                        </button>

                      </div>

                    </div>

                  ))}

                </div>

                {/* TOTAL */}

                <div className="cart-footer">

                  <div className="cart-total">

                    <span>
                      Total
                    </span>

                    <strong>
                      {formatearPrecio(
                        calcularTotal()
                      )}
                    </strong>

                  </div>

                  <button
                    className="checkout-button"
                    onClick={() =>
                      alert(
                        "El proceso de compra se conectará con pedidos y Wompi."
                      )
                    }
                  >
                    Continuar con la compra
                  </button>

                </div>

              </>

            )}

          </aside>

        </div>

      )}

      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="footer">

        <div className="footer-content">

          <div>

            <div className="logo footer-logo">

              <span>
                dRojas
              </span>

              <strong>
                Galery
              </strong>

            </div>

            <p>
              Obras originales de Duvan Rojas.
            </p>

          </div>

          <div className="footer-links">

            <a href="#inicio">
              Inicio
            </a>

            <a href="#galeria">
              Galería
            </a>

            <a href="#nosotros">
              Nosotros
            </a>

          </div>

        </div>

        <div className="footer-bottom">

          <p>
            © {new Date().getFullYear()}
            {" "}
            dRojasGalery. Todos los derechos
            reservados.
          </p>

        </div>

      </footer>

    </div>
  );
}

export default App;