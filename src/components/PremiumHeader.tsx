import { Badge } from "@/components/ui/badge";
import { Globe, MapPin, LucideIcon } from "lucide-react";

interface PremiumHeaderProps {
    title: string;
    description: string;
    emoji?: string;
    primaryBadge?: {
        icon: LucideIcon;
        text: string;
        animate?: boolean;
    };
    secondaryBadge?: {
        icon: LucideIcon;
        text: string;
    };
    breadcrumbItems?: Array<{
        label: string;
        href?: string;
        isActive?: boolean;
    }>;
    className?: string;
}

const PremiumHeader = ({
    title,
    description,
    emoji,
    primaryBadge = {
        icon: Globe,
        text: "Keşfet",
        animate: true
    },
    secondaryBadge = {
        icon: MapPin,
        text: "Türkiye Lezzetleri"
    },
    breadcrumbItems = [],
    className = ""
}: PremiumHeaderProps) => {
    const PrimaryIcon = primaryBadge.icon;
    const SecondaryIcon = secondaryBadge.icon;

    return (
        <div className={`relative rounded-3xl bg-gradient-to-r from-orange-500 to-amber-500 p-8 mb-10 overflow-hidden shadow-xl ${className}`}>
            <div className="absolute inset-0 bg-cover bg-center opacity-10 bg-placeholder"></div>
            <div className="relative z-10 max-w-3xl">
                {/* Breadcrumb Badges */}
                {breadcrumbItems.length > 0 && (
                    <div className="flex items-center gap-2 mb-6">
                        {breadcrumbItems.map((item, index) => (
                            <div key={index} className="flex items-center">
                                {item.href ? (
                                    <a href={item.href}>
                                        <Badge className={`transition-all duration-200 px-3 py-1 rounded-full border-0 ${item.isActive
                                            ? 'bg-white text-orange-600 hover:bg-orange-50'
                                            : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                                            }`}>
                                            {index === 0 && <PrimaryIcon className={`h-3.5 w-3.5 mr-1 ${primaryBadge.animate ? 'animate-pulse' : ''}`} />}
                                            {index === breadcrumbItems.length - 1 && item.isActive && <SecondaryIcon className="h-3.5 w-3.5 mr-1" />}
                                            {item.label}
                                        </Badge>
                                    </a>
                                ) : (
                                    <Badge className={`transition-all duration-200 px-3 py-1 rounded-full border-0 ${item.isActive
                                        ? 'bg-white text-orange-600 hover:bg-orange-50'
                                        : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                                        }`}>
                                        {index === 0 && <PrimaryIcon className={`h-3.5 w-3.5 mr-1 ${primaryBadge.animate ? 'animate-pulse' : ''}`} />}
                                        {index === breadcrumbItems.length - 1 && item.isActive && <SecondaryIcon className="h-3.5 w-3.5 mr-1" />}
                                        {item.label}
                                    </Badge>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Title */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                    {title}
                    {emoji && <span className="ml-2 inline-block animate-bounce">{emoji}</span>}
                </h1>

                {/* Description */}
                <p className="text-white/90 text-lg sm:text-xl max-w-2xl leading-relaxed">
                    {description}
                </p>
            </div>

            {/* Decorative elements */}
            <div className="absolute bottom-0 right-0 transform translate-y-1/4 translate-x-1/4 w-64 h-64 rounded-full bg-orange-300 opacity-20 blur-2xl"></div>
            <div className="absolute top-0 right-10 transform -translate-y-1/2 w-32 h-32 rounded-full bg-amber-300 opacity-20 blur-xl"></div>
        </div>
    );
};

export default PremiumHeader;
