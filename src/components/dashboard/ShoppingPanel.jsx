"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import Toast from "@/components/Toast/Toast";
import { ShopDataSkeleton } from "@/components/dashboard/LoadingSkeleton";
import { useShoppingCart } from "@/components/dashboard/ShoppingCartProvider";
import { cartLineKey } from "@/lib/shop/cartStorage";
import {
  SHOPPING_TABS,
  shoppingTabHref,
} from "@/lib/shoppingNav";
import styles from "./Dashboard.module.css";

const PAYMENT_LABELS = {
  cash_on_delivery: "Cash on delivery",
  mobile_banking: "Mobile banking",
  card: "Debit / credit card",
};

function orderStatusLabel(status) {
  return status.replaceAll("_", " ");
}

function paymentLabel(method) {
  return PAYMENT_LABELS[method] ?? method ?? "—";
}

const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "completed",
];

const money = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
});

function formatDate(iso) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso ?? "—";
  }
}

function genderLabel(gender) {
  if (gender === "gents") return "Gents";
  if (gender === "female") return "Female";
  return gender;
}

async function apiRequest(path, { method = "GET", body } = {}) {
  const res = await fetch(`/api/v1${path}`, {
    method,
    credentials: "include",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  let payload;
  try {
    payload = await res.json();
  } catch {
    payload = {};
  }

  if (!res.ok) {
    throw new Error(payload.error || "Something went wrong.");
  }

  return payload.data;
}

async function uploadProductImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/v1/uploads/product-image", {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  let payload;
  try {
    payload = await res.json();
  } catch {
    payload = {};
  }

  if (!res.ok) {
    throw new Error(payload.error || "Image upload failed.");
  }

  return payload.data.url;
}

function FavoriteHeartButton({ productId, isFavorite, onToggle, className }) {
  const label = isFavorite
    ? "Remove from favorites"
    : "Add to favorites";

  return (
    <button
      type="button"
      className={
        className
          ? className
          : isFavorite
            ? `${styles.shopFavoriteHeart} ${styles.shopFavoriteHeartActive}`
            : styles.shopFavoriteHeart
      }
      aria-pressed={isFavorite}
      aria-label={label}
      title={label}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onToggle(productId);
      }}
    >
      <svg
        className={styles.shopFavoriteHeartIcon}
        viewBox="0 0 24 24"
        aria-hidden
      >
        {isFavorite ? (
          <path
            fill="currentColor"
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          />
        ) : (
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          />
        )}
      </svg>
    </button>
  );
}

function ProductCard({
  product,
  isFavorite,
  isAdmin,
  onOpen,
  onQuickAdd,
  onToggleFavorite,
  onDeleteProduct,
}) {
  return (
    <article className={styles.shopCardWrap}>
      <FavoriteHeartButton
        productId={product.id}
        isFavorite={isFavorite}
        onToggle={onToggleFavorite}
      />
      <button
        type="button"
        className={styles.shopCard}
        onClick={() => onOpen(product)}
      >
        <div className={styles.shopCardMedia}>
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.imageUrl} alt="" className={styles.shopCardImg} />
          ) : (
            <span className={styles.shopCardPlaceholder}>No image</span>
          )}
        </div>
        <div className={styles.shopCardBody}>
          <h3 className={styles.shopCardTitle}>{product.name}</h3>
          <p className={styles.shopCardMeta}>{genderLabel(product.gender)}</p>
          <div className={styles.shopCardPrices}>
            {product.hasDiscount ? (
              <>
                <span className={styles.shopPriceSale}>
                  {money.format(product.finalPrice)}
                </span>
                <span className={styles.shopPriceWas}>
                  {money.format(product.price)}
                </span>
              </>
            ) : (
              <span className={styles.shopPriceSale}>
                {money.format(product.price)}
              </span>
            )}
          </div>
        </div>
      </button>
      {isAdmin ? (
        <button
          type="button"
          className={styles.shopDeleteProductBtn}
          onClick={() => onDeleteProduct(product)}
        >
          Delete product
        </button>
      ) : null}
      <button
        type="button"
        className={styles.shopQuickAddBtn}
        onClick={() => onQuickAdd(product)}
      >
        Add to cart
      </button>
    </article>
  );
}

function ProductDetailPanel({
  product,
  isFavorite,
  onClose,
  onToggleFavorite,
  onAddToCart,
}) {
  const [size, setSize] = useState(product.sizes[0] ?? "");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setSize(product.sizes[0] ?? "");
    setQuantity(1);
  }, [product]);

  const handleAdd = () => {
    onAddToCart({
      productId: product.id,
      name: product.name,
      gender: product.gender,
      size,
      quantity: Number(quantity),
      unitPrice: product.finalPrice,
    });
  };

  return (
    <div className={styles.shopDetailBackdrop} role="presentation">
      <div
        className={styles.shopDetailToast}
        role="dialog"
        aria-labelledby="shop-detail-title"
        aria-modal="true"
      >
        <div className={styles.shopDetailHeader}>
          <h2 id="shop-detail-title" className={styles.shopDetailTitle}>
            {product.name}
          </h2>
          <button
            type="button"
            className={styles.shopDetailClose}
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {product.imageUrl ? (
          <div className={styles.shopDetailMedia}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.imageUrl}
              alt=""
              className={styles.shopDetailImg}
            />
          </div>
        ) : null}

        <dl className={styles.shopDetailList}>
          <div>
            <dt>Category</dt>
            <dd>{genderLabel(product.gender)}</dd>
          </div>
          <div>
            <dt>Price</dt>
            <dd>
              {product.hasDiscount ? (
                <>
                  {money.format(product.finalPrice)}{" "}
                  <span className={styles.shopPriceWas}>
                    {money.format(product.price)}
                  </span>
                </>
              ) : (
                money.format(product.price)
              )}
            </dd>
          </div>
          {product.discountPrice != null && product.hasDiscount ? (
            <div>
              <dt>Discount price</dt>
              <dd>{money.format(product.discountPrice)}</dd>
            </div>
          ) : null}
          <div>
            <dt>Sizes</dt>
            <dd>{product.sizes.join(", ") || "—"}</dd>
          </div>
          {product.description ? (
            <div>
              <dt>Description</dt>
              <dd>{product.description}</dd>
            </div>
          ) : null}
        </dl>

        <div className={styles.shopDetailActions}>
          <FavoriteHeartButton
            productId={product.id}
            isFavorite={isFavorite}
            onToggle={onToggleFavorite}
            className={`${styles.shopFavoriteHeart} ${styles.shopFavoriteHeartDetail} ${isFavorite ? styles.shopFavoriteHeartActive : ""}`}
          />
          <button
            type="button"
            className={styles.shopFavoriteBtn}
            onClick={() => onToggleFavorite(product.id)}
          >
            {isFavorite ? "Remove from favorites" : "Add to favorites"}
          </button>
        </div>

        <div className={styles.shopCheckoutForm}>
          <p className={styles.shopCheckoutHeading}>Add to cart</p>
          <label className={styles.shopField}>
            <span>Size</span>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              required
            >
              {product.sizes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className={styles.shopField}>
            <span>Quantity</span>
            <input
              type="number"
              min={1}
              max={99}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </label>
          <button
            type="button"
            className={styles.shopPrimaryBtn}
            onClick={handleAdd}
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ShoppingPanel({ userRole, activeTab = "products" }) {
  const router = useRouter();
  const isAdmin = userRole === "admin";
  const tab = activeTab;
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailProduct, setDetailProduct] = useState(null);
  const [ordering, setOrdering] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [toast, setToast] = useState(null);
  const {
    cart,
    cartCount,
    cartSubtotal,
    addToCart: pushCartLine,
    removeCartLine,
    updateCartQuantity,
    clearCart,
  } = useShoppingCart();
  const [checkoutPhone, setCheckoutPhone] = useState("");
  const [checkoutAddress, setCheckoutAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");

  const [addForm, setAddForm] = useState({
    name: "",
    description: "",
    gender: "gents",
    price: "",
    discountPrice: "",
    sizes: "S, M, L, XL",
    imageUrl: "",
  });
  const [savingProduct, setSavingProduct] = useState(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState(null);

  const favoriteSet = useMemo(
    () => new Set(favoriteIds),
    [favoriteIds],
  );

  const loadProducts = useCallback(async () => {
    const data = await apiRequest("/products");
    setProducts(data.products ?? []);
  }, []);

  const loadOrders = useCallback(async () => {
    const data = await apiRequest("/orders");
    setOrders(data.orders ?? []);
  }, []);

  const loadFavorites = useCallback(async () => {
    const data = await apiRequest("/favorites");
    setFavoriteProducts(data.products ?? []);
    setFavoriteIds(data.favoriteIds ?? []);
  }, []);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([loadProducts(), loadOrders(), loadFavorites()]);
    } catch (err) {
      setToast({
        variant: "error",
        message: err instanceof Error ? err.message : "Failed to load shop data.",
      });
    } finally {
      setLoading(false);
    }
  }, [loadFavorites, loadOrders, loadProducts]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  useEffect(() => {
    return () => {
      if (localPreview) {
        URL.revokeObjectURL(localPreview);
      }
    };
  }, [localPreview]);

  const imagePreviewSrc = localPreview || addForm.imageUrl.trim() || null;

  const clearProductImage = () => {
    if (localPreview) {
      URL.revokeObjectURL(localPreview);
      setLocalPreview(null);
    }
    setAddForm((f) => ({ ...f, imageUrl: "" }));
  };

  const handleImageFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setToast({ variant: "error", message: "Please choose an image file." });
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setToast({ variant: "error", message: "Image must be 4 MB or smaller." });
      return;
    }

    if (localPreview) {
      URL.revokeObjectURL(localPreview);
    }
    setLocalPreview(URL.createObjectURL(file));
    setImageUploading(true);

    try {
      const url = await uploadProductImage(file);
      setAddForm((f) => ({ ...f, imageUrl: url }));
      setToast({ variant: "success", message: "Image uploaded." });
    } catch (err) {
      clearProductImage();
      setToast({
        variant: "error",
        message: err instanceof Error ? err.message : "Upload failed.",
      });
    } finally {
      setImageUploading(false);
    }
  };

  const addToCart = (line) => {
    pushCartLine(line);
    setToast({
      variant: "success",
      message: `${line.name} added to cart.`,
    });
  };

  const quickAddToCart = (product) => {
    const size = product.sizes[0];
    if (!size) {
      setToast({ variant: "error", message: "This product has no sizes." });
      return;
    }
    addToCart({
      productId: product.id,
      name: product.name,
      gender: product.gender,
      size,
      quantity: 1,
      unitPrice: product.finalPrice,
    });
  };

  const checkoutCart = async (event) => {
    event.preventDefault();
    if (cart.length === 0) {
      setToast({ variant: "error", message: "Your cart is empty." });
      return;
    }
    setOrdering(true);
    try {
      await apiRequest("/orders", {
        method: "POST",
        body: {
          phone: checkoutPhone,
          shippingAddress: checkoutAddress,
          paymentMethod,
          items: cart.map((line) => ({
            productId: line.productId,
            size: line.size,
            quantity: line.quantity,
          })),
        },
      });
      clearCart();
      setCheckoutPhone("");
      setCheckoutAddress("");
      setPaymentMethod("cash_on_delivery");
      router.push(shoppingTabHref("orders"));
      await loadOrders();
      setToast({
        variant: "success",
        message: "Order placed successfully. We will contact you soon.",
      });
    } catch (err) {
      setToast({
        variant: "error",
        message: err instanceof Error ? err.message : "Could not place order.",
      });
    } finally {
      setOrdering(false);
    }
  };

  const toggleFavorite = async (productId) => {
    const wasFavorite = favoriteSet.has(productId);
    try {
      if (wasFavorite) {
        const data = await apiRequest(`/favorites/${productId}`, {
          method: "DELETE",
        });
        setFavoriteIds(data.favoriteIds ?? []);
      } else {
        const data = await apiRequest("/favorites", {
          method: "POST",
          body: { productId },
        });
        setFavoriteIds(data.favoriteIds ?? []);
      }
      await loadFavorites();
      setToast({
        variant: "success",
        message: wasFavorite
          ? "Removed from favorites."
          : "Added to favorites.",
      });
    } catch (err) {
      setToast({
        variant: "error",
        message: err instanceof Error ? err.message : "Could not update favorite.",
      });
    }
  };

  const submitNewProduct = async (event) => {
    event.preventDefault();
    setSavingProduct(true);
    try {
      const data = await apiRequest("/products", {
        method: "POST",
        body: {
          name: addForm.name,
          description: addForm.description,
          gender: addForm.gender,
          price: Number(addForm.price),
          discountPrice: addForm.discountPrice
            ? Number(addForm.discountPrice)
            : null,
          sizes: addForm.sizes,
          imageUrl: addForm.imageUrl,
        },
      });
      setProducts((prev) => [data.product, ...prev]);
      setShowAddForm(false);
      clearProductImage();
      setAddForm({
        name: "",
        description: "",
        gender: "gents",
        price: "",
        discountPrice: "",
        sizes: "S, M, L, XL",
        imageUrl: "",
      });
      setToast({ variant: "success", message: "Product added." });
    } catch (err) {
      setToast({
        variant: "error",
        message: err instanceof Error ? err.message : "Could not add product.",
      });
    } finally {
      setSavingProduct(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    const snapshot = orders;
    setStatusUpdatingId(orderId);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o)),
    );

    try {
      const data = await apiRequest(`/orders/${orderId}`, {
        method: "PATCH",
        body: { status },
      });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? data.order : o)),
      );
      setToast({
        variant: "success",
        message: "Order status updated.",
      });
    } catch (err) {
      setOrders(snapshot);
      setToast({
        variant: "error",
        message: err instanceof Error ? err.message : "Could not update status.",
      });
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const removeOrder = async (orderId) => {
    if (!window.confirm("Remove this order from the system?")) {
      return;
    }
    setStatusUpdatingId(orderId);
    try {
      await apiRequest(`/orders/${orderId}`, { method: "DELETE" });
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      setToast({ variant: "success", message: "Order removed." });
    } catch (err) {
      setToast({
        variant: "error",
        message: err instanceof Error ? err.message : "Could not remove order.",
      });
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const deleteProduct = async (product) => {
    if (
      !window.confirm(
        `Delete "${product.name}" permanently? This cannot be undone.`,
      )
    ) {
      return;
    }
    try {
      await apiRequest(`/products/${product.id}`, { method: "DELETE" });
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      await loadFavorites();
      setToast({ variant: "success", message: "Product deleted." });
    } catch (err) {
      setToast({
        variant: "error",
        message: err instanceof Error ? err.message : "Could not delete product.",
      });
    }
  };

  const gridProducts =
    tab === "favorites" ? favoriteProducts : products;

  return (
    <div className={styles.shopPanel}>
      <header className={styles.shopHeader}>
        <div>
          <h1 className={styles.shopTitle}>Shopping</h1>
          <nav className={styles.shopTabs} aria-label="Shopping sections">
            {SHOPPING_TABS.map((item) => (
              <Link
                key={item.id}
                href={shoppingTabHref(item.id)}
                className={
                  tab === item.id
                    ? `${styles.shopTab} ${styles.shopTabActive}`
                    : styles.shopTab
                }
              >
                {item.id === "cart" && cartCount > 0
                  ? `Cart (${cartCount})`
                  : item.label}
              </Link>
            ))}
          </nav>
        </div>
        {isAdmin ? (
          <button
            type="button"
            className={styles.shopAddBtn}
            onClick={() => setShowAddForm((v) => !v)}
          >
            <span className={styles.shopAddIcon} aria-hidden>
              +
            </span>
            Add product
          </button>
        ) : null}
      </header>

      {showAddForm && isAdmin ? (
        <form className={styles.shopAdminForm} onSubmit={submitNewProduct}>
          <h2 className={styles.shopAdminFormTitle}>New product</h2>
          <div className={styles.shopAdminGrid}>
            <label className={styles.shopField}>
              <span>Name</span>
              <input
                value={addForm.name}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, name: e.target.value }))
                }
                required
              />
            </label>
            <label className={styles.shopField}>
              <span>Gender</span>
              <select
                value={addForm.gender}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, gender: e.target.value }))
                }
              >
                <option value="gents">Gents</option>
                <option value="female">Female</option>
              </select>
            </label>
            <label className={styles.shopField}>
              <span>Price</span>
              <input
                type="number"
                min={0}
                step="0.01"
                value={addForm.price}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, price: e.target.value }))
                }
                required
              />
            </label>
            <label className={styles.shopField}>
              <span>Discount price (optional)</span>
              <input
                type="number"
                min={0}
                step="0.01"
                value={addForm.discountPrice}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, discountPrice: e.target.value }))
                }
              />
            </label>
            <label className={`${styles.shopField} ${styles.shopFieldFull}`}>
              <span>Sizes (comma-separated)</span>
              <input
                value={addForm.sizes}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, sizes: e.target.value }))
                }
                required
              />
            </label>
            <div className={`${styles.shopFieldFull} ${styles.shopImageField}`}>
              <span className={styles.shopImageLabel}>Product image</span>
              <div className={styles.shopImageUploadRow}>
                {imagePreviewSrc ? (
                  <div className={styles.shopImagePreviewWrap}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagePreviewSrc}
                      alt="Product preview"
                      className={styles.shopImagePreview}
                    />
                  </div>
                ) : (
                  <div className={styles.shopImagePreviewPlaceholder}>
                    No image yet
                  </div>
                )}
                <div className={styles.shopImageControls}>
                  <label className={styles.shopImageFileBtn}>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className={styles.shopImageFileInput}
                      disabled={imageUploading}
                      onChange={handleImageFileChange}
                    />
                    {imageUploading ? "Uploading…" : "Upload image"}
                  </label>
                  {addForm.imageUrl || localPreview ? (
                    <button
                      type="button"
                      className={styles.shopImageClearBtn}
                      onClick={clearProductImage}
                      disabled={imageUploading}
                    >
                      Remove
                    </button>
                  ) : null}
                  <p className={styles.shopImageHint}>
                    JPEG, PNG, WebP, or GIF · max 4 MB
                  </p>
                  <label className={styles.shopField}>
                    <span>Or paste image URL</span>
                    <input
                      value={addForm.imageUrl}
                      onChange={(e) => {
                        if (localPreview) {
                          URL.revokeObjectURL(localPreview);
                          setLocalPreview(null);
                        }
                        setAddForm((f) => ({
                          ...f,
                          imageUrl: e.target.value,
                        }));
                      }}
                      placeholder="https://…"
                    />
                  </label>
                </div>
              </div>
            </div>
            <label className={`${styles.shopField} ${styles.shopFieldFull}`}>
              <span>Description</span>
              <textarea
                rows={3}
                value={addForm.description}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </label>
          </div>
          <div className={styles.shopAdminFormActions}>
            <button
              type="button"
              className={styles.filterClearBtn}
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.shopPrimaryBtn}
              disabled={savingProduct}
            >
              {savingProduct ? "Saving…" : "Save product"}
            </button>
          </div>
        </form>
      ) : null}

      {tab === "cart" ? (
        <div className={styles.shopCartLayout}>
          {cart.length === 0 ? (
            <div className={styles.placeholder}>
              <p>Your cart is empty. Add products from the catalog.</p>
              <Link href={shoppingTabHref("products")} className={styles.shopTab}>
                Browse products
              </Link>
            </div>
          ) : (
            <>
              <div className={styles.tableWrap}>
                <table className={styles.submissionsTable}>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Size</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Line total</th>
                      <th aria-label="Actions" />
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((line) => {
                      const key = cartLineKey(line.productId, line.size);
                      return (
                        <tr key={key}>
                          <td>
                            {line.name}
                            <span className={styles.shopCartMeta}>
                              {" "}
                              · {genderLabel(line.gender)}
                            </span>
                          </td>
                          <td>{line.size}</td>
                          <td>
                            <input
                              type="number"
                              min={1}
                              max={99}
                              className={styles.shopCartQty}
                              value={line.quantity}
                              onChange={(e) =>
                                updateCartQuantity(key, e.target.value)
                              }
                            />
                          </td>
                          <td>{money.format(line.unitPrice)}</td>
                          <td>
                            {money.format(line.unitPrice * line.quantity)}
                          </td>
                          <td>
                            <button
                              type="button"
                              className={styles.shopCartRemove}
                              onClick={() => removeCartLine(key)}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <form
                className={styles.shopCartCheckout}
                onSubmit={checkoutCart}
              >
                <h2 className={styles.shopAdminFormTitle}>Payment & delivery</h2>
                <p className={styles.shopCartSubtotal}>
                  Subtotal: <strong>{money.format(cartSubtotal)}</strong>
                </p>
                <label className={styles.shopField}>
                  <span>Phone number</span>
                  <input
                    type="tel"
                    value={checkoutPhone}
                    onChange={(e) => setCheckoutPhone(e.target.value)}
                    placeholder="+1 555 000 0000"
                    required
                    autoComplete="tel"
                  />
                </label>
                <label className={styles.shopField}>
                  <span>Receiving address</span>
                  <textarea
                    value={checkoutAddress}
                    onChange={(e) => setCheckoutAddress(e.target.value)}
                    placeholder="Street, city, postal code"
                    rows={3}
                    required
                  />
                </label>
                <label className={styles.shopField}>
                  <span>Payment method</span>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    {Object.entries(PAYMENT_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  type="submit"
                  className={styles.shopPrimaryBtn}
                  disabled={ordering}
                >
                  {ordering ? "Placing order…" : "Confirm payment & place order"}
                </button>
              </form>
            </>
          )}
        </div>
      ) : loading ? (
        <ShopDataSkeleton tab={tab} contentOnly />
      ) : tab === "orders" ? (
        <div className={styles.tableWrap}>
          <table className={styles.submissionsTable}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Items</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className={styles.tableEmpty}>
                    No orders yet.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>
                      <ul className={styles.shopOrderItems}>
                        {order.items.map((line, idx) => (
                          <li key={`${order.id}-${idx}`}>
                            {line.name} · {genderLabel(line.gender)} · size{" "}
                            {line.size} × {line.quantity}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td>{order.phone}</td>
                    <td className={styles.messageCell}>{order.shippingAddress}</td>
                    <td>{money.format(order.total)}</td>
                    <td>{paymentLabel(order.paymentMethod)}</td>
                    <td>
                      {isAdmin ? (
                        <div className={styles.shopOrderStatusCell}>
                          <select
                            className={`${styles.filterSelect} ${styles[`orderStatus_${order.status}`] ?? ""}`}
                            value={order.status}
                            disabled={statusUpdatingId === order.id}
                            onChange={(e) =>
                              updateOrderStatus(order.id, e.target.value)
                            }
                          >
                            {ORDER_STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {orderStatusLabel(s)}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            className={styles.shopRemoveOrderBtn}
                            disabled={statusUpdatingId === order.id}
                            onClick={() => removeOrder(order.id)}
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <span
                          className={`${styles.statusBadge} ${styles[`orderStatus_${order.status}`] ?? ""}`}
                        >
                          {orderStatusLabel(order.status)}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <>
          {gridProducts.length === 0 ? (
            <div className={styles.placeholder}>
              <p>
                {tab === "favorites"
                  ? "You have no favorite products yet."
                  : "No products available yet."}
              </p>
            </div>
          ) : (
            <div className={styles.shopGrid}>
              {gridProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isFavorite={favoriteSet.has(product.id)}
                  isAdmin={isAdmin}
                  onOpen={setDetailProduct}
                  onQuickAdd={quickAddToCart}
                  onToggleFavorite={toggleFavorite}
                  onDeleteProduct={deleteProduct}
                />
              ))}
            </div>
          )}
        </>
      )}

      {detailProduct ? (
        <ProductDetailPanel
          product={detailProduct}
          isFavorite={favoriteSet.has(detailProduct.id)}
          onClose={() => setDetailProduct(null)}
          onToggleFavorite={toggleFavorite}
          onAddToCart={addToCart}
        />
      ) : null}

      {toast ? (
        <Toast
          message={toast.message}
          variant={toast.variant}
          onClose={() => setToast(null)}
        />
      ) : null}
    </div>
  );
}
