/* eslint-disable @next/next/no-img-element */

import { ApiProduct } from "@/store/cart-store";
import { Plus } from "lucide-react";

interface ProductCardProps {
    product: ApiProduct;
    onAddToCart: (product: ApiProduct) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
    return (
        <article className="group overflow-hidden rounded-4xl border border-slate-200 max-w-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl grid grid-cols-[auto_1fr]">
            <div className="relative  max-w-20 flex items-center md:max-w-30 justify-center w-full lg:max-w-40">
                <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="object-contain rounded-sm transition  duration-300  "
                />
            </div>

            <div className="p-2 bg-linear-to-br from-emerald-100 via-lime-50 to-yellow-50 flex flex-col items-center justify-around     gap-2">
                <div className="flex items-start justify-between ">
                    <h3 className="text-xs font-extrabold text-slate-900">
                        {product.name}
                    </h3>
                </div>
                <div>
                    <p className="text-xs  text-slate-600">
                        {product.description}
                    </p>

                    <p className=" text-xs font-semibold text-emerald-700">
                        {product.presentation}
                    </p>

                    <p className=" text-xs font-extrabold text-slate-900 flex justify-between items-center">

                        <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-700">
                            Disponible
                        </span>
                    </p>
                </div>

                <div className=" flex  justify-between items-center gap-3">
                    <div>

                        <button
                            onClick={() => onAddToCart(product)}
                            className="rounded-full bg-emerald-700 p-1 text-xs font-bold text-white transition hover:bg-emerald-800 flex cursor-pointer"
                        >
                            <Plus />
                            <span className="text-xs font-extrabold  flex justify-between items-center">
                                ${product.price.toLocaleString("es-CO")}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
}