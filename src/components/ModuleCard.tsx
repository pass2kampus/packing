
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, CheckCircle, ArrowRight, Key } from 'lucide-react';

interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  type: string;
  keysRequired?: number;
}

interface ModuleCardProps {
  module: Module;
  isCompleted: boolean;
  isUnlocked: boolean;
  onModuleClick: (module: Module) => void;
  userKeys: number;
}

export const ModuleCard = ({ 
  module, 
  isCompleted, 
  isUnlocked, 
  onModuleClick,
  userKeys 
}: ModuleCardProps) => {
  const canClick = true; // All modules are now clickable

  // Toned down banner background
  const bannerBgClass = "bg-gradient-to-br from-blue-50 to-cyan-50";

  return (
    <Card
      className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
        canClick
          ? 'hover:shadow-lg border-2 border-transparent hover:border-blue-200'
          : 'opacity-60 cursor-not-allowed'
      } ${isCompleted ? 'ring-2 ring-green-500' : ''}`}
      onClick={() => canClick && onModuleClick(module)}
    >
      <CardContent className="p-6">
        <div className={`w-full h-32 ${bannerBgClass} rounded-lg mb-4 flex items-center justify-center relative overflow-hidden`}>
          <div className="text-4xl text-blue-500">{module.icon}</div>

          {isCompleted && (
            <div className="absolute top-2 right-2">
              <CheckCircle className="h-6 w-6 text-green-500 bg-white rounded-full" />
            </div>
          )}

          {isUnlocked && !isCompleted && (
            <div className="absolute bottom-2 right-2">
              <ArrowRight className="h-5 w-5 text-cyan-700" />
            </div>
          )}
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {module.title}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          {module.description}
        </p>

        <div className="flex items-center justify-between">
          <span className={`text-xs px-2 py-1 rounded-full ${
            isCompleted
              ? 'bg-green-100 text-green-800'
              : 'bg-blue-100 text-blue-800'
          }`}>
            {isCompleted 
              ? 'Completed' 
              : 'Available'
            }
          </span>

          {canClick && (
            <Button
              size="sm"
              variant={isCompleted ? "secondary" : "default"}
              className="h-8"
            >
              {isCompleted 
                ? 'Review' 
                : isUnlocked 
                  ? 'Start' 
                  : `Unlock`
              }
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
