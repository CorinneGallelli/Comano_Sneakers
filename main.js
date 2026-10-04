const app = Vue.createApp({
  data() {
    return {
      products: [
        { id: 1, name: 'Corsa Veloce 3', category: 'Running', price: 129, stock: 12, desc: 'Leggera e reattiva, ideale per allenamenti su asfalto.', images: ['images/corsa1.png', 'images/corsa2.png', 'images/corsa3.png'] },
        { id: 2, name: 'Sentiero GTX', category: 'Trail', price: 149, stock: 3, desc: 'Suola tassellata per sentieri e terreni sconnessi.', images: ['images/sentiero1.png', 'images/sentiero2.png', 'images/sentiero3.png'] },
        { id: 3, name: 'Palestra Pro', category: 'Training', price: 99, stock: 0, desc: 'Stabile e flessibile per gli allenamenti in palestra.', images: ['images/palestra1.png', 'images/palestra2.png', 'images/palestra3.png'] },
        { id: 4, name: 'Maratona Light', category: 'Running', price: 169, stock: 8, desc: 'Ammortizzazione morbida per le lunghe distanze.', images: ['images/maratona1.png', 'images/maratona2.png', 'images/maratona3.png'] }
      ],
      sizes: [39, 40, 41, 42, 43, 44],
      chosen: {},
      open: {},
      hovered: null,
      cart: [],
      showCart: false,
      freeShipping: 150,
      toast: '',
      toastTimer: null,
      selectedCategory: 'Tutte',
      search: '',
      sortBy: 'default',
      onlyAvailable: false
    }
  },
  computed: {
    cartCount() {
      return this.cart.reduce((n, item) => n + item.qty, 0)
    },
    cartTotal() {
      return this.cart.reduce((sum, item) => sum + item.qty * item.price, 0)
    },
    shippingPercent() {
      return Math.min(100, Math.round((this.cartTotal / this.freeShipping) * 100))
    },
    categories() {
      const names = this.products.map((p) => p.category)
      return ['Tutte', ...new Set(names)]
    },
    filteredProducts() {
      const list = this.products.filter((p) => {
        const okCategory = this.selectedCategory === 'Tutte' || p.category === this.selectedCategory
        const okSearch = p.name.toLowerCase().includes(this.search.toLowerCase())
        const okStock = !this.onlyAvailable || p.stock > 0
        return okCategory && okSearch && okStock
      })
      if (this.sortBy === 'name') list.sort((a, b) => a.name.localeCompare(b.name))
      if (this.sortBy === 'price-asc') list.sort((a, b) => a.price - b.price)
      if (this.sortBy === 'price-desc') list.sort((a, b) => b.price - a.price)
      return list
    }
  },
  watch: {
    // immediate: parte subito, appena l'app si crea
    selectedCategory: {
      handler(newValue) {
        document.title = 'COMANO Sneakers - ' + newValue
      },
      immediate: true
    },
    // deep: scatta anche quando cambia qualcosa DENTRO il carrello (es. la quantità)
    cart: {
      handler(newCart) {
        localStorage.setItem('comano-cart', JSON.stringify(newCart))
      },
      deep: true
    }
  },
  created() {
    // l'app è appena stata creata: recupero il carrello salvato
    const saved = localStorage.getItem('comano-cart')
    if (saved) this.cart = JSON.parse(saved)
  },
  mounted() {
    // la pagina è sullo schermo: con il tasto Esc si chiude il carrello
    window.addEventListener('keydown', this.onKey)
  },
  updated() {
    // scatta a ogni modifica della pagina (solo a scopo didattico, puoi toglierlo)
    console.log('Pagina aggiornata')
  },
  unmounted() {
    // quando l'app viene tolta, si "ripulisce" quello che si era aggiunto
    window.removeEventListener('keydown', this.onKey)
  },
  methods: {
    onKey(event) {
      if (event.key === 'Escape') this.showCart = false
    },
    addToCart(product) {
      const size = this.chosen[product.id]
      if (!size || product.stock === 0) return
      const found = this.cart.find((i) => i.id === product.id && i.size === size)
      if (found) {
        found.qty++
      } else {
        this.cart.push({ id: product.id, name: product.name, price: product.price, size: size, qty: 1 })
      }
      this.toast = product.name + ' aggiunta al carrello'
      clearTimeout(this.toastTimer)
      this.toastTimer = setTimeout(() => { this.toast = '' }, 2000)
    },
    changeQty(index, delta) {
      this.cart[index].qty += delta
      if (this.cart[index].qty <= 0) {
        this.cart.splice(index, 1)
      }
    },
    clearCart() {
      this.cart = []
    }
  }
})
app.mount('#app')