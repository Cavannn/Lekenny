// ProductPage.tsx
import { useState } from '@lynx-js/react'

type Product = {
  id: number
  title: string
  price: number
  tags: string[]
  img: string
  shipping: string
}

type ProductPageProps = {
  product: Product
  onBack: () => void
  onAddToCart: (product: Product, quantity: number) => void
  onBuyNow: (product: Product, quantity: number) => void
}

export default function ProductPage({ product, onBack, onAddToCart, onBuyNow }: ProductPageProps) {
  const [quantity, setQuantity] = useState(1)

  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(1, quantity + change)
    setQuantity(newQuantity)
  }

  const handleAddToCart = () => {
    onAddToCart(product, quantity)
  }

  const handleBuyNow = () => {
    onBuyNow(product, quantity)
  }

  return (
    <view className="ProductPage">
      {/* Header with back button */}
      <view className="ProductPage__header">
        <view className="ProductPage__backButton" bindtap={onBack}>
          <text className="ProductPage__backText">← Back</text>
        </view>
      </view>

      {/* Large product image - top half */}
      <view className="ProductPage__imageContainer">
        <image 
          src={product.img || 'https://picsum.photos/seed/lynx/600/400'} 
          className="ProductPage__image"
          mode="aspectFit"
        />
      </view>

      {/* Product details - bottom half */}
      <view className="ProductPage__details">
        <view className="ProductPage__info">
          <text className="ProductPage__title">{product.title}</text>
          <text className="ProductPage__price">${Number(product.price).toFixed(2)}</text>
          <text className="ProductPage__shipping">Shipping: {product.shipping}</text>
          
          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <view className="ProductPage__tags">
              {product.tags.map((tag, index) => (
                <view key={index} className="ProductPage__tag">
                  <text className="ProductPage__tagText">{tag}</text>
                </view>
              ))}
            </view>
          )}

          {/* Quantity selector */}
          <view className="ProductPage__quantityContainer">
            <text className="ProductPage__quantityLabel">Quantity:</text>
            <view className="ProductPage__quantitySelector">
              <view 
                className="ProductPage__quantityButton" 
                bindtap={() => handleQuantityChange(-1)}
              >
                <text className="ProductPage__quantityButtonText">-</text>
              </view>
              <text className="ProductPage__quantityValue">{quantity}</text>
              <view 
                className="ProductPage__quantityButton" 
                bindtap={() => handleQuantityChange(1)}
              >
                <text className="ProductPage__quantityButtonText">+</text>
              </view>
            </view>
          </view>
        </view>

        {/* Action buttons at bottom */}
        <view className="ProductPage__actions">
          <view className="ProductPage__addToCart" bindtap={handleAddToCart}>
            <text className="ProductPage__addToCartText">Add to Cart</text>
          </view>
          <view className="ProductPage__buyNow" bindtap={handleBuyNow}>
            <text className="ProductPage__buyNowText">Buy Now</text>
          </view>
        </view>
      </view>
    </view>
  )
}
