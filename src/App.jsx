import { useState } from "react";
import "./App.css";

const pinturas = [
  { id: 1, titulo: "Pintura 1", precio: 350000, imagen: "1.jpeg" },
  { id: 2, titulo: "Pintura 2", precio: 420000, imagen: "2.jpeg" },
  { id: 3, titulo: "Pintura 3", precio: 450000, imagen: "3.jpeg" },
  { id: 4, titulo: "Pintura 4", precio: 500000, imagen: "4.jpeg" },
  { id: 5, titulo: "Pintura 5", precio: 380000, imagen: "5.jpeg" },
  { id: 6, titulo: "Pintura 6", precio: 550000, imagen: "6.jpeg" },
  { id: 7, titulo: "Pintura 7", precio: 470000, imagen: "7.jpeg" },
  { id: 8, titulo: "Pintura 8", precio: 600000, imagen: "8.jpeg" },
  { id: 9, titulo: "Pintura 9", precio: 390000, imagen: "9.jpeg" },
  { id: 10, titulo: "Pintura 10", precio: 480000, imagen: "10.jpeg" },
  { id: 11, titulo: "Pintura 11", precio: 520000, imagen: "11.jpeg" },
  { id: 12, titulo: "Pintura 12", precio: 430000, imagen: "12.jpeg" },
  { id: 13, titulo: "Pintura 13", precio: 580000, imagen: "13.jpeg" },
  { id: 14, titulo: "Pintura 14", precio: 650000, imagen: "14.jpeg" },
];

function formatearPrecio(precio) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(precio);
}

function App() {
  const [pinturaSeleccionada, setPinturaSeleccionada] = useState(null);
  const [carrito, setCarrito] = useState([]);

  const agregarAlCarrito = (pintura) => {
    const existe = carrito.some((item) => item.id === pintura.id);

    if (existe) {
      alert("Esta pintura ya está en el carrito.");
      return;
    }

    setCarrito([...carrito, pintura]);

    alert(`${pintura.titulo} fue agregada al carrito.`);
  };

  const comprarAhora = (pintura) => {
    setCarrito([pintura]);

    alert(
      `Has seleccionado ${pintura.titulo} por ${formatearPrecio(
        pintura.precio
      )}`
    );
  };

  return (
    <div className="app">

      {/* ================= HEADER ================= */}

      <header className="header">

        <div className="logo">
          <h1>dartsGallery</h1>
          <span>Galería de Arte</span>
        </div>

        <nav>
          <a href="#inicio">Inicio</a>
          <a href="#galeria">Galería</a>
          <a href="#nosotros">Nosotros</a>
          <a href="#contacto">Contacto</a>
        </nav>

        <button className="cart">
          🛒 Carrito ({carrito.length})
        </button>

      </header>

      {/* ================= HERO ================= */}

      <section id="inicio" className="hero">

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
            Descubre nuestra colección de pinturas originales
            creadas para quienes valoran el arte.
          </p>

          <a href="#galeria" className="hero-button">
            Explorar galería
          </a>

        </div>

      </section>

      {/* ================= GALERÍA ================= */}

      <section id="galeria" className="gallery-section">

        <div className="section-title">

          <p>COLECCIÓN</p>

          <h2>Nuestras pinturas</h2>

          <span>
            Descubre piezas únicas para darle personalidad a tus espacios.
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
                  src={`/images/${pintura.imagen}`}
                  alt={pintura.titulo}
                />

                <button className="favorite">
                  ♡
                </button>

              </div>

              <div className="painting-info">

                <h3>{pintura.titulo}</h3>

                <p className="price">
                  {formatearPrecio(pintura.precio)}
                </p>

                <button
                  className="details-button"
                  onClick={() =>
                    setPinturaSeleccionada(pintura)
                  }
                >
                  Ver pintura
                </button>

              </div>

            </article>

          ))}

        </div>

      </section>

      {/* ================= NOSOTROS ================= */}

      <section id="nosotros" className="about">

        <p>SOBRE NOSOTROS</p>

        <h2>
          Arte creado para ser parte de tu historia
        </h2>

        <p>
          En dRojasGalery buscamos conectar a las personas
          con pinturas únicas, creadas con pasión y dedicación.
        </p>

      </section>

      {/* ================= FOOTER ================= */}

      <footer id="contacto">

        <h2>dartsGallery</h2>

        <p>
          Galería de pinturas originales
        </p>

        <p>
          © 2026 dartsGallery
        </p>

      </footer>

      {/* ================= MODAL ================= */}

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

            {/* IMAGEN */}

            <div className="modal-image-container">

              <img
                src={`/images/${pinturaSeleccionada.imagen}`}
                alt={pinturaSeleccionada.titulo}
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
                Obra original disponible para compra.
                Cada pintura es una pieza única creada
                para darle personalidad y estilo a tus espacios.
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

    </div>
  );
}

export default App;