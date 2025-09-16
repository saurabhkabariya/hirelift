'use client';

import { motion } from 'framer-motion';
import { Check, Crown, Star } from 'lucide-react';

export default function PricingCard({ 
  plan, 
  index, 
  onUpgrade, 
  isPopular = false,
  showComparison = false 
}) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1
      }
    }
  };

  const buttonVariants = {
    hover: { scale: 1.02, y: -2 },
    tap: { scale: 0.98 }
  };

  return (
    <motion.article
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
        isPopular 
          ? 'border-blue-500 ring-2 ring-blue-200' 
          : 'border-gray-200 hover:border-gray-300'
      } ${plan.disabled ? 'opacity-75' : ''}`}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
            <Crown className="w-4 h-4" />
            Most Popular
          </div>
        </div>
      )}

      {/* Sale Badge */}
      {plan.onSale && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
          {plan.salePercentage}% OFF
        </div>
      )}

      <div className="p-6 sm:p-8">
        {/* Plan Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            {plan.icon && (
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isPopular ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                <plan.icon className={`w-6 h-6 ${
                  isPopular ? 'text-blue-600' : 'text-gray-600'
                }`} />
              </div>
            )}
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
          
          {/* Price Display */}
          <div className="mb-3">
            {plan.onSale && plan.originalPrice ? (
              <div className="space-y-1">
                <div className="text-lg text-gray-500 line-through">
                  {plan.originalPrice}
                  {plan.originalPrice !== '₹0' && <span className="text-sm ml-1">{plan.billing}</span>}
                </div>
                <div className="text-3xl font-bold text-green-600">
                  {plan.price}
                  {plan.price !== '₹0' && <span className="text-lg font-normal ml-1">{plan.billing}</span>}
                </div>
              </div>
            ) : (
              <div className="text-3xl font-bold text-gray-900">
                {plan.price}
                {plan.price !== '₹0' && <span className="text-lg font-normal ml-1">{plan.billing}</span>}
              </div>
            )}
          </div>
          
          <p className="text-gray-600 text-sm">{plan.description}</p>
        </div>

        {/* Features List */}
        <div className="space-y-3 mb-8">
          {plan.features.map((feature, featureIndex) => (
            <div key={featureIndex} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700 text-sm">{feature}</span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={() => !plan.disabled && onUpgrade && onUpgrade(plan)}
          disabled={plan.disabled || plan.comingSoon}
          className={`w-full py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200 ${
            plan.disabled
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
              : plan.comingSoon
              ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
              : isPopular
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
              : 'bg-gray-900 text-white hover:bg-gray-800 shadow-md hover:shadow-lg'
          }`}
        >
          {plan.buttonText}
        </motion.button>

        {/* Additional Info */}
        {plan.comingSoon && (
          <p className="text-center text-xs text-gray-500 mt-2">
            Coming Soon
          </p>
        )}
      </div>
    </motion.article>
  );
}
