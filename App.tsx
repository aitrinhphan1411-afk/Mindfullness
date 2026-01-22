
import React, { useState, useMemo } from 'react';
import { Page, UserInfo, InsightResult } from './types';
import { Layout } from './components/Layout';
import { analyzeFeedback } from './services/geminiService';

// Cấu hình danh sách Admin (Thay đổi email tại đây)
const ADMIN_EMAILS = ['admin@mynavitechtus.com', 'hr@mynavitechtus.com', 'manager@mynavitechtus.com'];

// Cấu hình quyền truy cập khảo sát (Mock logic)
// Trong thực tế, dữ liệu này có thể đến từ Backend
const getAllowedSurveys = (email: string) => {
  const adminAccess = ADMIN_EMAILS.includes(email);
  if (adminAccess) return ['birthday', 'career'];
  
  // Ví dụ: Email có chữ 'test' thì chỉ thấy Birthday
  if (email.includes('test')) return ['birthday'];
  
  // Mặc định cho mọi người
  return ['birthday', 'career'];
};

const App: React.FC = () => {
  const [page, setPage] = useState<Page | string>(Page.LOGIN);
  const [userInfo, setUserInfo] = useState<UserInfo>({ email: '' });
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiInsight, setAiInsight] = useState<InsightResult | null>(null);

  // Xác định quyền hạn dựa trên email đã nhập
  const isAdmin = useMemo(() => ADMIN_EMAILS.includes(userInfo.email.toLowerCase()), [userInfo.email]);
  const allowedSurveys = useMemo(() => getAllowedSurveys(userInfo.email.toLowerCase()), [userInfo.email]);

  const handleInput = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const email = userInfo.email.trim().toLowerCase();
    if (email.endsWith('@mynavitechtus.com')) {
      setPage(Page.SURVEY_SELECT);
    } else {
      alert("Vui lòng sử dụng email công ty: @mynavitechtus.com");
    }
  };

  const submitSurvey = async (type: string) => {
    setIsSubmitting(true);
    try {
      const result = await analyzeFeedback(type, formData);
      setAiInsight(result);
      setPage(Page.THANKS);
    } catch (err) {
      console.error(err);
      setPage(Page.THANKS);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleCheckbox = (key: string, value: string) => {
    const current = formData[key] || "";
    if (current.includes(value)) {
      handleInput(key, current.replace(value + ",", ""));
    } else {
      handleInput(key, current + value + ",");
    }
  };

  return (
    <Layout 
      onGoToDashboard={() => setPage(Page.DASHBOARD)} 
      // CHỈ hiện nút Dashboard nếu là ADMIN và không ở trang Login
      showDashboardLink={isAdmin && page !== Page.LOGIN && page !== Page.DASHBOARD}
    >
      <div className="max-w-3xl mx-auto w-full px-4 py-8 flex-1">
        
        {page === Page.LOGIN && (
          <div className="max-w-md mx-auto mt-12 animate-fade-in">
            <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-b-[10px] border-[#4ddcff]">
              <div className="p-10">
                <div className="flex justify-center mb-8">
                  <img src="https://vn.mynavi-techtus.com/assets/images/logo.png" alt="Logo" className="h-20 object-contain" />
                </div>
                <h1 className="text-2xl font-extrabold text-gray-800 mb-2 text-center">Chào bạn!</h1>
                <p className="text-gray-500 mb-8 text-center text-sm">Nhập email công ty để bắt đầu.</p>
                <form onSubmit={handleLogin} className="space-y-4">
                  <input 
                    type="email" required placeholder="yourname@mynavitechtus.com"
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#4ddcff] focus:bg-white rounded-2xl outline-none transition-all"
                    value={userInfo.email}
                    onChange={(e) => setUserInfo({ email: e.target.value })}
                  />
                  <button type="submit" className="w-full bg-[#4ddcff] hover:bg-[#00d0ff] text-white py-5 rounded-2xl font-bold text-lg shadow-lg transition-all">
                    Bắt đầu
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {page === Page.SURVEY_SELECT && (
          <div className="animate-fade-in space-y-8 py-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800">Chọn chủ đề phản hồi</h2>
              <p className="text-gray-500">Dành riêng cho: <span className="font-bold text-[#4ddcff]">{userInfo.email}</span></p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Lọc hiển thị khảo sát dựa trên quyền truy cập */}
              {allowedSurveys.includes('birthday') && (
                <button onClick={() => setPage(Page.SURVEY_BIRTHDAY)} className="bg-white p-8 rounded-[2rem] shadow-xl border-2 border-transparent hover:border-[#4ddcff] transition-all text-left group">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🎂</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Tiệc Sinh Nhật</h3>
                  <p className="text-sm text-gray-500">Phản hồi về không khí và tổ chức buổi tiệc.</p>
                </button>
              )}
              
              {allowedSurveys.includes('career') && (
                <button onClick={() => setPage(Page.SURVEY_CAREER)} className="bg-white p-8 rounded-[2rem] shadow-xl border-2 border-transparent hover:border-[#4ddcff] transition-all text-left group">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">☕</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Cafe Career</h3>
                  <p className="text-sm text-gray-500">Chia sẻ về định hướng phát triển nghề nghiệp.</p>
                </button>
              )}

              {allowedSurveys.length === 0 && (
                <div className="col-span-2 text-center py-10 bg-gray-50 rounded-3xl">
                  <p className="text-gray-400 font-medium">Hiện tại chưa có khảo sát nào dành cho bạn.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {page === Page.SURVEY_BIRTHDAY && (
          <div className="animate-fade-in space-y-6 py-6">
             <button onClick={() => setPage(Page.SURVEY_SELECT)} className="text-xs font-bold text-gray-400 hover:text-[#4ddcff] mb-4 uppercase">← Quay lại</button>
             <h2 className="text-2xl font-bold text-gray-800">Khảo sát Tiệc Sinh Nhật</h2>
             <div className="bg-white p-8 rounded-3xl shadow-sm space-y-8">
                <div>
                  <label className="block font-bold mb-4">1. Cảm xúc của bạn? *</label>
                  <div className="grid grid-cols-5 gap-2">
                    {['😴', '😐', '🍃', '😆', '🚀'].map((emoji, i) => (
                      <button key={i} onClick={() => handleInput('bd_q1', i+1)} className={`p-4 border-2 rounded-xl transition-all ${formData.bd_q1 === i+1 ? 'bg-[#4ddcff] border-[#4ddcff] text-white shadow-md' : 'bg-gray-50 border-transparent text-gray-400'}`}>{emoji}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block font-bold mb-2">2. Kết nối thành viên? (1-5) *</label>
                  <input type="range" min="1" max="5" step="1" className="w-full accent-[#4ddcff]" onChange={(e) => handleInput('bd_q2', e.target.value)} />
                </div>
                <div>
                  <label className="block font-bold mb-4">3. Cảm xúc chủ đạo?</label>
                  <div className="flex flex-wrap gap-2">
                    {['Bất ngờ', 'Thoải mái', 'Gắn kết'].map(opt => (
                      <button key={opt} onClick={() => toggleCheckbox('bd_q3', opt)} className={`px-4 py-2 rounded-xl text-sm font-bold border-2 ${formData.bd_q3?.includes(opt) ? 'bg-[#4ddcff] border-[#4ddcff] text-white' : 'bg-white border-gray-100 text-gray-400'}`}>{opt}</button>
                    ))}
                  </div>
                </div>
             </div>
             <button onClick={() => submitSurvey('Birthday')} disabled={isSubmitting} className="w-full py-5 rounded-2xl font-bold text-xl shadow-xl bg-[#4ddcff] text-white">Gửi phản hồi</button>
          </div>
        )}

        {page === Page.SURVEY_CAREER && (
          <div className="animate-fade-in space-y-6 py-6">
             <button onClick={() => setPage(Page.SURVEY_SELECT)} className="text-xs font-bold text-gray-400 hover:text-[#00a8cc] mb-4 uppercase">← Quay lại</button>
             <div className="bg-[#fff9f0] p-6 rounded-[2rem] border-2 border-[#ffecce] flex items-center gap-4">
              <span className="text-4xl">☕</span>
              <p className="text-sm italic text-orange-900 leading-relaxed font-medium">Team HD mong muốn lắng nghe về Career Path của bạn...</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm space-y-8">
              <div>
                <label className="block font-bold mb-2">1. Điều gì bạn làm tốt nhất trong 3 tháng qua?</label>
                <textarea className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:border-[#00a8cc] border-2 border-transparent" onChange={(e) => handleInput('cr_q1', e.target.value)}></textarea>
              </div>
              <div>
                <label className="block font-bold mb-4 text-red-500">2. Năng lực của bạn được ghi nhận đúng mức? (1-5)</label>
                <div className="flex justify-between">
                  {[1,2,3,4,5].map(n => (
                    <button key={n} onClick={() => handleInput('cr_q4', n)} className={`w-12 h-12 rounded-full border-2 font-bold ${formData.cr_q4 === n ? 'bg-[#00a8cc] text-white border-[#00a8cc]' : 'text-[#00a8cc] border-[#00a8cc]'}`}>{n}</button>
                  ))}
                </div>
              </div>
            </div>
            <button onClick={() => submitSurvey('Career')} disabled={isSubmitting} className="w-full py-5 rounded-2xl font-bold text-xl shadow-xl bg-[#00a8cc] text-white">Gửi thông tin</button>
          </div>
        )}

        {page === Page.THANKS && (
          <div className="max-w-xl mx-auto text-center animate-fade-in py-12">
            <div className="mb-8 inline-block p-8 bg-white rounded-[3rem] shadow-2xl"><span className="text-7xl">💙</span></div>
            <h2 className="text-3xl font-extrabold text-[#00a8cc] mb-4">Cảm ơn bạn!</h2>
            <p className="text-gray-500 mb-10 text-lg">Phản hồi của bạn giúp Techtus tốt hơn mỗi ngày.</p>
            {aiInsight && (
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border-l-[12px] border-[#4ddcff] text-left mb-10">
                <p className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest">🤖 AI Insight</p>
                <p className="text-gray-700 leading-relaxed font-medium italic">"{aiInsight.summary}"</p>
              </div>
            )}
            <div className="flex gap-4 justify-center">
              <button onClick={() => { setFormData({}); setPage(Page.SURVEY_SELECT); }} className="px-10 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold">Làm khảo sát khác</button>
              <button onClick={() => { setUserInfo({email: ''}); setPage(Page.LOGIN); }} className="px-10 py-4 bg-[#4ddcff] text-white rounded-2xl font-bold shadow-lg shadow-cyan-100">Đăng xuất</button>
            </div>
          </div>
        )}

        {page === Page.DASHBOARD && isAdmin && (
          <div className="animate-fade-in py-8 space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-extrabold text-gray-800">Admin Dashboard</h2>
              <button onClick={() => setPage(Page.SURVEY_SELECT)} className="text-[#4ddcff] font-bold">Về trang khảo sát</button>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase">Hài lòng</p>
                <p className="text-3xl font-black text-[#4ddcff]">4.8/5</p>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase">Phản hồi</p>
                <p className="text-3xl font-black text-gray-800">124</p>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase">Tỉ lệ</p>
                <p className="text-3xl font-black text-green-500">92%</p>
              </div>
            </div>
            <div className="bg-white p-10 rounded-[3rem] border border-gray-50 shadow-sm text-center">
              <p className="text-gray-400 italic">Dữ liệu chi tiết đang được đồng bộ từ Google Sheets...</p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default App;
