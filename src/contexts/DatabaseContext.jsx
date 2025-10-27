import React, { createContext, useContext, useState, useEffect } from 'react';

const DatabaseContext = createContext();

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};

export const DatabaseProvider = ({ children }) => {
  const [kols, setKols] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    socialMedia: 0,
    twitterThread: 0,
    blogger: 0,
    productionTalent: 0,
    totalValue: 0,
    averageRate: 0
  });

  // Initialize database and load data
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load initial data
        await loadKOLs();
        await loadStats();
        
        console.log('Database initialized successfully');
      } catch (err) {
        console.error('Error initializing database:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeDatabase();
  }, []);

  // Transform database fields from snake_case to camelCase
  const transformKOLData = (kol) => {
    return {
      id: kol.id,
      name: kol.name,
      instagram: kol.instagram,
      tiktok: kol.tiktok,
      facebook: kol.facebook,
      twitter: kol.twitter,
      thread: kol.thread,
      youtube: kol.youtube,
      lemon8: kol.lemon8,
      xhs: kol.xhs,
      blog: kol.blog,
      rate: kol.rate,
      instagramRate: kol.instagramRate,
      tiktokRate: kol.tiktokRate,
      facebookRate: kol.facebookRate,
      twitterRate: kol.twitterRate,
      threadRate: kol.threadRate,
      blogRate: kol.blogRate,
      youtubeRate: kol.youtubeRate,
      lemon8Rate: kol.lemon8Rate,
      xhsRate: kol.xhsRate,
      rating: kol.rating,
      sellingPrice: kol.selling_price || kol.sellingPrice || 0,
      tier: kol.tier,
      gender: kol.gender,
      niches: kol.niches || [],
      hairStyle: kol.hair_style,
      race: kol.race,
      address: kol.address,
      contactNumber: kol.contact_number,
      submissionDate: kol.submission_date,
      rateDetails: kol.rate_details,
  pic: kol.pic,
  picUserId: kol.pic_user_id || kol.picUserId || null,
  picUserName: kol.pic_user_name || kol.picUserName || null,
      kolType: kol.kol_type,
      notes: kol.notes,
      isActive: kol.is_active,
      createdAt: kol.created_at,
      updatedAt: kol.updated_at
    };
  };

  // Load all KOLs
  const loadKOLs = async () => {
    try {
      const response = await fetch('https://alist.jutateknologi.com/api/kols');
      if (!response.ok) {
        throw new Error('Failed to fetch KOLs');
      }
      const data = await response.json();
      // Transform the data to match frontend expectations
      const transformedData = data.map(transformKOLData);
      setKols(transformedData);
      return transformedData; // Return the data so it can be used in components
    } catch (err) {
      console.error('Error loading KOLs:', err);
      setError(err.message);
      return []; // Return empty array on error
    }
  };

  // Load KOLs by type
  const loadKOLsByType = async (kolType) => {
    try {
      const response = await fetch(`https://alist.jutateknologi.com/api/kols/type/${kolType}`);
      if (!response.ok) {
        throw new Error('Failed to fetch KOLs by type');
      }
      const data = await response.json();
      // Transform the data to match frontend expectations
      return data.map(transformKOLData);
    } catch (err) {
      console.error('Error loading KOLs by type:', err);
      setError(err.message);
      return [];
    }
  };

  // Load statistics
  const loadStats = async () => {
    try {
      const response = await fetch('https://alist.jutateknologi.com/api/kols/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      const data = await response.json();
      setStats({
        total: parseInt(data.total) || 0,
        socialMedia: parseInt(data.social_media) || 0,
        twitterThread: parseInt(data.twitter_thread) || 0,
        blogger: parseInt(data.blogger) || 0,
        productionTalent: parseInt(data.production_talent) || 0,
        totalValue: parseFloat(data.total_value) || 0,
        averageRate: parseFloat(data.average_rate) || 0
      });
    } catch (err) {
      console.error('Error loading stats:', err);
      setError(err.message);
    }
  };

  // Create new KOL
  const createKOL = async (kolData) => {
    try {
      const response = await fetch('https://alist.jutateknologi.com/api/kols', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(kolData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create KOL');
      }
      
      const data = await response.json();
      const newKOL = transformKOLData(data);
      await loadKOLs();
      await loadStats();
      return newKOL;
    } catch (err) {
      console.error('Error creating KOL:', err);
      setError(err.message);
      throw err;
    }
  };

  // Update KOL
  const updateKOL = async (id, kolData) => {
    try {
      const response = await fetch(`https://alist.jutateknologi.com/api/kols/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(kolData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update KOL');
      }
      
      const data = await response.json();
      const updatedKOL = transformKOLData(data);
      await loadKOLs();
      await loadStats();
      return updatedKOL;
    } catch (err) {
      console.error('Error updating KOL:', err);
      setError(err.message);
      throw err;
    }
  };

  // Delete KOL
  const deleteKOL = async (id) => {
    try {
      const response = await fetch(`https://alist.jutateknologi.com/api/kols/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete KOL');
      }
      
      await loadKOLs();
      await loadStats();
    } catch (err) {
      console.error('Error deleting KOL:', err);
      setError(err.message);
      throw err;
    }
  };

  // Get KOL by ID
  const getKOLById = async (id) => {
    try {
      const response = await fetch(`https://alist.jutateknologi.com/api/kols/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch KOL');
      }
      const data = await response.json();
      // Transform the data to match frontend expectations
      return transformKOLData(data);
    } catch (err) {
      console.error('Error getting KOL by ID:', err);
      setError(err.message);
      return null;
    }
  };

  // Get all niches
  const getNiches = async () => {
    try {
      const response = await fetch('https://alist.jutateknologi.com/api/niches');
      if (!response.ok) {
        throw new Error('Failed to fetch niches');
      }
      return await response.json();
    } catch (err) {
      console.error('Error getting niches:', err);
      setError(err.message);
      return [];
    }
  };

  // Refresh data
  const refreshData = async () => {
    try {
      await loadKOLs();
      await loadStats();
    } catch (err) {
      console.error('Error refreshing data:', err);
      setError(err.message);
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  const value = {
    kols,
    loading,
    error,
    stats,
    loadKOLs,
    loadKOLsByType,
    createKOL,
    updateKOL,
    deleteKOL,
    getKOLById,
    getNiches,
    refreshData,
    clearError
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};
