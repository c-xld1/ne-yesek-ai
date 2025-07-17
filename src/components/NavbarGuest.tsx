import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";

/**
 * Giriş yapmamış kullanıcılar için navbar sağ kısmında gösterilecek bileşen
 * Giriş yap ve kayıt ol butonları içerir
 */
const NavbarGuest: React.FC = () => {
    return (
        <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" className="border-orange-500 text-orange-600 hover:bg-orange-50" asChild>
                <Link to="/giris-yap" className="flex items-center gap-1">
                    <LogIn className="h-4 w-4" />
                    <span>Giriş Yap</span>
                </Link>
            </Button>

            <Button variant="default" size="sm" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white hover:opacity-90 shadow-sm" asChild>
                <Link to="/kayit-ol" className="flex items-center gap-1">
                    <UserPlus className="h-4 w-4" />
                    <span>Kayıt Ol</span>
                </Link>
            </Button>
        </div>
    );
};

export default NavbarGuest;