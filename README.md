# HMG Urban Planning Tool

The **HMG Urban Planning Tool** is a web-based calculator designed to help healthcare planners, urban developers, and policymakers estimate healthcare infrastructure needs based on population, area, demographics, and setting (urban or rural).

This tool supports both **single-stage** and **phased (5-year)** deployment strategies.

## 🚀 Features

- Calculates recommendations for:
  - Primary Healthcare Centers (PHCs)
  - Ambulance Stations
  - Telehealth Booths
  - Mobile Clinics
  - Emergency Pods
  - Women’s Health Clinics
- Custom logic based on:
  - Area (km²)
  - Population size
  - Density and setting
  - Demographic modifiers (children, elderly, chronic illness, female %)
- Justification for each recommendation based on global (WHO) and national (Saudi Vision 2030, Saudi Red Crescent) planning standards
- Clean, mobile-friendly UI
- Arabic/English-ready structure
- Attribution footer

## 📊 Formula References

- **Ambulance:** 1 per 10,000 or 1 per 4 km² (urban) / 10 km² (rural)
- **PHC:** 1 per 10,000 or 1 per 1.5 km²
- **Telehealth Booth:** 1 per 5,000 + elderly > 15%
- **Mobile Clinic:** 1 per 40 km² + chronic > 20%
- **Women’s Clinic:** if female % > 60%
- **Emergency Pod:** only if no PHC within 2 km or no ambulance within 10 km

## 🏗️ Technologies Used

- React (Next.js 13)
- TypeScript
- Vercel for hosting
- CSS inline styles

## 👨‍💼 Created By

**Dr. Mohammed AlBarti**  
Corporate Business Development – Dr. Sulaiman Al Habib Medical Group (HMG)

## 🛠️ To Deploy (No Terminal Required)

1. Download the full ZIP
2. Upload it to a new GitHub repository
3. Connect GitHub to [Vercel](https://vercel.com)
4. Set root as `/` and framework as **Next.js**
5. Deploy and test your tool live