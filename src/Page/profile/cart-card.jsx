import { useEffect, useState } from "react";
import ImageComponent from "../../component/image/ImageComponent";
import { productPath } from "../../routes/paths";
import { Link } from "react-router-dom";

export const CartCard = ({ id }) => {
  return (
    <Link to={productPath(id)} className="p-3 shadow-2xl  rounded-xl">
      <ImageComponent cardCss="w-full xl:h-[26vh] md:h-[15vh] h-[10vh]" />

      <div className="px-2 pt-2">
        <h3 className="text-center text-xl">GS-4322</h3>
        <button className="bg-blue-800 w-full text-white mt-2 py-2 rounded-md cursor-pointer">
         Order Now 
        </button>
      </div>
    </Link>
  );
};
