import React from "react";


export default function PrintSlip({
  cartData,
  saleData,
}) {

  if (!saleData) {
    return null;
  }


  return (

    <div className="hidden print:block p-4 max-w-sm mx-auto text-black font-sans text-xs bg-white min-h-screen">


      {/* ========================================================
          PHARMACY HEADER
      ========================================================= */}

      <div className="text-center space-y-1 border-b border-dashed border-slate-400 pb-3">

        <h2 className="text-base font-black tracking-wide">

          MEDVAULT RX PHARMACY

        </h2>

        <p className="text-[10px] text-slate-600">

          Phase 2 Johar Town, Lahore, Pakistan

        </p>

        <p className="text-[10px] text-slate-600">

          Tel: +92 42 111 222 333

        </p>


        {/* INVOICE INFORMATION */}

        <div className="text-left text-[9px] space-y-0.5 pt-3">

          <p>

            <span className="font-bold">
              Invoice Ref:
            </span>{" "}

            {saleData.invoiceId}

          </p>


          <p>

            <span className="font-bold">
              Date / Time:
            </span>{" "}

            {saleData.timestamp
              ? new Date(
                  saleData.timestamp
                ).toLocaleString()
              : "-"}

          </p>


          <p>

            <span className="font-bold">
              Customer:
            </span>{" "}

            {saleData.customer ||
              "Walk-in Customer"}

          </p>


          <p>

            <span className="font-bold">
              Payment:
            </span>{" "}

            {saleData.payment_method}

          </p>


          {saleData.prescription_reference && (

            <p>

              <span className="font-bold">
                Prescription:
              </span>{" "}

              {saleData.prescription_reference}

            </p>

          )}

        </div>

      </div>


      {/* ========================================================
          ITEMS
      ========================================================= */}

      <div className="py-3 border-b border-dashed border-slate-400 space-y-1.5">


        <div className="grid grid-cols-4 font-bold border-b pb-1 text-[9px] uppercase tracking-wider">

          <span className="col-span-2">
            Item Description
          </span>

          <span className="text-center">
            Qty
          </span>

          <span className="text-right">
            Total
          </span>

        </div>


        {cartData.map((item) => (

          <div
            key={item.id}
            className="grid grid-cols-4 font-medium text-[10px]"
          >

            <span className="col-span-2 truncate">

              {item.name}

            </span>

            <span className="text-center">

              x{item.qty}

            </span>

            <span className="text-right font-bold">

              $
              {Number(
                item.total
              ).toFixed(2)}

            </span>

          </div>

        ))}

      </div>


      {/* ========================================================
          TOTALS
      ========================================================= */}

      <div className="pt-3 space-y-1 text-right text-[10px] font-medium">


        {/* SUBTOTAL */}

        <p>

          Subtotal:

          <span className="ml-2">

            $
            {Number(
              saleData.subtotal
            ).toFixed(2)}

          </span>

        </p>


        {/* TAX */}

        <p>

          Tax (7%):

          <span className="ml-2">

            $
            {Number(
              saleData.tax
            ).toFixed(2)}

          </span>

        </p>


        {/* GRAND TOTAL */}

        <div className="border-t border-double border-slate-800 pt-1.5 text-xs font-black flex justify-between mt-2">

          <span>
            GRAND TOTAL
          </span>

          <span>

            $
            {Number(
              saleData.grand_total
            ).toFixed(2)}

          </span>

        </div>


        {/* AMOUNT TENDERED */}

        <p className="pt-2">

          Amount Tendered:

          <span className="ml-2">

            $
            {Number(
              saleData.amount_tendered
            ).toFixed(2)}

          </span>

        </p>


        {/* CHANGE */}

        <p>

          Change Due:

          <span className="ml-2 font-bold">

            $
            {Number(
              saleData.change_due
            ).toFixed(2)}

          </span>

        </p>

      </div>


      {/* ========================================================
          FOOTER
      ========================================================= */}

      <div className="text-center text-[9px] text-slate-500 mt-6 border-t border-dashed pt-3 border-slate-300 space-y-0.5">

        <p className="font-bold">

          Thank you for your purchase!

        </p>

        <p>

          Prescription drugs cannot be returned or substituted.

        </p>

      </div>

    </div>

  );

}