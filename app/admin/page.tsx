"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import P2PHeader from "@/components/layout/P2PHeader";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

interface User {
  id: string;
  email: string;
  created_at: string;
  user_metadata?: {
    avatar_url?: string;
    full_name?: string;
  };
}

interface UserProfile {
  user_id: string;
  referral_code?: string;
  total_deposits: number;
  balance: number;
}

interface Ticket {
  id: string;
  user_id: string;
  subject: string;
  status: 'open' | 'in_progress' | 'closed';
  created_at: string;
  updated_at: string;
  user_email?: string;
  unread_count?: number;
}

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'tickets' | 'users'>('tickets');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [userProfiles, setUserProfiles] = useState<Record<string, UserProfile>>({});
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUserEmail, setCurrentUserEmail] = useState("");

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/auth');
      return;
    }

    setCurrentUserEmail(user.email || '');

    // ВРЕМЕННО: Разрешаем доступ любому авторизованному пользователю
    // TODO: Добавить проверку роли из базы данных
    // Для продакшена раскомментируйте строки ниже и добавьте свой email:
    
    // const adminEmails = ['your-email@gmail.com']; // Замените на ваш email
    // if (!adminEmails.includes(user.email || '')) {
    //   router.push('/');
    //   return;
    // }

    setIsAdmin(true);
    loadData();
  };

  const loadData = async () => {
    setLoading(true);
    await Promise.all([loadTickets(), loadUsers()]);
    setLoading(false);
  };

  const loadTickets = async () => {
    // TODO: Загрузить тикеты из базы данных
    // Пока используем моковые данные
    const mockTickets: Ticket[] = [
      {
        id: '1',
        user_id: 'user1',
        subject: 'Проблема с пополнением счета',
        status: 'open',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        user_email: 'user1@example.com',
        unread_count: 3,
      },
      {
        id: '2',
        user_id: 'user2',
        subject: 'Вопрос по верификации',
        status: 'in_progress',
        created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        user_email: 'user2@example.com',
        unread_count: 1,
      },
      {
        id: '3',
        user_id: 'user3',
        subject: 'Не могу вывести средства',
        status: 'open',
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        user_email: 'user3@example.com',
        unread_count: 5,
      },
      {
        id: '4',
        user_id: 'user4',
        subject: 'Спасибо за помощь!',
        status: 'closed',
        created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        user_email: 'user4@example.com',
        unread_count: 0,
      },
    ];
    setTickets(mockTickets);
  };

  const loadUsers = async () => {
    const supabase = createClient();
    
    // Загружаем пользователей из auth.users (требует admin API)
    // Пока используем моковые данные
    const mockUsers: User[] = [
      {
        id: 'user1',
        email: 'user1@example.com',
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        user_metadata: {
          full_name: 'Иван Иванов',
        },
      },
      {
        id: 'user2',
        email: 'user2@example.com',
        created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        user_metadata: {
          full_name: 'Петр Петров',
        },
      },
      {
        id: 'user3',
        email: 'user3@example.com',
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        user_metadata: {
          full_name: 'Мария Сидорова',
        },
      },
      {
        id: 'current',
        email: currentUserEmail,
        created_at: new Date().toISOString(),
        user_metadata: {
          full_name: 'Вы (Админ)',
        },
      },
    ];

    const mockProfiles: Record<string, UserProfile> = {
      user1: {
        user_id: 'user1',
        referral_code: 'REF123',
        total_deposits: 5000,
        balance: 3200,
      },
      user2: {
        user_id: 'user2',
        referral_code: 'REF456',
        total_deposits: 10000,
        balance: 8500,
      },
      user3: {
        user_id: 'user3',
        total_deposits: 1000,
        balance: 950,
      },
      current: {
        user_id: 'current',
        referral_code: 'ADMIN2024',
        total_deposits: 50000,
        balance: 45000,
      },
    };

    setUsers(mockUsers);
    setUserProfiles(mockProfiles);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-700';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-700';
      case 'closed':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open':
        return 'Открыт';
      case 'in_progress':
        return 'В работе';
      case 'closed':
        return 'Закрыт';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} мин назад`;
    } else if (diffHours < 24) {
      return `${diffHours} ч назад`;
    } else if (diffDays < 7) {
      return `${diffDays} дн назад`;
    } else {
      return date.toLocaleDateString('ru-RU');
    }
  };

  const filteredTickets = tickets.filter(ticket =>
    ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.user_email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.user_metadata?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2b6aff]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <P2PHeader />
      
      <div className="container max-w-[1400px] mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#1e2329] mb-2">Панель администратора</h1>
          <p className="text-[#707a8a]">Управление тикетами поддержки и пользователями</p>
          <p className="text-xs text-[#2b6aff] mt-1">Вы вошли как: {currentUserEmail}</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-4">
          <div className="flex border-b border-[#eaecef]">
            <button
              onClick={() => setActiveTab('tickets')}
              className={`px-6 py-4 font-semibold text-sm transition ${
                activeTab === 'tickets'
                  ? 'text-[#2b6aff] border-b-2 border-[#2b6aff]'
                  : 'text-[#707a8a] hover:text-[#1e2329]'
              }`}
            >
              Тикеты поддержки
              {tickets.filter(t => t.status !== 'closed').length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                  {tickets.filter(t => t.status !== 'closed').length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-4 font-semibold text-sm transition ${
                activeTab === 'users'
                  ? 'text-[#2b6aff] border-b-2 border-[#2b6aff]'
                  : 'text-[#707a8a] hover:text-[#1e2329]'
              }`}
            >
              Пользователи
              <span className="ml-2 text-xs text-[#707a8a]">({users.length})</span>
            </button>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-[#eaecef]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={activeTab === 'tickets' ? 'Поиск по тикетам...' : 'Поиск по пользователям...'}
              className="w-full px-4 py-2 bg-[#fafafa] border border-[#eaecef] rounded-lg text-sm focus:outline-none focus:border-[#2b6aff]"
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2b6aff]"></div>
          </div>
        ) : (
          <>
            {/* Tickets Tab */}
            {activeTab === 'tickets' && (
              <div className="space-y-3">
                {filteredTickets.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <p className="text-[#707a8a]">Тикеты не найдены</p>
                  </div>
                ) : (
                  filteredTickets.map((ticket) => (
                    <Link
                      key={ticket.id}
                      href={`/admin/tickets/${ticket.id}`}
                      className="block bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-base font-semibold text-[#1e2329]">{ticket.subject}</h3>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(ticket.status)}`}>
                              {getStatusText(ticket.status)}
                            </span>
                            {ticket.unread_count && ticket.unread_count > 0 && (
                              <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                                {ticket.unread_count} новых
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-[#707a8a]">
                            <span>От: {ticket.user_email}</span>
                            <span>•</span>
                            <span>Создан: {formatDate(ticket.created_at)}</span>
                            <span>•</span>
                            <span>Обновлен: {formatDate(ticket.updated_at)}</span>
                          </div>
                        </div>
                        <svg className="w-5 h-5 text-[#707a8a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[#fafafa] border-b border-[#eaecef]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-[#707a8a] uppercase">Пользователь</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-[#707a8a] uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-[#707a8a] uppercase">Реф. код</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-[#707a8a] uppercase">Депозиты</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-[#707a8a] uppercase">Баланс</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-[#707a8a] uppercase">Регистрация</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#eaecef]">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-[#707a8a]">
                          Пользователи не найдены
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => {
                        const profile = userProfiles[user.id];
                        return (
                          <tr key={user.id} className="hover:bg-[#fafafa] transition">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2b6aff] to-[#1e4fd9] flex items-center justify-center text-white font-semibold">
                                  {user.user_metadata?.full_name?.[0] || user.email[0].toUpperCase()}
                                </div>
                                <span className="font-medium text-[#1e2329]">
                                  {user.user_metadata?.full_name || 'Не указано'}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-[#707a8a]">{user.email}</td>
                            <td className="px-6 py-4">
                              {profile?.referral_code ? (
                                <span className="px-2 py-1 bg-[#2b6aff] bg-opacity-10 text-[#2b6aff] text-xs font-mono rounded">
                                  {profile.referral_code}
                                </span>
                              ) : (
                                <span className="text-sm text-[#707a8a]">—</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm font-semibold text-[#0ecb81]">
                                ${profile?.total_deposits?.toLocaleString() || '0'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm font-semibold text-[#1e2329]">
                                ${profile?.balance?.toLocaleString() || '0'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-[#707a8a]">
                              {new Date(user.created_at).toLocaleDateString('ru-RU')}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
