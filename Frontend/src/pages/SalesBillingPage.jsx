import React, { useState, useEffect } from "react";

import PointOfSaleCart from "../components/PointOfSaleCart";
import CheckoutSummary from "../components/CheckoutSummary";
import RecentBillingLogs from "../components/RecentBillingLogs";
import PrintSlip from "../components/PrintSlip";

import {
  createSale,
  getMedications,
  getSales,
} from "../data/authApi";


export default function SalesBillingPage() {

  // ============================================================
  // STATE
  // ============================================================

  const [cart, setCart] = useState([]);

  const [logs, setLogs] = useState([]);

  const [medications, setMedications] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [customerName, setCustomerName] = useState("");

  const [prescriptionRef, setPrescriptionRef] = useState("");

  const [receipt, setReceipt] = useState(null);

  const [amountTendered, setAmountTendered] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("Cash");


  // ============================================================
  // LOAD DATA
  // ============================================================

  const loadSalesData = async () => {

    const [medicationList, sales] = await Promise.all([
      getMedications(),
      getSales(),
    ]);

    setMedications(medicationList);

    setLogs(sales);
  };


  useEffect(() => {

    loadSalesData()
      .catch((requestError) => {
        setError(
          requestError.message ||
          "Unable to load billing data."
        );
      })
      .finally(() => {
        setLoading(false);
      });

  }, []);


  // ============================================================
  // FIND MEDICATION
  // ============================================================

  const getMedication = (medicationId) => {

    return medications.find(
      (medication) =>
        medication.id === medicationId
    );

  };


  // ============================================================
  // GET STOCK
  // ============================================================

  const getStock = (medicationId) => {

    const medication =
      getMedication(medicationId);

    return Number(
      medication?.stock ?? 0
    );

  };


  // ============================================================
  // UPDATE CART QUANTITY
  // ============================================================

  const handleUpdateQty = (id, newQty) => {

    const quantity = parseInt(newQty, 10);

    if (
      Number.isNaN(quantity) ||
      quantity < 1
    ) {
      return;
    }

    setCart((previousCart) => {

      return previousCart.map((item) => {

        if (item.id !== id) {
          return item;
        }

        const availableStock =
          getStock(item.medication);

        if (quantity > availableStock) {

          setError(
            `Only ${availableStock} units of ${item.name} are available.`
          );

          return item;
        }

        const itemSubtotal =
          item.price * quantity;

        const discountAmount =
          itemSubtotal *
          (item.discount / 100);

        const lineTotal =
          itemSubtotal -
          discountAmount;

        return {
          ...item,

          qty: quantity,

          total: lineTotal,

        };

      });

    });

  };


  // ============================================================
  // ADD MEDICATION TO CART
  // ============================================================

  const handleAddItemToCart = (drug) => {

    setError("");

    const stock =
      Number(drug.stock ?? 0);

    // ----------------------------------------------------------
    // OUT OF STOCK
    // ----------------------------------------------------------

    if (stock <= 0) {

      setError(
        `${drug.name} is currently out of stock.`
      );

      return;
    }


    // ----------------------------------------------------------
    // CHECK EXISTING CART ITEM
    // ----------------------------------------------------------

    const existingItem =
      cart.find(
        (item) =>
          item.medication === drug.id
      );


    // ----------------------------------------------------------
    // EXISTING ITEM
    // ----------------------------------------------------------

    if (existingItem) {

      const newQuantity =
        existingItem.qty + 1;

      if (newQuantity > stock) {

        setError(
          `Only ${stock} units of ${drug.name} are available.`
        );

        return;
      }

      handleUpdateQty(
        existingItem.id,
        newQuantity
      );

      return;
    }


    // ----------------------------------------------------------
    // NEW ITEM
    // ----------------------------------------------------------

    const newItem = {

      id: drug.id,

      medication: drug.id,

      name: drug.name,

      qty: 1,

      stock: stock,

      price: Number(drug.price),

      discount: 0,

      total: Number(drug.price),

    };


    setCart((previousCart) => [
      ...previousCart,
      newItem,
    ]);

  };


  // ============================================================
  // REMOVE ITEM
  // ============================================================

  const handleRemoveItem = (id) => {

    setCart((previousCart) =>
      previousCart.filter(
        (item) => item.id !== id
      )
    );

  };


  // ============================================================
  // SUBTOTAL
  // ============================================================

  const subtotal = cart.reduce(
    (total, item) =>
      total + Number(item.total || 0),
    0
  );


  // ============================================================
  // TAX
  // ============================================================

  const tax =
    subtotal * 0.07;


  // ============================================================
  // GRAND TOTAL
  // ============================================================

  const grandTotal =
    Math.max(
      0,
      subtotal + tax
    );


  // ============================================================
  // AMOUNT TENDERED
  // ============================================================

  const numericAmountTendered =
    Number(amountTendered || 0);


  // ============================================================
  // CHANGE
  // ============================================================

  const changeDue =
    Math.max(
      0,
      numericAmountTendered -
        grandTotal
    );


  // ============================================================
  // PAYMENT VALIDATION
  // ============================================================

  const paymentIsValid =
    numericAmountTendered >= grandTotal;


  // ============================================================
  // COMPLETE SALE
  // ============================================================

  const handleCompleteSale = async () => {

    setError("");

    // ----------------------------------------------------------
    // EMPTY CART
    // ----------------------------------------------------------

    if (cart.length === 0) {

      setError(
        "Please add at least one medication to the cart."
      );

      return;
    }


    // ----------------------------------------------------------
    // PAYMENT VALIDATION
    // ----------------------------------------------------------

    if (
      numericAmountTendered < grandTotal
    ) {

      setError(
        `Amount tendered must be at least $${grandTotal.toFixed(2)}.`
      );

      return;
    }


    setIsSubmitting(true);


    try {

      // --------------------------------------------------------
      // CREATE SALE
      // --------------------------------------------------------

      const sale = await createSale({

        customer_name:
          customerName.trim(),

        payment_method:
          paymentMethod,

        amount_tendered:
          numericAmountTendered.toFixed(2),

        prescription_reference:
          prescriptionRef.trim(),

        items: cart.map((item) => ({

          medication:
            item.medication,

          quantity:
            item.qty,

          discount_percent:
            Number(item.discount || 0),

        })),

      });


      // --------------------------------------------------------
      // REFRESH INVENTORY + BILLING
      // --------------------------------------------------------

      const [
        medicationList,
        sales,
      ] = await Promise.all([

        getMedications(),

        getSales(),

      ]);


      setMedications(
        medicationList
      );

      setLogs(
        sales
      );


      // --------------------------------------------------------
      // SAVE RECEIPT
      // IMPORTANT:
      // Use cart BEFORE clearing it.
      // --------------------------------------------------------

      setReceipt({

        sale: sale,

        items: [...cart],

      });


      // --------------------------------------------------------
      // RESET POS
      // --------------------------------------------------------

      setCart([]);

      setCustomerName("");

      setPrescriptionRef("");

      setAmountTendered("");

      setPaymentMethod("Cash");


      // --------------------------------------------------------
      // PRINT
      // --------------------------------------------------------

      window.setTimeout(() => {

        window.print();

      }, 100);


    } catch (requestError) {

      setError(
        requestError.message ||
        "Unable to complete the sale."
      );

    } finally {

      setIsSubmitting(false);

    }

  };


  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {

    return (

      <div className="h-full w-full flex items-center justify-center bg-slate-50">

        <div className="text-teal-600 font-semibold animate-pulse text-sm">

          Loading POS...

        </div>

      </div>

    );

  }


  // ============================================================
  // UI
  // ============================================================

  return (

    <>

      <main className="h-full overflow-y-auto p-8 bg-slate-50 space-y-6 print:hidden animate-fadeIn">


        {/* ======================================================
            ERROR
        ======================================================= */}

        {error && (

          <div className="rounded-lg bg-rose-50 border border-rose-100 px-4 py-3 text-xs font-semibold text-rose-700">

            {error}

          </div>

        )}


        {/* ======================================================
            POS AREA
        ======================================================= */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">


          {/* ====================================================
              CART
          ===================================================== */}

          <div className="lg:col-span-2">

            <PointOfSaleCart

              cartData={cart}

              medications={medications}

              onUpdateQty={
                handleUpdateQty
              }

              onRemoveItem={
                handleRemoveItem
              }

              onSelectItem={
                handleAddItemToCart
              }

              customerName={
                customerName
              }

              setCustomerName={
                setCustomerName
              }

              prescriptionRef={
                prescriptionRef
              }

              setPrescriptionRef={
                setPrescriptionRef
              }

            />

          </div>


          {/* ====================================================
              CHECKOUT
          ===================================================== */}

          <div>

            <CheckoutSummary

              subtotal={
                subtotal
              }

              tax={
                tax
              }

              grandTotal={
                grandTotal
              }

              changeDue={
                changeDue
              }

              amountTendered={
                amountTendered
              }

              setAmountTendered={
                setAmountTendered
              }

              paymentMethod={
                paymentMethod
              }

              setPaymentMethod={
                setPaymentMethod
              }

              onCompleteSale={
                handleCompleteSale
              }

              isSubmitting={
                isSubmitting
              }

              paymentIsValid={
                paymentIsValid
              }

            />

          </div>

        </div>


        {/* ======================================================
            BILLING LOGS
        ======================================================= */}

        <RecentBillingLogs
          logsData={logs}
        />

      </main>


      {/* ========================================================
          PRINT RECEIPT
      ========================================================= */}

      <PrintSlip

        cartData={
          receipt?.items || []
        }

        saleData={
          receipt?.sale
        }

      />

    </>

  );

}