document.querySelectorAll(".lang-select-header").forEach(select => {
    const current = select.querySelector(".lang-current-header");
    const text = select.querySelector(".lang-text-header");
    const list = select.querySelector(".lang-list-header");
    const items = list.querySelectorAll("li");

    // открыть / закрыть текущий селект
    current.addEventListener("click", (e) => {
        e.stopPropagation();

        // закрываем все остальные прежде чем открыть этот
        document.querySelectorAll(".lang-select-header.active").forEach(other => {
            if (other !== select) other.classList.remove("active");
        });

        select.classList.toggle("active");
    });

    // выбор языка
    items.forEach(item => {
        item.addEventListener("click", () => {
            text.textContent = item.dataset.lang;
            select.classList.remove("active");
        });
    });
});

// закрытие кликом вне всех селектов
document.addEventListener("click", () => {
    document.querySelectorAll(".lang-select-header.active").forEach(select => {
        select.classList.remove("active");
    });
});


const burger = document.querySelector('.burger');
const menu = document.querySelector('.menu');
const body = document.body

burger.addEventListener('click', () => {
    burger.classList.toggle('active--menu');
    menu.classList.toggle('active--menu');
    body.classList.toggle('lock')
});

const box = document.getElementById('cryptoBox');
const dropdown = document.getElementById('cryptoDropdown');
const arrow = document.getElementById('cryptoArrow');
const icon = document.getElementById('cryptoIcon');
const valueText = document.getElementById('cryptoValue');


function toggleDrop() {
const open = box.classList.toggle('open');
dropdown.style.display = open ? 'block' : 'none';
}


document.querySelectorAll('.crypto-item').forEach(item => {
item.addEventListener('click', () => {
icon.src = item.dataset.icon;
valueText.textContent = item.dataset.value;
box.classList.remove('open');
dropdown.style.display = 'none';
});
});


window.addEventListener('click', (e) => {
if (!box.contains(e.target)) {
box.classList.remove('open');
dropdown.style.display = 'none';
}
});


const select = document.getElementById("countrySelect");
const selected = select.querySelector(".selected");
const options = select.querySelector(".options");
const selectedFlag = selected.querySelector(".flag");
const selectedText = selected.querySelector("span");

selected.addEventListener("click", () => {
    select.classList.toggle("open");
});

select.querySelectorAll(".option").forEach(option => {
    option.addEventListener("click", () => {
        const value = option.getAttribute("data-value");
        const flag = option.getAttribute("data-flag");

        selectedFlag.src = flag;
        selectedText.textContent = value;

        select.classList.remove("open");
    });
});

// Закрытие при клике вне
document.addEventListener("click", (e) => {
    if (!select.contains(e.target)) {
        select.classList.remove("open");
    }
});


const boxPayment = document.getElementById("paymentBox");
const text = document.getElementById("paymentText");
const optionsPayment = box.querySelector(".payment-options");

boxPayment.addEventListener("click", () => {
    boxPayment.classList.toggle("open");
});

boxPayment.querySelectorAll(".payment-option").forEach(option => {
    option.addEventListener("click", (e) => {
        e.stopPropagation();

        const value = option.getAttribute("data-value");
        text.textContent = value;

        boxPayment.classList.remove("open");
    });
});

// Убрать, если клик вне
document.addEventListener("click", (e) => {
    if (!boxPayment.contains(e.target)) {
        boxPayment.classList.remove("open");
    }
});


const btnBuy = document.querySelector(".btn-buy");
  const btnSell = document.querySelector(".btn-sell");

  const wrapperBuy = document.querySelector(".wrapper-trade-p2p-2");
  const wrapperSell = document.querySelector(".wrapper-trade-p2p-1");

  // Стартовое состояние
  wrapperBuy.classList.add("active");

  btnBuy.addEventListener("click", () => {
    btnBuy.classList.add("active");
    btnSell.classList.remove("active");

    wrapperBuy.classList.add("active");
    wrapperSell.classList.remove("active");
  });

  btnSell.addEventListener("click", () => {
    btnSell.classList.add("active");
    btnBuy.classList.remove("active");

    wrapperSell.classList.add("active");
    wrapperBuy.classList.remove("active");
  });


  