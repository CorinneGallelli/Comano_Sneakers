const app = Vue.createApp({
  data() {
    return {
      products: [
        { id: 1, name: 'Corsa Veloce 3', category: 'Running', price: 129, images: ['images/corsa1.png', 'images/corsa2.png', 'images/corsa3.png'] },
        { id: 2, name: 'Sentiero GTX', category: 'Trail', price: 149, images: ['images/sentiero1.png', 'images/sentiero2.png', 'images/sentiero3.png'] },
        { id: 3, name: 'Palestra Pro', category: 'Training', price: 99, images: ['images/palestra1.png', 'images/palestra2.png', 'images/palestra3.png'] },
        { id: 4, name: 'Maratona Light', category: 'Running', price: 169, images: ['images/maratona1.png', 'images/maratona2.png', 'images/maratona3.png'] }
      ],
      sizes: [39, 40, 41, 42, 43, 44],
      chosen: {},
      cart: [],
      showCart: false,
      selectedCategory: 'Tutte',
      search: ''
    }
  },
  computed: {
    cartCount() {
      return this.cart.reduce((n, item) => n + item.qty, 0)
    },
    cartTotal() {
      return this.cart.reduce((sum, item) => sum + item.qty * item.price, 0)
    },
    categories() {
      const names = this.products.map((p) => p.category)
      return ['Tutte', ...new Set(names)]
    },
    filteredProducts() {
      return this.products.filter((p) => {
        const okCategory = this.selectedCategory === 'Tutte' || p.category === this.selectedCategory
        const okSearch = p.name.toLowerCase().includes(this.search.toLowerCase())
        return okCategory && okSearch
      })
    }
  },
  watch: {
    selectedCategory(newValue) {
      document.title = 'COMANO Sneakers - ' + newValue
    }
  },
  methods: {
    addToCart(product) {
      const size = this.chosen[product.id]
      if (!size) return
      const found = this.cart.find((i) => i.id === product.id && i.size === size)
      if (found) {
        found.qty++
      } else {
        this.cart.push({ id: product.id, name: product.name, price: product.price, size: size, qty: 1 })
      }
      this.showCart = true
    },
    changeQty(index, delta) {
      this.cart[index].qty += delta
      if (this.cart[index].qty <= 0) {
        this.cart.splice(index, 1)
      }
    }
  }
})
app.mount('#app')