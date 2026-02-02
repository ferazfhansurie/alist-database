import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getApiUrl } from '../config/api';

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
    const transformed = {
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
      rate: parseFloat(kol.rate) || 0,
      // PostgreSQL returns aliases in all lowercase - parse as numbers
      instagramRate: parseFloat(kol.instagramrate || kol.instagramRate || kol.instagram_rate) || 0,
      tiktokRate: parseFloat(kol.tiktokrate || kol.tiktokRate || kol.tiktok_rate) || 0,
      facebookRate: parseFloat(kol.facebookrate || kol.facebookRate || kol.facebook_rate) || 0,
      twitterRate: parseFloat(kol.twitterrate || kol.twitterRate || kol.twitter_rate) || 0,
      threadRate: parseFloat(kol.threadrate || kol.threadRate || kol.thread_rate) || 0,
      blogRate: parseFloat(kol.blograte || kol.blogRate || kol.blog_rate) || 0,
      youtubeRate: parseFloat(kol.youtuberate || kol.youtubeRate || kol.youtube_rate) || 0,
      lemon8Rate: parseFloat(kol.lemon8rate || kol.lemon8Rate || kol.lemon8_rate) || 0,
      xhsRate: parseFloat(kol.xhsrate || kol.xhsRate || kol.xhs_rate) || 0,
      rating: parseInt(kol.rating) || 0,
      sellingPrice: parseFloat(kol.sellingprice || kol.sellingPrice || kol.selling_price) || 0,
      tier: kol.tier,
      gender: kol.gender,
      niches: kol.niches || [],
      hairStyle: kol.hair_style || kol.hairStyle || kol.hairstyle,
      race: kol.race,
      address: kol.address,
      contactNumber: kol.contact_number || kol.contactNumber || kol.contactnumber,
      submissionDate: kol.submission_date || kol.submissionDate || kol.submissiondate,
      rateDetails: kol.rate_details || kol.rateDetails || kol.ratedetails,
      pic: kol.pic,
      picUserId: kol.picuserid || kol.picUserId || kol.pic_user_id || null,
      picUserName: kol.picusername || kol.picUserName || kol.pic_user_name || null,
      kolType: kol.kol_type || kol.kolType || kol.koltype,
      notes: kol.notes,
      isActive: kol.is_active !== undefined ? kol.is_active : (kol.isActive !== undefined ? kol.isActive : kol.isactive),
      createdAt: kol.created_at || kol.createdAt || kol.createdat,
      updatedAt: kol.updated_at || kol.updatedAt || kol.updatedat
    };
    

    
    return transformed;
  };

  // Load all KOLs
  const loadKOLs = useCallback(async () => {
    try {
      console.log('🌐 API CALL - loadKOLs');
      const response = await fetch(getApiUrl('/api/kols'));
      if (!response.ok) {
        throw new Error('Failed to fetch KOLs');
      }
      const data = await response.json();
      console.log(data)
      // Transform the data to match frontend expectations
      const transformedData = data.map(transformKOLData);
      setKols(transformedData);
      return transformedData; // Return the data so it can be used in components
    } catch (err) {
      console.error('Error loading KOLs:', err);
      setError(err.message);
      return []; // Return empty array on error
    }
  }, []);

  // Load KOLs by type
  const loadKOLsByType = useCallback(async (kolType) => {
    try {
    
      const response = await fetch(getApiUrl(`/api/kols/type/${kolType}`));
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
  }, []);

  // Load statistics
  const loadStats = async () => {
    try {
      const response = await fetch(getApiUrl('/api/kols/stats'));
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
      const response = await fetch(getApiUrl('/api/kols'), {
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
      const response = await fetch(getApiUrl(`/api/kols/${id}`), {
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
      const response = await fetch(getApiUrl(`/api/kols/${id}`), {
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
  const getKOLById = useCallback(async (id) => {
    try {
      console.log('🌐 API CALL - getKOLById:', id);
      const response = await fetch(getApiUrl(`/api/kols/${id}`));
      if (!response.ok) {
        throw new Error('Failed to fetch KOL');
      }
      const data = await response.json();
      console.log('📥 API RESPONSE - getKOLById raw data:', {
        id: data.id,
        name: data.name,
        rates: {
          instagramrate: data.instagramrate,
          tiktokrate: data.tiktokrate,
          facebookrate: data.facebookrate,
          instagramRate: data.instagramRate,
          tiktokRate: data.tiktokRate,
          facebookRate: data.facebookRate
        }
      });
      // Transform the data to match frontend expectations
      const transformed = transformKOLData(data);
      console.log('🟢 EDIT VIEW - Transformed data for', data.name, ':', {
        instagramRate: transformed.instagramRate,
        tiktokRate: transformed.tiktokRate,
        facebookRate: transformed.facebookRate
      });
      return transformed;
    } catch (err) {
      console.error('Error getting KOL by ID:', err);
      setError(err.message);
      return null;
    }
  }, []);

  // Get all niches
  const getNiches = async () => {
    try {
      const response = await fetch(getApiUrl('/api/niches'));
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
