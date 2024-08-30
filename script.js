let cart = [];
let total = 0;
let cartCount = 0; // Contador Flotante
let orderCounter = 0; // Contador de pedidos
let lastOrderTime = Date.now(); // Marca de tiempo del último pedido

function addToCart(product, price) {
    cart.push({ product, price });
    updateCart();
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = ''; // Limpia el contenido del carrito
    total = 0; // Reinicia el total
    cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `${item.product} - $${item.price} <button class="remove-btn" onclick="removeFromCart(${index})">Eliminar</button>`;
        cartItems.appendChild(li);
        total += item.price;
    });
    document.getElementById('total').textContent = total.toFixed(2);
    // Actualiza el contador flotante
    cartCount = cart.length;
    document.getElementById('cart-count').textContent = cartCount;
}

function removeFromCart(index) {
    cart.splice(index, 1); // Elimina el producto del carrito
    updateCart(); // Actualiza la vista del carrito
}

function clearCart() {
    cart = []; // Vacía el carrito
    total = 0; // Reinicia el total
    cartCount = 0; // Reinicia el contador flotante
    updateCart(); // Actualiza la vista del carrito
}

function canPlaceOrder() {
    const now = Date.now();
    const elapsedTime = (now - lastOrderTime) / 60000; // Tiempo transcurrido en minutos
    if (elapsedTime >= 10) {
        orderCounter = 0; // Reinicia el contador si han pasado más de 10 minutos
        lastOrderTime = now; // Actualiza la marca de tiempo
        return true;
    }
    if (orderCounter >= 10) {
        const nextAvailableTime = new Date(lastOrderTime + 10 * 60000); // Suma 10 minutos a la última marca de tiempo
        const hours = nextAvailableTime.getHours().toString().padStart(2, '0');
        const minutes = nextAvailableTime.getMinutes().toString().padStart(2, '0');
        alert(`Se ha alcanzado el límite de 10 pedidos en los últimos 10 minutos. Podrás hacer un nuevo pedido a partir de las ${hours}:${minutes}.`);
        return false;
    }
    return true;
}

function sendToWhatsApp(event) {
    event.preventDefault();

    if (!canPlaceOrder()) {
        return; // Detener si no se puede hacer el pedido
    }

    // Verificar si el carrito está vacío
    if (cart.length === 0) {
        alert("El carrito está vacío. Por favor, agrega productos antes de confirmar la compra.");
        return;
    }

    // Obtener datos del formulario
    const name = document.getElementById('name').value;
    const grade = document.getElementById('grade').value; // Grado y Grupo
    const time = document.getElementById('time').value;
    const tip = parseFloat(document.getElementById('tip').value) || 0;
    const comments = document.getElementById('comments').value; // Comentarios adicionales

    // Obtener el total actual
    let total = parseFloat(document.getElementById('total').textContent);

    // Detalles del pedido
    const orderDetails = cart.map(item => `${item.product} - $${item.price}`).join('\n');
    const grandTotal = total + tip; // Total con propina

    // Formato del mensaje
    const message = `
Pedido de: ${name}
Grado y Grupo: ${grade}
Hora de Entrega: ${time}
Comentarios Adicionales: ${comments ? comments : 'Ninguno'}
\nPedido:\n${orderDetails}
\n\nTotal: $${total.toFixed(2)}
Propina: $${tip.toFixed(2)}
Total a Pagar: $${grandTotal.toFixed(2)}
    `;

    // Enviar el mensaje a WhatsApp
    const whatsappURL = `https://wa.me/7561574133?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');

    // Vaciar el carrito y resetear el contador después de enviar el pedido
    clearCart();
    orderCounter++; // Incrementa el contador de pedidos

    // Limpiar los campos del formulario
    document.getElementById('name').value = '';
    document.getElementById('grade').value = ''; // Limpiar Grado y Grupo
    document.getElementById('time').value = '';
    document.getElementById('tip').value = '';
    document.getElementById('comments').value = ''; // Limpiar comentarios adicionales
}

// Simula un clic en el carrito flotante para mostrar el carrito
document.getElementById('floating-cart').addEventListener('click', function() {
    document.getElementById('cart-and-checkout').scrollIntoView({ behavior: 'smooth' });
});
