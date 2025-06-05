let carrito = [];

document.addEventListener('DOMContentLoaded', () => {
  const botonesAgregar = document.querySelectorAll('.add-to-cart');
  botonesAgregar.forEach(boton => {
    boton.addEventListener('click', () => {
      const nombre = boton.getAttribute('data-nombre');
      const precio = parseFloat(boton.getAttribute('data-precio'));
      const img = boton.getAttribute('data-img');
      agregarAlCarrito({ nombre, precio, img });
      mostrarToast(`${nombre} agregado al carrito`);
    });
  });

  cargarCarritoDesdeLocalStorage();
  actualizarResumenCarrito();

  const botonVaciar = document.getElementById('clear-cart');
  if (botonVaciar) {
    botonVaciar.addEventListener('click', () => {
      if (confirm('¿Estás segura de que deseas vaciar el carrito?')) {
        carrito = [];
        guardarCarritoEnLocalStorage();
        actualizarResumenCarrito();
        mostrarToast('Carrito vaciado correctamente');
      }
    });
  }

  const botonSeguir = document.getElementById('continue-shopping');
  if (botonSeguir) {
    botonSeguir.addEventListener('click', () => {
      mostrarToast('Redirigiendo a productos...');
      window.location.href = 'productos.html';
    });
  }

  const botonCheckout = document.getElementById('checkout-btn');
  if (botonCheckout) {
    botonCheckout.addEventListener('click', () => {
      mostrarToast('Procesando tu pago...');
    });
  }
});

function agregarAlCarrito(producto) {
  const existente = carrito.find(item => item.nombre === producto.nombre);
  if (existente) {
    existente.cantidad += 1;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }

  guardarCarritoEnLocalStorage();
  actualizarResumenCarrito();
}

function guardarCarritoEnLocalStorage() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function cargarCarritoDesdeLocalStorage() {
  const guardado = localStorage.getItem('carrito');
  if (guardado) {
    carrito = JSON.parse(guardado);
  }
}

function mostrarToast(mensaje) {
  const toast = document.createElement('div');
  toast.className = 'toast-custom position-fixed bottom-0 end-0 m-3 p-3 bg-success text-white rounded shadow d-flex align-items-center gap-3';
  toast.style.zIndex = '9999';
  toast.innerHTML = `
    <i class="fas fa-check-circle fa-lg"></i>
    <div>${mensaje}</div>
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('opacity-0');
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}

function actualizarResumenCarrito() {
  const productosDiv = document.getElementById('carrito-productos');
  const cantidadSpan = document.getElementById('cart-quantity');
  const subtotalSpan = document.getElementById('cart-subtotal');
  const ivaSpan = document.getElementById('cart-iva');
  const envioSpan = document.getElementById('cart-shipping');
  const totalSpan = document.getElementById('cart-total');
  const countSpan = document.getElementById('cart-count');
  const mensajeVacio = document.getElementById('empty-cart-message');

  productosDiv.innerHTML = '';

  if (carrito.length === 0) {
    mensajeVacio.classList.remove('d-none');
    cantidadSpan.textContent = '0';
    subtotalSpan.textContent = '$0';
    ivaSpan.textContent = '$0';
    envioSpan.textContent = '$0';
    totalSpan.textContent = '$0';
    countSpan.textContent = '0';
    return;
  }

  mensajeVacio.classList.add('d-none');

  let cantidadTotal = 0;
  let subtotal = 0;

  const tabla = document.createElement('table');
  tabla.className = 'table table-bordered align-middle text-center';
  tabla.innerHTML = `
    <thead class="table-dark">
      <tr>
        <th>Imagen</th>
        <th>Producto</th>
        <th>Precio</th>
        <th>Cantidad</th>
        <th>Subtotal</th>
        <th>Eliminar</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;

  const tbody = tabla.querySelector('tbody');

  carrito.forEach((producto, index) => {
    cantidadTotal += producto.cantidad;
    const sub = producto.precio * producto.cantidad;
    subtotal += sub;

    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td><img src="${producto.img}" width="60" height="60" class="rounded" style="object-fit:cover;"></td>
      <td>${producto.nombre}</td>
      <td>$${producto.precio.toLocaleString('es-CO')}</td>
      <td>
        <input type="number" min="1" value="${producto.cantidad}" data-index="${index}" class="form-control form-control-sm cantidad-input text-center">
      </td>
      <td>$${sub.toLocaleString('es-CO')}</td>
      <td>
        <button class="btn btn-danger btn-sm eliminar-btn" data-index="${index}" title="Eliminar">
          <i class="fas fa-trash-alt"></i>
        </button>
      </td>
    `;

    tbody.appendChild(fila);
  });

  productosDiv.appendChild(tabla);

  // Escuchar cambios en cantidades
  document.querySelectorAll('.cantidad-input').forEach(input => {
    input.addEventListener('change', (e) => {
      let nuevaCantidad = parseInt(e.target.value);
      const index = parseInt(e.target.getAttribute('data-index'));
      if (isNaN(nuevaCantidad) || nuevaCantidad < 1) nuevaCantidad = 1;
      carrito[index].cantidad = nuevaCantidad;
      guardarCarritoEnLocalStorage();
      actualizarResumenCarrito();
      mostrarToast('Cantidad actualizada');
    });
  });

  // Botones de eliminar
  document.querySelectorAll('.eliminar-btn').forEach(boton => {
    boton.addEventListener('click', (e) => {
      const index = parseInt(boton.getAttribute('data-index'));
      carrito.splice(index, 1);
      guardarCarritoEnLocalStorage();
      actualizarResumenCarrito();
      mostrarToast('Producto eliminado');
    });
  });

  const iva = subtotal * 0.19;
  const envio = subtotal > 0 ? 10000 : 0;
  const total = subtotal + iva + envio;

  cantidadSpan.textContent = cantidadTotal;
  subtotalSpan.textContent = `$${subtotal.toLocaleString('es-CO')}`;
  ivaSpan.textContent = `$${iva.toLocaleString('es-CO')}`;
  envioSpan.textContent = `$${envio.toLocaleString('es-CO')}`;
  totalSpan.textContent = `$${total.toLocaleString('es-CO')}`;
  countSpan.textContent = cantidadTotal;
}
