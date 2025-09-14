import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface WorkoutSession {
  id: string;
  date: string;
  duration: number; // in minutes
  rounds: number;
  completed: boolean;
}

interface WorkoutStats {
  totalWorkouts: number;
  totalTime: number; // in minutes
  streak: number; // days
}

const WORKOUT_STORAGE_KEY = 'workout_sessions';
const STATS_STORAGE_KEY = 'workout_stats';

export const useWorkoutStats = () => {
  const [stats, setStats] = useState<WorkoutStats>({
    totalWorkouts: 0,
    totalTime: 0,
    streak: 0,
  });

  const [sessions, setSessions] = useState<WorkoutSession[]>([]);

  // Load stats and sessions on mount
  useEffect(() => {
    loadStats();
    loadSessions();
  }, []);

  const loadStats = async () => {
    try {
      const savedStats = await AsyncStorage.getItem(STATS_STORAGE_KEY);
      if (savedStats) {
        setStats(JSON.parse(savedStats));
      }
    } catch (error) {
      console.log('Error loading workout stats:', error);
    }
  };

  const loadSessions = async () => {
    try {
      const savedSessions = await AsyncStorage.getItem(WORKOUT_STORAGE_KEY);
      if (savedSessions) {
        const parsedSessions = JSON.parse(savedSessions);
        setSessions(parsedSessions);
        calculateStats(parsedSessions);
      }
    } catch (error) {
      console.log('Error loading workout sessions:', error);
    }
  };

  const calculateStats = useCallback((sessionsList: WorkoutSession[]) => {
    const completedSessions = sessionsList.filter(session => session.completed);
    const totalWorkouts = completedSessions.length;
    const totalTime = completedSessions.reduce((sum, session) => sum + session.duration, 0);
    
    // Calculate streak
    const sortedSessions = completedSessions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < sortedSessions.length; i++) {
      const sessionDate = new Date(sortedSessions[i].date);
      sessionDate.setHours(0, 0, 0, 0);
      
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      
      if (sessionDate.getTime() === expectedDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }

    const newStats = { totalWorkouts, totalTime, streak };
    setStats(newStats);
    
    // Save stats
    AsyncStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(newStats));
  }, []);

  const startWorkout = useCallback((rounds: number) => {
    const session: WorkoutSession = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      duration: 0,
      rounds,
      completed: false,
    };
    
    const newSessions = [...sessions, session];
    setSessions(newSessions);
    AsyncStorage.setItem(WORKOUT_STORAGE_KEY, JSON.stringify(newSessions));
    
    return session.id;
  }, [sessions]);

  const completeWorkout = useCallback((sessionId: string, duration: number) => {
    const updatedSessions = sessions.map(session => 
      session.id === sessionId 
        ? { ...session, duration, completed: true }
        : session
    );
    
    setSessions(updatedSessions);
    AsyncStorage.setItem(WORKOUT_STORAGE_KEY, JSON.stringify(updatedSessions));
    calculateStats(updatedSessions);
  }, [sessions, calculateStats]);

  const cancelWorkout = useCallback((sessionId: string) => {
    const updatedSessions = sessions.filter(session => session.id !== sessionId);
    setSessions(updatedSessions);
    AsyncStorage.setItem(WORKOUT_STORAGE_KEY, JSON.stringify(updatedSessions));
  }, [sessions]);

  return {
    stats,
    startWorkout,
    completeWorkout,
    cancelWorkout,
  };
};
