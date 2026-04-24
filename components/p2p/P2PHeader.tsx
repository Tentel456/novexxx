import Link from "next/link";

export default function P2PHeader() {
  return (
    <div className="flex justify-between items-center py-10 border-b border-gray-800">
      <Link
        href="/p2p"
        className="text-xl font-bold border-b-2 border-[#00cbff] pb-1"
      >
        P2P
      </Link>
      
      <ul className="flex gap-11 items-center">
        <li>
          <Link href="/p2p/orders" className="text-sm font-bold hover:text-[#00cbff] transition">
            Мои ордера
          </Link>
        </li>
        <li>
          <Link href="/p2p/profile" className="text-sm font-bold hover:text-[#00cbff] transition">
            Мой профиль
          </Link>
        </li>
      </ul>
    </div>
  );
}
