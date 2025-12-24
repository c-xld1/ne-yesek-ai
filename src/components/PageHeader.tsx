import { ReactNode } from "react";
import { motion } from "framer-motion";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  badge?: string;
  backgroundPattern?: boolean;
  actions?: ReactNode;
}

const PageHeader = ({
  title,
  description,
  icon,
  badge,
  backgroundPattern = true,
  actions,
}: PageHeaderProps) => {
  return (
    <div className="relative gradient-secondary border-b border-border overflow-hidden">
      {/* Background Pattern */}
      {backgroundPattern && (
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f97316' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
      )}

      <div className="relative max-w-7xl mx-auto px-4 py-10 sm:py-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Badge */}
          {badge && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4"
            >
              {badge}
            </motion.div>
          )}

          {/* Title with Icon */}
          <div className="flex items-center justify-center gap-3 mb-3">
            {icon && (
              <motion.div
                initial={{ rotate: -10, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-3xl sm:text-4xl"
              >
                {icon}
              </motion.div>
            )}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
              {title}
            </h1>
          </div>

          {/* Description */}
          {description && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              {description}
            </motion.p>
          )}

          {/* Actions */}
          {actions && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-5 flex items-center justify-center gap-4"
            >
              {actions}
            </motion.div>
          )}
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-primary/10 to-transparent rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default PageHeader;
