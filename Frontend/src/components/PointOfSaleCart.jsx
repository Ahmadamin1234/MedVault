import React, { useState } from "react";

import {
  User,
  FileText,
  Search,
  Trash2,
} from "lucide-react";


export default function PointOfSaleCart({

  cartData,

  medications,

  onUpdateQty,

  onRemoveItem,

  onSelectItem,

  customerName,

  setCustomerName,

  prescriptionRef,

  setPrescriptionRef,

}) {

  const [query, setQuery] =
    useState("");

  const [isOpen, setIsOpen] =
    useState(false);


  // ============================================================
  // SEARCH MEDICATIONS
  // ============================================================

  const filteredCatalog =
    medications.filter((drug) => {

      const name =
        drug.name?.toLowerCase() || "";

      const generic =
        drug.generic?.toLowerCase() || "";

      const search =
        query.toLowerCase();

      return (
        name.includes(search) ||
        generic.includes(search)
      );

    });


  // ============================================================
  // GET CART QUANTITY
  // ============================================================

  const getCartQuantity = (
    medicationId
  ) => {

    const item =
      cartData.find(
        (cartItem) =>
          cartItem.medication ===
          medicationId
      );

    return item?.qty || 0;

  };


  // ============================================================
  // GET STOCK
  // ============================================================

  const getStock = (drug) => {

    return Number(
      drug.stock ?? 0
    );

  };


  return (

    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">


      {/* ========================================================
          HEADER
      ========================================================= */}

      <div className="flex justify-between items-center">

        <h3 className="text-sm font-bold text-slate-800">

          Point of Sale Cart

        </h3>

        <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded uppercase">

          {cartData.length} Item
          {cartData.length !== 1 ? "s" : ""}

        </span>

      </div>


      {/* ========================================================
          CUSTOMER + PRESCRIPTION
      ========================================================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">


        {/* CUSTOMER */}

        <div className="space-y-1">

          <label className="font-bold text-slate-400">

            Customer Name

          </label>

          <div className="relative">

            <input

              type="text"

              value={customerName}

              onChange={(e) =>
                setCustomerName(
                  e.target.value
                )
              }

              placeholder="Walk-in Customer"

              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 pl-8 font-semibold text-slate-700 focus:outline-none focus:border-teal-500"

            />

            <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />

          </div>

        </div>


        {/* PRESCRIPTION */}

        <div className="space-y-1">

          <label className="font-bold text-slate-400">

            Prescription Reference

          </label>

          <div className="relative">

            <input

              type="text"

              value={prescriptionRef}

              onChange={(e) =>
                setPrescriptionRef(
                  e.target.value
                )
              }

              placeholder="Enter Rx Number..."

              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 pl-8 font-semibold text-slate-700 focus:outline-none focus:border-teal-500"

            />

            <FileText className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />

          </div>

        </div>

      </div>


      {/* ========================================================
          SEARCH MEDICATION
      ========================================================= */}

      <div className="space-y-1 relative text-xs">

        <label className="font-bold text-slate-400">

          Search Drug to Add

        </label>

        <div className="relative">

          <input

            type="text"

            value={query}

            onFocus={() =>
              setIsOpen(true)
            }

            onChange={(e) => {

              setQuery(
                e.target.value
              );

              setIsOpen(true);

            }}

            placeholder="Type medication name..."

            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 pl-8 font-bold text-teal-600 focus:outline-none focus:border-teal-500"

          />

          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />

        </div>


        {/* ======================================================
            SEARCH RESULTS
        ======================================================= */}

        {isOpen && query && (

          <div className="absolute left-0 right-0 bg-white border border-slate-200 rounded-lg shadow-xl mt-1 z-50 overflow-hidden max-h-60 overflow-y-auto">


            {filteredCatalog.map(
              (drug) => {

                const stock =
                  getStock(drug);

                const cartQuantity =
                  getCartQuantity(
                    drug.id
                  );

                const availableToAdd =
                  stock - cartQuantity;

                const outOfStock =
                  stock <= 0;

                const cartLimitReached =
                  availableToAdd <= 0;


                return (

                  <button

                    type="button"

                    key={drug.id}

                    disabled={
                      outOfStock ||
                      cartLimitReached
                    }

                    onClick={() => {

                      onSelectItem(
                        drug
                      );

                      setQuery("");

                      setIsOpen(false);

                    }}

                    className={`w-full p-3 flex justify-between items-center text-left border-b border-slate-100 ${
                      outOfStock ||
                      cartLimitReached

                        ? "bg-slate-50 opacity-60 cursor-not-allowed"

                        : "bg-white hover:bg-teal-50 cursor-pointer"
                    }`}

                  >

                    <div>

                      <div className="font-bold text-slate-800">

                        {drug.name}

                      </div>

                      {drug.generic && (

                        <div className="text-[10px] text-slate-400">

                          {drug.generic}

                        </div>

                      )}

                      <div className="text-[10px] mt-1">

                        <span
                          className={
                            stock > 0
                              ? "text-slate-500"
                              : "text-rose-500 font-bold"
                          }
                        >

                          Stock: {stock}

                        </span>

                        {cartQuantity > 0 && (

                          <span className="ml-2 text-blue-500">

                            In cart: {cartQuantity}

                          </span>

                        )}

                      </div>

                    </div>


                    <div className="text-right">

                      <div className="font-bold text-teal-600">

                        ${Number(
                          drug.price
                        ).toFixed(2)}

                      </div>


                      {outOfStock && (

                        <div className="text-[9px] text-rose-500 font-bold uppercase">

                          Out of Stock

                        </div>

                      )}


                      {!outOfStock &&
                        cartLimitReached && (

                          <div className="text-[9px] text-amber-500 font-bold">

                            Maximum Available

                          </div>

                        )}

                    </div>

                  </button>

                );

              }
            )}


            {filteredCatalog.length === 0 && (

              <div className="p-4 text-center text-slate-400">

                No matching medications found.

              </div>

            )}

          </div>

        )}

      </div>


      {/* ========================================================
          CART TABLE
      ========================================================= */}

      <div className="overflow-x-auto pt-4">

        <table className="w-full text-left border-collapse text-xs">

          <thead>

            <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">

              <th className="pb-2">
                Drug Name
              </th>

              <th className="pb-2 text-center">
                Qty
              </th>

              <th className="pb-2 text-center">
                Unit Price
              </th>

              <th className="pb-2 text-center">
                Discount%
              </th>

              <th className="pb-2 text-right">
                Line Total
              </th>

              <th className="pb-2 text-center">
              </th>

            </tr>

          </thead>


          <tbody className="divide-y divide-slate-100">


            {cartData.map((item) => (

              <tr
                key={item.id}
                className="hover:bg-slate-50/30"
              >


                {/* MEDICATION */}

                <td className="py-3">

                  <div className="font-bold text-slate-900">

                    {item.name}

                  </div>

                  <div className="text-[9px] text-slate-400">

                    Available: {item.stock}

                  </div>

                </td>


                {/* QUANTITY */}

                <td className="py-3 text-center">

                  <input

                    type="number"

                    min="1"

                    max={item.stock}

                    value={item.qty}

                    onChange={(e) =>
                      onUpdateQty(
                        item.id,
                        e.target.value
                      )
                    }

                    className="w-14 p-1 border rounded bg-slate-50 border-slate-200 text-center font-bold focus:outline-none focus:border-teal-500"

                  />

                </td>


                {/* UNIT PRICE */}

                <td className="py-3 text-center text-slate-400">

                  ${Number(
                    item.price
                  ).toFixed(2)}

                </td>


                {/* DISCOUNT */}

                <td className="py-3 text-center text-slate-400">

                  {Number(
                    item.discount
                  ).toFixed(2)}%

                </td>


                {/* LINE TOTAL */}

                <td className="py-3 text-right font-bold text-slate-800">

                  ${Number(
                    item.total
                  ).toFixed(2)}

                </td>


                {/* DELETE */}

                <td className="py-3 text-center">

                  <button

                    type="button"

                    onClick={() =>
                      onRemoveItem(
                        item.id
                      )
                    }

                    className="text-slate-300 hover:text-rose-500 p-1.5 rounded hover:bg-rose-50"

                  >

                    <Trash2 className="w-3.5 h-3.5" />

                  </button>

                </td>

              </tr>

            ))}


            {/* EMPTY CART */}

            {cartData.length === 0 && (

              <tr>

                <td
                  colSpan={6}
                  className="py-12 text-center text-slate-400 font-medium italic"
                >

                  Your shopping cart is empty.

                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>

  );

}