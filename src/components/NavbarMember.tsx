
import React from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Settings, Heart, PlusCircle, Bell, Star, HelpCircle, Shield, ChefHat } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";


// Giriş yapmış kullanıcılar için navbar sağ kısmı
const NavbarMember: React.FC = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isChef, setIsChef] = useState(false);

    useEffect(() => {
        checkUserRoles();
    }, [user]);

    const checkUserRoles = async () => {
        if (!user) return;
        
        // Admin kontrolü
        const { data: adminData } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", user.id)
            .eq("role", "admin")
            .single();
        setIsAdmin(!!adminData);

        // Chef kontrolü
        const { data: chefData } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", user.id)
            .eq("role", "chef")
            .single();
        setIsChef(!!chefData);
    };

    const handleProfile = () => {
        if (username) {
            navigate(`/profil/${username}`);
        } else {
            navigate("/profil");
        }
    };
    const handleSettings = () => {
        navigate("/ayarlar");
    };
    const handleLogout = () => {
        logout();
        navigate("/giris-yap");
    };
    const handleFavorites = () => {
        navigate("/favoriler");
    };

    const username = user?.username;
    const email = user?.email;
    const avatarUrl = (user as any)?.avatar_url; // avatar_url from profiles table
    const firstLetter = username ? username.charAt(0).toUpperCase() : "?";

    return (
        <div className="flex items-center space-x-3">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                            {avatarUrl ? (
                                <AvatarImage src={avatarUrl} alt={username || "Kullanıcı"} />
                            ) : (
                                <AvatarFallback className="bg-food-100 text-food-600">{firstLetter}</AvatarFallback>
                            )}
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="end" forceMount>
                    {/* Profil özeti */}
                    <DropdownMenuLabel className="font-normal pb-2 border-b border-orange-100">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                                {avatarUrl ? (
                                    <AvatarImage src={avatarUrl} alt={username || "Kullanıcı"} />
                                ) : (
                                    <AvatarFallback className="bg-food-100 text-food-600 text-lg">{firstLetter}</AvatarFallback>
                                )}
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="text-base font-semibold text-gray-900">{username || "Kullanıcı"}</span>
                                <span className="text-xs text-muted-foreground">{email || "-"}</span>
                            </div>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuGroup>
                        <DropdownMenuItem onClick={handleProfile}>
                            <User className="mr-2 h-4 w-4" />
                            <span>Profilim</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleFavorites}>
                            <Heart className="mr-2 h-4 w-4" />
                            <span>Favorilerim</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate("/tarif-paylas")}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            <span>Tarif Paylaş</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleSettings}>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Ayarlar</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => navigate("/bildirimler")}>
                            <Bell className="mr-2 h-4 w-4" />
                            <span>Bildirimler</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate("/premium")}>
                            <Star className="mr-2 h-4 w-4 text-yellow-500" />
                            <span>Premium</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate("/yardim")}>
                            <HelpCircle className="mr-2 h-4 w-4" />
                            <span>Yardım & Destek</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    {(isAdmin || isChef) && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                {isAdmin && (
                                    <DropdownMenuItem onClick={() => navigate("/admin")} className="text-purple-600 focus:text-purple-600 focus:bg-purple-50">
                                        <Shield className="mr-2 h-4 w-4" />
                                        <span>Admin Panel</span>
                                    </DropdownMenuItem>
                                )}
                                {isChef && (
                                    <DropdownMenuItem onClick={() => navigate("/chef-panel")} className="text-orange-600 focus:text-orange-600 focus:bg-orange-50">
                                        <ChefHat className="mr-2 h-4 w-4" />
                                        <span>Şef Paneli</span>
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuGroup>
                        </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Çıkış Yap</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default NavbarMember;