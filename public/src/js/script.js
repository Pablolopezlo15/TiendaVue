// SLIDER MANUAL
let currentSlide = 1;

function changeSlide(n) {
    showSlide(currentSlide += n);
}

function showSlide(n) {
    const slides = document.querySelector('.slides2');
    if (n > 5) { currentSlide = 1; }
    if (n < 1) { currentSlide = 5; }
    slides.style.transform = `translateX(${-(currentSlide - 1) * 100}%)`;
}

const { createApp } = Vue

const app = createApp({
    data() {
        return {
            productos: [],
            productosTop: [],
            categorias: [],
            carrito: [],
            LandingPage: true,
            mostrarProductos: false,
            mostrarDetalle: false,
            mostrarCarrito: false,
            FinalizarCompra: false,
            login: false,
            ordenar: '0',
        }
    },
    methods: {
        obtenerCategorias() {
            document.getElementById("loader").style.display = "flex";
            fetch('https://fakestoreapi.com/products/categories')
            .then(res => res.json())
            .then(json => {
                // console.log(json);
                this.categorias = json;
                document.getElementById("loader").style.display = "none";
                // console.log(this.categorias);
            })
        },
        obtenerProductos() {
            document.getElementById("loader").style.display = "flex";

            fetch('https://fakestoreapi.com/products')
            .then(res => res.json())
            .then(json => {
                // console.log(json);
                this.productos = json;
                document.getElementById("loader").style.display = "none";

            })
        },
        obtenerProductosTop() {
            document.getElementById("loader").style.display = "flex";

            fetch('https://fakestoreapi.com/products')
            .then(res => res.json())
            .then(json => {
                this.productosTop = json.sort((a, b) => b.rating.rate - a.rating.rate).slice(0, 5);
        
                document.getElementById("loader").style.display = "none";
            })
        },
        mostrarLandingPage() {
            this.mostrarProductos = false;
            this.mostrarDetalle = false;
            this.mostrarCarrito = false;
            this.FinalizarCompra = false;
            this.login = false;

            this.LandingPage = true;
        },
        mostrarDetalleProducto(producto){
            this.LandingPage = false;
            this.mostrarCarrito = false;
            this.mostrarProductos = false;
            this.FinalizarCompra = false;
            this.login = false;

            this.producto = producto;
            this.mostrarDetalle = true;
            
        },
        mostrarLogin() {
            this.LandingPage = false;
            this.mostrarCarrito = false;
            this.mostrarProductos = false;
            this.FinalizarCompra = false;
            this.mostrarDetalle = false;

            this.login = true;
        },
        mostrarProductosCategoria(categoria) {
            this.mostrarDetalle = false;
            this.mostrarCarrito = false;
            this.LandingPage = false;
            this.FinalizarCompra = false;
            this.login = false;

            this.mostrarProductos = true;
            document.getElementById("loader").style.display = "flex";

            fetch('https://fakestoreapi.com/products/category/' + categoria)
            .then(res => res.json())
            .then(json => {
                // console.log(json);
                this.productos = json;
                document.getElementById("loader").style.display = "none";

                // console.log(this.productos);
            })
        },

        mostrarCarritoProductos() {
            const carritoGuardado = localStorage.getItem("carrito");
            if (carritoGuardado) {
                this.carrito = JSON.parse(carritoGuardado);
            }
            
            this.LandingPage = false;
            this.mostrarDetalle = false;
            this.mostrarProductos = false;
            this.FinalizarCompra = false;
            this.login = false;

            this.mostrarCarrito = true;
        },

        añadirCarrito(producto){
            producto.cantidad = 1;
            this.carrito.push(producto);
            localStorage.setItem("carrito", JSON.stringify(this.carrito));
        },

        aumentarCantidad(producto){
            producto.cantidad++;
            localStorage.setItem("carrito", JSON.stringify(this.carrito));
        },

        disminuirCantidad(producto){
            if (producto.cantidad > 1) {
                producto.cantidad--;
                localStorage.setItem("carrito", JSON.stringify(this.carrito));
            }
        },

        eliminarProducto(producto){
            this.carrito = this.carrito.filter((item) => item.id !== producto.id);
            localStorage.setItem("carrito", JSON.stringify(this.carrito));
            
        },

        calcularTotal() {
            let total = 0;
            for (let i = 0; i < this.carrito.length; i++) {
                total += this.carrito[i].price * this.carrito[i].cantidad;
            }

            return parseFloat(total.toFixed(2));
        },

        aproximarTotal(total) {
            return parseFloat(total.toFixed(2));
        },

        mostrarFinalizarCompra() {
            this.mostrarCarrito = false;
            this.mostrarDetalle = false;
            this.LandingPage = false;
            this.mostrarProductos = false;
            this.login = false;

            this.FinalizarCompra = true;
        },

    },
    mounted() {
        this.obtenerCategorias();
        this.obtenerProductos();
        this.obtenerProductosTop();
    },
    computed: {
        productosOrdenados() {
            switch(this.ordenar) {
              case '0':
                return this.productos.slice().sort((a, b) => a.title.localeCompare(b.title));
              case '1':
                return this.productos.slice().sort((a, b) => b.title.localeCompare(a.title));
              case '2':
                return this.productos.slice().sort((a, b) => a.price - b.price);
              case '3':
                return this.productos.slice().sort((a, b) => b.price - a.price);
              case '4':
                return this.productos.slice().sort((a, b) => b.rating.rate - a.rating.rate);
              default:
                return this.productos;
            }
        },

        productosTopOrdenados() {
            return this.productosTop.slice().sort((a, b) => b.rating.rate - a.rating.rate);
            }
        }
})
app.mount('#app')