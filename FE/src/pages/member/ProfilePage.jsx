import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Camera, Save, CheckCircle, User, Target, Trash2, Flame } from 'lucide-react';

const goals = [
  { id: 'bulk', label: 'Bulk', desc: 'Tăng cơ, tăng cân', color: '#FF5722' },
  { id: 'cut', label: 'Cut', desc: 'Giảm mỡ, giữ cơ', color: '#3b82f6' },
  { id: 'maintain', label: 'Maintain', desc: 'Duy trì thể trạng', color: '#71717a' },
];

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    goal: user?.goal || 'bulk',
    height: user?.height || '',
    weight: user?.weight || '',
    age: user?.age || '',
    gender: user?.gender || 'male',
    bio: user?.bio || '',
    allergies: user?.allergies || [],
  });
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState('info');

  const savedMealPlans = user?.savedMealPlans || [];

  const handleDeleteMealPlan = (index) => {
    const updatedPlans = savedMealPlans.filter((_, idx) => idx !== index);
    updateUser({ savedMealPlans: updatedPlans });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await new Promise(r => setTimeout(r, 600));
    updateUser(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl space-y-5 mx-auto">
      {/* Avatar + name */}
      <div className="glass rounded-2xl p-6 border border-[#18181B]/10 flex items-center gap-5">
        <div className="relative">
          <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full object-cover border-2 border-[#18181B]/10" />
          <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#FF5722] flex items-center justify-center">
            <Camera className="w-3.5 h-3.5 text-black" />
          </button>
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-black text-[#18181B]">{user.name}</h2>
          <p className="text-sm text-[#18181B]/60">{user.email}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#FF5722]/10 text-[#FF5722] border border-[#FF5722]/20">
              {user.level || 'Athlete'}
            </span>
            <span className="text-xs text-[#18181B]/40">·</span>
            <span className="text-xs text-[#18181B]/60">Tham gia từ {user.joinedAt}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: 'info', label: 'Thông tin' },
          { id: 'body', label: 'Chỉ số cơ thể' },
          { id: 'nutrition', label: 'Dinh dưỡng & Dị ứng' },
          { id: 'security', label: 'Bảo mật' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === t.id ? 'bg-[#FF5722]/10 text-[#FF5722] border border-[#FF5722]/20' : 'text-[#18181B]/60 hover:text-[#18181B]'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSave}>
        {tab === 'info' && (
          <div className="glass rounded-2xl p-6 border border-[#18181B]/10 space-y-4">
            <h3 className="font-semibold text-[#18181B] flex items-center gap-2">
              <User className="w-4 h-4 text-[#FF5722]" /> Thông tin cá nhân
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: 'name', label: 'Họ và tên', type: 'text', placeholder: 'Tên của bạn' },
                { key: 'phone', label: 'Số điện thoại', type: 'tel', placeholder: '0xxx xxx xxx' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs text-[#18181B]/60 mb-1.5">{f.label}</label>
                  <input type={f.type} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full px-4 py-3 rounded-xl glass border border-[#18181B]/10 text-[#18181B] placeholder-[#18181B]/40 focus:outline-none focus:border-[#FF5722]/50 text-sm"
                  />
                </div>
              ))}
            </div>
            <div>
              <label className="block text-xs text-[#18181B]/60 mb-1.5">Email</label>
              <input type="email" value={form.email} disabled
                className="w-full px-4 py-3 rounded-xl bg-white/[0.02] border border-[#18181B]/10 text-[#18181B]/40 text-sm cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs text-[#18181B]/60 mb-2">Mục tiêu tập luyện</label>
              <div className="grid grid-cols-3 gap-2">
                {goals.map(g => (
                  <button key={g.id} type="button" onClick={() => setForm(p => ({ ...p, goal: g.id }))}
                    className={`p-3 rounded-xl border text-center transition-all ${form.goal === g.id ? 'border-current' : 'border-[#18181B]/10 hover:border-[#18181B]/20'}`}
                    style={form.goal === g.id ? { borderColor: `${g.color}50`, background: `${g.color}10`, color: g.color } : {}}>
                    <p className="text-sm font-bold">{g.label}</p>
                    <p className="text-xs opacity-60 mt-0.5">{g.desc}</p>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs text-[#18181B]/60 mb-1.5">Giới thiệu bản thân</label>
              <textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
                placeholder="Chia sẻ hành trình fitness của bạn..." rows={3}
                className="w-full px-4 py-3 rounded-xl glass border border-[#18181B]/10 text-[#18181B] placeholder-[#18181B]/40 focus:outline-none focus:border-[#FF5722]/50 text-sm resize-none"
              />
            </div>
          </div>
        )}

        {tab === 'body' && (
          <div className="glass rounded-2xl p-6 border border-[#18181B]/10 space-y-4">
            <h3 className="font-semibold text-[#18181B] flex items-center gap-2">
              <Target className="w-4 h-4 text-[#FF5722]" /> Chỉ số cơ thể
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { key: 'age', label: 'Tuổi', placeholder: '25', unit: 'tuổi' },
                { key: 'height', label: 'Chiều cao', placeholder: '175', unit: 'cm' },
                { key: 'weight', label: 'Cân nặng hiện tại', placeholder: '70', unit: 'kg' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs text-[#18181B]/60 mb-1.5">{f.label}</label>
                  <div className="relative">
                    <input type="number" value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      className="w-full px-4 py-3 rounded-xl glass border border-[#18181B]/10 text-[#18181B] placeholder-[#18181B]/40 focus:outline-none focus:border-[#FF5722]/50 text-sm pr-12"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#18181B]/40">{f.unit}</span>
                  </div>
                </div>
              ))}
              <div>
                <label className="block text-xs text-[#18181B]/60 mb-1.5">Giới tính</label>
                <select value={form.gender} onChange={e => setForm(p => ({ ...p, gender: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl glass border border-[#18181B]/10 text-[#18181B] bg-transparent focus:outline-none text-sm">
                  <option value="male" className="bg-white">Nam</option>
                  <option value="female" className="bg-white">Nữ</option>
                </select>
              </div>
            </div>
            {form.height && form.weight && (
              <div className="p-4 rounded-xl bg-[#FF5722]/5 border border-[#FF5722]/20">
                <p className="text-xs text-[#18181B]/60 mb-1">BMI ước tính</p>
                <p className="text-2xl font-black text-[#FF5722]">
                  {(form.weight / ((form.height / 100) ** 2)).toFixed(1)}
                  <span className="text-sm font-normal text-[#18181B]/60 ml-2">
                    {(() => {
                      const bmi = form.weight / ((form.height / 100) ** 2);
                      return bmi < 18.5 ? 'Thiếu cân' : bmi < 25 ? 'Bình thường' : bmi < 30 ? 'Thừa cân' : 'Béo phì';
                    })()}
                  </span>
                </p>
              </div>
            )}
          </div>
        )}

        {tab === 'nutrition' && (
          <div className="space-y-5">
            {/* Allergies section */}
            <div className="glass rounded-2xl p-6 border border-[#18181B]/10 space-y-4">
              <h3 className="font-semibold text-[#18181B] flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#FF5722]" /> Khai báo Dị ứng & Hạn chế ăn uống
              </h3>
              <p className="text-xs text-[#18181B]/60 leading-relaxed">
                Hệ thống AI sẽ tự động ẩn hoặc hiển thị cảnh báo đỏ nổi bật khi bạn mua/được đề xuất các món ăn có chứa thành phần dị ứng đã khai báo.
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { id: 'lactose', label: 'Lactose (Sữa bò)' },
                  { id: 'seafood', label: 'Hải sản' },
                  { id: 'peanuts', label: 'Đậu phộng' },
                  { id: 'gluten', label: 'Gluten' },
                  { id: 'eggs', label: 'Trứng' },
                  { id: 'none', label: 'Không dị ứng' },
                ].map(item => {
                  const hasAllergy = form.allergies.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        let updated = [...form.allergies];
                        if (item.id === 'none') {
                          updated = ['none'];
                        } else {
                          updated = updated.filter(a => a !== 'none');
                          if (hasAllergy) {
                            updated = updated.filter(a => a !== item.id);
                          } else {
                            updated.push(item.id);
                          }
                        }
                        setForm(p => ({ ...p, allergies: updated }));
                      }}
                      className={`p-3 rounded-xl border text-center transition-all text-xs font-bold ${
                        hasAllergy
                          ? 'border-red-500/50 bg-red-500/10 text-red-400'
                          : 'border-[#18181B]/10 hover:border-[#18181B]/20 text-[#18181B]/60'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Saved meal plans section */}
            <div className="glass rounded-2xl p-6 border border-[#18181B]/10 space-y-4">
              <h3 className="font-semibold text-[#18181B] flex items-center gap-2">
                <Target className="w-4 h-4 text-[#FF5722]" /> Thực đơn & Meal Plan đã lưu
              </h3>
              
              {savedMealPlans.length === 0 ? (
                <div className="py-8 text-center text-[#18181B]/40 text-xs">
                  Chưa có Meal Plan nào được lưu trong hồ sơ cá nhân.
                </div>
              ) : (
                <div className="space-y-4">
                  {savedMealPlans.map((plan, planIdx) => (
                    <div key={planIdx} className="glass rounded-xl p-4 border border-[#18181B]/10 relative text-left">
                      <button
                        type="button"
                        onClick={() => handleDeleteMealPlan(planIdx)}
                        className="absolute right-3 top-3 text-[#18181B]/40 hover:text-red-400 p-1 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-black uppercase text-[#FF5722] bg-[#FF5722]/10 px-2 py-0.5 rounded-full">
                          Meal Plan #{planIdx + 1}
                        </span>
                        <span className="text-[10px] text-[#18181B]/40">
                          {plan.date || 'Gần đây'}
                        </span>
                      </div>
                      {plan.reason && (
                        <p className="text-xs text-[#18181B]/70 italic mb-3">
                          "{plan.reason}"
                        </p>
                      )}
                      
                      <div className="space-y-2">
                        {plan.items?.map((item, itemIdx) => (
                          <div key={itemIdx} className="flex justify-between items-center bg-white/30 rounded-lg p-2 border border-[#18181B]/5 text-xs">
                            <span className="font-semibold text-[#18181B]">{item.name}</span>
                            <span className="text-[#FF5722] font-bold">{item.protein_g}g Protein</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'security' && (
          <div className="glass rounded-2xl p-6 border border-[#18181B]/10 space-y-4">
            <h3 className="font-semibold text-[#18181B]">Bảo mật tài khoản</h3>
            {[
              { label: 'Mật khẩu hiện tại', placeholder: '••••••••' },
              { label: 'Mật khẩu mới', placeholder: 'Tối thiểu 6 ký tự' },
              { label: 'Xác nhận mật khẩu mới', placeholder: 'Nhập lại mật khẩu' },
            ].map((f, i) => (
              <div key={i}>
                <label className="block text-xs text-[#18181B]/60 mb-1.5">{f.label}</label>
                <input type="password" placeholder={f.placeholder}
                  className="w-full px-4 py-3 rounded-xl glass border border-[#18181B]/10 text-[#18181B] placeholder-[#18181B]/40 focus:outline-none focus:border-[#FF5722]/50 text-sm"
                />
              </div>
            ))}
            <div className="pt-4 border-t border-[#18181B]/10">
              <button type="button" className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors">
                <Trash2 className="w-4 h-4" /> Xóa tài khoản
              </button>
              <p className="text-xs text-[#18181B]/40 mt-1">Hành động này không thể hoàn tác.</p>
            </div>
          </div>
        )}

        <button type="submit"
          className={`mt-4 w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${saved ? 'bg-[#FF5722]/20 text-[#FF5722] border border-[#FF5722]/30' : 'bg-[#FF5722] text-white hover:bg-[#FF5722]/90'}`}>
          {saved ? <><CheckCircle className="w-4 h-4" /> Đã lưu!</> : <><Save className="w-4 h-4" /> Lưu thay đổi</>}
        </button>
      </form>
    </div>
  );
}
