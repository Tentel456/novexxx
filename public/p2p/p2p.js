(function () {
  var state = {
    side: "buy",
    coin: "USDT",
    fiat: "RUB",
    paymentSelected: ["Сбербанк", "Тинькофф", "Альфа-Банк", "ВТБ", "СБП"],
    bank: "all",
    amount: "",
    page: 1,
    pageSize: 5,
    offers: [],
    sellerFilters: {
      onlineOnly: true,
      verifiedOnly: false,
      thirdPartyOnly: false,
      ordersMin: "",
      ordersMax: "",
      completionMin: "",
      completionMax: ""
    }
  };

  var tableBody = document.getElementById("p2p-table-body");
  var statusEl = document.getElementById("p2p-status");
  var paginationEl = document.getElementById("pagination");
  var amountInput = document.getElementById("amount-input");
  var searchBtn = document.getElementById("search-btn-wide") || document.getElementById("search-btn");
  var refreshBtn = document.getElementById("refresh-btn");
  var resetBtn = document.getElementById("reset-filters-btn");
  var sellerApplyBtn = document.getElementById("seller-apply-btn");
  var sellerResetBtn = document.getElementById("seller-reset-btn");
  var sellerResetLink = document.getElementById("seller-reset-link");

  if (!tableBody || !statusEl || !paginationEl) return;

  var PAYMENT_ALL_IDS = [
    "Сбербанк",
    "Тинькофф",
    "Альфа-Банк",
    "ВТБ",
    "СБП",
    "Райффайзенбанк",
    "Газпромбанк",
    "Почта Банк",
    "ЮMoney",
    "Ozon Банк"
  ];

  var PAYMENT_ICON_MAP = {
    Сбербанк: "/p2p/img/sber-logo.svg",
    Тинькофф: "/p2p/img/tbank-logo.svg",
    "Альфа-Банк": "/p2p/img/alpha.svg",
    ВТБ: "/p2p/img/vtb.svg",
    СБП: "/p2p/img/sbp.svg",
    Райффайзенбанк: "/p2p/img/rfb.svg",
    Газпромбанк: "/p2p/img/gpb.svg",
    "Почта Банк": "/p2p/img/pb.svg",
    ЮMoney: "/p2p/img/Ymoney.svg",
    "Ozon Банк": "/p2p/img/ozonbank.svg"
  };

  function parseFallbackData() {
    var node = document.getElementById("p2p-fallback-data");
    if (!node) return [];
    try {
      return JSON.parse(node.textContent || "[]");
    } catch (e) {
      return [];
    }
  }

  function normalizeOffer(raw) {
    var paymentsRaw = raw.payments || raw.payMethods || raw.payMethod || [];
    var payments = Array.isArray(paymentsRaw)
      ? paymentsRaw.map(function (item) {
          if (typeof item === "string") return item;
          return item && (item.name || item.payName || item.payType) ? String(item.name || item.payName || item.payType) : "";
        }).filter(Boolean)
      : String(paymentsRaw).split(",").map(function (item) { return item.trim(); }).filter(Boolean);

    var completion = Number(raw.completion || raw.orderCompleteRate || raw.completeRate || 0);
    var orders = Number(raw.orders || raw.tradeCount || raw.orderCount || 0);
    var min = Number(raw.min || raw.minTradeLimit || raw.tradeMinLimit || raw.minAmount || 0);
    var max = Number(raw.max || raw.maxTradeLimit || raw.tradeMaxLimit || raw.maxAmount || 0);

    return {
      name: raw.name || raw.nickName || raw.userName || "Unknown",
      completion: Number.isFinite(completion) ? completion : 0,
      orders: Number.isFinite(orders) ? orders : 0,
      price: Number(raw.price || raw.unitPrice || 0),
      asset: raw.asset || raw.coin || raw.coinCode || state.coin,
      available: Number(raw.available || raw.tradeCount || raw.amount || raw.tradableAmount || 0),
      min: Number.isFinite(min) ? min : 0,
      max: Number.isFinite(max) ? max : 0,
      payments: payments.length ? payments : ["СБП"],
      online: raw.online !== undefined ? Boolean(raw.online) : true,
      verified: raw.verified !== undefined ? Boolean(raw.verified) : completion >= 99,
      thirdParty: raw.thirdParty !== undefined ? Boolean(raw.thirdParty) : false
    };
  }

  function formatNum(value, maxFraction) {
    return new Intl.NumberFormat("ru-RU", {
      minimumFractionDigits: 0,
      maximumFractionDigits: maxFraction
    }).format(value);
  }

  var FIAT_FROM_RUB = {
    RUB: 1,
    USD: 1 / 92,
    EUR: 1 / 100,
    KZT: 5.55,
    UAH: 0.45,
    BYN: 0.036
  };

  function convertRubToFiat(amountRub, fiat) {
    var k = FIAT_FROM_RUB[fiat];
    if (k == null || !Number.isFinite(k)) k = 1;
    return amountRub * k;
  }

  function convertFiatToRub(amountFiat, fiat) {
    var k = FIAT_FROM_RUB[fiat];
    if (k == null || !Number.isFinite(k) || k === 0) k = 1;
    return amountFiat / k;
  }

  function escapeHtmlAttr(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;");
  }

  function paymentIconsHtml(payments) {
    var chunks = [];
    for (var i = 0; i < payments.length; i += 1) {
      var label = payments[i];
      var src = PAYMENT_ICON_MAP[label];
      if (src) {
        chunks.push(
          '<span class="pay-icons__item">' +
            '<span class="pay-icons__logo" aria-hidden="true">' +
            '<img src="' +
            escapeHtmlAttr(src) +
            '" alt="" width="20" height="20" loading="lazy" /></span>' +
            '<span class="pay-icons__name">' +
            escapeHtmlAttr(label) +
            "</span></span>"
        );
      } else {
        chunks.push(
          '<span class="pay-icons__item pay-icons__item--fallback">' +
            '<span class="pay-icons__name">' +
            escapeHtmlAttr(label) +
            "</span></span>"
        );
      }
    }
    return '<div class="pay-icons">' + chunks.join("") + "</div>";
  }

  function getFilteredOffers() {
    var amount = Number(String(state.amount).replace(",", "."));
    var hasAmount = Number.isFinite(amount) && amount > 0;
    var seller = state.sellerFilters;
    var ordersMin = Number(seller.ordersMin);
    var ordersMax = Number(seller.ordersMax);
    var completionMin = Number(seller.completionMin);
    var completionMax = Number(seller.completionMax);
    var hasOrdersMin = Number.isFinite(ordersMin) && seller.ordersMin !== "";
    var hasOrdersMax = Number.isFinite(ordersMax) && seller.ordersMax !== "";
    var hasCompletionMin = Number.isFinite(completionMin) && seller.completionMin !== "";
    var hasCompletionMax = Number.isFinite(completionMax) && seller.completionMax !== "";

    return state.offers.filter(function (offer) {
      if (state.coin && offer.asset && offer.asset !== state.coin) return false;
      var payN = state.paymentSelected.length;
      var allPay = PAYMENT_ALL_IDS.length;
      if (payN > 0 && payN < allPay) {
        var payHit = false;
        for (var pi = 0; pi < state.paymentSelected.length; pi += 1) {
          if (offer.payments.indexOf(state.paymentSelected[pi]) !== -1) {
            payHit = true;
            break;
          }
        }
        if (!payHit) return false;
      }
      if (state.bank !== "all" && offer.payments.indexOf(state.bank) === -1) return false;
      if (hasAmount) {
        var amountRub = convertFiatToRub(amount, state.fiat);
        if (amountRub < offer.min || amountRub > offer.max) return false;
      }
      if (seller.onlineOnly && !offer.online) return false;
      if (seller.verifiedOnly && !offer.verified) return false;
      if (seller.thirdPartyOnly && !offer.thirdParty) return false;
      if (hasOrdersMin && offer.orders < ordersMin) return false;
      if (hasOrdersMax && offer.orders > ordersMax) return false;
      if (hasCompletionMin && offer.completion < completionMin) return false;
      if (hasCompletionMax && offer.completion > completionMax) return false;
      return true;
    });
  }

  var maxPages = 5;

  function renderTable() {
    var offers = getFilteredOffers();
    var totalPages = Math.min(maxPages, Math.max(1, Math.ceil(offers.length / state.pageSize)));
    if (state.page > totalPages) state.page = totalPages;
    var start = (state.page - 1) * state.pageSize;
    var pageItems = offers.slice(start, start + state.pageSize);
    var tradeLabel = state.side === "sell" ? "Продать" : "Купить";
    var tradeBtnClass = state.side === "sell" ? "buy-btn buy-btn--sell" : "buy-btn";

    function tradeButtonLabel(offer) {
      var asset = offer.asset || state.coin || "USDT";
      return tradeLabel + " " + asset;
    }

    if (!pageItems.length) {
      tableBody.innerHTML = '<tr><td colspan="5" class="empty-cell">Нет объявлений под выбранные фильтры.</td></tr>';
    } else {
      tableBody.innerHTML = pageItems
        .map(function (offer) {
          var initial = offer.name ? offer.name.charAt(0).toUpperCase() : "U";
          var priceFiat = convertRubToFiat(offer.price, state.fiat);
          var minFiat = convertRubToFiat(offer.min, state.fiat);
          var maxFiat = convertRubToFiat(offer.max, state.fiat);
          return (
            '<tr class="p2p-row">' +
            '<td><div class="maker"><span class="avatar">' + initial + '</span><div><p class="maker-name" title="' + escapeHtmlAttr(offer.name) + '">' + offer.name + "</p>" +
            '<p class="maker-meta">' +
              '<span class="maker-meta__row maker-meta__row--completion">' +
              formatNum(offer.completion, 1) +
              "%</span>" +
              '<span class="maker-meta__sep" aria-hidden="true"> | </span>' +
              '<span class="maker-meta__row maker-meta__row--orders">' +
              formatNum(offer.orders, 0) +
              " ордеров</span></p></div></div></td>" +
            "<td><span class=\"price\">" +
            formatNum(priceFiat, 2) +
            '</span> <span class="price-fiat">' +
            state.fiat +
            "</span></td>" +
            '<td class="avail-cell">' +
              '<div class="avail-cell__inner">' +
              '<div class="avail-row">' +
              '<span class="avail-row__label">Доступно</span>' +
              '<span class="avail-row__value">' +
              formatNum(offer.available, 2) +
              " " +
              (offer.asset || state.coin) +
              "</span>" +
              "</div>" +
              '<div class="avail-row">' +
              '<span class="avail-row__label">Лимиты</span>' +
              '<span class="avail-row__value">' +
              formatNum(minFiat, 0) +
              " \u2013 " +
              formatNum(maxFiat, 0) +
              " " +
              state.fiat +
              "</span>" +
              "</div>" +
              "</div>" +
              "</td>" +
            '<td class="pay">' + paymentIconsHtml(offer.payments) + "</td>" +
            '<td><button class="' + tradeBtnClass + '" type="button">' + tradeButtonLabel(offer) + "</button></td>" +
            "</tr>"
          );
        })
        .join("");
    }

    renderPagination(totalPages);
  }

  function renderPagination(totalPages) {
    function pageButton(label, page, isActive, isDisabled) {
      return (
        '<button type="button" class="page-btn' + (isActive ? " page-btn--active" : "") + '" data-page="' + page + '"' +
        (isDisabled ? " disabled" : "") + ">" + label + "</button>"
      );
    }

    var html = pageButton("‹", Math.max(1, state.page - 1), false, state.page === 1);
    for (var i = 1; i <= totalPages; i += 1) {
      if (totalPages > 7 && i > 2 && i < totalPages - 1 && Math.abs(i - state.page) > 1) {
        if (i === 3 || i === totalPages - 2) html += '<span class="page-dots">...</span>';
        continue;
      }
      html += pageButton(String(i), i, i === state.page, false);
    }
    html += pageButton("›", Math.min(totalPages, state.page + 1), false, state.page === totalPages);
    paginationEl.innerHTML = html;
  }

  function closeAllDropdowns(except) {
    document.querySelectorAll("[data-dropdown]").forEach(function (wrap) {
      if (except && wrap === except) return;
      wrap.classList.remove("is-open");
      var menu = wrap.querySelector(".dropdown-menu");
      if (menu) menu.setAttribute("hidden", "");
    });
  }

  function setupDropdowns() {
    document.querySelectorAll("[data-dropdown]").forEach(function (wrap) {
      var toggle = wrap.querySelector("[data-dropdown-toggle]");
      var menu = wrap.querySelector(".dropdown-menu");
      var valueNode = wrap.querySelector("[data-dropdown-value]");
      if (!toggle || !menu) return;

      toggle.addEventListener("click", function (e) {
        e.stopPropagation();
        var willOpen = !wrap.classList.contains("is-open");
        closeAllDropdowns(wrap);
        wrap.classList.toggle("is-open", willOpen);
        if (willOpen) menu.removeAttribute("hidden");
        else menu.setAttribute("hidden", "");
      });

      menu.addEventListener("click", function (e) {
        e.stopPropagation();
      });

      menu.querySelectorAll("[data-close-dropdown]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          closeAllDropdowns();
        });
      });

      menu.querySelectorAll("button[data-value]").forEach(function (optionBtn) {
        optionBtn.addEventListener("click", function () {
          if (!valueNode) return;
          var value = optionBtn.getAttribute("data-value");
          var displayLabel = optionBtn.getAttribute("data-label") || optionBtn.textContent.trim();
          valueNode.textContent = displayLabel;

          menu.querySelectorAll("button[data-value]").forEach(function (btn) {
            btn.classList.remove("is-selected");
          });
          optionBtn.classList.add("is-selected");

          var filterType = wrap.getAttribute("data-filter");
          if (filterType === "coin") state.coin = value;
          else if (filterType === "fiat") {
            state.fiat = value;
            var fiatImg = wrap.querySelector("[data-fiat-img]");
            var imgSrc = optionBtn.getAttribute("data-img");
            if (fiatImg && imgSrc) fiatImg.setAttribute("src", imgSrc);
          }
          else if (filterType === "page-size") state.pageSize = Number(value) || 5;
          else if (filterType === "bank") state.bank = value;

          state.page = 1;
          closeAllDropdowns();
          renderTable();
        });
      });
    });

    document.addEventListener("click", function () {
      closeAllDropdowns();
    });
  }

  function setupCurrencySearch() {
    document.querySelectorAll("[data-currency-search]").forEach(function (input) {
      input.addEventListener("click", function (e) {
        e.stopPropagation();
      });

      input.addEventListener("input", function () {
        var query = input.value.trim().toLowerCase();
        var menu = input.closest(".dropdown-menu--currency");
        if (!menu) return;
        menu.querySelectorAll(".currency-list li").forEach(function (item) {
          var text = item.textContent.toLowerCase();
          item.style.display = text.indexOf(query) >= 0 ? "" : "none";
        });
      });
    });
  }

  function readPaymentSelectionFromDOM() {
    var selected = [];
    document.querySelectorAll('[data-filter="payment"] [data-payment-checkbox]').forEach(function (cb) {
      if (cb.checked) selected.push(cb.value);
    });
    return selected;
  }

  function updatePaymentButtonLabel() {
    var wrap = document.querySelector('[data-filter="payment"]');
    var node = wrap && wrap.querySelector("[data-dropdown-value]");
    if (!node) return;
    var sel = state.paymentSelected;
    var n = sel.length;
    if (n === 0 || n === PAYMENT_ALL_IDS.length) {
      node.textContent = "Все способы оплаты";
      return;
    }
    if (n <= 2) {
      node.textContent = sel.join(", ");
      return;
    }
    node.textContent = sel.slice(0, 2).join(", ") + " +" + (n - 2);
  }

  function syncPaymentCheckboxesFromState() {
    document.querySelectorAll('[data-filter="payment"] [data-payment-checkbox]').forEach(function (cb) {
      cb.checked = state.paymentSelected.indexOf(cb.value) !== -1;
    });
  }

  function setupPaymentMethods() {
    var wrap = document.querySelector('[data-filter="payment"]');
    if (!wrap) return;

    function applySelection() {
      state.paymentSelected = readPaymentSelectionFromDOM();
      updatePaymentButtonLabel();
      state.page = 1;
      renderTable();
    }

    wrap.querySelectorAll("[data-payment-checkbox]").forEach(function (cb) {
      cb.addEventListener("change", function (e) {
        e.stopPropagation();
        applySelection();
      });
      cb.addEventListener("click", function (e) {
        e.stopPropagation();
      });
    });

    var selectAllBtn = wrap.querySelector("[data-payment-select-all]");
    if (selectAllBtn) {
      selectAllBtn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        wrap.querySelectorAll("[data-payment-checkbox]").forEach(function (cb) {
          cb.checked = true;
        });
        applySelection();
      });
    }

    syncPaymentCheckboxesFromState();
    updatePaymentButtonLabel();
  }

  function setupPaymentSearch() {
    document.querySelectorAll("[data-payment-search]").forEach(function (input) {
      input.addEventListener("click", function (e) {
        e.stopPropagation();
      });

      input.addEventListener("input", function () {
        var query = input.value.trim().toLowerCase();
        var menu = input.closest(".dropdown-menu--payment");
        if (!menu) return;
        menu.querySelectorAll(".dropdown-menu--payment .payment-panel li").forEach(function (item) {
          var text = item.textContent.toLowerCase();
          item.style.display = text.indexOf(query) >= 0 ? "" : "none";
        });
      });
    });
  }

  function readSellerFiltersFromUI() {
    var result = {
      onlineOnly: true,
      verifiedOnly: false,
      thirdPartyOnly: false,
      ordersMin: "",
      ordersMax: "",
      completionMin: "",
      completionMax: ""
    };

    document.querySelectorAll("[data-toggle-field]").forEach(function (toggle) {
      var key = toggle.getAttribute("data-toggle-field");
      if (!key) return;
      result[key] = toggle.classList.contains("is-on");
    });

    document.querySelectorAll("[data-seller-field]").forEach(function (input) {
      var key = input.getAttribute("data-seller-field");
      if (!key) return;
      result[key] = input.value.trim();
    });

    return result;
  }

  function applySellerFiltersToUI(filters) {
    document.querySelectorAll("[data-toggle-field]").forEach(function (toggle) {
      var key = toggle.getAttribute("data-toggle-field");
      if (!key) return;
      var enabled = Boolean(filters[key]);
      toggle.classList.toggle("is-on", enabled);
      toggle.setAttribute("aria-pressed", enabled ? "true" : "false");
    });

    document.querySelectorAll("[data-seller-field]").forEach(function (input) {
      var key = input.getAttribute("data-seller-field");
      if (!key) return;
      input.value = filters[key] || "";
    });
  }

  function resetSellerFilterValues() {
    state.sellerFilters = {
      onlineOnly: true,
      verifiedOnly: false,
      thirdPartyOnly: false,
      ordersMin: "",
      ordersMax: "",
      completionMin: "",
      completionMax: ""
    };
    applySellerFiltersToUI(state.sellerFilters);
  }

  function setupSellerFilters() {
    document.querySelectorAll("[data-toggle-field]").forEach(function (toggle) {
      toggle.addEventListener("click", function () {
        var willEnable = !toggle.classList.contains("is-on");
        toggle.classList.toggle("is-on", willEnable);
        toggle.setAttribute("aria-pressed", willEnable ? "true" : "false");
      });
    });

    function doReset() {
      resetSellerFilterValues();
      state.page = 1;
      renderTable();
      closeAllDropdowns();
    }

    if (sellerResetBtn) sellerResetBtn.addEventListener("click", doReset);
    if (sellerResetLink) sellerResetLink.addEventListener("click", doReset);

    if (sellerApplyBtn) {
      sellerApplyBtn.addEventListener("click", function () {
        state.sellerFilters = readSellerFiltersFromUI();
        state.page = 1;
        renderTable();
        closeAllDropdowns();
      });
    }
  }

  function setupTabs() {
    var tabs = document.querySelectorAll(".p2p-trade-switch__btn");
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (item) {
          item.classList.remove("is-active");
        });
        tab.classList.add("is-active");
        state.side = tab.getAttribute("data-side") === "sell" ? "sell" : "buy";
        renderTable();
      });
    });
  }

  function setupControls() {
    paginationEl.addEventListener("click", function (e) {
      var btn = e.target.closest(".page-btn[data-page]");
      if (!btn || btn.disabled) return;
      state.page = Number(btn.getAttribute("data-page")) || 1;
      renderTable();
    });

    if (amountInput) {
      amountInput.addEventListener("input", function () {
        state.amount = amountInput.value.trim();
      });
    }

    if (searchBtn) {
      searchBtn.addEventListener("click", function () {
        state.page = 1;
        renderTable();
      });
    }

    if (refreshBtn) {
      refreshBtn.addEventListener("click", function () {
        loadOffers(true);
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        state.paymentSelected = [];
        document.querySelectorAll('[data-filter="payment"] [data-payment-checkbox]').forEach(function (cb) {
          cb.checked = false;
        });
        updatePaymentButtonLabel();
        state.bank = "all";
        state.amount = "";
        state.page = 1;
        if (amountInput) amountInput.value = "";
        var labels = document.querySelectorAll("[data-dropdown-value]");
        if (labels[1]) labels[1].textContent = "Все способы оплаты";
        resetSellerFilterValues();
        renderTable();
      });
    }
  }

  function setupTopBannersClose() {
    var banners = document.querySelector(".p2p-top-banners");
    var closeBtn = document.querySelector(".p2p-top-banner__close");
    if (!banners || !closeBtn) return;

    function hideBanners(event) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      banners.style.display = "none";
    }

    closeBtn.addEventListener("click", hideBanners);
    closeBtn.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        hideBanners(event);
      }
    });
  }

  function mapHtxPayload(payload) {
    var list = [];
    if (payload && Array.isArray(payload.data)) list = payload.data;
    else if (payload && payload.data && Array.isArray(payload.data.list)) list = payload.data.list;
    else if (payload && Array.isArray(payload.list)) list = payload.list;
    return list.map(normalizeOffer).filter(function (item) {
      return Number.isFinite(item.price) && item.price > 0;
    });
  }

  async function fetchHtxOffers() {
    var endpoints = [
      "https://otc-api.htx.com/v1/data/trade-market",
      "https://otc-api.huobi.pro/v1/data/trade-market"
    ];

    var payload = {
      coinId: 2,
      currency: 11,
      tradeType: state.side === "sell" ? "buy" : "sell",
      currPage: 1,
      payMethod: 0,
      acceptOrder: -1,
      online: 1,
      amount: 0
    };

    for (var i = 0; i < endpoints.length; i += 1) {
      var endpoint = endpoints[i];
      try {
        var response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!response.ok) continue;
        var data = await response.json();
        var mapped = mapHtxPayload(data);
        if (mapped.length) return { source: "htx", items: mapped };
      } catch (e) {}
    }
    throw new Error("HTX API unavailable");
  }

  async function loadOffers(forceRefresh) {
    if (forceRefresh) statusEl.textContent = "Обновляем объявления...";
    else statusEl.textContent = "Загрузка объявлений...";
    statusEl.hidden = false;

    try {
      var result = await fetchHtxOffers();
      state.offers = result.items;
    } catch (e) {
      state.offers = parseFallbackData().map(normalizeOffer);
    }

    statusEl.textContent = "";
    statusEl.hidden = true;

    state.page = 1;
    renderTable();
  }

  setupDropdowns();
  setupCurrencySearch();
  setupPaymentSearch();
  setupPaymentMethods();
  setupSellerFilters();
  setupTabs();
  setupControls();
  setupTopBannersClose();
  loadOffers(false);
})();
