"use client";

import { Product } from "@/lib/types";
import { urlFor } from "@/lib/sanity.client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Button from "@/components/ui/Button";
import ProductCard from "@/components/ui/ProductCard";
import { Icon } from "@iconify/react";
import SectionHeader from "@/components/layout/SectionHeader";
import ProductCheckoutModal from "@/components/ui/ProductCheckoutModal";

interface ProductDetailClientProps {
    product: Product;
    relatedProducts: Product[];
}

export default function ProductDetailClient({
    product,
    relatedProducts,
}: ProductDetailClientProps) {
    const [selectedSize, setSelectedSize] = useState<string>("");
    const [selectedImage, setSelectedImage] = useState(product.image);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [sizeError, setSizeError] = useState(false);

    const allImages = [
        product.image,
        ...(product.otherImages || []),
    ].filter(Boolean);

    return (
        <main className="bg-[#F1EFF6] min-h-screen pt-16">
            <div className="container-wide py-8 md:py-10 lg:py-14">
                {/* Go Back */}
                <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 text-neutral-500 hover:text-primary transition mb-6"
                >
                    <Icon icon="mdi:arrow-left" className="w-5 h-5" />
                    <span className="text-sm">Go back</span>
                </Link>

                {/* Product Detail */}
                <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 xl:gap-16">
                    {/* LEFT — Product Info */}
                    <div className="flex flex-col max-w-[460px]">
                        <h1 className="text-[35px] md:text-[36px] font-semibold text-neutral-900 mb-2">
                            {product.displayTitle || product.name}
                        </h1>

                        <p className="text-[20px] md:text-[24px] font-semibold text-primary mb-4">
                            GH₵ {product.price.toFixed(2)}
                        </p>

                        {product.description && (
                            <p className="text-[14px] text-neutral-500 leading-relaxed mb-6">
                                {product.description}
                            </p>
                        )}

                        {/* Sizes */}
                        {product.sizes && product.sizes.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-[11px] font-bold text-neutral-900 uppercase tracking-wider mb-3">
                                    Available Sizes
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`px-4 py-2 text-[13px] rounded-md border transition ${selectedSize === size
                                                ? "bg-primary border-primary text-white"
                                                : "border-neutral-300 text-neutral-700 hover:border-primary"
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {sizeError && (
                            <p className="text-red-500 text-sm font-bold mt-2">Please select a size before purchasing.</p>
                        )}

                        <Button
                            variant="primary"
                            size="lg"
                            fullWidth
                            buttonClassName="mt-6"
                            onClick={() => {
                                if (product.sizes && product.sizes.length > 0 && !selectedSize) {
                                    setSizeError(true);
                                    return;
                                }
                                setSizeError(false);
                                setIsCheckoutOpen(true);
                            }}
                        >
                            BUY
                        </Button>
                    </div>

                    {/* RIGHT — Images */}
                    <div className="flex gap-4">
                        {/* Main Image */}
                        <div className="relative flex-1 aspect-square bg-neutral-100 rounded-xl overflow-hidden">
                            <Image
                                src={urlFor(selectedImage).width(700).height(700).url()}
                                alt={product.name}
                                fill
                                priority
                                className="object-contain p-4"
                            />
                        </div>

                        {/* Thumbnails */}
                        {allImages.length > 1 && (
                            <div className="flex flex-col gap-3 w-[88px]">
                                {allImages.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(img)}
                                        className={`relative w-full h-[96px] rounded-lg overflow-hidden border-2 transition ${selectedImage === img
                                            ? "border-primary"
                                            : "border-transparent hover:border-neutral-300"
                                            }`}
                                    >
                                        <Image
                                            src={urlFor(img).width(120).height(160).url()}
                                            alt={`${product.name} view ${index + 1}`}
                                            fill
                                            className="object-contain p-2"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <section className="mt-20">
                        <div className="mb-10">
                            <SectionHeader
                                title="YOU MIGHT ALSO LIKE"
                                subtext="Discover the other collections and exclusive items from our store"
                                showLine
                                uppercase
                            />
                        </div>

                        <div className="flex flex-wrap items-stretch justify-center gap-8 lg:gap-12">
                            {relatedProducts.map((relatedProduct) => (
                                <div key={relatedProduct._id} className="w-full max-w-[300px] xl:max-w-[350px]">
                                    <ProductCard product={relatedProduct} />
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            <ProductCheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                productName={product.displayTitle || product.name}
                productId={product._id}
                price={product.price}
                selectedSize={selectedSize}
            />
        </main>
    );
}
