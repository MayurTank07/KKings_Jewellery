import React from "react";
import "./ProductCard.css";
const ProductCard = ({product}) => {
  return (
    <div className="productCard max-w-60 m-3 transition-all cursor-pointer hover:scale-105">
      {/* Image */}
      <div className="h-80">
        <img
          className="h-full w-full object-cover object-left-top"
          src={product.image}
          alt="Bracelet Broad"
        />
      </div>

      {/* Text */}
      <div className="textPart bg-white p-3 space-y-1">
        <p className="font-bold opacity-60">{product.brand}</p>
        <p>{product.title}</p>

        {/* Price */}
        <div className="flex items-center space-x-2">
          <p className="font-semibold">{product.price}</p>
          <p className="line-through opacity-50">{product.selling_price}</p>
          <p className="text-red-600 font-semibold">{product.color}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;