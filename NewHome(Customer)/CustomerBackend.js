// Intercept the booking confirmation to persist it
  const _origBkFinalConfirm = window.bkFinalConfirm;
  if (typeof _origBkFinalConfirm === "function") {
    window.bkFinalConfirm = function () {
      _origBkFinalConfirm();

      const refEl = document.getElementById("bkRcptRef");
      const ref   = refEl ? refEl.textContent : "";
      if (!ref || ref === "REV-000000") return;

      const make  = document.getElementById("bkMake")?.value  || "";
      const model = document.getElementById("bkModel")?.value || "";
      const year  = document.getElementById("bkYear")?.value  || "";
      const svc   = window.bkSelSvc   || "";
      const price = window.bkSelPrice || 0;
      const date  = document.getElementById("bkDate")?.value  || "";
      const time  = window.bkSelTime  || "";
      const pay   = parseFloat(document.getElementById("bkPayAmt")?.value) || 0;

      CustomerDB.onBookingComplete({
        refNo:           ref,
        service:         svc,
        price,
        downpayment:     pay,
        balance:         price - pay,
        appointmentDate: date,
        time,
        vehicleMake:     make,
        vehicleModel:    model,
        vehicleYear:     year,
      });
    };
  }