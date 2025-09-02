// بيانات السلة
const cart = [];
const PRICE = 60;
const COUPON = "Achraf lmezkk";
const DISCOUNT = 0.30;

// عناصر DOM
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const cartTotalPage = document.getElementById("cartTotalPage");
const discountPage = document.getElementById("discountPage");
const grandTotalPage = document.getElementById("grandTotalPage");
const cartItems = document.getElementById("cartItems");
const checkoutForm = document.getElementById("checkoutForm");
const couponInput = document.getElementById("coupon");
const addressInput = document.getElementById("address");
const confirmOverlay = document.getElementById("confirmOverlay");
const closeConfirm = document.getElementById("closeConfirm");

// إضافة المنتجات
document.querySelectorAll(".product .btn.add").forEach(btn => {
  btn.addEventListener("click", e => {
    const card = e.currentTarget.closest(".product");
    const id = card.dataset.id;
    const name = card.dataset.name;
    const existing = cart.find(i => i.id === id);
    if (existing) existing.qty++;
    else cart.push({ id, name, price: PRICE, qty: 1 });
    updateCartUI();
    // نبضة لطيفة
    e.currentTarget.classList.add("pulse");
    setTimeout(()=>e.currentTarget.classList.remove("pulse"), 400);
  });
});

// تحديث الواجهات
function updateCartUI(){
  const items = cart.reduce((s,i)=> s + i.qty, 0);
  const total = cart.reduce((s,i)=> s + i.qty * i.price, 0);

  cartCount.textContent = items;
  cartTotal.textContent = total.toFixed(0);

  // صفحة السلة
  if (cartItems){
    cartItems.innerHTML = "";
    cart.forEach(i=>{
      const row = document.createElement("div");
      row.className = "cart-item";
      row.innerHTML = `
        <span class="title">${i.name}</span>
        <div class="qty">
          <button data-op="dec">-</button>
          <span>${i.qty}</span>
          <button data-op="inc">+</button>
          <span style="margin-inline-start:8px">${i.price*i.qty} MAD</span>
        </div>
      `;
      // تحكم بالكمية
      row.querySelector('[data-op="inc"]').onclick = ()=>{ i.qty++; updateCartUI(); };
      row.querySelector('[data-op="dec"]').onclick = ()=>{
        i.qty--; if (i.qty<=0){ const idx = cart.indexOf(i); cart.splice(idx,1); }
        updateCartUI();
      };
      cartItems.appendChild(row);
    });

    const subtotal = total;
    const hasCoupon = (couponInput && couponInput.value.trim() === COUPON) || false;
    const discount = hasCoupon ? Math.round(subtotal * DISCOUNT) : 0;
    const grand = subtotal - discount;

    cartTotalPage.textContent = subtotal.toFixed(0);
    discountPage.textContent = discount.toFixed(0);
    grandTotalPage.textContent = grand.toFixed(0);
  }
}

// خصم مباشر عند إدخال الكوبون
if (couponInput){
  couponInput.addEventListener("input", ()=> updateCartUI());
}

// تأكيد الطلب
if (checkoutForm){
  checkoutForm.addEventListener("submit", e=>{
    e.preventDefault();
    if (!addressInput.value.trim()){
      addressInput.focus();
      addressInput.reportValidity();
      return;
    }
    // عرض التوثيق الأخضر المتحرك
    confirmOverlay.classList.add("show");
    // تفريغ السلة شكلياً
    cart.length = 0;
    updateCartUI();
    checkoutForm.reset();
  });
}
if (closeConfirm){
  closeConfirm.addEventListener("click", ()=> confirmOverlay.classList.remove("show"));
  confirmOverlay.addEventListener("click", (e)=>{ if(e.target===confirmOverlay) confirmOverlay.classList.remove("show"); });
}

// إظهار الأقسام بسلاسة عند التمرير
const revealObserver = new IntersectionObserver((entries)=>{
  entries.forEach(ent=>{
    if (ent.isIntersecting){ ent.target.classList.add("visible"); revealObserver.unobserve(ent.target); }
  });
},{threshold:.15});
document.querySelectorAll(".reveal").forEach(sec => revealObserver.observe(sec));

// سويتش سريع عبر الـ Option
const quick = document.getElementById("quickSwitch");
if (quick){
  quick.addEventListener("change", ()=>{
    const val = quick.value;
    if (val === "instagram"){
      window.open("https://www.instagram.com/bakhira.store2025?igsh=MTkyNHlvdGw5aDgxMw==", "_blank");
    }else{
      document.querySelector(val)?.scrollIntoView({behavior:"smooth"});
    }
  });
}