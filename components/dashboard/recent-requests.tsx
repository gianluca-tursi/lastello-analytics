'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const requests = [
  {
    id: 1,
    name: 'Maria Rossi',
    email: 'maria.rossi@email.com',
    type: 'Cremazione',
    status: 'completed',
    date: '2 ore fa',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: 2,
    name: 'Giuseppe Bianchi',
    email: 'giuseppe.b@email.com',
    type: 'Tradizionale',
    status: 'pending',
    date: '5 ore fa',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: 3,
    name: 'Anna Verdi',
    email: 'anna.verdi@email.com',
    type: 'Cremazione',
    status: 'processing',
    date: '1 giorno fa',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: 4,
    name: 'Marco Ferrari',
    email: 'marco.f@email.com',
    type: 'Tradizionale',
    status: 'completed',
    date: '2 giorni fa',
    avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: 5,
    name: 'Laura Conti',
    email: 'laura.conti@email.com',
    type: 'Cremazione',
    status: 'completed',
    date: '3 giorni fa',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
];

const statusConfig = {
  completed: { label: 'Completato', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  pending: { label: 'In Attesa', className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  processing: { label: 'In Corso', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
};

export function RecentRequests() {
  return (
    <div className="space-y-4">
      {requests.map((request, index) => (
        <div
          key={request.id}
          className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <Avatar className="h-10 w-10 ring-2 ring-blue-100 dark:ring-blue-900/30">
            <AvatarImage src={request.avatar} alt={request.name} />
            <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white">
              {request.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{request.name}</p>
            <p className="text-xs text-muted-foreground">{request.email}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge 
              variant="secondary" 
              className={statusConfig[request.status as keyof typeof statusConfig].className}
            >
              {statusConfig[request.status as keyof typeof statusConfig].label}
            </Badge>
            <p className="text-xs text-muted-foreground">{request.date}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
