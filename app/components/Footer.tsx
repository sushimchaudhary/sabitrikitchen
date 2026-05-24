export default function Footer() {
  return (
    <footer className="bg-[#1e2227] text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-sm">
        {/* Brand + Contact */}
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#f67f02] flex items-center justify-center text-white font-bold text-sm">SK</div>
            <span className="text-white font-bold text-lg">Sabitri<span className="text-[#f67f02]">Kitchen</span></span>
          </div>
          <p className="text-xs font-bold text-white mb-2 uppercase tracking-wider">Contact Details</p>
          <div className="space-y-1 text-xs text-gray-400">
            <p>NTC Toll Free – 16600102121</p>
            <p>Ncell Toll Free – 18102102121</p>
            <p>Email: csd@sabitrikitchen.com.np</p>
            <p className="mt-2 font-semibold text-gray-300">Grievance Officer</p>
            <p>Bijay Rai</p>
            <p>Contact: +9779801079465</p>
            <p>Email: bijay.rai@sabitrikitchen.com.np</p>
          </div>
        </div>

        {/* Policy */}
        <div>
          <p className="text-white font-bold uppercase text-xs tracking-wider mb-3">Policy</p>
          <ul className="space-y-1.5 text-xs text-gray-400">
            {["AGM Notice", "Privacy Policies", "Information Security Policy", "Terms and Conditions", "Report Dispute, Fraud and Misuse", "Transaction Limits"].map((l) => (
              <li key={l}><a href="#" className="hover:text-[#f67f02] transition">{l}</a></li>
            ))}
          </ul>
        </div>

        {/* General */}
        <div>
          <p className="text-white font-bold uppercase text-xs tracking-wider mb-3">General</p>
          <ul className="space-y-1.5 text-xs text-gray-400">
            {["Getting Started", "Security", "SMS Syntax", "Reward Points", "Video Tutorials", "Sabitri Tariffs"].map((l) => (
              <li key={l}><a href="#" className="hover:text-[#f67f02] transition">{l}</a></li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <p className="text-white font-bold uppercase text-xs tracking-wider mb-3">Company</p>
          <ul className="space-y-1.5 text-xs text-gray-400">
            {["About us", "Career", "Blog/News", "Report", "Amendment"].map((l) => (
              <li key={l}><a href="#" className="hover:text-[#f67f02] transition">{l}</a></li>
            ))}
          </ul>
        </div>

        {/* Partners */}
        <div>
          <p className="text-white font-bold uppercase text-xs tracking-wider mb-3">Partners</p>
          <ul className="space-y-1.5 text-xs text-gray-400">
            {["Banks", "Western Union", "Sabitri Authorized Representatives"].map((l) => (
              <li key={l}><a href="#" className="hover:text-[#f67f02] transition">{l}</a></li>
            ))}
          </ul>
        </div>

        {/* Help */}
        <div>
          <p className="text-white font-bold uppercase text-xs tracking-wider mb-3">Help</p>
          <ul className="space-y-1.5 text-xs text-gray-400">
            {["Developer's Guide", "Logo Guidelines", "Sabitri Official Logo", "FAQ's", "Contact us"].map((l) => (
              <li key={l}><a href="#" className="hover:text-[#f67f02] transition">{l}</a></li>
            ))}
          </ul>
          <a href="#" className="mt-4 inline-block bg-[#f67f02] hover:bg-[#d96e00] text-white text-xs font-bold px-4 py-2 rounded transition">
            Become a merchant
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Trust badges */}
          <div className="flex items-center gap-3">
            <div className="bg-white rounded px-2 py-1 text-xs font-bold text-blue-800">VERIFIED by VISA</div>
            <div className="bg-white rounded px-2 py-1 text-xs font-bold text-red-700">MasterCard SecureCode</div>
            <div className="bg-white rounded px-2 py-1 text-xs font-bold text-gray-700">ISO 9001</div>
          </div>

          {/* App downloads */}
          <div className="text-center">
            <p className="text-xs text-gray-400 mb-1">Download Mobile Apps</p>
            <div className="flex gap-2">
              <a href="#" className="bg-black border border-gray-600 rounded px-3 py-1 text-white text-xs flex items-center gap-1 hover:border-[#f67f02] transition">
                <span>▶</span> Google Play
              </a>
              <a href="#" className="bg-black border border-gray-600 rounded px-3 py-1 text-white text-xs flex items-center gap-1 hover:border-[#f67f02] transition">
                <span>🍎</span> App Store
              </a>
            </div>
          </div>

          {/* Social */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Keep in touch</span>
            {["f", "t", "in", "yt"].map((s) => (
              <a key={s} href="#" className="w-7 h-7 bg-gray-700 hover:bg-[#f67f02] rounded flex items-center justify-center text-xs font-bold transition">{s}</a>
            ))}
          </div>
        </div>
        <p className="text-center text-xs text-gray-500 pb-4">© 2009-2026 Sabitri Kitchen Masala. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
