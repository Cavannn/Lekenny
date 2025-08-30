import { useState, useCallback, useEffect } from '@lynx-js/react'
import ProductPage from './ProductPage' 
import { RAW_CATALOG } from './catalogue'

import './App.css'
import tiktokLogo from './assets/tiktok-logo-tikok-icon-transparent-tikok-app-logo-free-png.webp'

type Product = {
  id: number
  title: string
  price: number
  tags: string[]
  img: string
  shipping: string
}

// Static backend URL
const BACKEND_URL = 'http://192.168.0.124:8000/chat'

function parsePrice(maybe: unknown): number {
  if (typeof maybe === 'number') return maybe
  if (typeof maybe !== 'string') return 0
  const cleaned = maybe.replace(/[^0-9.]/g, '')
  const n = Number(cleaned)
  return Number.isFinite(n) ? n : 0
}

function toUIProduct(raw: any): Product {
  const id = Number(raw?.id ?? 0)
  const title = String(raw?.title ?? raw?.name ?? 'Untitled')
  const price = parsePrice(raw?.price)
  const tags: string[] = []
  if (raw?.colours) tags.push(...String(raw.colours).split(',').map((s: string) => s.trim()))
  if (raw?.description) tags.push(...String(raw.description).split(',').map((s: string) => s.trim()))
  const img = String(raw?.img ?? raw?.image_url ?? raw?.url ?? '')
  const shipping = String(raw?.shipping ?? '')
  return { id, title, price, tags, img, shipping }
}

function truncate(s: string, n: number) {
  if (typeof s !== 'string') return '';
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}

const VISIBLE_TAGS = 3;

export default function App({ onRender }: { onRender?: () => void }) {
  const [message, setMessage] = useState('')
  const [responseText, setResponseText] = useState('')
  const DEFAULT_CATALOGUE: Product[] = RAW_CATALOG.map(toUIProduct)
  const [products, setProducts] = useState<Product[]>(DEFAULT_CATALOGUE)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Navigation state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showProductPage, setShowProductPage] = useState(false)

  useEffect(() => { onRender?.() }, [onRender])

  const onInput = useCallback((e: any) => {
    setMessage(e?.detail?.value ?? '')
  }, [])

  const handleSubmit = useCallback(async () => {
    if (!message.trim()) return
    if (!BACKEND_URL) { setError('Backend URL not configured'); return }
    setLoading(true)
    setError(null)
    setResponseText('')
    setProducts([])

    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 12000)
      const res = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
        signal: controller.signal,
      })
      clearTimeout(timeout)

      if (!res.ok) {
        const msg = await res.text().catch(() => res.statusText)
        throw new Error(`HTTP ${res.status}: ${msg}`)
      }

      const data = await res.json()
      setResponseText(data?.response ?? '')
      const list = Array.isArray(data?.products) ? data.products.map(toUIProduct) : []
      setProducts(list)
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        setError('Request timed out. Check backend URL and network.')
      } else {
        setError('Error connecting to backend.')
      }
    } finally {
      setLoading(false)
    }
  }, [message])

  // Navigation handlers
  const handleProductClick = useCallback((product: Product) => {
    setSelectedProduct(product)
    setShowProductPage(true)
  }, [])

  const handleBackFromProduct = useCallback(() => {
    setShowProductPage(false)
    setSelectedProduct(null)
  }, [])

  const handleAddToCart = useCallback((product: Product, quantity: number) => {
    // TODO: Implement add to cart functionality
    console.log('Adding to cart:', { product, quantity })
    // You can show a success message or update cart state here
  }, [])

  const handleBuyNow = useCallback((product: Product, quantity: number) => {
    // TODO: Implement buy now functionality
    console.log('Buy now:', { product, quantity })
    // You can navigate to checkout or payment flow here
  }, [])

  // Show product page if selected
  if (showProductPage && selectedProduct) {
    return (
      <ProductPage
        product={selectedProduct}
        onBack={handleBackFromProduct}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />
    )
  }

  // Main shop page
  return (
    <view className="SafeArea">
      <view className="Background" />

      <scroll-view 
        className="Shop"
        style={{
          height: '100vh'
        }}
        scroll-y={true}
      >
        {/* Header */}
        <view className="Header">
          <view className="Header__brand">
            <image src={tiktokLogo} className="Header__logo" />
            <text className="Header__title">TikTok Shop</text>
          </view>
          <view
            className="Header__clear"
            bindtap={() => { setMessage(''); setProducts(DEFAULT_CATALOGUE); setResponseText(''); setError(null); }}
          >
            <text className="Header__clearText">Clear</text>
          </view>
        </view>

        {/* Search bar */}
        <view className="SearchBar">
          <view className="SearchInputContainer">
            <input
              className="SearchInput"
              value={message}
              placeholder="Type your query..."
              bindinput={onInput}
            />
          </view>

          <view className="SearchButton" bindtap={handleSubmit}>
            <text className="SearchButton__text">Search</text>
          </view>
        </view>

        {/* Loading / Error / AI Response */}
        {loading && (
          <view className="Status">
            <text className="Status__text">Loading…</text>
          </view>
        )}

        {error && (
          <view className="Status Status--error">
            <text className="Status__text">{error}</text>
          </view>
        )}

        {responseText ? (
          <view className="Response">
            <text className="Response__label">AI Response</text>
            <text className="Response__text">{responseText}</text>
          </view>
        ) : null}

        {/* Products grid */}
        <view className="Grid">
          {products.length === 0 && responseText && !loading ? (
            <view className="Empty">
              <text className="Empty__text">No products found.</text>
            </view>
          ) : (
            products.map((p) => (
              <view key={p.id} className="Grid__col">
                <view className="Card" bindtap={() => handleProductClick(p)}>
                  <image src={p.img || 'https://picsum.photos/seed/lynx/600/400'} className="Card__image" />
                  <view className="Card__body">
                    <text className="Card__title">{truncate(p.title, 48)}</text>
                    <text className="Card__price">${Number(p.price).toFixed(2)}</text>
                    {p.shipping ? (
                      <text className="Card__shipping">Shipping: {p.shipping}</text>
                    ) : null}
                    {Array.isArray(p.tags) && p.tags.length > 0 ? (
                      <view className="Card__tags">
                        {p.tags.slice(0, VISIBLE_TAGS).map((t: string) => (
                          <view key={t} className="Tag">
                            <text className="Tag__text">{truncate(t, 12)}</text>
                          </view>
                        ))}
                      </view>
                    ) : null}
                    <view className="Card__cta" bindtap={() => handleAddToCart(p, 1)}>
                      <text className="Card__ctaText">Add to cart</text>
                    </view>
                  </view>
                </view>
              </view>
            ))
          )}
        </view>

        <view style={{ height: '80px' }} />
      </scroll-view>
    </view>
  )
}
