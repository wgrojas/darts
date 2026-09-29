import { useState } from "react";
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

// ======================================================
// TELEGRAM
// ======================================================

const enviarTelegram = async (mensaje) => {
  console.log("====================================");
  console.log("📨 INICIANDO ENVÍO A TELEGRAM");
  console.log("====================================");

  try {
    if (!TELEGRAM_BOT_TOKEN) {
      console.error(
        "❌ Falta VITE_TELEGRAM_BOT_TOKEN"
      );
      return false;
    }

    if (!TELEGRAM_CHAT_ID) {
      console.error(
        "❌ Falta VITE_TELEGRAM_CHAT_ID"
      );
      return false;
    }

    console.log(
      "✓ Token de Telegram configurado"
    );

    console.log(
      "✓ Chat ID configurado:",
      TELEGRAM_CHAT_ID
    );

    const url =
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    console.log(
      "📡 Enviando mensaje a Telegram..."
    );

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

    console.log(
      "📥 Respuesta Telegram:",
      datos
    );

    if (!datos.ok) {
      console.error(
        "❌ Telegram rechazó el mensaje:",
        datos
      );

      return false;
    }

    console.log(
      "✅ MENSAJE ENVIADO CORRECTAMENTE A TELEGRAM"
    );

    return true;
  } catch (error) {
    console.error(
      "❌ ERROR CONECTANDO CON TELEGRAM:",
      error
    );

    return false;
  }
};

// ======================================================
// CARGAR WOMPI
// ======================================================

const cargarWompi = () => {
  console.log(
    "🔄 Verificando Widget de Wompi..."
  );

  return new Promise((resolve, reject) => {
    if (window.WidgetCheckout) {
      console.log(
        "✓ WidgetCheckout ya está disponible"
      );

      resolve();
      return;
    }

    const scriptExistente =
      document.querySelector(
        'script[src="https://checkout.wompi.co/widget.js"]'
      );

    if (scriptExistente) {
      console.log(
        "ℹ️ Script de Wompi ya existe. Esperando carga..."
      );

      scriptExistente.addEventListener(
        "load",
        () => {
          console.log(
            "✓ Script Wompi cargado"
          );

          resolve();
        }
      );

      scriptExistente.addEventListener(
        "error",
        () => {
          reject(
            new Error(
              "No fue posible cargar el script de Wompi."
            )
          );
        }
      );

      return;
    }

    console.log(
      "📥 Cargando script de Wompi..."
    );

    const script =
      document.createElement("script");

    script.src =
      "https://checkout.wompi.co/widget.js";

    script.async = true;

    script.onload = () => {
      console.log(
        "✅ Script de Wompi cargado correctamente"
      );

      resolve();
    };

    script.onerror = () => {
      console.error(
        "❌ No fue posible cargar Wompi"
      );

      reject(
        new Error(
          "No fue posible cargar el Widget de Wompi."
        )
      );
    };

    document.body.appendChild(script);
  });
};

// ======================================================
// GENERAR FIRMA WOMPI
// ======================================================

const generarFirmaIntegridad = async (
  referencia,
  montoEnCentavos
) => {
  console.log(
    "===================================="
  );

  console.log(
    "🔐 GENERANDO FIRMA DE INTEGRIDAD"
  );

  console.log(
    "===================================="
  );

  if (!WOMPI_INTEGRITY_SECRET) {
    throw new Error(
      "No está configurado VITE_WOMPI_INTEGRITY_SECRET."
    );
  }

  const cadena =
    `${referencia}${montoEnCentavos}COP${WOMPI_INTEGRITY_SECRET}`;

  console.log(
    "Referencia:",
    referencia
  );

  console.log(
    "Monto en centavos:",
    montoEnCentavos
  );

  console.log(
    "Moneda: COP"
  );

  console.log(
    "✓ Cadena de integridad preparada"
  );

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

  const firma =
    hashArray
      .map((b) =>
        b
          .toString(16)
          .padStart(2, "0")
      )
      .join("");

  console.log(
    "✓ Firma SHA-256 generada"
  );

  console.log(
    "Firma:",
    firma
  );

  return firma;
};

// ======================================================
// REFERENCIA ÚNICA
// ======================================================

const generarReferencia = () => {
  const timestamp =
    Date.now();

  const aleatorio =
    Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();

  const referencia =
    `DARTS-${timestamp}-${aleatorio}`;

  console.log(
    "🧾 Referencia generada:",
    referencia
  );

  return referencia;
};

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
  const [pinturas] = useState(
    pinturasIniciales
  );

  const [
    pinturaSeleccionada,
    setPinturaSeleccionada,
  ] = useState(null);

  const [carrito, setCarrito] =
    useState([]);

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

  // ====================================================
  // CARRITO
  // ====================================================

  const agregarAlCarrito = (
    pintura
  ) => {
    const existe =
      carrito.some(
        (item) =>
          item.id === pintura.id
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

    setPinturaSeleccionada(
      null
    );

    setCarritoAbierto(true);
  };

  // ====================================================
  // COMPRAR AHORA
  // ====================================================

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

  // ====================================================
  // ELIMINAR DEL CARRITO
  // ====================================================

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

  // ====================================================
  // TOTAL
  // ====================================================

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

      const manejarCambio =
        (e) => {
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

          console.log(
            "📩 Enviando formulario de contacto..."
          );

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

            setContactoAbierto(
              false
            );
          } else {
            alert(
              "No fue posible enviar el mensaje a Telegram."
            );
          }
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
  // FORMULARIO DE COMPRA
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

      const manejarCambio =
        (e) => {
          setDatos({
            ...datos,
            [e.target.name]:
              e.target.value,
          });
        };

      // ==================================================
      // PROCESAR PAGO WOMPI
      // ==================================================

      const procesarPago =
        async () => {
          console.log(
            "\n===================================="
          );

          console.log(
            "💳 INICIANDO PROCESO DE PAGO WOMPI"
          );

          console.log(
            "===================================="
          );

          try {
            // --------------------------------------------
            // VALIDAR LLAVE PÚBLICA
            // --------------------------------------------

            console.log(
              "🔎 Validando configuración..."
            );

            if (
              !WOMPI_PUBLIC_KEY
            ) {
              throw new Error(
                "No está configurada VITE_WOMPI_PUBLIC_KEY en .env"
              );
            }

            console.log(
              "✓ Public Key encontrada"
            );

            // --------------------------------------------
            // VALIDAR SECRETO
            // --------------------------------------------

            if (
              !WOMPI_INTEGRITY_SECRET
            ) {
              throw new Error(
                "No está configurado VITE_WOMPI_INTEGRITY_SECRET en .env"
              );
            }

            console.log(
              "✓ Integrity Secret encontrado"
            );

            // --------------------------------------------
            // VALIDAR DATOS
            // --------------------------------------------

            if (
              !datos.nombre ||
              !datos.email ||
              !datos.telefono ||
              !datos.direccion ||
              !datos.ciudad
            ) {
              throw new Error(
                "Completa todos los datos obligatorios."
              );
            }

            console.log(
              "✓ Datos del cliente completos"
            );

            // --------------------------------------------
            // ESTADO
            // --------------------------------------------

            setProcesandoPago(
              true
            );

            // --------------------------------------------
            // CARGAR WOMPI
            // --------------------------------------------

            await cargarWompi();

            if (
              !window.WidgetCheckout
            ) {
              throw new Error(
                "WidgetCheckout no está disponible."
              );
            }

            console.log(
              "✓ WidgetCheckout disponible"
            );

            // --------------------------------------------
            // REFERENCIA
            // --------------------------------------------

            const referencia =
              generarReferencia();

            console.log(
              "🧾 Referencia:",
              referencia
            );

            // --------------------------------------------
            // MONTO
            // --------------------------------------------

            const montoEnCentavos =
              Math.round(
                Number(
                  totalCarrito
                ) * 100
              );

            console.log(
              "💰 Total COP:",
              totalCarrito
            );

            console.log(
              "💰 Monto en centavos:",
              montoEnCentavos
            );

            // --------------------------------------------
            // GENERAR FIRMA
            // --------------------------------------------

            const firma =
              await generarFirmaIntegridad(
                referencia,
                montoEnCentavos
              );

            console.log(
              "✓ Firma generada"
            );

            // --------------------------------------------
            // CONFIGURACIÓN WOMPI
            // --------------------------------------------

            const configuracionWompi =
              {
                currency: "COP",

                amountInCents:
                  montoEnCentavos,

                reference:
                  referencia,

                publicKey:
                  WOMPI_PUBLIC_KEY,

                signature: {
                  integrity:
                    firma,
                },
              };

            console.log(
              "===================================="
            );

            console.log(
              "⚙️ CONFIGURACIÓN WOMPI"
            );

            console.log(
              "===================================="
            );

            console.log(
              "Currency:",
              configuracionWompi.currency
            );

            console.log(
              "Amount:",
              configuracionWompi.amountInCents
            );

            console.log(
              "Reference:",
              configuracionWompi.reference
            );

            console.log(
              "Public Key:",
              configuracionWompi.publicKey
            );

            console.log(
              "Integrity:",
              firma
            );

            // --------------------------------------------
            // CREAR CHECKOUT
            // --------------------------------------------

            console.log(
              "🔨 Creando WidgetCheckout..."
            );

            const checkout =
              new window.WidgetCheckout(
                configuracionWompi
              );

            console.log(
              "✓ WidgetCheckout creado correctamente"
            );

            // --------------------------------------------
            // ABRIR CHECKOUT
            // --------------------------------------------

            console.log(
              "🚀 Abriendo ventana de Wompi..."
            );

            alert(
              "Wompi se está abriendo..."
            );

            checkout.open(
              async (resultado) => {
                console.log(
                  "\n===================================="
                );

                console.log(
                  "💳 RESULTADO DE WOMPI"
                );

                console.log(
                  "===================================="
                );

                console.log(
                  "Resultado completo:",
                  resultado
                );

                const transaccion =
                  resultado?.transaction;

                if (
                  !transaccion
                ) {
                  console.error(
                    "❌ Wompi no devolvió información de transacción."
                  );

                  alert(
                    "No se recibió información de la transacción."
                  );

                  setProcesandoPago(
                    false
                  );

                  return;
                }

                // ------------------------------------------
                // DATOS TRANSACCIÓN
                // ------------------------------------------

                const transactionId =
                  transaccion.id ||
                  "No disponible";

                const referenciaWompi =
                  transaccion.reference ||
                  referencia;

                const estado =
                  transaccion.status ||
                  "UNKNOWN";

                const metodoPago =
                  transaccion.payment_method_type ||
                  transaccion.payment_method?.type ||
                  "No disponible";

                console.log(
                  "🧾 Transaction ID:",
                  transactionId
                );

                console.log(
                  "🧾 Reference:",
                  referenciaWompi
                );

                console.log(
                  "📌 Status:",
                  estado
                );

                console.log(
                  "💳 Método de pago:",
                  metodoPago
                );

                console.log(
                  "📦 Transacción completa:",
                  transaccion
                );

                // ==========================================
                // PAGO APROBADO
                // ==========================================

                if (
                  estado ===
                  "APPROVED"
                ) {
                  console.log(
                    "===================================="
                  );

                  console.log(
                    "🟢🟢🟢 PAGO APROBADO 🟢🟢🟢"
                  );

                  console.log(
                    "===================================="
                  );

                  const mensajeTelegram = `
💰💰💰 PAGO APROBADO 💰💰💰

🎨 dartsGallery

━━━━━━━━━━━━━━━━━━

🧾 TRANSACCIÓN

ID:
${transactionId}

Referencia:
${referenciaWompi}

Método:
${metodoPago}

━━━━━━━━━━━━━━━━━━

🎨 OBRA

${pintura.titulo}

ID pintura:
${pintura.id}

💰 VALOR:

${formatearPrecio(
                    totalCarrito
                  )}

━━━━━━━━━━━━━━━━━━

👤 CLIENTE

Nombre:
${datos.nombre}

Correo:
${datos.email}

Teléfono:
${datos.telefono}

━━━━━━━━━━━━━━━━━━

📍 ENTREGA

Dirección:
${datos.direccion}

Ciudad:
${datos.ciudad}

━━━━━━━━━━━━━━━━━━

📝 OBSERVACIONES

${
  datos.observaciones ||
  "Sin observaciones"
}

━━━━━━━━━━━━━━━━━━

🟢 ESTADO:

PAGO APROBADO

✅ COMPRA REALIZADA
`;

                  console.log(
                    "📨 Enviando alerta de pago aprobado a Telegram..."
                  );

                  const telegramEnviado =
                    await enviarTelegram(
                      mensajeTelegram
                    );

                  if (
                    telegramEnviado
                  ) {
                    console.log(
                      "✅ Alerta de pago enviada a Telegram"
                    );
                  } else {
                    console.error(
                      "❌ No fue posible enviar la alerta a Telegram"
                    );
                  }

                  alert(
                    `✅ PAGO APROBADO\n\nReferencia:\n${referenciaWompi}\n\nValor:\n${formatearPrecio(
                      totalCarrito
                    )}\n\n¡Gracias por tu compra!`
                  );

                  console.log(
                    "🛒 Limpiando carrito..."
                  );

                  setCarrito([]);

                  setCompraAbierta(
                    false
                  );

                  console.log(
                    "✓ Compra finalizada"
                  );

                  setProcesandoPago(
                    false
                  );

                  return;
                }

                // ==========================================
                // PAGO RECHAZADO
                // ==========================================

                if (
                  estado ===
                  "DECLINED"
                ) {
                  console.log(
                    "===================================="
                  );

                  console.log(
                    "🔴 PAGO RECHAZADO"
                  );

                  console.log(
                    "===================================="
                  );

                  const mensajeTelegram = `
❌ PAGO RECHAZADO

🎨 dartsGallery

━━━━━━━━━━━━━━━━━━

🧾 TRANSACCIÓN

ID:
${transactionId}

Referencia:
${referenciaWompi}

Método:
${metodoPago}

━━━━━━━━━━━━━━━━━━

🎨 OBRA

${pintura.titulo}

💰 VALOR:

${formatearPrecio(
                    totalCarrito
                  )}

━━━━━━━━━━━━━━━━━━

👤 CLIENTE

Nombre:
${datos.nombre}

Correo:
${datos.email}

Teléfono:
${datos.telefono}

━━━━━━━━━━━━━━━━━━

🔴 ESTADO:

PAGO RECHAZADO
`;

                  await enviarTelegram(
                    mensajeTelegram
                  );

                  alert(
                    `❌ PAGO RECHAZADO\n\nEstado: ${estado}\n\nPuedes intentar nuevamente.`
                  );

                  setProcesandoPago(
                    false
                  );

                  return;
                }

                // ==========================================
                // OTROS ESTADOS
                // ==========================================

                console.log(
                  "⚠️ Estado de pago:",
                  estado
                );

                const mensajeTelegram = `
⚠️ ACTUALIZACIÓN DE PAGO

🎨 dartsGallery

━━━━━━━━━━━━━━━━━━

ID:
${transactionId}

Referencia:
${referenciaWompi}

Método:
${metodoPago}

Obra:
${pintura.titulo}

Valor:
${formatearPrecio(
                  totalCarrito
                )}

Cliente:
${datos.nombre}

Correo:
${datos.email}

━━━━━━━━━━━━━━━━━━

ESTADO:

${estado}
`;

                await enviarTelegram(
                  mensajeTelegram
                );

                alert(
                  `⚠️ Estado de la transacción:\n\n${estado}`
                );

                setProcesandoPago(
                  false
                );
              }
            );

          } catch (error) {
            console.error(
              "\n===================================="
            );

            console.error(
              "❌ ERROR WOMPI"
            );

            console.error(
              "===================================="
            );

            console.error(
              "Error completo:",
              error
            );

            console.error(
              "Mensaje:",
              error?.message
            );

            console.error(
              "Stack:",
              error?.stack
            );

            // --------------------------------------------
            // ALERTA TELEGRAM DE ERROR
            // --------------------------------------------

            const mensajeError = `
🚨 ERROR EN PAGO WOMPI

🎨 dartsGallery

━━━━━━━━━━━━━━━━━━

Cliente:
${datos.nombre}

Correo:
${datos.email}

Obra:
${pintura.titulo}

Valor:
${formatearPrecio(
              totalCarrito
            )}

━━━━━━━━━━━━━━━━━━

❌ ERROR

${
  error?.message ||
  "Error desconocido"
}
`;

            await enviarTelegram(
              mensajeError
            );

            alert(
              `❌ No fue posible iniciar el pago con Wompi.\n\nError:\n${
                error?.message ||
                "Error desconocido"
              }\n\nRevisa la consola (F12) para más información.`
            );

            setProcesandoPago(
              false
            );
          }
        };

      // ==================================================
      // ENVIAR PEDIDO
      // ==================================================

      const enviarPedido =
        async (e) => {
          e.preventDefault();

          console.log(
            "🛒 Botón Pagar con Wompi presionado"
          );

          if (
            !datos.nombre ||
            !datos.email ||
            !datos.telefono ||
            !datos.direccion ||
            !datos.ciudad
          ) {
            alert(
              "Completa todos los campos obligatorios."
            );

            return;
          }

          await procesarPago();
        };

      return (
        <div
          className="purchase-modal-overlay"
          onClick={() =>
            !procesandoPago &&
            setCompraAbierta(
              false
            )
          }
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
  // INTERFAZ
  // ====================================================

  return (
    <div className="app">

      {/* HEADER */}

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

      {/* GALERÍA */}

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
            Descubre piezas únicas
            para darle personalidad
            a tus espacios.
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

                <div className="image-container">

                  <img
                    src={
                      pintura.imagen
                    }
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

      {/* NOSOTROS */}

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

      {/* FOOTER */}

      <footer id="contacto">

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

      {/* =================================================
          MODAL PINTURA
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

      {/* =================================================
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
                Hablemos de arte
              </h2>

              <span>
                ¿Tienes alguna pregunta
                sobre nuestras obras?
                Estamos aquí para
                ayudarte.
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