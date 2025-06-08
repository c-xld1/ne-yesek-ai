
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search, Heart, Share2, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const actions = [
    {
      icon: BookOpen,
      label: "Tarif Ara",
      href: "/tarifler",
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      icon: Heart,
      label: "Favoriler",
      action: () => toast({ title: "❤️ Favoriler", description: "Favoriler sayfası yakında!" }),
      color: "bg-red-500 hover:bg-red-600"
    },
    {
      icon: Share2,
      label: "Paylaş",
      action: () => toast({ title: "📤 Paylaş", description: "Paylaşım özelliği yakında!" }),
      color: "bg-green-500 hover:bg-green-600"
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className={`flex flex-col items-end space-y-3 transition-all duration-300 ${isOpen ? 'mb-4' : 'mb-0'}`}>
        {isOpen && actions.map((action, index) => (
          <div
            key={index}
            className="flex items-center space-x-3 animate-fadeIn"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <span className="bg-white text-gray-800 px-3 py-1 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap">
              {action.label}
            </span>
            {action.href ? (
              <Link to={action.href}>
                <Button
                  size="sm"
                  className={`${action.color} text-white rounded-full h-12 w-12 p-0 shadow-lg hover:scale-110 transition-all duration-300`}
                >
                  <action.icon className="h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <Button
                size="sm"
                className={`${action.color} text-white rounded-full h-12 w-12 p-0 shadow-lg hover:scale-110 transition-all duration-300`}
                onClick={action.action}
              >
                <action.icon className="h-5 w-5" />
              </Button>
            )}
          </div>
        ))}
      </div>
      
      <Button
        size="lg"
        className={`gradient-primary text-white rounded-full h-14 w-14 p-0 shadow-xl hover:scale-110 transition-all duration-300 ${isOpen ? 'rotate-45' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default FloatingActionButton;
