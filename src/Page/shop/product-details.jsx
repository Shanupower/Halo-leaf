import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchProductById } from "../../feature/leafSlice";
import { toast } from "react-toastify";
import {
  checkServiceability as checkDeliveryServiceability,
} from "../../api/medusa/store";
import ProductImageSlider from "./ProductImageSlider";
import { ShopCard } from "./shop-card";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import EventIcon from "@mui/icons-material/Event";
import { buildImageUrl } from "../../utils/media";


export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { product } = useSelector((state) => state.leaf);
  const productDetails = product?.find(
    (item) => item?.documentId === id || item?.id === id
  );

  const [deliveryPincode, setDeliveryPincode] = useState("");
  const [serviceResponse, setServiceResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [id, dispatch]);

  const handleAddToCart = (afterAdd) => {
    if (!productDetails?.variant_id && !productDetails?.variants?.[0]?.id) {
      toast.error("This product cannot be added to the cart yet.");
      return;
    }
    dispatch(addToCart({ item: productDetails, quantity: 1 }))
      .unwrap()
      .then(() => {
        toast.success("Added to cart");
        if (afterAdd) afterAdd();
      })
      .catch((e) => toast.error(typeof e === "string" ? e : "Could not add to cart"));
  };

  const handleBuyNow = () => {
    handleAddToCart(() => navigate("/order"));
  };

  const checkServiceability = async () => {
    if (!deliveryPincode) return;

    setLoading(true);
    setError("");
    setServiceResponse(null);

    const variantId =
      productDetails?.variant_id || productDetails?.variants?.[0]?.id;

    try {
      const data = await checkDeliveryServiceability({
        delivery_pincode: deliveryPincode,
        ...(variantId ? { variant_id: variantId, quantity: 1 } : {}),
        cod: false,
        total_order_value: Math.round(Number(productDetails?.price || 0) * 100),
      });
      setServiceResponse(data);
    } catch (err) {
      console.error(err);
      setError("Service check failed. Please check your pincode and try again.");
    } finally {
      setLoading(false);
    }
  };

  const galleryImages =
    productDetails?.image?.length > 0
      ? productDetails.image
          .map((img) => buildImageUrl(img.url || img.full))
          .filter(Boolean)
      : productDetails?.imageUrl
        ? [productDetails.imageUrl]
        : productDetails?.thumbnail
          ? [buildImageUrl(productDetails.thumbnail)]
          : [];

  const productDescription =
    productDetails?.description ||
    productDetails?.shortDescription ||
    productDetails?.subtitle ||
    "";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:py-14">
      {!productDetails && (
        <p className="py-20 text-center text-gray-500">Loading product...</p>
      )}
      {productDetails && (
      <>
      <div className="grid gap-10 rounded-[2rem] bg-white md:grid-cols-2">
        {/* Images */}
        <ProductImageSlider images={galleryImages} />

        {/* Product Info */}
        <div className="space-y-4 md:pr-10">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-green-700">
            HaloLeaf product
          </p>
          <h1 className="text-3xl font-bold text-gray-950 md:text-5xl">
            {productDetails?.title}
          </h1>
          {productDetails.reviewCount > 0 && (
            <p className="text-sm text-gray-600">
              {Number(productDetails.ratingAverage || 0).toFixed(1)} ★ ·{" "}
              {productDetails.reviewCount} review
              {productDetails.reviewCount === 1 ? "" : "s"}
            </p>
          )}
          <p className="text-2xl font-bold text-green-800">
            ₹ {productDetails?.OrigialPrice || 0}
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              onClick={() => handleAddToCart()}
              className="w-full rounded-full border border-green-700 bg-white py-3 text-sm font-semibold text-green-800 transition hover:bg-green-50"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="w-full rounded-full bg-green-700 py-3 text-sm font-semibold text-white transition hover:bg-gray-950"
            >
              Buy Now
            </button>
          </div>

          {/* Pincode Check */}
          <div className="pt-3">
            <h4 className="mb-2 font-semibold">Check Delivery Availability</h4>
            <div className="flex gap-3">
              <input
                type="text"
                value={deliveryPincode}
                onChange={(e) => setDeliveryPincode(e.target.value)}
                placeholder="Enter Pincode"
                className="w-full rounded-full border border-green-100 px-4 py-3 outline-none focus:border-green-700"
              />
              <button
                onClick={checkServiceability}
                className="rounded-full bg-gray-950 px-5 py-3 text-white transition hover:bg-green-700"
              >
                {loading ? "Checking..." : "Check"}
              </button>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {serviceResponse && (
              <div className="mt-2 space-y-1 text-sm text-gray-700">
                <p
                  className={
                    serviceResponse.delivery_available
                      ? "text-green-700"
                      : "text-red-600"
                  }
                >
                  Delivery:{" "}
                  {serviceResponse.delivery_available ? "Available" : "Not available"}
                </p>
                {serviceResponse.estimated_delivery_days != null && (
                  <p>Estimated: {serviceResponse.estimated_delivery_days} day(s)</p>
                )}
                {serviceResponse.etd && <p>Expected by: {serviceResponse.etd}</p>}
                {serviceResponse.rate != null && (
                  <p>Shipping from ₹{Number(serviceResponse.rate).toFixed(0)}</p>
                )}
              </div>
            )}
          </div>

          <Accordion className="rounded-md border border-none shadow-sm">
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <h3 className="font-semibold">
                Description & Fit
              </h3>
            </AccordionSummary>
            <AccordionDetails>
              <p className="text-sm text-gray-600">
                {productDescription ||
                  "Product details will appear here once added in Medusa Admin."}
              </p>
            </AccordionDetails>
          </Accordion>

          

<Accordion className="shadow-none mt-4" style={{border:"none"}}>
  <AccordionSummary
    expandIcon={<ExpandMoreIcon />}
    aria-controls="panel2a-content"
    id="panel2a-header"
    className="px-0"
  >
    <h3 className="font-semibold text-lg">Shipping Info</h3>
  </AccordionSummary>

  <AccordionDetails className="px-0">
    <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
      {/* Discount */}
      <div className="flex items-center gap-3 rounded-xl p-4 shadow-sm"  style={{ border: "1px solid whitesmoke" }}>
        <LocalOfferIcon className="text-black" />
        <div>
          <p className="text-xs text-gray-500 font-medium">Disc</p>
          <p className="text-sm font-semibold text-black"><b>50%</b></p>
        </div>
      </div>

      {/* Package */}
      <div className="flex items-center gap-3 border rounded-xl p-4 shadow-sm"  style={{ border: "1px solid whitesmoke" }}>
        <Inventory2Icon className="text-black" />
        <div>
          <p className="text-xs text-gray-500 font-medium">Package</p>
          <p className="text-sm font-semibold text-black"><b>Regular Package</b></p>
        </div>
      </div>

      {/* Delivery */}
      <div className="flex items-center gap-3 border rounded-xl p-2 shadow-sm"  style={{ border: "1px solid whitesmoke" }}>
        <LocalShippingIcon className="text-black" />
        <div>
          <p className="text-xs text-gray-500 font-medium">Delivery</p>
          <p className="text-sm text-black mt-1"><b>3–4 Working Days</b></p>
        </div>
      </div>

      {/* Estimated */}
      <div className="flex items-center gap-3 border rounded-xl p-4 shadow-sm"  style={{ border: "1px solid whitesmoke" }}>
        <EventIcon className="text-black" />
        <div>
          <p className="text-xs text-gray-500 font-medium">Estimated</p>
          <p className="text-sm font-semibold text-black"><b>10–12 October 2024</b></p>
        </div>
      </div>
    </div>
  </AccordionDetails>
</Accordion>

          </div>   
      </div>

      <div className="mt-16 grid gap-8 rounded-[2rem] border border-green-100 bg-[#f7fbf4] p-6 md:grid-cols-2 md:p-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-green-700">
            Customer reviews
          </p>
          {productDetails.reviewCount > 0 ? (
            <>
              <p className="mt-4 text-5xl font-bold text-gray-950">
                {Number(productDetails.ratingAverage || 0).toFixed(1)}
                <span className="text-2xl text-gray-500"> / 5</span>
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Based on {productDetails.reviewCount} review
                {productDetails.reviewCount === 1 ? "" : "s"}
              </p>
            </>
          ) : (
            <div className="mt-4 rounded-2xl border border-green-100 bg-white p-5 text-sm leading-6 text-gray-600">
              No reviews yet. Be the first to share feedback after your order.
            </div>
          )}
        </div>

        <div className="space-y-4">
          {(productDetails.reviews || []).length > 0 ? (
            productDetails.reviews.map((review) => (
              <div key={review.id} className="rounded-2xl border border-green-100 bg-white p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-950">{review.name}</h4>
                    <p className="text-sm text-green-700">{review.rating} ★</p>
                  </div>
                  {review.date && (
                    <p className="text-xs text-gray-400">{review.date}</p>
                  )}
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  {review.comment}
                </p>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-green-100 bg-white p-5 text-sm leading-6 text-gray-600">
              Customer reviews will appear here soon.
            </div>
          )}
        </div>
      </div>

      {/* You Might Also Like */}
      <div className="mt-16">
        <h3 className="text-xl font-semibold mb-6">You might also like</h3>
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
          {product?.slice(0, 3).map((item, index) => (
            <ShopCard key={index} id={index} item={item} />
          ))}
        </div>
      </div>
      </>
      )}
    </div>
  );
};
