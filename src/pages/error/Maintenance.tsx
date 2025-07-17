import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Wrench,
    Clock,
    Coffee,
    Heart,
    Twitter,
    Mail,
    MessageCircle
} from "lucide-react";

const Maintenance = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Estimated maintenance end time (you can make this dynamic)
    const maintenanceEndTime = new Date();
    maintenanceEndTime.setHours(maintenanceEndTime.getHours() + 2); // 2 hours from now

    const timeRemaining = Math.max(0, maintenanceEndTime.getTime() - currentTime.getTime());
    const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));
    const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0">
                <motion.div
                    className="absolute top-20 left-20 w-64 h-64 bg-blue-200 rounded-full opacity-20 blur-3xl"
                    animate={{
                        x: [0, 100, 0],
                        y: [0, 50, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
                <motion.div
                    className="absolute bottom-20 right-20 w-96 h-96 bg-purple-200 rounded-full opacity-20 blur-3xl"
                    animate={{
                        x: [0, -100, 0],
                        y: [0, -50, 0],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
                <motion.div
                    className="absolute top-1/2 left-1/2 w-48 h-48 bg-indigo-200 rounded-full opacity-20 blur-2xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            </div>

            <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center max-w-4xl"
                >
                    {/* Main Icon */}
                    <motion.div
                        className="mb-8"
                        animate={{
                            rotate: [0, 10, -10, 0],
                            scale: [1, 1.05, 1]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-2xl mb-6">
                            <Wrench className="h-16 w-16 text-white" />
                        </div>
                    </motion.div>

                    {/* Logo & Brand */}
                    <div className="mb-8">
                        <h1 className="text-6xl sm:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                            Ne Yesek AI
                        </h1>
                        <div className="text-2xl text-gray-600 mb-2">🍳 ⚙️ 🔧</div>
                    </div>

                    {/* Main Message */}
                    <Card className="bg-white/80 backdrop-blur-lg shadow-2xl border-0 mb-8">
                        <CardContent className="p-10">
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                                Bakım Çalışması Devam Ediyor
                            </h2>
                            <p className="text-gray-600 text-xl leading-relaxed mb-8">
                                Daha iyi bir deneyim sunmak için sistemimizi güncelliyoruz.
                                <br className="hidden sm:block" />
                                Kısa süre sonra daha lezzetli tariflerle karşınızda olacağız!
                            </p>

                            {/* Countdown */}
                            <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-6 mb-8">
                                <div className="flex items-center justify-center gap-2 mb-4">
                                    <Clock className="h-6 w-6 text-blue-600" />
                                    <span className="text-blue-800 font-semibold text-lg">Tahmini Süre</span>
                                </div>
                                <div className="flex items-center justify-center gap-8">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-blue-600">{hoursRemaining}</div>
                                        <div className="text-blue-500 text-sm">Saat</div>
                                    </div>
                                    <div className="text-2xl text-blue-400">:</div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-blue-600">{minutesRemaining}</div>
                                        <div className="text-blue-500 text-sm">Dakika</div>
                                    </div>
                                </div>
                            </div>

                            {/* What We're Doing */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="text-center p-4">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <span className="text-2xl">🔧</span>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Sistem Güncellemesi</h3>
                                    <p className="text-sm text-gray-600">Performans iyileştirmeleri yapıyoruz</p>
                                </div>
                                <div className="text-center p-4">
                                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <span className="text-2xl">🍳</span>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Yeni Tarifler</h3>
                                    <p className="text-sm text-gray-600">Lezzetli yeni tarifler ekliyoruz</p>
                                </div>
                                <div className="text-center p-4">
                                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <span className="text-2xl">✨</span>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-2">UI İyileştirmeleri</h3>
                                    <p className="text-sm text-gray-600">Daha kullanıcı dostu arayüz</p>
                                </div>
                            </div>

                            {/* Contact Options */}
                            <div className="border-t border-gray-200 pt-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Acil durumlar için bize ulaşın
                                </h3>
                                <div className="flex flex-wrap justify-center gap-4">
                                    <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                                        <Mail className="h-4 w-4 mr-2" />
                                        E-posta Gönder
                                    </Button>
                                    <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
                                        <Twitter className="h-4 w-4 mr-2" />
                                        Twitter
                                    </Button>
                                    <Button variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                                        <MessageCircle className="h-4 w-4 mr-2" />
                                        WhatsApp
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Fun Maintenance Quote */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl p-6 mb-8"
                    >
                        <Coffee className="h-8 w-8 text-amber-600 mx-auto mb-3" />
                        <p className="text-gray-700 italic text-lg mb-2">
                            "En güzel yemekler, en iyi hazırlık gerektirir!"
                        </p>
                        <p className="text-amber-600 font-semibold">- Ne Yesek AI Ekibi</p>
                    </motion.div>

                    {/* Thank You Message */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.7 }}
                        className="flex items-center justify-center gap-2 text-gray-600"
                    >
                        <Heart className="h-5 w-5 text-red-500" />
                        <span>Sabrınız için teşekkür ederiz!</span>
                        <Heart className="h-5 w-5 text-red-500" />
                    </motion.div>

                    {/* Auto-refresh notice */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 1 }}
                        className="mt-8 text-sm text-gray-500"
                    >
                        Bu sayfa otomatik olarak güncellenmektedir.
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default Maintenance;
