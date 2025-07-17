import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Home,
    ArrowLeft,
    Search,
    ChefHat,
    Utensils,
    Heart,
    Shield,
    Server,
    Wifi,
    AlertTriangle,
    Lock,
    UserX
} from "lucide-react";

interface ErrorConfig {
    code: string;
    title: string;
    description: string;
    emoji: string;
    icon: any;
    color: {
        primary: string;
        secondary: string;
        gradient: string;
        background: string;
    };
    autoRedirect?: boolean;
    redirectSeconds?: number;
    suggestions: Array<{
        title: string;
        description: string;
        icon: any;
        link: string;
    }>;
    quote: string;
}

const errorConfigs: Record<string, ErrorConfig> = {
    "404": {
        code: "404",
        title: "Sayfa Bulunamadı",
        description: "Aradığınız sayfa mevcut değil veya taşınmış olabilir. Belki de yeni bir tarif keşfetme zamanı geldi!",
        emoji: "🍳",
        icon: Search,
        color: {
            primary: "orange-500",
            secondary: "orange-600",
            gradient: "from-orange-500 to-orange-600",
            background: "from-orange-100 to-amber-100"
        },
        autoRedirect: true,
        redirectSeconds: 3,
        suggestions: [
            {
                title: "Tarifleri Keşfet",
                description: "Binlerce lezzetli tarif sizi bekliyor",
                icon: ChefHat,
                link: "/recipes"
            },
            {
                title: "Arama Yap",
                description: "İstediğiniz tarifi bulun",
                icon: Search,
                link: "/recipes?search="
            },
            {
                title: "Favorilerim",
                description: "Beğendiğiniz tarifleri görün",
                icon: Heart,
                link: "/favorites"
            }
        ],
        quote: "Kayıp bir sayfa, yeni bir lezzet keşfetme fırsatı olabilir!"
    },
    "401": {
        code: "401",
        title: "Giriş Yapmanız Gerekiyor",
        description: "Bu sayfayı görüntülemek için önce hesabınıza giriş yapmanız gerekiyor.",
        emoji: "🔐",
        icon: UserX,
        color: {
            primary: "red-500",
            secondary: "red-600",
            gradient: "from-red-500 to-red-600",
            background: "from-red-100 to-pink-100"
        },
        autoRedirect: false,
        suggestions: [
            {
                title: "Giriş Yap",
                description: "Hesabınıza giriş yapın",
                icon: Lock,
                link: "/login"
            },
            {
                title: "Kayıt Ol",
                description: "Yeni hesap oluşturun",
                icon: UserX,
                link: "/register"
            },
            {
                title: "Ana Sayfa",
                description: "Ana sayfaya geri dönün",
                icon: Home,
                link: "/"
            }
        ],
        quote: "En güzel tarifler, üye olan kullanıcıları bekliyor!"
    },
    "403": {
        code: "403",
        title: "Erişim Yasak",
        description: "Bu sayfaya erişim yetkiniz bulunmuyor. Yönetici ile iletişime geçebilirsiniz.",
        emoji: "🚫",
        icon: Shield,
        color: {
            primary: "red-500",
            secondary: "red-600",
            gradient: "from-red-500 to-red-600",
            background: "from-red-100 to-rose-100"
        },
        autoRedirect: false,
        suggestions: [
            {
                title: "Ana Sayfa",
                description: "Ana sayfaya geri dönün",
                icon: Home,
                link: "/"
            },
            {
                title: "İletişim",
                description: "Destek ekibi ile iletişime geçin",
                icon: Heart,
                link: "/contact"
            },
            {
                title: "Tarifleri Keşfet",
                description: "Herkese açık tarifleri görün",
                icon: ChefHat,
                link: "/recipes"
            }
        ],
        quote: "Her mutfakta kendine ait kurallar vardır!"
    },
    "500": {
        code: "500",
        title: "Sunucu Hatası",
        description: "Sunucumuzda bir hata oluştu. Teknik ekibimiz durumun farkında ve sorunu çözmeye çalışıyor.",
        emoji: "⚠️",
        icon: Server,
        color: {
            primary: "purple-500",
            secondary: "purple-600",
            gradient: "from-purple-500 to-purple-600",
            background: "from-purple-100 to-indigo-100"
        },
        autoRedirect: false,
        suggestions: [
            {
                title: "Sayfayı Yenile",
                description: "Sayfayı yeniden yüklemeyi deneyin",
                icon: ArrowLeft,
                link: "javascript:window.location.reload()"
            },
            {
                title: "Ana Sayfa",
                description: "Ana sayfaya geri dönün",
                icon: Home,
                link: "/"
            },
            {
                title: "İletişim",
                description: "Sorunu bildirin",
                icon: Heart,
                link: "/contact"
            }
        ],
        quote: "En iyi şefler bile bazen ocağı karıştırır!"
    },
    "network": {
        code: "Ağ",
        title: "İnternet Bağlantısı Yok",
        description: "İnternet bağlantınızı kontrol edin ve tekrar deneyin.",
        emoji: "📡",
        icon: Wifi,
        color: {
            primary: "blue-500",
            secondary: "blue-600",
            gradient: "from-blue-500 to-blue-600",
            background: "from-blue-100 to-cyan-100"
        },
        autoRedirect: false,
        suggestions: [
            {
                title: "Bağlantıyı Kontrol Et",
                description: "İnternet bağlantınızı kontrol edin",
                icon: Wifi,
                link: "javascript:window.location.reload()"
            },
            {
                title: "Sayfayı Yenile",
                description: "Bağlantı sağlandıktan sonra yenileyin",
                icon: ArrowLeft,
                link: "javascript:window.location.reload()"
            },
            {
                title: "Ana Sayfa",
                description: "Ana sayfaya geri dönün",
                icon: Home,
                link: "/"
            }
        ],
        quote: "İyi bir tarif, iyi bir bağlantı gerektirir!"
    }
};

export interface ErrorPageProps {
    errorType?: string;
    customTitle?: string;
    customDescription?: string;
    showNavbar?: boolean;
    showFooter?: boolean;
}

const ErrorPage = ({
    errorType = "404",
    customTitle,
    customDescription,
    showNavbar = true,
    showFooter = true
}: ErrorPageProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const config = errorConfigs[errorType] || errorConfigs["404"];
    const [countdown, setCountdown] = useState(config.redirectSeconds || 3);

    useEffect(() => {
        console.error(
            `${config.code} Error: User encountered error:`,
            errorType,
            location.pathname
        );

        if (config.autoRedirect) {
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        navigate('/');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [location.pathname, navigate, errorType, config]);

    const IconComponent = config.icon;

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
            {showNavbar && <Navbar />}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="flex items-center justify-center min-h-[70vh]">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-2xl"
                    >
                        {/* Error Code Animation */}
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="relative mb-8"
                        >
                            <div className={`text-8xl sm:text-9xl font-bold bg-gradient-to-r ${config.color.gradient} bg-clip-text text-transparent mb-4`}>
                                {config.code}
                            </div>
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-4 -right-4 text-4xl"
                            >
                                {config.emoji}
                            </motion.div>
                        </motion.div>

                        {/* Error Message */}
                        <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-orange-200 mb-8">
                            <CardContent className="p-8">
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                                    {customTitle || config.title}
                                </h1>
                                <p className="text-gray-600 text-lg mb-6">
                                    {customDescription || config.description}
                                </p>

                                {/* Countdown Info - only for auto-redirect errors */}
                                {config.autoRedirect && (
                                    <div className={`bg-gradient-to-r ${config.color.background} rounded-lg p-4 mb-6`}>
                                        <p className={`text-${config.color.secondary} font-medium text-center`}>
                                            <span className={`text-2xl font-bold text-${config.color.primary}`}>{countdown}</span> saniye sonra ana sayfaya yönlendirileceksiniz...
                                        </p>
                                        <div className="w-full bg-orange-200 rounded-full h-2 mt-3">
                                            <motion.div
                                                className={`bg-gradient-to-r ${config.color.gradient} h-2 rounded-full`}
                                                initial={{ width: "100%" }}
                                                animate={{ width: `${(countdown / (config.redirectSeconds || 3)) * 100}%` }}
                                                transition={{ duration: 1 }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Current Path Info - only for 404 */}
                                {errorType === "404" && (
                                    <div className="bg-orange-50 rounded-lg p-4 mb-6">
                                        <p className="text-sm text-orange-700">
                                            <strong>Aranan sayfa:</strong> {location.pathname}
                                        </p>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Button
                                        asChild
                                        className="gradient-primary text-white hover:shadow-lg transition-all duration-200"
                                    >
                                        <Link to="/">
                                            <Home className="h-4 w-4 mr-2" />
                                            Ana Sayfaya Dön
                                        </Link>
                                    </Button>

                                    <Button
                                        variant="outline"
                                        onClick={() => window.history.back()}
                                        className="border-orange-200 text-orange-700 hover:bg-orange-50"
                                    >
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Geri Dön
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Suggestions */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                            {config.suggestions.map((suggestion, index) => {
                                const SuggestionIcon = suggestion.icon;
                                return (
                                    <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer bg-white/60 backdrop-blur-sm">
                                        <CardContent className="p-6 text-center">
                                            <SuggestionIcon className={`h-8 w-8 text-${config.color.primary} mx-auto mb-3`} />
                                            <h3 className="font-semibold text-gray-900 mb-2">{suggestion.title}</h3>
                                            <p className="text-sm text-gray-600">{suggestion.description}</p>
                                            <Button
                                                asChild
                                                variant="ghost"
                                                size="sm"
                                                className={`mt-3 text-${config.color.primary} hover:bg-${config.color.primary}/10`}
                                            >
                                                {suggestion.link.startsWith('javascript:') ? (
                                                    <button onClick={() => eval(suggestion.link.replace('javascript:', ''))}>
                                                        {suggestion.title === "Sayfayı Yenile" ? "Yenile" : "Git"}
                                                    </button>
                                                ) : (
                                                    <Link to={suggestion.link}>
                                                        {suggestion.title === "Tarifleri Keşfet" ? "Keşfet" :
                                                            suggestion.title === "Arama Yap" ? "Ara" :
                                                                suggestion.title === "Favorilerim" ? "Görüntüle" :
                                                                    suggestion.title === "Giriş Yap" ? "Giriş" :
                                                                        suggestion.title === "Kayıt Ol" ? "Kayıt" : "Git"}
                                                    </Link>
                                                )}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>

                        {/* Fun Quote */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className={`bg-gradient-to-r ${config.color.background} rounded-2xl p-6 mb-8`}
                        >
                            <Utensils className={`h-8 w-8 text-${config.color.primary} mx-auto mb-3`} />
                            <p className="text-gray-700 italic text-lg">
                                "{config.quote}"
                            </p>
                            <p className={`text-${config.color.primary} font-semibold mt-2`}>- Ne Yesek AI</p>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {showFooter && <Footer />}
        </div>
    );
};

export default ErrorPage;
