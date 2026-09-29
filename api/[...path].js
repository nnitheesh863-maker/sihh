// Vercel Serverless Function to handle API requests on Vercel
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const url = req.url || '';

  // Auth: Login
  if (url.includes('/api/auth/login') || url.includes('/auth/login')) {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const email = (body.email || 'farmer@sih.gov.in').toLowerCase().trim();
    const role = email.includes('officer') ? 'PROCUREMENT_OFFICER' : email.includes('admin') ? 'ADMIN' : 'FARMER';
    const name = role === 'ADMIN' ? 'System Administrator' : role === 'PROCUREMENT_OFFICER' ? 'APMC Officer (Nashik)' : 'Sanjay Kumar (Farmer)';

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: `usr_${Date.now().toString(36)}`,
          name,
          email,
          phone: body.phone || '9876543210',
          role,
          village: 'Palakkad',
          district: 'Nashik',
        },
        tokens: {
          accessToken: `mock_jwt_${Date.now()}`,
          refreshToken: `mock_refresh_${Date.now()}`,
        },
      },
      message: 'Login successful',
    });
  }

  // Auth: Register
  if (url.includes('/api/auth/register') || url.includes('/auth/register')) {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const email = (body.email || 'farmer@sih.gov.in').toLowerCase().trim();
    const role = body.role || (email.includes('officer') ? 'PROCUREMENT_OFFICER' : email.includes('admin') ? 'ADMIN' : 'FARMER');
    const name = body.name || (role === 'ADMIN' ? 'System Administrator' : role === 'PROCUREMENT_OFFICER' ? 'APMC Officer' : 'Sanjay Kumar (Farmer)');

    return res.status(201).json({
      success: true,
      data: {
        user: {
          id: `usr_${Date.now().toString(36)}`,
          name,
          email,
          phone: body.phone || '9876543210',
          role,
          village: body.village || 'Palakkad',
          district: body.district || 'Nashik',
        },
        tokens: {
          accessToken: `mock_jwt_${Date.now()}`,
          refreshToken: `mock_refresh_${Date.now()}`,
        },
      },
      message: 'Registration successful',
    });
  }

  // Auth: Me
  if (url.includes('/api/auth/me') || url.includes('/auth/me')) {
    return res.status(200).json({
      success: true,
      data: {
        id: 'usr_current',
        name: 'Sanjay Kumar (Farmer)',
        email: 'farmer@sih.gov.in',
        phone: '9876543210',
        role: 'FARMER',
        village: 'Palakkad',
        district: 'Nashik',
      },
    });
  }

  // Auth: Refresh
  if (url.includes('/api/auth/refresh') || url.includes('/auth/refresh')) {
    return res.status(200).json({
      success: true,
      data: {
        accessToken: `mock_jwt_refreshed_${Date.now()}`,
        refreshToken: `mock_refresh_refreshed_${Date.now()}`,
      },
    });
  }

  // Detection: Analyze
  if (url.includes('/api/detection/analyze') || url.includes('/detection/analyze')) {
    const id = `analysis_${Date.now()}`;
    return res.status(200).json({
      success: true,
      data: {
        analysis: {
          id,
          userId: 'usr_current',
          imageUrl: '',
          processedImageUrl: '',
          grade: 'A',
          score: 96,
          size: 'Medium (50-65mm)',
          freshness: 'HIGH',
          damageLevel: 'NONE',
          recommendation: 'ACCEPT - GRADE A EXPORT',
          aiModelVersion: 'YOLO11n-v2.1',
          processingTimeMs: 110,
          createdAt: new Date().toISOString(),
          defects: [],
        },
        certificate: {
          id: `cert_${Date.now()}`,
          certificateNumber: `OGC-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          pdfUrl: '',
        },
        grade: 'A',
        score: 96,
        size: 'Medium (50-65mm)',
        freshness: 'HIGH',
        damage: 'NONE',
        recommendation: 'ACCEPT - GRADE A EXPORT',
        processedImage: '',
        defects: [],
        batchReport: {
          totalOnions: 1,
          healthyCount: 1,
          damagedCount: 0,
          rottenCount: 0,
          sproutedCount: 0,
          undersizedCount: 0,
          gradeAPercentage: 100,
          ursPercentage: 0,
          qualityScore: 96,
          primaryDiseaseDetected: 'Healthy Specimen (Zero Pathogens)',
          overallRiskLevel: 'Low',
          recommendations: [
            '🌟 GRADE A PREMIUM: Specimen meets top APMC Export Standards.',
            '✓ Zero Pathogens: Tunic scales and neck tissue 100% intact.',
            'Optimal Storage: Maintain 0-2°C with 65-70% humidity in aerated crates.',
          ],
        },
        environmentalRisk: 'Low',
        overallRisk: 'Low',
        aiModelVersion: 'YOLO11n-v2.1',
        processingTimeMs: 110,
        certificateUrl: '',
      },
      message: 'Onion analyzed successfully',
    });
  }

  // Default Fallback
  return res.status(200).json({
    success: true,
    message: 'PeelVision AI API Gateway Online',
    timestamp: new Date().toISOString(),
  });
}
