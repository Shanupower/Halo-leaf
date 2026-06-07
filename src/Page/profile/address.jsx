import { useDispatch, useSelector } from "react-redux";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import { deleteAddress } from "../../feature/leafSlice";
import { Link } from "react-router-dom";

export const Address = () => {
  const { addresses } = useSelector((state) => state.leaf.user);
  const dispatch = useDispatch();

  const handleDeleteAddress = (id) => {
    dispatch(deleteAddress(id));
  };

  return (
    <div className="p-6 sm:p-8">
      {addresses?.length === 0 ? (
        <div className="flex min-h-[20rem] flex-col items-center justify-center gap-4 text-center">
          <p className="text-lg font-semibold text-gray-700">No saved addresses</p>
          <Link
            to="/address"
            className="rounded-full bg-green-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-950"
          >
            Add an address
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses?.map((item) => (
            <div
              key={item?.documentId || item?.id}
              className="flex flex-col gap-4 rounded-2xl border border-green-100 bg-[#f7fbf4] p-5 sm:flex-row sm:items-start sm:justify-between"
            >
              <p className="text-sm leading-6 text-gray-700 sm:max-w-[75%]">
                {item?.address1}, {item?.address2}, {item?.pin_code},{" "}
                {item?.district}, {item?.city}, {item?.state}
              </p>
              <div className="flex shrink-0 gap-3">
                <Link
                  to={`/address/${item?.documentId}`}
                  aria-label="Edit address"
                  className="rounded-full border border-green-200 p-2 text-green-800 transition hover:border-green-700 hover:bg-white"
                >
                  <EditIcon fontSize="small" />
                </Link>
                <button
                  type="button"
                  aria-label="Delete address"
                  onClick={() => handleDeleteAddress(item?.documentId)}
                  className="rounded-full border border-red-100 p-2 text-red-600 transition hover:border-red-300 hover:bg-white"
                >
                  <DeleteForeverIcon fontSize="small" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
