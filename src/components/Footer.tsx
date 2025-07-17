
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Sparkles, Heart, ChefHat } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook", color: "hover:text-blue-400" },
    { icon: Instagram, href: "#", label: "Instagram", color: "hover:text-pink-400" },
    { icon: Twitter, href: "#", label: "Twitter", color: "hover:text-blue-300" },
    { icon: Youtube, href: "#", label: "YouTube", color: "hover:text-red-400" },
  ];

  const quickLinks = [
    { name: "Ana Sayfa", href: "/" },
    { name: "Tarifler", href: "/tarifler" },
    { name: "Kategoriler", href: "/kategoriler" },
    { name: "AI Önerileri", href: "/ai-onerileri" },
    { name: "Blog", href: "/blog" },
    { name: "Hakkımızda", href: "/hakkimizda" },
  ];

  const categories = [
    { name: "Kahvaltı", href: "/kategori/kahvalti", emoji: "🍳" },
    { name: "Ana Yemekler", href: "/kategori/ana-yemekler", emoji: "🍲" },
    { name: "Tatlılar", href: "/kategori/tatlilar", emoji: "🍰" },
    { name: "İçecekler", href: "/kategori/icecekler", emoji: "🥤" },
    { name: "Atıştırmalıklar", href: "/kategori/atistirmaliklar", emoji: "🥨" },
    { name: "Vejetaryen", href: "/kategori/vejetaryen", emoji: "🥗" },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,rgb(249_115_22)_1px,transparent_0)] bg-[length:32px_32px]"></div>
      </div>

      {/* Newsletter Section */}
      <div className="relative bg-gradient-to-r from-orange-500 to-red-500 py-16">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <ChefHat className="h-8 w-8 text-white" />
              </motion.div>
              <h3 className="text-3xl md:text-4xl font-bold text-white">
                Haftalık Tarif Bülteni
              </h3>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <Sparkles className="h-8 w-8 text-yellow-300" />
              </motion.div>
            </div>

            <p className="text-orange-100 mb-8 max-w-2xl mx-auto text-lg">
              En yeni tarifler, AI destekli mutfak ipuçları ve özel içerikler için bültenimize katılın!
            </p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Input
                placeholder="✉️ E-posta adresiniz..."
                className="bg-white/95 backdrop-blur-sm text-gray-900 border-0 rounded-2xl h-12 text-lg placeholder:text-gray-500 focus:ring-2 focus:ring-white/50"
              />
              <Button className="bg-white text-orange-600 hover:bg-gray-50 rounded-2xl h-12 px-8 font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                🚀 Abone Ol
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 rounded-xl blur-lg opacity-50"></div>
                <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 p-3 rounded-xl">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                NeYesek.AI
              </span>
            </div>

            <p className="text-gray-300 text-lg leading-relaxed">
              Yapay zeka destekli tarif platformu. Milyonlarca tarif, kişisel öneriler ve mutfak deneyiminizi kolaylaştıran teknoloji.
            </p>

            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  className={`inline-flex items-center justify-center w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-2xl text-gray-300 ${social.color} transition-all duration-300 hover:scale-110 hover:shadow-lg`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <social.icon className="h-6 w-6" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-xl font-bold text-white flex items-center gap-2">
              <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
              Hızlı Bağlantılar
            </h4>
            <div className="space-y-3">
              {quickLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Link
                    to={link.href}
                    className="block text-gray-300 hover:text-orange-400 transition-colors duration-200 hover:translate-x-2 transform text-lg"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Categories */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="text-xl font-bold text-white flex items-center gap-2">
              <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
              Popüler Kategoriler
            </h4>
            <div className="space-y-3">
              {categories.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Link
                    to={category.href}
                    className="flex items-center gap-3 text-gray-300 hover:text-orange-400 transition-all duration-200 hover:translate-x-2 transform text-lg group"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                      {category.emoji}
                    </span>
                    {category.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h4 className="text-xl font-bold text-white flex items-center gap-2">
              <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
              İletişim
            </h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                  <Mail className="h-5 w-5 text-orange-400" />
                </div>
                <span className="text-lg">info@neyesek.ai</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                  <Phone className="h-5 w-5 text-orange-400" />
                </div>
                <span className="text-lg">+90 212 555 0123</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-orange-400" />
                </div>
                <span className="text-lg">İstanbul, Türkiye</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-gray-700/50 py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <motion.div
            className="flex items-center gap-2 text-gray-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span>© 2024 NeYesek.AI. Tüm hakları saklıdır.</span>
            <Heart className="h-4 w-4 text-red-400 animate-pulse" />
            <span>ile yapıldı</span>
          </motion.div>

          <motion.div
            className="flex gap-6 text-gray-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Link to="/gizlilik" className="hover:text-orange-400 transition-colors duration-200">
              Gizlilik Politikası
            </Link>
            <Link to="/kullanim-sartlari" className="hover:text-orange-400 transition-colors duration-200">
              Kullanım Şartları
            </Link>
            <Link to="/cerezler" className="hover:text-orange-400 transition-colors duration-200">
              Çerez Politikası
            </Link>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
