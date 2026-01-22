
import React, { useState } from 'react';
import { Page, UserInfo, BirthdaySurveyData, CareerSurveyData, InsightResult } from './types';
import { Layout } from './components/Layout';
import { EMOJIS, EMOTION_OPTIONS, CAREER_TOPICS, MOCK_CHART_DATA } from './constants';
import { analyzeFeedback } from './services/geminiService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const App: React.FC = () => {
  const [page, setPage] = useState<Page>(Page.LOGIN);
  const [userInfo, setUserInfo] = useState<UserInfo>({ email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiInsight, setAiInsight] = useState<InsightResult | null>(null);

  // Form States
  const [birthdayForm, setBirthdayForm] = useState<BirthdaySurveyData>({
    sentiment: 3,
    connectionLevel: 5,
    emotions: [],
    feedback: ''
  });

  const [careerForm, setCareerForm] = useState<CareerSurveyData>({
    satisfaction: 3,
    frequency: 'Hàng tháng',
    topics: [],
    suggestions: ''
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const email = userInfo.email.trim().toLowerCase();
    // Chấp nhận domain chính xác: @mynavitechtus.com
    if (email.endsWith('@mynavitechtus.com')) {
      setPage(Page.SURVEY_SELECT);
    } else {
      alert("Vui lòng sử dụng email công ty: @mynavitechtus.com");
    }
  };

  const handleBirthdaySubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await analyzeFeedback('Birthday Party', birthdayForm);
      setAiInsight(result);
      setPage(Page.THANKS);
    } catch (err) {
      console.error(err);
      setPage(Page.THANKS);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCareerSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await analyzeFeedback('Cafe Career', careerForm);
      setAiInsight(result);
      setPage(Page.THANKS);
    } catch (err) {
      console.error(err);
      setPage(Page.THANKS);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTag = (list: string[], item: string, setter: (val: string[]) => void) => {
    if (list.includes(item)) {
      setter(list.filter(i => i !== item));
    } else {
      setter([...list, item]);
    }
  };

  return (
    <Layout 
      onGoToDashboard={() => setPage(Page.DASHBOARD)} 
      showDashboardLink={page !== Page.DASHBOARD}
    >
      <div className="max-w-4xl mx-auto w-full px-4 py-8 flex-1">
        
        {/* LOGIN PAGE */}
        {page === Page.LOGIN && (
          <div className="max-w-md mx-auto mt-8 md:mt-16 animate-fade-in">
            <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-b-[10px] border-[#4ddcff]">
              <div className="p-10">
                <div className="flex justify-center mb-10">
                  <img 
                    src="https://vn.mynavi-techtus.com/assets/images/logo.png" 
                    alt="Mynavi TechTus Logo" 
                    className="h-24 object-contain"
                  />
                </div>
                <h1 className="text-2xl font-extrabold text-gray-800 mb-2 text-center">Chào mừng bạn!</h1>
                <p className="text-gray-500 mb-8 text-center leading-relaxed px-4">
                  Đăng nhập bằng email công ty để bắt đầu đóng góp ý kiến xây dựng Techtus.
                </p>
                
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                      Email Mynavi TechTus
                    </label>
                    <input 
                      type="email"
                      required
                      placeholder="yourname@mynavitechtus.com"
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#4ddcff] focus:bg-white rounded-2xl outline-none transition-all duration-200"
                      value={userInfo.email}
                      onChange={(e) => setUserInfo({ email: e.target.value })}
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-[#4ddcff] hover:bg-[#00d0ff] text-white py-5 rounded-2xl font-bold text-lg shadow-lg shadow-cyan-100 transition-all hover:scale-[1.01] active:scale-[0.99]"
                  >
                    Bắt đầu ngay
                  </button>
                </form>
              </div>
            </div>
            <p className="mt-8 text-center text-xs text-gray-400 font-medium">
              BUILDING A BETTER WORKPLACE TOGETHER
            </p>
          </div>
        )}

        {/* SURVEY SELECTION */}
        {page === Page.SURVEY_SELECT && (
          <div className="space-y-8 animate-fade-in max-w-2xl mx-auto py-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800">Chọn chủ đề khảo sát</h2>
              <p className="text-gray-500">Mọi phản hồi của bạn đều được ghi nhận một cách trân trọng.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <button 
                onClick={() => setPage(Page.SURVEY_BIRTHDAY)}
                className="group relative bg-white p-8 rounded-[2.5rem] border-2 border-transparent hover:border-[#4ddcff] shadow-xl transition-all text-left overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-pink-50 text-pink-500 rounded-2xl flex items-center justify-center mb-6 text-3xl">🎂</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Tiệc Sinh Nhật</h3>
                  <p className="text-sm text-gray-500 mb-6">Không khí, tổ chức và sự gắn kết trong buổi tiệc vừa qua.</p>
                  <span className="text-sm font-bold text-[#00a8cc] flex items-center gap-1 group-hover:gap-2 transition-all">
                    Làm khảo sát <span className="text-lg">→</span>
                  </span>
                </div>
              </button>

              <button 
                onClick={() => setPage(Page.SURVEY_CAREER)}
                className="group relative bg-white p-8 rounded-[2.5rem] border-2 border-transparent hover:border-[#4ddcff] shadow-xl transition-all text-left overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mb-6 text-3xl">☕️</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Cafe Career</h3>
                  <p className="text-sm text-gray-500 mb-6">Chất lượng chủ đề và mong muốn phát triển nghề nghiệp.</p>
                  <span className="text-sm font-bold text-[#00a8cc] flex items-center gap-1 group-hover:gap-2 transition-all">
                    Làm khảo sát <span className="text-lg">→</span>
                  </span>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* BIRTHDAY SURVEY FORM */}
        {page === Page.SURVEY_BIRTHDAY && (
          <div className="max-w-xl mx-auto space-y-8 animate-fade-in py-8">
            <button onClick={() => setPage(Page.SURVEY_SELECT)} className="text-xs font-bold text-gray-400 hover:text-[#4ddcff] flex items-center gap-2 uppercase tracking-widest">
              ← Trở lại danh sách
            </button>
            <h2 className="text-3xl font-extrabold text-gray-800 text-center">Tiệc Sinh Nhật 🎂</h2>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <label className="block text-lg font-bold text-gray-700 mb-6">Bạn cảm thấy thế nào về buổi tiệc? *</label>
              <div className="grid grid-cols-5 gap-2">
                {EMOJIS.map((item, i) => (
                  <button 
                    key={i}
                    onClick={() => setBirthdayForm({...birthdayForm, sentiment: i + 1})}
                    className={`flex flex-col items-center p-4 rounded-2xl transition-all border-2 ${birthdayForm.sentiment === i + 1 ? 'bg-cyan-50 border-[#4ddcff]' : 'bg-gray-50 border-transparent hover:bg-gray-100'}`}
                  >
                    <span className="text-3xl mb-2">{item.icon}</span>
                    <span className="text-[10px] font-bold text-gray-400 text-center uppercase leading-tight">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <label className="block text-lg font-bold text-gray-700 mb-6">Chương trình chạm đến cảm xúc nào?</label>
              <div className="flex flex-wrap gap-3">
                {EMOTION_OPTIONS.map(tag => (
                  <button 
                    key={tag}
                    onClick={() => toggleTag(birthdayForm.emotions, tag, (val) => setBirthdayForm({...birthdayForm, emotions: val}))}
                    className={`px-6 py-3 rounded-2xl text-sm font-semibold transition-all ${birthdayForm.emotions.includes(tag) ? 'bg-[#4ddcff] text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <label className="block text-lg font-bold text-gray-700 mb-4">Ý kiến đóng góp thêm?</label>
              <textarea 
                rows={4}
                placeholder="Ví dụ: Bữa tiệc rất vui nhưng cần nhiều đồ ăn mặn hơn..."
                className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:bg-white border-2 border-transparent focus:border-[#4ddcff] transition-all"
                value={birthdayForm.feedback}
                onChange={(e) => setBirthdayForm({...birthdayForm, feedback: e.target.value})}
              />
            </div>

            <button 
              onClick={handleBirthdaySubmit}
              disabled={isSubmitting}
              className={`w-full py-5 rounded-2xl font-bold text-xl shadow-xl transition-all ${isSubmitting ? 'bg-gray-300' : 'bg-[#4ddcff] hover:bg-[#00d0ff] text-white'}`}
            >
              {isSubmitting ? 'Đang gửi...' : 'Gửi phản hồi'}
            </button>
          </div>
        )}

        {/* CAREER SURVEY FORM */}
        {page === Page.SURVEY_CAREER && (
          <div className="max-w-xl mx-auto space-y-8 animate-fade-in py-8">
            <button onClick={() => setPage(Page.SURVEY_SELECT)} className="text-xs font-bold text-gray-400 hover:text-[#00a8cc] flex items-center gap-2 uppercase tracking-widest">
              ← Trở lại danh sách
            </button>
            <h2 className="text-3xl font-extrabold text-gray-800 text-center">Cafe Career ☕️</h2>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <label className="block text-lg font-bold text-gray-700 mb-6">Bạn hài lòng với nội dung thế nào? *</label>
              <div className="flex gap-3">
                {[1,2,3,4,5].map(val => (
                  <button 
                    key={val}
                    onClick={() => setCareerForm({...careerForm, satisfaction: val})}
                    className={`flex-1 h-16 flex items-center justify-center rounded-2xl font-bold text-lg border-2 transition-all ${careerForm.satisfaction === val ? 'bg-[#00a8cc] border-[#00a8cc] text-white shadow-lg' : 'bg-gray-50 border-transparent text-gray-400 hover:bg-gray-100'}`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <label className="block text-lg font-bold text-gray-700 mb-6">Chủ đề mong muốn tiếp theo?</label>
              <div className="flex flex-wrap gap-3">
                {CAREER_TOPICS.map(topic => (
                  <button 
                    key={topic}
                    onClick={() => toggleTag(careerForm.topics, topic, (val) => setCareerForm({...careerForm, topics: val}))}
                    className={`px-5 py-3 rounded-2xl text-sm font-semibold border-2 transition-all ${careerForm.topics.includes(topic) ? 'border-[#00a8cc] bg-cyan-50 text-[#00a8cc]' : 'border-transparent bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleCareerSubmit}
              disabled={isSubmitting}
              className={`w-full py-5 rounded-2xl font-bold text-xl shadow-xl transition-all ${isSubmitting ? 'bg-gray-300' : 'bg-[#00a8cc] hover:bg-[#008ba8] text-white'}`}
            >
              {isSubmitting ? 'Đang gửi...' : 'Gửi phản hồi'}
            </button>
          </div>
        )}

        {/* THANKS PAGE */}
        {page === Page.THANKS && (
          <div className="max-w-xl mx-auto text-center animate-fade-in py-16">
            <div className="mb-8 inline-block p-8 bg-white rounded-[3rem] shadow-2xl relative">
              <span className="text-7xl">💙</span>
              <div className="absolute -bottom-2 -right-2 bg-green-400 w-8 h-8 rounded-full border-4 border-white"></div>
            </div>
            <h2 className="text-3xl font-extrabold text-[#00a8cc] mb-4">Cảm ơn {userInfo.email.split('@')[0]}!</h2>
            <p className="text-gray-500 mb-10 text-lg px-8">
              Ý kiến của bạn đã được ghi nhận và phân tích tự động bởi HR Bot. Chúng mình sẽ sớm có những thay đổi tích cực!
            </p>

            {aiInsight && (
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border-l-[12px] border-[#4ddcff] text-left mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-[#4ddcff]/10 rounded-xl flex items-center justify-center text-xl">🤖</div>
                  <span className="font-bold text-gray-800">HR Bot Analysis</span>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed font-medium">"{aiInsight.summary}"</p>
                  <div className="bg-amber-50 p-4 rounded-2xl border-l-4 border-amber-400">
                    <p className="text-xs font-bold text-amber-700 uppercase mb-1">Ghi chú cho HR</p>
                    <p className="text-sm text-amber-900">{aiInsight.actionableStep}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => setPage(Page.SURVEY_SELECT)}
                className="px-10 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all"
              >
                Gửi thêm ý kiến
              </button>
              <button 
                onClick={() => { setUserInfo({email: ''}); setPage(Page.LOGIN); }}
                className="px-10 py-4 bg-[#4ddcff] text-white rounded-2xl font-bold shadow-lg shadow-cyan-100 hover:brightness-105 transition-all"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        )}

        {/* DASHBOARD - GIỮ NGUYÊN NHƯ PHIÊN BẢN TRƯỚC NHƯNG CẬP NHẬT UI CHUNG */}
        {page === Page.DASHBOARD && (
          <div className="space-y-8 animate-fade-in py-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-extrabold text-gray-800">Bảng Quản Trị HR</h2>
                <p className="text-gray-500">Dữ liệu thời gian thực từ nhân viên</p>
              </div>
              <button 
                onClick={() => setPage(Page.LOGIN)}
                className="px-5 py-2.5 bg-white border-2 border-gray-100 rounded-2xl text-sm font-bold text-gray-500 hover:border-[#4ddcff] hover:text-[#4ddcff] transition-all"
              >
                Trang người dùng
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { label: 'Sự tham gia', val: '92%', change: '+4%', color: 'text-green-500' },
                { label: 'Chỉ số hạnh phúc', val: '4.8/5', change: 'Ổn định', color: 'text-[#4ddcff]' },
                { label: 'Phản hồi mới', val: '18', change: 'Trong 24h', color: 'text-gray-500' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-50">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{stat.label}</p>
                  <h3 className="text-4xl font-extrabold text-gray-800">{stat.val}</h3>
                  <p className={`text-xs mt-3 font-bold ${stat.color}`}>{stat.change}</p>
                </div>
              ))}
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50 min-h-[400px]">
              <h4 className="text-lg font-bold text-gray-800 mb-8">Diễn biến sự hài lòng nhân viên</h4>
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MOCK_CHART_DATA}>
                    <defs>
                      <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4ddcff" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#4ddcff" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                    <Tooltip contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)'}} />
                    <Area type="monotone" dataKey="sentiment" stroke="#4ddcff" strokeWidth={5} fillOpacity={1} fill="url(#colorVal)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default App;
