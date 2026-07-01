// ═══════════════════════════════════════════════════════════════════════════
// EXEMPLE D'INTÉGRATION DU WIDGET DE FORMATION DANS LE DASHBOARD ADMIN
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  BookOpen,
  Award,
  MessageSquare 
} from 'lucide-react';
import TrainingStatsWidget from '../components/TrainingStatsWidget';
import { UserProgress } from '../types/training';

/**
 * Cet exemple montre comment intégrer le widget de statistiques
 * de formation dans votre dashboard admin existant.
 * 
 * INSTRUCTIONS :
 * 1. Copiez la section TrainingStatsWidget dans votre Admin.tsx
 * 2. Chargez les données de progression depuis localStorage ou Firebase
 * 3. Passez les données au widget
 */

export default function AdminDashboardWithTraining() {
  const [trainingProgress, setTrainingProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrainingProgress();
  }, []);

  const loadTrainingProgress = () => {
    try {
      // Méthode 1 : Depuis localStorage (pour test)
      const savedProgress = localStorage.getItem('trainingProgress');
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        // Si c'est un seul utilisateur, le mettre dans un tableau
        setTrainingProgress(Array.isArray(progress) ? progress : [progress]);
      }

      // Méthode 2 : Depuis Firebase (production)
      // Décommentez et adaptez selon votre structure Firebase
      /*
      import { collection, getDocs } from 'firebase/firestore';
      import { db } from '../firebase';
      
      const loadFromFirebase = async () => {
        const querySnapshot = await getDocs(collection(db, 'trainingProgress'));
        const allProgress: UserProgress[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.progress) {
            allProgress.push(...data.progress);
          }
        });
        
        setTrainingProgress(allProgress);
      };
      
      loadFromFirebase();
      */
      
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement de la progression:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-pm-dark flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-ring loading-lg text-pm-gold mb-4"></div>
          <p className="text-white/40">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pm-dark p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-playfair font-black text-white mb-2">
            Dashboard Admin
          </h1>
          <p className="text-white/60">
            Vue d'ensemble de la plateforme Perfect Models Management
          </p>
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            label="Mannequins actifs"
            value="42"
            change="+12%"
            color="blue"
          />
          <StatCard
            icon={Calendar}
            label="Événements ce mois"
            value="8"
            change="+3"
            color="green"
          />
          <StatCard
            icon={MessageSquare}
            label="Messages non lus"
            value="15"
            change="5 nouveaux"
            color="yellow"
          />
          <StatCard
            icon={TrendingUp}
            label="Taux de conversion"
            value="68%"
            change="+5%"
            color="purple"
          />
        </div>

        {/* Grille principale */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Widget de formation - NOUVEAU */}
          <div className="lg:col-span-2">
            <TrainingStatsWidget allProgress={trainingProgress} />
          </div>

          {/* Autres widgets existants */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-playfair font-bold text-white mb-4">
              Activité récente
            </h3>
            <div className="space-y-3">
              <ActivityItem
                type="casting"
                message="Nouvelle candidature casting"
                time="Il y a 5 min"
              />
              <ActivityItem
                type="booking"
                message="Demande de réservation"
                time="Il y a 1h"
              />
              <ActivityItem
                type="message"
                message="Nouveau message contact"
                time="Il y a 2h"
              />
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-playfair font-bold text-white mb-4">
              Prochains événements
            </h3>
            <div className="space-y-3">
              <EventItem
                title="Fashion Day 2024"
                date="15 Juin 2024"
                location="Libreville"
              />
              <EventItem
                title="Casting Elite Models"
                date="22 Juin 2024"
                location="Port-Gentil"
              />
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickAction
            icon={Users}
            label="Gérer les mannequins"
            href="/admin/models"
          />
          <QuickAction
            icon={BookOpen}
            label="Contenu formation"
            href="/formation"
          />
          <QuickAction
            icon={Calendar}
            label="Événements"
            href="/admin/fashion-day-events"
          />
          <QuickAction
            icon={Award}
            label="Certificats"
            href="/admin/classroom-progress"
          />
        </div>
      </div>
    </div>
  );
}

// Composants auxiliaires
function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  change, 
  color 
}: { 
  icon: any; 
  label: string; 
  value: string; 
  change: string; 
  color: string;
}) {
  const colorClasses = {
    blue: 'text-blue-400 bg-blue-500/10',
    green: 'text-green-400 bg-green-500/10',
    yellow: 'text-yellow-400 bg-yellow-500/10',
    purple: 'text-purple-400 bg-purple-500/10'
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-12 h-12 rounded-xl ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center`}>
          <Icon size={24} />
        </div>
      </div>
      <div className="text-3xl font-black text-white mb-1">{value}</div>
      <div className="text-sm text-white/60 mb-2">{label}</div>
      <div className="text-xs text-green-400">{change}</div>
    </div>
  );
}

function ActivityItem({ 
  type, 
  message, 
  time 
}: { 
  type: string; 
  message: string; 
  time: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
      <div className="w-2 h-2 rounded-full bg-pm-gold" />
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm">{message}</p>
        <p className="text-white/40 text-xs">{time}</p>
      </div>
    </div>
  );
}

function EventItem({ 
  title, 
  date, 
  location 
}: { 
  title: string; 
  date: string; 
  location: string;
}) {
  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
      <h4 className="text-white font-bold mb-2">{title}</h4>
      <div className="flex items-center gap-4 text-xs text-white/60">
        <span>📅 {date}</span>
        <span>📍 {location}</span>
      </div>
    </div>
  );
}

function QuickAction({ 
  icon: Icon, 
  label, 
  href 
}: { 
  icon: any; 
  label: string; 
  href: string;
}) {
  return (
    <a
      href={href}
      className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-pm-gold/30 hover:bg-white/10 transition-all group"
    >
      <div className="w-12 h-12 rounded-xl bg-pm-gold/20 flex items-center justify-center group-hover:scale-110 transition-transform">
        <Icon size={24} className="text-pm-gold" />
      </div>
      <span className="text-white/70 text-sm text-center group-hover:text-white transition-colors">
        {label}
      </span>
    </a>
  );
}
