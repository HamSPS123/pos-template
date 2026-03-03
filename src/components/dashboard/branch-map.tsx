"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { type BranchDashboard, formatLAK } from "@/lib/mock-dashboard"

interface BranchMapProps {
  branches: BranchDashboard[]
}

const storeIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7"/></svg>`

function getShortName(name: string): string {
  const match = name.match(/\(([^)]+)\)/)
  return match ? match[1] : name.slice(0, 12)
}

function formatShortRevenue(n: number): string {
  if (n >= 1_000_000) return `₭${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `₭${(n / 1_000).toFixed(0)}k`
  return `₭${n}`
}

function pillMarker(branch: BranchDashboard) {
  const color = branch.status === "active" ? "#22c55e" : "#94a3b8"
  const label = getShortName(branch.name)
  const rev = formatShortRevenue(branch.totalRevenue)
  return `
    <div style="
      display: inline-flex; align-items: center; gap: 5px;
      background: ${color}; color: white;
      padding: 4px 10px 4px 6px; border-radius: 16px;
      font-size: 11px; font-weight: 600; white-space: nowrap;
      box-shadow: 0 2px 8px rgba(0,0,0,0.25);
      border: 2px solid white;
      font-family: 'Noto Sans Lao', system-ui, sans-serif;
      cursor: pointer;
      line-height: 1.2;
    ">
      <span style="display:flex;align-items:center;justify-content:center;width:18px;height:18px;background:rgba(255,255,255,0.25);border-radius:50%;flex-shrink:0;">
        ${storeIconSvg}
      </span>
      <span>${label}: ${rev}</span>
    </div>
  `
}

export default function BranchMap({ branches }: BranchMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const map = L.map(mapRef.current, {
      center: [17.975, 102.615],
      zoom: 13,
      scrollWheelZoom: true,
      zoomControl: false,
    })

    L.control.zoom({ position: "bottomright" }).addTo(map)

    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
      maxZoom: 19,
    }).addTo(map)

    branches.forEach((branch) => {
      const html = pillMarker(branch)
      const icon = L.divIcon({
        className: "",
        html,
        iconSize: [0, 0],
        iconAnchor: [0, 14],
        popupAnchor: [70, -10],
      })

      const marker = L.marker([branch.lat, branch.lng], { icon }).addTo(map)

      marker.bindPopup(`
        <div style="min-width: 220px; font-family: 'Noto Sans Lao', system-ui, sans-serif; padding: 2px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <div style="width: 8px; height: 8px; border-radius: 50%; background: ${branch.status === "active" ? "#22c55e" : "#94a3b8"};"></div>
            <h3 style="margin: 0; font-size: 13px; font-weight: 700; color: #1e293b;">${branch.name}</h3>
          </div>
          <p style="margin: 0 0 10px 0; font-size: 11px; color: #64748b; line-height: 1.4;">${branch.address}</p>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px; padding: 8px; background: #f8fafc; border-radius: 8px; font-size: 11px;">
            <div style="text-align: center;">
              <div style="color: #94a3b8; font-size: 10px; margin-bottom: 2px;">ລາຍຮັບ</div>
              <div style="font-weight: 700; color: #16a34a;">₭${formatLAK(branch.totalRevenue)}</div>
            </div>
            <div style="text-align: center;">
              <div style="color: #94a3b8; font-size: 10px; margin-bottom: 2px;">ລາຍຈ່າຍ</div>
              <div style="font-weight: 700; color: #ef4444;">₭${formatLAK(branch.totalExpense)}</div>
            </div>
            <div style="text-align: center;">
              <div style="color: #94a3b8; font-size: 10px; margin-bottom: 2px;">ກຳໄລ</div>
              <div style="font-weight: 700; color: #2563eb;">₭${formatLAK(branch.profit)}</div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 10px; margin-top: 8px; font-size: 10px; color: #94a3b8;">
            <span>📦 ${branch.totalOrders} ອໍເດີ</span>
            <span>👥 ${branch.employeeCount} ພະນັກງານ</span>
          </div>
        </div>
      `, { className: "modern-popup" })
    })

    mapInstanceRef.current = map

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [branches])

  return <div ref={mapRef} className="h-full w-full rounded-xl" />
}
