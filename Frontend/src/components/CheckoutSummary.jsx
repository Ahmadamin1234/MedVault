import React from "react";


export default function CheckoutSummary({

  subtotal,

  tax,

  grandTotal,

  changeDue,

  amountTendered,

  setAmountTendered,

  paymentMethod,

  setPaymentMethod,

  onCompleteSale,

  isSubmitting,

  paymentIsValid,

}) {

  const numericAmount =
    Number(amountTendered || 0);


  const insufficientPayment =
    numericAmount < grandTotal;


  return (

    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-full space-y-6">


      {/* ========================================================
          TOTALS
      ========================================================= */}

      <div>

        <h3 className="text-sm font-bold text-slate-800 mb-4">

          Checkout Summary

        </h3>


        <div className="space-y-2 text-xs font-semibold text-slate-500 border-b pb-4">


          {/* SUBTOTAL */}

          <div className="flex justify-between">

            <span>
              Subtotal
            </span>

            <span className="text-slate-800 font-bold">

              ${subtotal.toFixed(2)}

            </span>

          </div>


          {/* TAX */}

          <div className="flex justify-between">

            <span>
              Tax (7%)
            </span>

            <span className="text-slate-800 font-bold">

              ${tax.toFixed(2)}

            </span>

          </div>

        </div>


        {/* GRAND TOTAL */}

        <div className="flex justify-between items-center pt-4 text-sm font-black text-slate-900">

          <span>
            Grand Total
          </span>

          <span className="text-2xl text-teal-600 font-black">

            ${grandTotal.toFixed(2)}

          </span>

        </div>

      </div>


      {/* ========================================================
          PAYMENT
      ========================================================= */}

      <div className="space-y-4 text-xs">


        <span className="font-bold text-slate-400 block text-[10px] uppercase">

          Payment Method

        </span>


        {/* PAYMENT METHODS */}

        <div className="grid grid-cols-3 gap-2">

          {[
            "Cash",
            "Card",
            "Insurance",
          ].map((method) => (

            <button

              type="button"

              key={method}

              onClick={() =>
                setPaymentMethod(
                  method
                )
              }

              className={`py-2 rounded-lg font-bold border transition-colors ${
                paymentMethod === method

                  ? "border-teal-600 bg-teal-50 text-teal-700"

                  : "border-slate-200 text-slate-500 hover:bg-slate-50"
              }`}

            >

              {method}

            </button>

          ))}

        </div>


        {/* ======================================================
            AMOUNT + CHANGE
        ======================================================= */}

        <div className="grid grid-cols-2 gap-4 pt-2">


          {/* AMOUNT TENDERED */}

          <div className="space-y-1">

            <span className="font-bold text-slate-400 block text-[10px]">

              Amount Tendered

            </span>

            <input

              type="number"

              min="0"

              step="0.01"

              value={amountTendered}

              onChange={(e) =>
                setAmountTendered(
                  e.target.value
                )
              }

              placeholder="0.00"

              className={`w-full bg-slate-50 border rounded-lg p-2 font-bold text-slate-800 text-sm focus:outline-none ${
                insufficientPayment &&
                amountTendered !== ""
                  ? "border-rose-300 focus:border-rose-500"
                  : "border-slate-200 focus:border-teal-500"
              }`}

            />


            {/* PAYMENT ERROR */}

            {insufficientPayment &&
              amountTendered !== "" &&
              grandTotal > 0 && (

                <p className="text-[9px] text-rose-500 font-bold">

                  Need $
                  {(
                    grandTotal -
                    numericAmount
                  ).toFixed(2)} more

                </p>

              )}

          </div>


          {/* CHANGE */}

          <div className="space-y-1">

            <span className="font-bold text-slate-400 block text-[10px]">

              Change Due

            </span>

            <div className="w-full bg-emerald-50 border border-emerald-100 rounded-lg p-2 font-black text-emerald-600 text-sm">

              ${changeDue.toFixed(2)}

            </div>

          </div>

        </div>

      </div>


      {/* ========================================================
          COMPLETE SALE
      ========================================================= */}

      <div className="space-y-2 pt-2">


        <button

          type="button"

          onClick={onCompleteSale}

          disabled={
            isSubmitting ||
            subtotal <= 0 ||
            !paymentIsValid
          }

          className={`w-full py-3 font-bold rounded-lg text-xs tracking-wide shadow-md transition-all ${
            isSubmitting ||
            subtotal <= 0 ||
            !paymentIsValid

              ? "bg-slate-300 text-slate-500 cursor-not-allowed"

              : "bg-teal-600 hover:bg-teal-700 text-white cursor-pointer active:scale-95"
          }`}

        >

          {isSubmitting

            ? "Processing Sale..."

            : "Complete Sale & Print Receipt"}

        </button>


        {!paymentIsValid &&
          subtotal > 0 && (

            <p className="text-center text-[10px] text-rose-500 font-semibold">

              Enter enough payment to complete the sale.

            </p>

          )}

      </div>

    </div>

  );

}