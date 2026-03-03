"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { type BranchDashboard, formatLAK } from "@/lib/mock-dashboard"

interface BranchMapProps {
  branches: BranchDashboard[]
}

const storeSvg = (color: string) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="44" height="44">
  <defs>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.25)"/>
    </filter>
  </defs>
  <circle cx="24" cy="24" r="20" fill="${color}" filter="url(#shadow)" stroke="white" stroke-width="2.5"/>
  <g transform="translate(12,11)" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M1 10L3 1h18l2 10"/>
    <path d="M1 10c0 2 1.5 3 3 3s3-1 3-3"/>
    <path d="M7 10c0 2 1.5 3 3 3s3-1 3-3"/>
    <path d="M13 10c0 2 1.5 3 3 3s3-1 3-3"/>
    <path d="M19 10c0 2 1.5 3 3 3"/>
    <path d="M1 10c0 2 1.5 3 3 3"/>
    <rect x="2" y="13" width="20" height="11" rx="1"/>
    <rect x="9" y="17" width="6" height="7"/>
  </g>
</svg>`

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
      const color = branch.status === "active" ? "#2563eb" : "#94a3b8"

      const icon = L.divIcon({
        className: "",
        html: storeSvg(color),
        iconSize: [44, 44],
        iconAnchor: [22, 22],
        popupAnchor: [0, -24],
      })

      const marker = L.marker([branch.lat, branch.lng], { icon }).addTo(map)

      marker.bindPopup(`
        <div style="min-width: 220px; font-family: system-ui, -apple-system, sans-serif; padding: 2px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <div style="width: 8px; height: 8px; border-radius: 50%; background: ${branch.status === "active" ? "#22c55e" : "#94a3b8"};"></div>
            <h3 style="margin: 0; font-size: 13px; font-weight: 700; color: #1e293b;">${branch.name}</h3>
          </div>
          <p style="margin: 0 0 10px 0; font-size: 11px; color: #64748b; line-height: 1.4;">${branch.address}</p>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px; padding: 8px; background: #f8fafc; border-radius: 8px; font-size: 11px;">
            <div style="text-align: center;">
              <div style="color: #94a3b8; font-size: 10px; margin-bottom: 2px;">Revenue</div>
              <div style="font-weight: 700; color: #16a34a;">₭${formatLAK(branch.totalRevenue)}</div>
            </div>
            <div style="text-align: center;">
              <div style="color: #94a3b8; font-size: 10px; margin-bottom: 2px;">Expense</div>
              <div style="font-weight: 700; color: #ef4444;">₭${formatLAK(branch.totalExpense)}</div>
            </div>
            <div style="text-align: center;">
              <div style="color: #94a3b8; font-size: 10px; margin-bottom: 2px;">Profit</div>
              <div style="font-weight: 700; color: #2563eb;">₭${formatLAK(branch.profit)}</div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 10px; margin-top: 8px; font-size: 10px; color: #94a3b8;">
            <span>📦 ${branch.totalOrders} orders</span>
            <span>� ${branch.employeeCount} staff</span>
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
