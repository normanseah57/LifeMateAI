import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Store, 
  Tag, 
  ExternalLink, 
  ShieldCheck, 
  Activity, 
  DollarSign, 
  Smile, 
  Compass, 
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const PARTNER_OFFERS = [
  {
    id: 'p1',
    title: 'Talkspace Online Therapy',
    category: 'mind',
    tagline: 'Match with a licensed therapist online. Special LifeMate rate.',
    deal: 'First month 15% off',
    price: '$65 / week',
    provider: 'Talkspace Health',
    link: 'https://www.talkspace.com',
    details: 'Get clinical support tailored for young adults dealing with stress, burnout, or transition anxiety.',
    icon: Smile,
    color: '#EC4899',
    matchGoal: 'Manage Stress'
  },
  {
    id: 'p2',
    title: 'Chase High Yield Account',
    category: 'money',
    tagline: 'Earn high-yield interest on your emergency reserves with zero fees.',
    deal: '4.50% APY + $100 Bonus',
    price: '$0 Monthly Fee',
    provider: 'Chase Bank OpenBanking',
    link: 'https://www.chase.com',
    details: 'Securely link via open banking to automatically route budget savings into a high-interest reserve.',
    icon: DollarSign,
    color: '#3B82F6',
    matchGoal: 'Save Money'
  },
  {
    id: 'p3',
    title: 'Equinox Fitness Passes',
    category: 'body',
    tagline: 'Unlock access to premier classes, wellness spas, and cardio centers.',
    deal: 'Save $120 on Initiation',
    price: '$180 / month',
    provider: 'Equinox Clubs',
    link: 'https://www.equinox.com',
    details: 'Includes advanced health assessments that sync sleep quality directly to Garmin or Apple Watch.',
    icon: Activity,
    color: '#10B981',
    matchGoal: 'Build Habits'
  },
  {
    id: 'p4',
    title: 'GreenChef Organic Meals',
    category: 'body',
    tagline: 'Pre-portioned, chef-crafted organic meals delivered directly to your door.',
    deal: '50% Off First Delivery Box',
    price: '$7.99 / serving',
    provider: 'Green Chef Delivery',
    link: 'https://www.greenchef.com',
    details: 'Organic ingredients, high protein options. Nutrients automatically sync to LifeMate calorie targets.',
    icon: Activity,
    color: '#10B981',
    matchGoal: 'Better Sleep'
  },
  {
    id: 'p5',
    title: 'BetterHelp Counseling',
    category: 'mind',
    tagline: 'Chat, phone, or video therapy with accredited relationship guides.',
    deal: '1 Week Free Trial',
    price: '$60 / session',
    provider: 'BetterHelp Inc.',
    link: 'https://www.betterhelp.com',
    details: 'Affordable counseling with 24/7 chat support. Goal-aligned tracking helps highlight stress reductions.',
    icon: Smile,
    color: '#EC4899',
    matchGoal: 'Manage Stress'
  },
  {
    id: 'p6',
    title: 'SoFi Automated Investing',
    category: 'money',
    tagline: 'Start fractional investing or automated portfolios with no management fees.',
    deal: 'Get $25 in Free Stock',
    price: '$5 Min Investment',
    provider: 'SoFi Invest',
    link: 'https://www.sofi.com',
    details: 'AI-led wealth building tools. Set up micro-allocations directly aligned with your savings goals.',
    icon: DollarSign,
    color: '#3B82F6',
    matchGoal: 'Save Money'
  }
];

const Marketplace = () => {
  const { profile, addNotification, addAuditLog } = useApp();
  const [filter, setFilter] = useState('all');
  const [bookedOffer, setBookedOffer] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Personalized Match: First item matching User's Onboarding Goal
  const userGoal = profile.primaryGoal || 'Save Money';
  const recommendedOffer = PARTNER_OFFERS.find(o => o.matchGoal === userGoal) || PARTNER_OFFERS[0];

  const filteredOffers = PARTNER_OFFERS.filter(o => {
    if (filter === 'all') return true;
    return o.category === filter;
  });

  const handleBookMock = (offer) => {
    setBookedOffer(offer);
    setBookingSuccess(false);
  };

  const confirmBooking = () => {
    if (!bookedOffer) return;
    
    // Log audit log and notify user
    addNotification(
      "Partner Deal Activated", 
      `Congratulations! You've redeemed the "${bookedOffer.deal}" offer with ${bookedOffer.provider}. Check your email for details.`, 
      bookedOffer.category === 'money' ? 'finance' : 'health'
    );
    
    addAuditLog(
      "Marketplace Redemption", 
      `User redeemed partner coupon code for ${bookedOffer.title} (${bookedOffer.provider}).`
    );

    setBookingSuccess(true);
    setTimeout(() => {
      setBookedOffer(null);
      setBookingSuccess(false);
    }, 2500);
  };

  return (
    <div className="marketplace-container fade-in">
      <div className="marketplace-header" style={{ marginBottom: '16px' }}>
        <h2 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Store size={22} className="col-purple" /> Partner Ecosystem
        </h2>
        <p className="subtitle" style={{ margin: '0' }}>Goal-aligned wellness deals and services curated for your lifestyle.</p>
      </div>

      {/* RECOMMENDED CARD (DYNAMIC ALIGNMENT) */}
      <div className="recommended-section-card" style={{
        background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.12), rgba(236, 72, 153, 0.08))',
        border: '1px solid rgba(167, 139, 250, 0.3)',
        borderRadius: '24px',
        padding: '16px',
        marginBottom: '20px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          backgroundColor: 'rgba(167, 139, 250, 0.2)',
          color: '#C084FC',
          fontSize: '10px',
          fontWeight: '700',
          padding: '4px 8px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <Sparkles size={10} /> BEST GOAL MATCH
        </div>
        
        <span className="welcome-tag" style={{ color: '#C084FC', fontWeight: '700', textTransform: 'uppercase', fontSize: '10px' }}>
          Based on Goal: {userGoal}
        </span>
        <h3 style={{ margin: '4px 0 8px 0', fontSize: '17px', fontWeight: '800' }}>
          {recommendedOffer.title}
        </h3>
        <p style={{ fontSize: '13px', margin: '0 0 12px 0', color: '#E2E8F0', opacity: 0.9 }}>
          {recommendedOffer.tagline}
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '14px', fontWeight: '800', color: '#10B981' }}>{recommendedOffer.deal}</span>
            <span style={{ fontSize: '11px', display: 'block', color: '#94A3B8' }}>Est: {recommendedOffer.price}</span>
          </div>
          <button 
            onClick={() => handleBookMock(recommendedOffer)}
            className="onboarding-btn" 
            style={{ 
              padding: '8px 16px', 
              fontSize: '12px', 
              borderRadius: '12px', 
              background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', 
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '700'
            }}
          >
            Redeem Deal <ArrowRight size={14} style={{ marginLeft: '4px' }} />
          </button>
        </div>
      </div>

      {/* FILTER BUTTONS */}
      <div className="marketplace-filters" style={{
        display: 'flex',
        gap: '6px',
        marginBottom: '16px',
        overflowX: 'auto',
        paddingBottom: '4px'
      }}>
        {['all', 'mind', 'money', 'body'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`filter-badge ${filter === tab ? 'active' : ''}`}
            style={{
              padding: '6px 14px',
              borderRadius: '14px',
              border: '1px solid',
              borderColor: filter === tab ? '#C084FC' : 'rgba(255, 255, 255, 0.05)',
              backgroundColor: filter === tab ? 'rgba(139, 92, 246, 0.15)' : 'rgba(15, 23, 42, 0.3)',
              color: filter === tab ? '#FFF' : '#94A3B8',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              textTransform: 'capitalize',
              transition: 'all 0.2s ease'
            }}
          >
            {tab === 'all' ? 'All Offers' : tab === 'mind' ? 'Mental (Mind)' : tab === 'money' ? 'Finance (Money)' : 'Physical (Body)'}
          </button>
        ))}
      </div>

      {/* OFFERS GRID */}
      <div className="offers-grid-scroll" style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxHeight: '430px',
        overflowY: 'auto',
        paddingRight: '2px'
      }}>
        {filteredOffers.map((offer) => {
          const Icon = offer.icon;
          return (
            <div key={offer.id} className="partner-card" style={{
              background: 'rgba(15, 23, 42, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.04)',
              borderRadius: '20px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              transition: 'transform 0.2s ease, border-color 0.2s ease'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '10px',
                    backgroundColor: `rgba(255, 255, 255, 0.03)`,
                    border: `1px solid ${offer.color}50`,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: offer.color
                  }}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <h4 style={{ margin: '0', fontSize: '14px', fontWeight: '700' }}>{offer.title}</h4>
                    <span style={{ fontSize: '11px', color: '#94A3B8' }}>By {offer.provider}</span>
                  </div>
                </div>
                <div style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  color: '#10B981',
                  fontSize: '10px',
                  fontWeight: '700',
                  padding: '2px 8px',
                  borderRadius: '8px'
                }}>
                  {offer.deal}
                </div>
              </div>

              <p style={{ margin: '0', fontSize: '12.5px', color: '#CBD5E1', lineHeight: '1.4' }}>
                {offer.details}
              </p>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid rgba(255, 255, 255, 0.03)',
                paddingTop: '10px',
                marginTop: '4px'
              }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#EF4444' }}>
                  {offer.price}
                </span>
                <button
                  onClick={() => handleBookMock(offer)}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    color: '#E2E8F0',
                    fontSize: '11px',
                    fontWeight: '600',
                    padding: '6px 12px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Unlock Deal <ExternalLink size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MOCK BOOKING DIALOG OVERLAY */}
      {bookedOffer && (
        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          backgroundColor: 'rgba(9, 13, 22, 0.9)',
          zIndex: 110,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '24px'
        }} className="fade-in">
          <div style={{
            background: '#131B2E',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '24px',
            padding: '24px',
            width: '100%',
            maxWidth: '320px',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
          }}>
            {!bookingSuccess ? (
              <>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '18px',
                  backgroundColor: 'rgba(139, 92, 246, 0.1)',
                  color: '#C084FC',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: '0 auto 16px auto',
                  border: '1px solid rgba(139, 92, 246, 0.3)'
                }}>
                  <Tag size={28} />
                </div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '800' }}>Confirm Redemption</h3>
                <p style={{ fontSize: '13px', color: '#94A3B8', margin: '0 0 20px 0' }}>
                  Unlock exclusive member deal: <strong>{bookedOffer.deal}</strong> from {bookedOffer.provider}. We will mock this connection securely.
                </p>
                
                <div style={{
                  display: 'flex',
                  gap: '10px'
                }}>
                  <button 
                    onClick={() => setBookedOffer(null)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '12px',
                      border: '1.5px solid rgba(255,255,255,0.05)',
                      backgroundColor: 'rgba(255,255,255,0.03)',
                      color: '#E2E8F0',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={confirmBooking}
                    style={{
                      flex: 2,
                      padding: '12px',
                      borderRadius: '12px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                      color: 'white',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    Claim Voucher
                  </button>
                </div>
              </>
            ) : (
              <div className="fade-in">
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '18px',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  color: '#34D399',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: '0 auto 16px auto',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}>
                  <ShieldCheck size={28} />
                </div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '800', color: '#34D399' }}>Voucher Claimed!</h3>
                <p style={{ fontSize: '13px', color: '#E2E8F0', margin: '0' }}>
                  Commission logs generated. Life Score bonus applied (+2 Wellbeing score for self-care initiative).
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
