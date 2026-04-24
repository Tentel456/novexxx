"use client";

import Script from "next/script";
import P2PHeader from "@/components/layout/P2PHeader";
import "./main.css";
import "./p2p.css";

export default function P2PPage() {
  const handleScriptLoad = () => {
    console.log("P2P script loaded successfully");
  };

  const handleScriptError = () => {
    console.error("Failed to load P2P script");
  };

  return (
    <>
      <P2PHeader />

      <section className="p2p-top-banners" aria-label="Промо баннеры">
        <div className="container">
          <div className="p2p-top-banners__inner">
            <a className="p2p-top-banner p2p-top-banner--commission" href="#">
              <div className="p2p-top-banner__content">
                <p className="p2p-top-banner__title">Нулевая комиссия на P2P</p>
                <p className="p2p-top-banner__text">Покупайте и продавайте криптовалюту без комиссий</p>
              </div>
            </a>
            <div className="p2p-top-banners__divider" aria-hidden="true"></div>
            <a className="p2p-top-banner p2p-top-banner--referral" href="#">
              <div className="p2p-top-banner__content">
                <p className="p2p-top-banner__title">Приглашайте друзей</p>
                <p className="p2p-top-banner__text">
                  и получайте до <span className="p2p-top-banner__accent">30%</span> с каждой сделки
                </p>
              </div>
              <span className="p2p-top-banner__btn">Подробнее</span>
              <span className="p2p-top-banner__close" role="button" tabIndex={0} aria-label="Закрыть баннеры">
                ×
              </span>
            </a>
          </div>
        </div>
      </section>

      <main className="p2p-page">
        <section className="p2p-shell">
          <div className="p2p-topbar">
            <div className="p2p-topbar__left">
              <h1 className="p2p-logo">P2P</h1>
              <div className="p2p-trade-switch" role="tablist" aria-label="Режим торговли">
                <button className="p2p-trade-switch__btn is-active" type="button" data-side="buy">
                  Купить
                </button>
                <button className="p2p-trade-switch__btn p2p-trade-switch__btn--sell" type="button" data-side="sell">
                  Продать
                </button>
              </div>
            </div>
            <div className="p2p-topbar__actions">
              <div className="dropdown topbar-dropdown" data-dropdown>
                <button className="topbar-btn topbar-btn--ghost" type="button" data-dropdown-toggle>
                  Мои ордера
                  <span className="dropdown-chevron" aria-hidden="true"></span>
                </button>
                <div className="dropdown-menu dropdown-menu--orders" hidden>
                  <p className="orders-menu__title">Мои ордера</p>
                  <ul className="orders-menu__list">
                    <li>
                      <button type="button" className="orders-menu__item" data-close-dropdown>
                        <span>Открытые ордера</span>
                      </button>
                    </li>
                    <li>
                      <button type="button" className="orders-menu__item" data-close-dropdown>
                        <span>Оплаченные ордера</span>
                      </button>
                    </li>
                    <li>
                      <button type="button" className="orders-menu__item" data-close-dropdown>
                        <span>Отмененные ордера</span>
                      </button>
                    </li>
                    <li>
                      <button type="button" className="orders-menu__item" data-close-dropdown>
                        <span>Архив ордеров</span>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
              <button className="topbar-btn topbar-btn--primary" type="button">
                <img className="topbar-btn__icon" src="/p2p/img/add.svg" alt="" width="18" height="18" aria-hidden="true" />
                Создать объявление
              </button>
            </div>
          </div>

          <div className="p2p-filters">
            <div className="field field--coin field--coin-static" aria-label="Валюта: USDT">
              <img className="coin-logo" src="/p2p/img/usdt-logo.svg" alt="" width="20" height="20" />
              <span>USDT</span>
            </div>
            <div className="p2p-amount-fiat-field">
              <label className="p2p-amount-fiat-field__input-wrap">
                <input
                  id="amount-input"
                  className="p2p-amount-fiat-field__input"
                  type="text"
                  inputMode="decimal"
                  placeholder="Введите сумму"
                />
              </label>
              <span className="p2p-amount-fiat-field__rule" aria-hidden="true"></span>
              <div className="dropdown p2p-amount-fiat-field__fiat" data-dropdown data-filter="fiat">
                <button className="p2p-amount-fiat-field__fiat-btn" type="button" data-dropdown-toggle>
                  <span className="p2p-amount-fiat-field__fiat-meta">
                    <span className="p2p-amount-fiat-field__fiat-flag" data-fiat-flag>
                      <img data-fiat-img src="/p2p/img/ru.jpg" alt="" loading="lazy" />
                    </span>
                    <span data-dropdown-value>RUB</span>
                  </span>
                  <span className="dropdown-chevron" aria-hidden="true"></span>
                </button>
                <div className="dropdown-menu dropdown-menu--currency" hidden>
                  <div className="currency-search">
                    <span className="currency-search__icon" aria-hidden="true">
                      <img src="/p2p/img/search-logo.svg" alt="" width="16" height="16" />
                    </span>
                    <input type="text" placeholder="Поиск валюты" data-currency-search />
                  </div>
                  <p className="currency-title">Фиатные валюты</p>
                  <ul className="currency-list">
                    <li>
                      <button
                        type="button"
                        data-value="RUB"
                        data-label="RUB"
                        data-img="/p2p/img/ru.jpg"
                        className="currency-option is-selected"
                      >
                        <img className="currency-option__country-img" src="/p2p/img/ru.jpg" alt="" loading="lazy" />
                        <span className="currency-option__code">RUB</span>
                        <span className="currency-option__name">Российский рубль</span>
                        <span className="currency-option__check" aria-hidden="true">
                          <img src="/p2p/img/arrow-success.svg" alt="" width="18" height="14" />
                        </span>
                      </button>
                    </li>
                    <li>
                      <button type="button" data-value="USD" data-label="USD" data-img="/p2p/img/usa-flga.jpg" className="currency-option">
                        <img className="currency-option__country-img" src="/p2p/img/usa-flga.jpg" alt="" loading="lazy" />
                        <span className="currency-option__code">USD</span>
                        <span className="currency-option__name">Доллар США</span>
                        <span className="currency-option__check" aria-hidden="true">
                          <img src="/p2p/img/arrow-success.svg" alt="" width="18" height="14" />
                        </span>
                      </button>
                    </li>
                    <li>
                      <button type="button" data-value="EUR" data-label="EUR" data-img="/p2p/img/eur.jpg" className="currency-option">
                        <img className="currency-option__country-img" src="/p2p/img/eur.jpg" alt="" loading="lazy" />
                        <span className="currency-option__code">EUR</span>
                        <span className="currency-option__name">Евро</span>
                        <span className="currency-option__check" aria-hidden="true">
                          <img src="/p2p/img/arrow-success.svg" alt="" width="18" height="14" />
                        </span>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="dropdown" data-dropdown data-filter="payment">
              <button className="field field--select" type="button" data-dropdown-toggle>
                <span data-dropdown-value>Все способы оплаты</span>
                <span className="dropdown-chevron" aria-hidden="true"></span>
              </button>
              <div className="dropdown-menu dropdown-menu--payment" hidden>
                <div className="payment-search">
                  <span className="payment-search__icon" aria-hidden="true">
                    <img src="/p2p/img/search-logo.svg" alt="" width="16" height="16" />
                  </span>
                  <input type="text" placeholder="Поиск способа" data-payment-search />
                </div>
                <div className="payment-panel">
                  <p className="payment-section-title">Рекомендуемые</p>
                  <ul className="payment-list">
                    <li>
                      <label className="payment-checkbox" htmlFor="pay-sber">
                        <input id="pay-sber" type="checkbox" data-payment-checkbox value="Сбербанк" defaultChecked />
                        <span className="payment-checkbox__box" aria-hidden="true"></span>
                        <span className="payment-checkbox__logo" aria-hidden="true">
                          <img src="/p2p/img/sber-logo.svg" alt="" width="28" height="28" loading="lazy" />
                        </span>
                        <span className="payment-checkbox__name">Сбербанк</span>
                      </label>
                    </li>
                    <li>
                      <label className="payment-checkbox" htmlFor="pay-tinkoff">
                        <input id="pay-tinkoff" type="checkbox" data-payment-checkbox value="Тинькофф" defaultChecked />
                        <span className="payment-checkbox__box" aria-hidden="true"></span>
                        <span className="payment-checkbox__logo" aria-hidden="true">
                          <img src="/p2p/img/tbank-logo.svg" alt="" width="28" height="28" loading="lazy" />
                        </span>
                        <span className="payment-checkbox__name">Тинькофф</span>
                      </label>
                    </li>
                    <li>
                      <label className="payment-checkbox" htmlFor="pay-alfa">
                        <input id="pay-alfa" type="checkbox" data-payment-checkbox value="Альфа-Банк" defaultChecked />
                        <span className="payment-checkbox__box" aria-hidden="true"></span>
                        <span className="payment-checkbox__logo" aria-hidden="true">
                          <img src="/p2p/img/alpha.svg" alt="" width="28" height="28" loading="lazy" />
                        </span>
                        <span className="payment-checkbox__name">Альфа-Банк</span>
                      </label>
                    </li>
                    <li>
                      <label className="payment-checkbox" htmlFor="pay-vtb">
                        <input id="pay-vtb" type="checkbox" data-payment-checkbox value="ВТБ" defaultChecked />
                        <span className="payment-checkbox__box" aria-hidden="true"></span>
                        <span className="payment-checkbox__logo" aria-hidden="true">
                          <img src="/p2p/img/vtb.svg" alt="" width="28" height="28" loading="lazy" />
                        </span>
                        <span className="payment-checkbox__name">ВТБ</span>
                      </label>
                    </li>
                    <li>
                      <label className="payment-checkbox" htmlFor="pay-sbp">
                        <input id="pay-sbp" type="checkbox" data-payment-checkbox value="СБП" defaultChecked />
                        <span className="payment-checkbox__box" aria-hidden="true"></span>
                        <span className="payment-checkbox__logo" aria-hidden="true">
                          <img src="/p2p/img/sbp.svg" alt="" width="28" height="28" loading="lazy" />
                        </span>
                        <span className="payment-checkbox__name">СБП</span>
                      </label>
                    </li>
                  </ul>
                  <p className="payment-section-title">Другие способы</p>
                  <ul className="payment-list">
                    <li>
                      <label className="payment-checkbox" htmlFor="pay-raif">
                        <input id="pay-raif" type="checkbox" data-payment-checkbox value="Райффайзенбанк" />
                        <span className="payment-checkbox__box" aria-hidden="true"></span>
                        <span className="payment-checkbox__logo" aria-hidden="true">
                          <img src="/p2p/img/rfb.svg" alt="" width="28" height="28" loading="lazy" />
                        </span>
                        <span className="payment-checkbox__name">Райффайзенбанк</span>
                      </label>
                    </li>
                    <li>
                      <label className="payment-checkbox" htmlFor="pay-gazprom">
                        <input id="pay-gazprom" type="checkbox" data-payment-checkbox value="Газпромбанк" />
                        <span className="payment-checkbox__box" aria-hidden="true"></span>
                        <span className="payment-checkbox__logo" aria-hidden="true">
                          <img src="/p2p/img/gpb.svg" alt="" width="28" height="28" loading="lazy" />
                        </span>
                        <span className="payment-checkbox__name">Газпромбанк</span>
                      </label>
                    </li>
                    <li>
                      <label className="payment-checkbox" htmlFor="pay-pochta">
                        <input id="pay-pochta" type="checkbox" data-payment-checkbox value="Почта Банк" />
                        <span className="payment-checkbox__box" aria-hidden="true"></span>
                        <span className="payment-checkbox__logo" aria-hidden="true">
                          <img src="/p2p/img/pb.svg" alt="" width="28" height="28" loading="lazy" />
                        </span>
                        <span className="payment-checkbox__name">Почта Банк</span>
                      </label>
                    </li>
                    <li>
                      <label className="payment-checkbox" htmlFor="pay-yoomoney">
                        <input id="pay-yoomoney" type="checkbox" data-payment-checkbox value="ЮMoney" />
                        <span className="payment-checkbox__box" aria-hidden="true"></span>
                        <span className="payment-checkbox__logo" aria-hidden="true">
                          <img src="/p2p/img/Ymoney.svg" alt="" width="28" height="28" loading="lazy" />
                        </span>
                        <span className="payment-checkbox__name">ЮMoney</span>
                      </label>
                    </li>
                    <li>
                      <label className="payment-checkbox" htmlFor="pay-ozon">
                        <input id="pay-ozon" type="checkbox" data-payment-checkbox value="Ozon Банк" />
                        <span className="payment-checkbox__box" aria-hidden="true"></span>
                        <span className="payment-checkbox__logo" aria-hidden="true">
                          <img src="/p2p/img/ozonbank.svg" alt="" width="28" height="28" loading="lazy" />
                        </span>
                        <span className="payment-checkbox__name">Ozon Банк</span>
                      </label>
                    </li>
                  </ul>
                  <button type="button" className="payment-select-all" data-payment-select-all>
                    Выбрать все
                  </button>
                </div>
              </div>
            </div>
            <div className="dropdown" data-dropdown data-filter="seller-advanced">
              <button className="field field--filter" type="button" data-dropdown-toggle>
                <span className="field--filter__icon">
                  <img src="/p2p/img/filter-logo.svg" alt="" width="18" height="18" />
                </span>
                <span className="field--filter__text">Фильтры продавца</span>
                <span className="dropdown-chevron" aria-hidden="true"></span>
              </button>
              <div className="dropdown-menu dropdown-menu--seller" hidden>
                <div className="seller-filter__head">
                  <p>Фильтры продавца</p>
                  <button type="button" className="seller-filter__link-btn" id="seller-reset-link">
                    Сбросить
                  </button>
                </div>
                <div className="seller-filter__row">
                  <div>
                    <p className="seller-filter__label">Только онлайн</p>
                    <p className="seller-filter__hint">Показывать только активных продавцов</p>
                  </div>
                  <button
                    type="button"
                    className="seller-switch is-on"
                    data-toggle-field="onlineOnly"
                    aria-pressed="true"
                  ></button>
                </div>
                <div className="seller-filter__row">
                  <div>
                    <p className="seller-filter__label">Только верифицированные</p>
                    <p className="seller-filter__hint">Продавцы с подтвержденной личностью</p>
                  </div>
                  <button
                    type="button"
                    className="seller-switch"
                    data-toggle-field="verifiedOnly"
                    aria-pressed="false"
                  ></button>
                </div>
                <div className="seller-filter__row">
                  <div>
                    <p className="seller-filter__label">Разрешить третьих лиц</p>
                    <p className="seller-filter__hint">Оплата от третьих лиц</p>
                  </div>
                  <button
                    type="button"
                    className="seller-switch"
                    data-toggle-field="thirdPartyOnly"
                    aria-pressed="false"
                  ></button>
                </div>
                <div className="seller-filter__group">
                  <p className="seller-filter__label">Количество ордеров</p>
                  <div className="seller-filter__inputs">
                    <input type="text" placeholder="Мин" data-seller-field="ordersMin" />
                    <input type="text" placeholder="Макс" data-seller-field="ordersMax" />
                  </div>
                </div>
                <div className="seller-filter__group">
                  <p className="seller-filter__label">Процент завершения</p>
                  <div className="seller-filter__inputs seller-filter__inputs--percent">
                    <div className="seller-filter__input-wrap">
                      <input type="text" placeholder="Мин" data-seller-field="completionMin" />
                      <span>%</span>
                    </div>
                    <div className="seller-filter__input-wrap">
                      <input type="text" placeholder="Макс" data-seller-field="completionMax" />
                      <span>%</span>
                    </div>
                  </div>
                </div>
                <div className="seller-filter__actions">
                  <button type="button" className="seller-filter__btn seller-filter__btn--ghost" id="seller-reset-btn">
                    Сбросить
                  </button>
                  <button type="button" className="seller-filter__btn seller-filter__btn--primary" id="seller-apply-btn">
                    Применить
                  </button>
                </div>
              </div>
            </div>
            <button className="search-btn" type="button" id="search-btn-wide">
              <span className="search-btn__icon">
                <img src="/p2p/img/search-logo.svg" alt="" width="16" height="16" />
              </span>
              Поиск
            </button>
          </div>

          <p className="p2p-status" id="p2p-status" hidden></p>

          <div className="p2p-table-wrap">
            <table className="p2p-table">
              <thead>
                <tr>
                  <th className="p2p-th__maker">
                    <span className="p2p-th__maker-full">Мейкер</span>
                    <span className="p2p-th__maker-short">Мейкер (процент завершенных сделок)</span>
                  </th>
                  <th>Цена</th>
                  <th>
                    <span className="p2p-th-avail-inner">Доступно / Лимиты</span>
                  </th>
                  <th className="p2p-th-pay">
                    <span className="p2p-th-pay-full">Способы оплаты</span>
                    <span className="p2p-th-pay-short">Оплата</span>
                  </th>
                  <th className="trade-head">Торговля</th>
                </tr>
              </thead>
              <tbody id="p2p-table-body">
                <tr>
                  <td colSpan={5} className="empty-cell">
                    Загрузка объявлений...
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p2p-footer">
            <div className="rows-select-wrap">
              <span className="rows-select__label">Показать на странице:</span>
              <div className="dropdown" data-dropdown data-filter="page-size">
                <button className="rows-select" type="button" data-dropdown-toggle>
                  <span data-dropdown-value>5</span>
                  <span className="rows-select__chevron dropdown-chevron" aria-hidden="true"></span>
                </button>
                <div className="dropdown-menu dropdown-menu--page-size" hidden>
                  <ul>
                    <li>
                      <button type="button" data-value="5" data-label="5">
                        5
                      </button>
                    </li>
                    <li>
                      <button type="button" data-value="10" data-label="10">
                        10
                      </button>
                    </li>
                    <li>
                      <button type="button" data-value="20" data-label="20">
                        20
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="pagination" id="pagination"></div>
          </div>
        </section>
      </main>

      <script
        id="p2p-fallback-data"
        type="application/json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              name: "AlphaTrader",
              completion: 99.3,
              orders: 1243,
              price: 91.24,
              asset: "USDT",
              available: 12435.21,
              min: 10000,
              max: 200000,
              payments: ["Тинькофф", "СБП"],
              online: true,
              verified: true,
              thirdParty: false
            },
            {
              name: "BitMaster",
              completion: 98.7,
              orders: 856,
              price: 91.25,
              asset: "USDT",
              available: 8763.50,
              min: 5000,
              max: 150000,
              payments: ["Сбербанк", "Тинькофф"],
              online: true,
              verified: true,
              thirdParty: false
            },
            {
              name: "CryptoMax",
              completion: 98.1,
              orders: 2321,
              price: 91.26,
              asset: "USDT",
              available: 15236.10,
              min: 10000,
              max: 300000,
              payments: ["СБП", "ВТБ", "Альфа-Банк"],
              online: true,
              verified: true,
              thirdParty: false
            },
            {
              name: "DreamMoney",
              completion: 98.4,
              orders: 532,
              price: 91.27,
              asset: "USDT",
              available: 8450.00,
              min: 5000,
              max: 130000,
              payments: ["СБП"],
              online: true,
              verified: true,
              thirdParty: false
            },
            {
              name: "EasyCrypto",
              completion: 99.0,
              orders: 765,
              price: 91.28,
              asset: "USDT",
              available: 20312.45,
              min: 20000,
              max: 500000,
              payments: ["Сбербанк", "Тинькофф", "СБП"],
              online: true,
              verified: true,
              thirdParty: false
            }
          ])
        }}
      />

      <Script 
        src="/p2p/p2p.js" 
        strategy="lazyOnload" 
        onLoad={handleScriptLoad}
        onError={handleScriptError}
      />
    </>
  );
}
