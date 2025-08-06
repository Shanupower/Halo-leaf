import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../feature/leafSlice";
import ProductImageSlider from "./ProductImageSlider";
import { ShopCard } from "./shop-card";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import EventIcon from "@mui/icons-material/Event";


export const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product } = useSelector((state) => state.leaf);
  const productDetails = product?.find((item) => item?.documentId === id);

  const [mainImage, setMainImage] = useState("");
  const [deliveryPincode, setDeliveryPincode] = useState("");
  const [serviceResponse, setServiceResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Accordion toggles
  const [showDescription, setShowDescription] = useState(false);
  const [showShipping, setShowShipping] = useState(false);
const [expanded, setExpanded] = useState(true);
  useEffect(() => {
    window.scrollTo(0, 0);
    setMainImage(productDetails?.image?.[0]?.url);
  }, [productDetails]);

  const handleAddToCart = () => {
    dispatch(addToCart({ ...productDetails, quantity: 1 }));
  };

  const checkServiceability = async () => {
    if (!deliveryPincode) return;

    setLoading(true);
    setError("");
    setServiceResponse(null);

    try {
      const response = await fetch(
        "https://api.rapidshyp.com/rapidshyp/apis/v1/serviceabilty_check",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "rapidshyp-token":
              "8e3ca34d7ad8ac6598c3110cd8e3be08b8efe0b4ed0f28e71b3706e1f5dabcaf",
          },
          body: JSON.stringify({
            Pickup_pincode: "226202",
            Delivery_pincode: deliveryPincode,
            cod: true,
            total_order_value: 2000,
            weight: 1,
          }),
        }
      );

      const data = await response.json();
      setServiceResponse(data);
    } catch (err) {
      console.error(err);
      setError("Service check failed. Please check your pincode and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-30">
      {/* Top Section */}
      <div className="grid md:grid-cols-2 gap-10">
        {/* Images */}
        <ProductImageSlider
          images={
            productDetails?.image?.map(
              (img) => `${import.meta.env.VITE_Image_BASE_URL}${img.url}`
            ) || []
          }
        />

        {/* Product Info */}
        <div className="space-y-2 pr-20">
          <p className="text-sm text-gray-500">Main Fashion</p>
          <h2 className="text-2xl font-bold">{productDetails?.title}</h2>
          <p className="text-xl font-semibold text-black">
            ₹ {productDetails?.OrigialPrice || 0}
          </p>

          <button
            onClick={handleAddToCart}
            className="bg-black text-white w-full py-3 rounded-full text-sm font-medium"
          >
            Add to Cart
          </button>

          {/* Pincode Check */}
          <div className="pt-3">
            <h4 className="font-semibold mb-2">Check Delivery Availability</h4>
            <div className="flex gap-3">
              <input
                type="text"
                value={deliveryPincode}
                onChange={(e) => setDeliveryPincode(e.target.value)}
                placeholder="Enter Pincode"
                className="border px-3 py-2 rounded w-full"
              />
              <button
                onClick={checkServiceability}
                className="bg-gray-800 text-white px-4 py-2 rounded"
              >
                {loading ? "Checking..." : "Check"}
              </button>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {serviceResponse && (
              <p className="text-green-600 mt-2">
                Delivery Available:{" "}
                {serviceResponse.data?.delivery_available ? "Yes ✅" : "No ❌"}
              </p>
            )}
          </div>

          <Accordion expanded={true} className="rounded-md border border-none shadow-sm">
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
                {productDetails?.description ||
                  "Loose fit hoodie in medium-weight cotton-blend fleece with a generous, but not oversized silhouette. Jersey-lined drawstring hood, dropped shoulders, long sleeves, and a kangaroo pocket. Wide ribbing at cuffs and hem. Soft brushed inside."}
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

      {/* Ratings */}
      <div className="grid md:grid-cols-2 gap-10 mt-16">
        <div className="text-center md:text-left">
          <p className="text-5xl font-bold">
            4.5<span className="text-2xl text-gray-500"> / 5</span>
          </p>
          <p className="text-sm text-gray-400 mt-1">(50 New Reviews)</p>
          <div className="mt-4 space-y-2 text-sm">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-2">
                <span className="w-5">{star}★</span>
                <div className="bg-gray-200 rounded h-2 flex-1">
                  <div className="bg-black h-2 rounded w-[80%]"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Review */}
        <div className="border rounded-xl p-4">
          <div className="flex gap-4 items-start">
            <img
              src="https://randomuser.me/api/portraits/men/75.jpg"
              alt="Alex"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">Alex Mathio</h4>
                <p className="text-sm text-gray-400">13 Oct 2024</p>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                “NextGen’s dedication to sustainability and ethical practices resonates strongly
                with today’s consumers.”
              </p>
            </div>
          </div>
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
    </div>
  );
};
