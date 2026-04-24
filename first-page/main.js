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