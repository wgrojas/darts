import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import emailjs from "@emailjs/browser";
import "./App.css";

// ======================================================
// CONFIGURACIÓN
// ======================================================

// Telegram
const TELEGRAM_BOT_TOKEN =
  import.meta.env.VITE_TELEGRAM_BOT_TOKEN;

const TELEGRAM_CHAT_ID =
  import.meta.env.VITE_TELEGRAM_CHAT_ID;

// Wompi
const WOMPI_PUBLIC_KEY =
  import.meta.env.VITE_WOMPI_PUBLIC_KEY;

const WOMPI_INTEGRITY_SECRET =
  import.meta.env.VITE_WOMPI_INTEGRITY_SECRET;

// EmailJS
const EMAILJS_SERVICE_ID =
  import.meta.env.VITE_EMAILJS_SERVICE_ID;

const EMAILJS_TEMPLATE_ID =
  import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

const EMAILJS_PUBLIC_KEY =
  import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const EMAIL_ADMIN =
  import.meta.env.VITE_EMAIL_ADMIN;

// ======================================================
// PINTURAS
// ======================================================

const pinturasIniciales = [
  {
    id: 1,
    titulo: "Pintura 1",
    descripcion:
      "Obra original de la colección dartsGallery.",
    precio: 350000,
    imagen: "/images/1.jpeg",
    stock: 1,
  },
  {
    id: 2,
    titulo: "Pintura 2",
    descripcion:
      "Obra original de la colección dartsGallery.",
    precio: 400000,
    imagen: "/images/2.jpeg",
    stock: 1,
  },
  {
    id: 3,
    titulo: "Pintura 3",
    descripcion:
      "Obra original de la colección dartsGallery.",
    precio: 450000,
    imagen: "/images/3.jpeg",
    stock: 1,
  },
  {
    id: 4,
    titulo: "Pintura 4",
    descripcion:
      "Obra original de la colección dartsGallery.",
    precio: 350000,
    imagen: "/images/4.jpeg",
    stock: 1,
  },
  {
    id: 5,
    titulo: "Pintura 5",
    descripcion:
      "Obra original de la colección dartsGallery.",
    precio: 600000,
    imagen: "/images/5.jpeg",
    stock: 1,
  },
  {
    id: 6,
    titulo: "Pintura 6",
    descripcion:
      "Obra original de la colección dartsGallery.",
    precio: 450000,
    imagen: "/images/6.jpeg",
    stock: 1,
  },
  {
    id: 7,
    titulo: "Pintura 7",
    descripcion:
      "Obra original de la colección dartsGallery.",
    precio: 400000,
    imagen: "/images/7.jpeg",
    stock: 1,
  },
  {
    id: 8,
    titulo: "Pintura 8",
    descripcion:
      "Obra original de la colección dartsGallery.",
    precio: 500000,
    imagen: "/images/8.jpeg",
    stock: 1,
  },
  {
    id: 9,
    titulo: "Pintura 9",
    descripcion:
      "Obra original de la colección dartsGallery.",
    precio: 650000,
    imagen: "/images/9.jpeg",
    stock: 1,
  },
  {
    id: 10,
    titulo: "Pintura 10",
    descripcion:
      "Obra original de la colección dartsGallery.",
    precio: 350000,
    imagen: "/images/10.jpeg",
    stock: 1,
  },
  {
    id: 11,
    titulo: "Pintura 11",
    descripcion:
      "Obra original de la colección dartsGallery.",
    precio: 500000,
    imagen: "/images/11.jpeg",
    stock: 1,
  },
  {
    id: 12,
    titulo: "Pintura 12",
    descripcion:
      "Obra original de la colección dartsGallery.",
    precio: 400000,
    imagen: "/images/12.jpeg",
    stock: 1,
  },
  {
    id: 13,
    titulo: "Pintura 13",
    descripcion:
      "Obra original de la colección dartsGallery.",
    precio: 450000,
    imagen: "/images/13.jpeg",
    stock: 1,
  },
  {
    id: 14,
    titulo: "Pintura 14",
    descripcion:
      "Obra original de la colección dartsGallery.",
    precio: 600000,
    imagen: "/images/14.jpeg",
    stock: 1,
  },
];

// ======================================================
// UTILIDADES
// ======================================================

const formatearPrecio = (precio) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(precio);
};

const generarReferencia = () => {
  return `DARTS-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase()}`;
};

// ======================================================
// TELEGRAM
// ======================================================

const enviarTelegram = async (mensaje) => {
  try {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.warn(
        "Telegram no está configurado."
      );
      return false;
    }

    const url =
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

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

    const resultado =
      await respuesta.json();

    return resultado.ok === true;
  } catch (error) {
    console.error(
      "Error Telegram:",
      error
    );

    return false;
  }
};

// ======================================================
// EMAILJS
// ======================================================

const enviarCorreo = async (datosCorreo) => {
  if (
    !EMAILJS_SERVICE_ID ||
    !EMAILJS_TEMPLATE_ID ||
    !EMAILJS_PUBLIC_KEY
  ) {
    console.warn(
      "EmailJS no está configurado."
    );

    return false;
  }

  try {
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        to_email:
          EMAIL_ADMIN ||
          datosCorreo.customer_email ||
          "",

        customer_name:
          datosCorreo.customer_name ||
          "",

        customer_email:
          datosCorreo.customer_email ||
          "",

        customer_phone:
          datosCorreo.customer_phone ||
          "",

        customer_address:
          datosCorreo.customer_address ||
          "",

        customer_city:
          datosCorreo.customer_city ||
          "",

        customer_region:
          datosCorreo.customer_region ||
          "",

        painting:
          datosCorreo.painting ||
          "",

        amount:
          datosCorreo.amount ||
          "",

        reference:
          datosCorreo.reference ||
          "",

        transaction_id:
          datosCorreo.transaction_id ||
          "",

        payment_status:
          datosCorreo.payment_status ||
          "",

        payment_method:
          datosCorreo.payment_method ||
          "",

        observations:
          datosCorreo.observations ||
          "",

        subject:
          datosCorreo.subject ||
          "",

        message:
          datosCorreo.message ||
          "",
      },
      EMAILJS_PUBLIC_KEY
    );

    return true;
  } catch (error) {
    console.error(
      "Error EmailJS:",
      error
    );

    return false;
  }
};

// ======================================================
// FIRMA WOMPI
// ======================================================

const generarFirmaIntegridad = async (
  referencia,
  montoEnCentavos
) => {
  if (!WOMPI_INTEGRITY_SECRET) {
    throw new Error(
      "No está configurado VITE_WOMPI_INTEGRITY_SECRET."
    );
  }

  const cadena =
    `${referencia}${montoEnCentavos}COP${WOMPI_INTEGRITY_SECRET}`;

  const encodedText =
    new TextEncoder().encode(
      cadena
    );

  const hashBuffer =
    await crypto.subtle.digest(
      "SHA-256",
      encodedText
    );

  const hashArray =
    Array.from(
      new Uint8Array(hashBuffer)
    );

  return hashArray
    .map((byte) =>
      byte
        .toString(16)
        .padStart(2, "0")
    )
    .join("");
};

// ======================================================
// COMPONENTE PRINCIPAL
// ======================================================

function App() {
  const [pinturas] =
    useState(pinturasIniciales);

  const [
    pinturaSeleccionada,
    setPinturaSeleccionada,
  ] = useState(null);

  const [
    carrito,
    setCarrito,
  ] = useState([]);

  const [
    favoritos,
    setFavoritos,
  ] = useState(() => {
    try {
      const guardados =
        localStorage.getItem(
          "dartsGalleryFavoritos"
        );

      return guardados
        ? JSON.parse(guardados)
        : [];
    } catch {
      return [];
    }
  });

  const [
    carritoAbierto,
    setCarritoAbierto,
  ] = useState(false);

  const [
    contactoAbierto,
    setContactoAbierto,
  ] = useState(false);

  const [
    compraAbierta,
    setCompraAbierta,
  ] = useState(false);

  const [
    favoritosAbiertos,
    setFavoritosAbiertos,
  ] = useState(false);

  // ====================================================
  // GUARDAR FAVORITOS
  // ====================================================

  useEffect(() => {
    localStorage.setItem(
      "dartsGalleryFavoritos",
      JSON.stringify(favoritos)
    );
  }, [favoritos]);

  // ====================================================
  // FAVORITOS
  // ====================================================

  const alternarFavorito = (
    pintura
  ) => {
    setFavoritos((actuales) => {
      const existe =
        actuales.includes(
          pintura.id
        );

      if (existe) {
        return actuales.filter(
          (id) =>
            id !== pintura.id
        );
      }

      return [
        ...actuales,
        pintura.id,
      ];
    });
  };

  const esFavorito = (id) =>
    favoritos.includes(id);

  // ====================================================
  // CARRITO
  // ====================================================

  const agregarAlCarrito = (
    pintura
  ) => {
    const existe =
      carrito.some(
        (item) =>
          item.id ===
          pintura.id
      );

    if (existe) {
      Swal.fire({
        icon: "info",
        title:
          "Ya está en el carrito",
        text:
          "Esta pintura ya está en el carrito.",
        confirmButtonColor:
          "#9b6b43",
      });

      return;
    }

    setCarrito([
      ...carrito,
      pintura,
    ]);

    setPinturaSeleccionada(
      null
    );

    setCarritoAbierto(true);
  };

  const comprarAhora = (
    pintura
  ) => {
    setCarrito([
      pintura,
    ]);

    setPinturaSeleccionada(
      null
    );

    setCompraAbierta(true);
  };

  const eliminarDelCarrito = (
    id
  ) => {
    setCarrito(
      carrito.filter(
        (item) =>
          item.id !== id
      )
    );
  };

  const totalCarrito =
    carrito.reduce(
      (total, pintura) =>
        total +
        Number(
          pintura.precio
        ),
      0
    );

  // ====================================================
  // FORMULARIO CONTACTO
  // ====================================================

  const FormularioContacto =
    () => {
      const [datos, setDatos] =
        useState({
          nombre: "",
          email: "",
          telefono: "",
          asunto: "",
          mensaje: "",
        });

      const [
        enviando,
        setEnviando,
      ] = useState(false);

      const manejarCambio = (
        e
      ) => {
        setDatos({
          ...datos,
          [e.target.name]:
            e.target.value,
        });
      };

      const enviarFormulario =
        async (e) => {
          e.preventDefault();

          setEnviando(true);

          const mensaje = `
📩 NUEVO MENSAJE - dartsGallery

👤 CLIENTE

Nombre:
${datos.nombre}

Correo:
${datos.email}

Teléfono:
${datos.telefono || "No indicado"}

📌 ASUNTO

${datos.asunto || "Sin asunto"}

💬 MENSAJE

${datos.mensaje}
`;

          const enviado =
            await enviarTelegram(
              mensaje
            );

          if (enviado) {
            await enviarCorreo({
              customer_name:
                datos.nombre,

              customer_email:
                datos.email,

              customer_phone:
                datos.telefono,

              subject:
                datos.asunto ||
                "Sin asunto",

              message:
                datos.mensaje,

              payment_status:
                "MENSAJE DE CONTACTO",
            });

            await Swal.fire({
              icon: "success",
              title:
                "Mensaje enviado",
              text:
                "Hemos recibido tu mensaje correctamente.",
              confirmButtonColor:
                "#9b6b43",
            });

            setDatos({
              nombre: "",
              email: "",
              telefono: "",
              asunto: "",
              mensaje: "",
            });

            setContactoAbierto(
              false
            );
          } else {
            await Swal.fire({
              icon: "error",
              title:
                "No se pudo enviar",
              text:
                "No fue posible enviar el mensaje.",
              confirmButtonColor:
                "#9b6b43",
            });
          }

          setEnviando(false);
        };

      return (
        <form
          className="contact-form"
          onSubmit={
            enviarFormulario
          }
        >
          <div className="form-row">
            <div className="form-group">
              <label>
                Nombre
              </label>

              <input
                type="text"
                name="nombre"
                value={
                  datos.nombre
                }
                onChange={
                  manejarCambio
                }
                placeholder="Tu nombre"
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
                value={
                  datos.email
                }
                onChange={
                  manejarCambio
                }
                placeholder="tu@email.com"
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
              value={
                datos.telefono
              }
              onChange={
                manejarCambio
              }
              placeholder="300 000 0000"
            />
          </div>

          <div className="form-group">
            <label>
              Asunto
            </label>

            <input
              type="text"
              name="asunto"
              value={
                datos.asunto
              }
              onChange={
                manejarCambio
              }
              placeholder="¿En qué podemos ayudarte?"
            />
          </div>

          <div className="form-group">
            <label>
              Mensaje
            </label>

            <textarea
              name="mensaje"
              rows="5"
              value={
                datos.mensaje
              }
              onChange={
                manejarCambio
              }
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
  // FORMULARIO COMPRA
  // ====================================================

  const FormularioCompra =
    () => {
      const [datos, setDatos] =
        useState({
          nombre: "",
          email: "",
          telefono: "",
          direccion: "",
          ciudad: "",
          departamento:
            "Santander",
          observaciones: "",
        });

      const [
        procesandoPago,
        setProcesandoPago,
      ] = useState(false);

      const pintura =
        carrito[0];

      if (!pintura) {
        return null;
      }

      const manejarCambio = (
        e
      ) => {
        setDatos({
          ...datos,
          [e.target.name]:
            e.target.value,
        });
      };

      // ================================================
      // PROCESAR PAGO
      // ================================================

      const procesarPago =
        async () => {
          try {
            if (!WOMPI_PUBLIC_KEY) {
              throw new Error(
                "No está configurada VITE_WOMPI_PUBLIC_KEY."
              );
            }

            if (
              !WOMPI_INTEGRITY_SECRET
            ) {
              throw new Error(
                "No está configurado VITE_WOMPI_INTEGRITY_SECRET."
              );
            }

            if (
              !datos.nombre ||
              !datos.email ||
              !datos.telefono ||
              !datos.direccion ||
              !datos.ciudad ||
              !datos.departamento
            ) {
              throw new Error(
                "Completa todos los datos obligatorios."
              );
            }

            setProcesandoPago(
              true
            );

            const referencia =
              generarReferencia();

            const montoEnCentavos =
              Math.round(
                Number(
                  totalCarrito
                ) * 100
              );

            const firma =
              await generarFirmaIntegridad(
                referencia,
                montoEnCentavos
              );

            // ------------------------------------------
            // ABRIR PESTAÑA WOMPI
            // ------------------------------------------

            const nombreVentana =
              `wompi_${Date.now()}`;

            const ventanaWompi =
              window.open(
                "about:blank",
                nombreVentana
              );

            if (!ventanaWompi) {
              throw new Error(
                "El navegador bloqueó la ventana de Wompi."
              );
            }

            ventanaWompi.document.title =
              "Redirigiendo a Wompi...";

            ventanaWompi.document.body.innerHTML = `
              <div style="
                font-family:Arial,sans-serif;
                text-align:center;
                padding:80px 20px;
              ">
                <div style="
                  width:45px;
                  height:45px;
                  margin:0 auto 20px;
                  border:4px solid #ddd;
                  border-top:4px solid #9b6b43;
                  border-radius:50%;
                  animation:spin 1s linear infinite;
                "></div>

                <h2>
                  Redirigiendo a Wompi...
                </h2>

                <p>
                  Estamos preparando tu pago.
                </p>

                <style>
                  @keyframes spin {
                    to {
                      transform:rotate(360deg);
                    }
                  }
                </style>
              </div>
            `;

            // ------------------------------------------
            // FORMULARIO WOMPI
            // ------------------------------------------

            const form =
              document.createElement(
                "form"
              );

            form.method =
              "GET";

            form.action =
              "https://checkout.wompi.co/p/";

            form.target =
              nombreVentana;

            form.style.display =
              "none";

            // ------------------------------------------
            // DATOS WOMPI
            // ------------------------------------------

            const campos = {
              "public-key":
                WOMPI_PUBLIC_KEY,

              currency:
                "COP",

              "amount-in-cents":
                String(
                  montoEnCentavos
                ),

              reference:
                referencia,

              "signature:integrity":
                firma,

              // CLIENTE
              "customer-data:email":
                datos.email,

              "customer-data:full-name":
                datos.nombre,

              "customer-data:phone-number":
                datos.telefono,

              // DIRECCIÓN
              "shipping-address:address-line-1":
                datos.direccion,

              "shipping-address:country":
                "CO",

              "shipping-address:phone-number":
                datos.telefono,

              "shipping-address:city":
                datos.ciudad,

              // IMPORTANTE
              // Esta era la que faltaba.
              "shipping-address:region":
                datos.departamento,
            };

            Object.entries(
              campos
            ).forEach(
              ([nombre, valor]) => {
                const input =
                  document.createElement(
                    "input"
                  );

                input.type =
                  "hidden";

                input.name =
                  nombre;

                input.value =
                  valor ?? "";

                form.appendChild(
                  input
                );
              }
            );

            document.body.appendChild(
              form
            );

            setCompraAbierta(
              false
            );

            form.submit();

            setProcesandoPago(
              false
            );

          } catch (error) {
            console.error(
              "Error Wompi:",
              error
            );

            await enviarTelegram(`
🚨 ERROR EN PAGO WOMPI

🎨 dartsGallery

Cliente:
${datos.nombre}

Correo:
${datos.email}

Teléfono:
${datos.telefono}

Obra:
${pintura.titulo}

Valor:
${formatearPrecio(
  totalCarrito
)}

Error:
${error.message}
`);

            await enviarCorreo({
              customer_name:
                datos.nombre,

              customer_email:
                datos.email,

              customer_phone:
                datos.telefono,

              customer_address:
                datos.direccion,

              customer_city:
                datos.ciudad,

              customer_region:
                datos.departamento,

              painting:
                pintura.titulo,

              amount:
                formatearPrecio(
                  totalCarrito
                ),

              payment_status:
                "ERROR",

              observations:
                error.message,

              subject:
                "dartsGallery - Error Wompi",
            });

            await Swal.fire({
              icon: "error",
              title:
                "No fue posible iniciar el pago",
              text:
                error.message,
              confirmButtonColor:
                "#9b6b43",
            });

            setProcesandoPago(
              false
            );
          }
        };

      const enviarPedido =
        async (e) => {
          e.preventDefault();

          if (
            !datos.nombre ||
            !datos.email ||
            !datos.telefono ||
            !datos.direccion ||
            !datos.ciudad ||
            !datos.departamento
          ) {
            await Swal.fire({
              icon: "warning",
              title:
                "Datos incompletos",
              text:
                "Completa todos los campos obligatorios.",
              confirmButtonColor:
                "#9b6b43",
            });

            return;
          }

          await procesarPago();
        };

      return (
        <div
          className="purchase-modal-overlay"
          onClick={() => {
            if (
              !procesandoPago
            ) {
              setCompraAbierta(
                false
              );
            }
          }}
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
                !procesandoPago &&
                setCompraAbierta(
                  false
                )
              }
              disabled={
                procesandoPago
              }
            >
              ×
            </button>

            <div className="purchase-header">
              <p>
                FINALIZAR COMPRA
              </p>

              <h2>
                Datos de entrega
              </h2>

              <span>
                Completa tus datos para
                continuar con el pago.
              </span>
            </div>

            <div className="purchase-summary">
              <img
                src={
                  pintura.imagen
                }
                alt={
                  pintura.titulo
                }
              />

              <div>
                <h3>
                  {
                    pintura.titulo
                  }
                </h3>

                <strong>
                  {formatearPrecio(
                    pintura.precio
                  )}
                </strong>
              </div>
            </div>

            <form
              className="purchase-form"
              onSubmit={
                enviarPedido
              }
            >
              <div className="form-row">
                <div className="form-group">
                  <label>
                    Nombre completo
                  </label>

                  <input
                    type="text"
                    name="nombre"
                    value={
                      datos.nombre
                    }
                    onChange={
                      manejarCambio
                    }
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
                    value={
                      datos.email
                    }
                    onChange={
                      manejarCambio
                    }
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
                    value={
                      datos.telefono
                    }
                    onChange={
                      manejarCambio
                    }
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
                    value={
                      datos.ciudad
                    }
                    onChange={
                      manejarCambio
                    }
                    placeholder="Bucaramanga"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>
                  Departamento / región
                </label>

                <input
                  type="text"
                  name="departamento"
                  value={
                    datos.departamento
                  }
                  onChange={
                    manejarCambio
                  }
                  placeholder="Santander"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Dirección de entrega
                </label>

                <input
                  type="text"
                  name="direccion"
                  value={
                    datos.direccion
                  }
                  onChange={
                    manejarCambio
                  }
                  placeholder="Dirección de entrega"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Observaciones
                </label>

                <textarea
                  name="observaciones"
                  value={
                    datos.observaciones
                  }
                  onChange={
                    manejarCambio
                  }
                  placeholder="Información adicional..."
                  rows="4"
                />
              </div>

              <button
                type="submit"
                className="purchase-button"
                disabled={
                  procesandoPago
                }
              >
                {procesandoPago
                  ? "Abriendo Wompi..."
                  : "💳 PAGAR CON WOMPI"}
              </button>
            </form>
          </div>
        </div>
      );
    };

  // ====================================================
  // PINTURAS FAVORITAS
  // ====================================================

  const pinturasFavoritas =
    pinturas.filter(
      (pintura) =>
        favoritos.includes(
          pintura.id
        )
    );

  // ====================================================
  // INTERFAZ
  // ====================================================

  return (
    <div className="app">

      {/* ================================================
          HEADER
      ================================================= */}

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

              setContactoAbierto(
                true
              );
            }}
          >
            Contacto
          </a>
        </nav>

        <div className="header-actions">

          <button
            className="favorites-header"
            onClick={() =>
              setFavoritosAbiertos(
                true
              )
            }
          >
            <span>
              ♥
            </span>

            Favoritos

            {favoritos.length >
              0 && (
              <b>
                {favoritos.length}
              </b>
            )}
          </button>

          <button
            className="cart"
            onClick={() =>
              setCarritoAbierto(
                true
              )
            }
          >
            🛒 Carrito (
            {carrito.length})
          </button>

        </div>

      </header>

      {/* ================================================
          HERO
      ================================================= */}

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

      {/* ================================================
          GALERÍA
      ================================================= */}

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
            darle personalidad a tus espacios.
          </span>

        </div>

        <div className="gallery-grid">

          {pinturas.map(
            (pintura) => (
              <article
                className="painting-card"
                key={
                  pintura.id
                }
              >

                <div
                  className="image-container"
                  onClick={() =>
                    setPinturaSeleccionada(
                      pintura
                    )
                  }
                >

                  <img
                    className="painting-motion"
                    src={
                      pintura.imagen
                    }
                    alt={
                      pintura.titulo
                    }
                  />

                  <div className="image-overlay">
                    <span>
                      Ver pintura
                    </span>
                  </div>

                  <button
                    className={`favorite ${
                      esFavorito(
                        pintura.id
                      )
                        ? "is-favorite"
                        : ""
                    }`}
                    type="button"
                    aria-label={
                      esFavorito(
                        pintura.id
                      )
                        ? "Quitar de favoritos"
                        : "Agregar a favoritos"
                    }
                    onClick={(e) => {
                      e.stopPropagation();

                      alternarFavorito(
                        pintura
                      );
                    }}
                  >
                    {esFavorito(
                      pintura.id
                    )
                      ? "♥"
                      : "♡"}
                  </button>

                </div>

                <div className="painting-info">

                  <h3>
                    {
                      pintura.titulo
                    }
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

      </section>

      {/* ================================================
          NOSOTROS
      ================================================= */}

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
          En dartsGallery buscamos
          conectar a las personas
          con pinturas únicas,
          creadas con pasión y
          dedicación.
        </p>

      </section>

      {/* ================================================
          FOOTER
      ================================================= */}

      <footer id="contacto">

        <h2>
          dartsGallery
        </h2>

        <p>
          Galería de pinturas
          originales
        </p>

        <button
          className="footer-contact"
          onClick={() =>
            setContactoAbierto(
              true
            )
          }
        >
          Contáctanos
        </button>

        <p>
          © 2026 dartsGallery
        </p>

      </footer>

      {/* ================================================
          MODAL VER PINTURA
      ================================================= */}

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

            <button
              className="close-modal"
              onClick={() =>
                setPinturaSeleccionada(
                  null
                )
              }
            >
              ×
            </button>

            <div className="modal-image-container">

              <img
                className="modal-painting-motion"
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
                {
                  pinturaSeleccionada.titulo
                }
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

              <div className="modal-favorite-row">

                <button
                  className={`modal-favorite ${
                    esFavorito(
                      pinturaSeleccionada.id
                    )
                      ? "is-favorite"
                      : ""
                  }`}
                  onClick={() =>
                    alternarFavorito(
                      pinturaSeleccionada
                    )
                  }
                >
                  {esFavorito(
                    pinturaSeleccionada.id
                  )
                    ? "♥ En favoritos"
                    : "♡ Agregar a favoritos"}
                </button>

              </div>

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

      {/* ================================================
          CARRITO
      ================================================= */}

      {carritoAbierto && (
        <div
          className="cart-overlay"
          onClick={() =>
            setCarritoAbierto(
              false
            )
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
                  setCarritoAbierto(
                    false
                  )
                }
              >
                ×
              </button>

            </div>

            {carrito.length ===
            0 ? (
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
                <div className="cart-items">

                  {carrito.map(
                    (pintura) => (
                      <div
                        className="cart-item"
                        key={
                          pintura.id
                        }
                      >

                        <img
                          src={
                            pintura.imagen
                          }
                          alt={
                            pintura.titulo
                          }
                        />

                        <div className="cart-item-info">

                          <h3>
                            {
                              pintura.titulo
                            }
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
                      setCarritoAbierto(
                        false
                      );

                      setCompraAbierta(
                        true
                      );
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

      {/* ================================================
          FAVORITOS
      ================================================= */}

      {favoritosAbiertos && (
        <div
          className="favorites-overlay"
          onClick={() =>
            setFavoritosAbiertos(
              false
            )
          }
        >

          <div
            className="favorites-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              className="close-modal"
              onClick={() =>
                setFavoritosAbiertos(
                  false
                )
              }
            >
              ×
            </button>

            <div className="favorites-header">

              <p>
                MI COLECCIÓN
              </p>

              <h2>
                Favoritos ❤️
              </h2>

              <span>
                {pinturasFavoritas.length ===
                0
                  ? "Todavía no tienes pinturas favoritas."
                  : `Tienes ${pinturasFavoritas.length} pintura${
                      pinturasFavoritas.length !==
                      1
                        ? "s"
                        : ""
                    } favorita${
                      pinturasFavoritas.length !==
                      1
                        ? "s"
                        : ""
                    }.`}
              </span>

            </div>

            {pinturasFavoritas.length ===
            0 ? (
              <div className="favorites-empty">
                <div>
                  ♡
                </div>

                <p>
                  Pulsa el corazón de
                  una pintura para
                  guardarla aquí.
                </p>
              </div>
            ) : (
              <div className="favorites-grid">

                {pinturasFavoritas.map(
                  (pintura) => (
                    <article
                      className="favorite-card"
                      key={
                        pintura.id
                      }
                    >

                      <div
                        className="favorite-card-image"
                        onClick={() => {
                          setFavoritosAbiertos(
                            false
                          );

                          setPinturaSeleccionada(
                            pintura
                          );
                        }}
                      >

                        <img
                          src={
                            pintura.imagen
                          }
                          alt={
                            pintura.titulo
                          }
                        />

                      </div>

                      <h3>
                        {
                          pintura.titulo
                        }
                      </h3>

                      <p>
                        {formatearPrecio(
                          pintura.precio
                        )}
                      </p>

                      <button
                        onClick={() =>
                          alternarFavorito(
                            pintura
                          )
                        }
                      >
                        ♥ Quitar
                      </button>

                    </article>
                  )
                )}

              </div>
            )}

          </div>

        </div>
      )}

      {/* ================================================
          CONTACTO
      ================================================= */}

      {contactoAbierto && (
        <div
          className="contact-modal-overlay"
          onClick={() =>
            setContactoAbierto(
              false
            )
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
                setContactoAbierto(
                  false
                )
              }
            >
              ×
            </button>

            <div className="contact-modal-header">

              <p>
                CONTACTO
              </p>

              <h2>
                Hablemos
              </h2>

              <span>
                ¿Tienes alguna pregunta
                sobre nuestras obras?
              </span>

            </div>

            <FormularioContacto />

          </div>

        </div>
      )}

      {/* ================================================
          COMPRA
      ================================================= */}

      {compraAbierta &&
        carrito.length > 0 && (
          <FormularioCompra />
        )}

    </div>
  );
}

export default App;