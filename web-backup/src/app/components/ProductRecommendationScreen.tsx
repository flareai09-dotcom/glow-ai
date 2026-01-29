import { motion } from 'motion/react';
import { ChevronLeft, Star, ShoppingCart, Filter, Heart, ExternalLink } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

interface ProductRecommendationScreenProps {
  onBack: () => void;
}

const products = [
  {
    name: 'Minimalist Niacinamide 10% Serum',
    brand: 'Minimalist',
    price: 349,
    rating: 4.5,
    reviews: 12500,
    category: 'Serum',
    benefits: ['Dark spots', 'Acne marks', 'Oil control'],
    image: 'https://images.unsplash.com/photo-1643379850623-7eb6442cd262?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2luY2FyZSUyMHNlcnVtJTIwYm90dGxlfGVufDF8fHx8MTc2OTI5Nzk4M3ww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    name: 'Plum Green Tea Face Wash',
    brand: 'Plum',
    price: 225,
    rating: 4.3,
    reviews: 8900,
    category: 'Cleanser',
    benefits: ['Oil control', 'Deep cleansing', 'Gentle'],
    image: 'https://images.unsplash.com/photo-1651740896477-467ea46b4fe5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2luY2FyZSUyMG5hdHVyYWwlMjBwcm9kdWN0c3xlbnwxfHx8fDE3NjkzNjc0MzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    name: 'Dot & Key Watermelon Gel',
    brand: 'Dot & Key',
    price: 399,
    rating: 4.6,
    reviews: 6700,
    category: 'Moisturizer',
    benefits: ['Hydration', 'Oil-free', 'Lightweight'],
    image: 'https://images.unsplash.com/photo-1620917669809-1af0497965de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwc2tpbmNhcmUlMjByb3V0aW5lfGVufDF8fHx8MTc2OTQwNTc5NXww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    name: 'Re\'equil Sunscreen SPF 50',
    brand: 'Re\'equil',
    price: 495,
    rating: 4.7,
    reviews: 15200,
    category: 'Sunscreen',
    benefits: ['PA++++', 'No white cast', 'Lightweight'],
    image: 'https://images.unsplash.com/photo-1643379850623-7eb6442cd262?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2luY2FyZSUyMHNlcnVtJTIwYm90dGxlfGVufDF8fHx8MTc2OTI5Nzk4M3ww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    name: 'Derma Co 2% Salicylic Acid',
    brand: 'Derma Co',
    price: 399,
    rating: 4.4,
    reviews: 9300,
    category: 'Treatment',
    benefits: ['Acne control', 'Pore refining', 'Exfoliation'],
    image: 'https://images.unsplash.com/photo-1651740896477-467ea46b4fe5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2luY2FyZSUyMG5hdHVyYWwlMjBwcm9kdWN0c3xlbnwxfHx8fDE3NjkzNjc0MzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    name: 'WOW Aloe Vera Gel',
    brand: 'WOW Skin Science',
    price: 249,
    rating: 4.2,
    reviews: 11000,
    category: 'Treatment',
    benefits: ['Soothing', 'Hydrating', 'Multi-purpose'],
    image: 'https://images.unsplash.com/photo-1684913127590-54e08d09a34b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbG9lJTIwdmVyYSUyMHBsYW50fGVufDF8fHx8MTc2OTM3NDczMXww&ixlib=rb-4.1.0&q=80&w=1080',
  },
];

export function ProductRecommendationScreen({ onBack }: ProductRecommendationScreenProps) {
  return (
    <div className="min-h-full w-full bg-[#FAF7F5] pb-6">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="flex items-center px-6 py-4">
          <button onClick={onBack} className="mr-4">
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800 flex-1">Recommended Products</h1>
          <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
            <Filter className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {/* Info banner */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gradient-to-r from-[#14B8A6]/10 to-[#10B981]/10 rounded-2xl p-4 mb-6"
        >
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Personalized for you:</span> Based on your skin analysis and concerns
          </p>
        </motion.div>

        {/* Category tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {['All', 'Cleanser', 'Serum', 'Moisturizer', 'Sunscreen', 'Treatment'].map((cat, i) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${i === 0
                  ? 'bg-[#14B8A6] text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products grid */}
        <div className="space-y-4">
          {products.map((product, index) => (
            <motion.div
              key={product.name}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-3xl shadow-sm overflow-hidden"
            >
              <div className="flex gap-4 p-4">
                {/* Product image */}
                <div className="w-28 h-28 rounded-2xl bg-gray-100 overflow-hidden flex-shrink-0">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
                      <h3 className="font-semibold text-gray-800 text-sm leading-tight mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                    </div>
                    <button className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center flex-shrink-0 ml-2">
                      <Heart className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span className="text-xs font-semibold text-gray-700">{product.rating}</span>
                    </div>
                    <span className="text-xs text-gray-400">({product.reviews.toLocaleString()})</span>
                  </div>

                  {/* Benefits */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {product.benefits.map((benefit) => (
                      <span
                        key={benefit}
                        className="px-2 py-0.5 bg-[#14B8A6]/10 text-[#14B8A6] rounded-full text-xs"
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>

                  {/* Price and CTA */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-end gap-1">
                      <span className="text-xl font-bold text-gray-800">₹{product.price}</span>
                    </div>
                    <Button
                      size="sm"
                      className="h-9 px-4 rounded-xl bg-gradient-to-r from-[#14B8A6] to-[#10B981] hover:shadow-md transition-all text-white text-xs"
                    >
                      <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>

              {/* Quick view link */}
              <div className="px-4 pb-3 pt-1">
                <button className="text-xs text-[#14B8A6] font-medium flex items-center gap-1 hover:underline">
                  View full details
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Info footer */}
        <div className="mt-6 bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-gray-600 text-center leading-relaxed">
            💡 All products are curated specifically for Indian skin types and climate. Prices are budget-friendly and verified.
          </p>
        </div>
      </div>
    </div>
  );
}
