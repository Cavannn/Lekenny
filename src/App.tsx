import { useState, useCallback, useEffect } from '@lynx-js/react'

import './App.css'
import tiktokLogo from './assets/tiktok-logo-tikok-icon-transparent-tikok-app-logo-free-png.webp'

type Product = {
  id: number
  title: string
  price: number
  tags: string[]
  img: string
}

/** ----------------------------------------------------------------------------
 * Backend endpoint
 * In simulator-only workflows, 127.0.0.1:8000 can work.
 * For BROWSER or OTHER DEVICE testing, replace with your machine's LAN IP.
 * Example: http://192.168.1.23:8000/chat
 * ---------------------------------------------------------------------------*/
const BACKEND_URL = 'http://172.20.10.2:8000/chat' // TODO: change to your LAN IP when testing from web/devices

/** ----------------------------------------------------------------------------
 * Optional local images (since backend doesn't return image URLs)
 * Replace these with your actual assets if you have them.
 * If you don't, you can leave them empty and use placeholders instead.
 * ---------------------------------------------------------------------------*/
// Example imports (uncomment and add your files):
// import hoodie from './assets/hoodie.png'
// import tiktokCap from './assets/tiktok-cap.png'
// import waterBottleM from './assets/water-bottle-medium.png'
// import waterBottleS from './assets/water-bottle-small.png'
// import waterBottleL from './assets/water-bottle-large.png'

const productImages: Record<number, string> = {
  // 1: hoodie,
  // 2: tiktokCap,
  // 5: waterBottleM,
  // 6: waterBottleS,
  // 7: waterBottleL,
}

/** Parses "$29.99" -> 29.99, "29.99" -> 29.99, "29" -> 29 */
function parsePrice(maybe: unknown): number {
  if (typeof maybe === 'number') return maybe
  if (typeof maybe !== 'string') return 0
  const cleaned = maybe.replace(/[^0-9.]/g, '')
  const n = Number(cleaned)
  return Number.isFinite(n) ? n : 0
}

/** Normalize backend product { id, name, price: "$..", colours, description } -> UI Product */
function toUIProduct(raw: any): Product {
  const id = Number(raw?.id ?? 0)
  const title = String(raw?.title ?? raw?.name ?? 'Untitled')
  const price = parsePrice(raw?.price)
  const tags: string[] = []
  if (raw?.colours) tags.push(...String(raw.colours).split(',').map((s: string) => s.trim()))
  if (raw?.description) tags.push(...String(raw.description).split(',').map((s: string) => s.trim()))
  const img = String(raw?.img ?? raw?.image_url ?? productImages[id] ?? '')
  return { id, title, price, tags, img }
}

export default function App({ onRender }: { onRender?: () => void }) {
  const [message, setMessage] = useState('')
  const [responseText, setResponseText] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { onRender?.() }, [onRender])

  // Lynx input event shape: e.detail.value
  const onInput = useCallback((e: any) => {
    setMessage(e?.detail?.value ?? '')
  }, [])

  const handleSubmit = useCallback(async () => {
    if (!message.trim()) return
    setLoading(true)
    setError(null)
    setResponseText('')
    setProducts([])

    try {
      const res = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      })

      if (!res.ok) {
        const msg = await res.text().catch(() => res.statusText)
        throw new Error(`HTTP ${res.status}: ${msg}`)
      }

      const data = await res.json()
      setResponseText(data?.response ?? '')
      const list = Array.isArray(data?.products) ? data.products.map(toUIProduct) : []
      setProducts(list)
    } catch (err: any) {
      setError('Error connecting to backend.')
    } finally {
      setLoading(false)
    }
  }, [message])

  return (
    <view className="SafeArea">
      {/* Background slab */}
      <view className="Background" />

      <view className="Shop">
        {/* Header */}
        <view className="Header">
          <view className="Header__brand">
            <image src={tiktokLogo} className="Header__logo" />
            <text className="Header__title">TikTok Shop</text>
          </view>
          <view
            className="Header__clear"
            bindtap={() => { setMessage(''); setProducts([]); setResponseText(''); setError(null); }}
          >
            <text className="Header__clearText">Clear</text>
          </view>
        </view>

        {/* Search bar - using display flex approach */}
        <view
          style={{
            marginTop: 12,
            width: '100%',
            height: 44,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          }}
        >
          {/* Search input container */}
          <view
            style={{
              flex: 1,
              height: 44,
              borderRadius: 12,
              borderColor: '#2a2a2a',
              borderWidth: 1,
              backgroundColor: '#171717',
              paddingLeft: 12,
              paddingRight: 12,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <input
              value={message}
              placeholder="Type your query..."
              bindinput={onInput}
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'transparent',
                color: '#ffffff !important',
                fontSize: 14,
                placeholderTextColor: '#ffffff !important',
                '--placeholder-color': '#ffffff'
              }}
              placeholderStyle={{
                color: '#ffffff'
              }}
            />
          </view>

          {/* Search button */}
          <view
            bindtap={handleSubmit}
            style={{
              width: 70,
              height: 44,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 8,
              backgroundColor: '#ffffff',
              borderWidth: 1,
              borderColor: '#000000',
            }}
          >
            <text style={{ fontWeight: '700', color: '#041016', fontSize: 12 }}>Search</text>
          </view>
        </view>

        {/* Loading / Error / AI Response */}
        {loading && (
          <view className="Filters" style={{ marginTop: '12px' }}>
            <text className="Filters__label">Loading…</text>
          </view>
        )}

        {error && (
          <view className="Filters" style={{ marginTop: '12px' }}>
            <text className="Filters__label">{error}</text>
          </view>
        )}

        {responseText ? (
          <view className="Filters" style={{ marginTop: '12px' }}>
            <text className="Filters__label">AI Response</text>
            <text style={{ color: '#eaeaea' }}>{responseText}</text>
          </view>
        ) : null}

        {/* Products grid (2 per row) */}
        <view className="Grid" style={{ marginTop: '12px' }}>
          {products.length === 0 && !loading && !responseText ? (
            <view className="Empty">
              <text className="Empty__text">Type a query and tap Search.</text>
            </view>
          ) : products.length === 0 && responseText && !loading ? (
            <view className="Empty">
              <text className="Empty__text">No products found.</text>
            </view>
          ) : (
            products.map((p) => (
              <view key={p.id} className="Grid__col" style={{ flexBasis: '49%' }}>
                <view className="Card">
                  {/* If no image provided, you can show a gray block or placeholder */}
                  <image src={p.img || 'https://picsum.photos/seed/lynx/600/400'} className="Card__image" />
                  <view className="Card__body">
                    <text className="Card__title">{p.title}</text>
                    <text className="Card__price">${Number(p.price).toFixed(2)}</text>
                    {Array.isArray(p.tags) && p.tags.length > 0 ? (
                      <view className="Card__tags">
                        {p.tags.map((t: string) => (
                          <view key={t} className="Tag"><text className="Tag__text">{t}</text></view>
                        ))}
                      </view>
                    ) : null}
                    <view className="Card__cta" bindtap={() => { /* TODO: add-to-cart */ }}>
                      <text className="Card__ctaText">Add to cart</text>
                    </view>
                  </view>
                </view>
              </view>
            ))
          )}
        </view>

        <view style={{ height: '24px' }} />
      </view>
    </view>
  )
}
