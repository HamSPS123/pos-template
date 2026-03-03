"use client"

import { useEffect, useRef, forwardRef, useImperativeHandle } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { useTheme } from "next-themes"
import { type BranchDashboard, formatLAK } from "@/lib/mock-dashboard"

export interface BranchMapHandle {
  flyTo: (lat: number, lng: number) => void
}

interface BranchMapProps {
  branches: BranchDashboard[]
}

const TILES = {
  light: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
  dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
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
  const pulse = branch.status === "active"
    ? `<span style="position:absolute;top:50%;left:-4px;transform:translateY(-50%);width:8px;height:8px;">
         <span style="position:absolute;inset:0;border-radius:50%;background:#22c55e;opacity:.6;animation:mapPulse 2s infinite;"></span>
         <span style="position:absolute;inset:1px;border-radius:50%;background:#22c55e;"></span>
       </span>`
    : ""
  return `
    <div style="
      position: relative;
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
      ${pulse}
      <span style="display:flex;align-items:center;justify-content:center;width:18px;height:18px;background:rgba(255,255,255,0.25);border-radius:50%;flex-shrink:0;">
        ${storeIconSvg}
      </span>
      <span>${label}: ${rev}</span>
    </div>
  `
}

const PULSE_CSS = `
@keyframes mapPulse {
  0% { transform: scale(1); opacity: 0.6; }
  70% { transform: scale(3); opacity: 0; }
  100% { transform: scale(1); opacity: 0; }
}
`

const BranchMap = forwardRef<BranchMapHandle, BranchMapProps>(function BranchMap({ branches }, ref) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const tileLayerRef = useRef<L.TileLayer | null>(null)
  const markersRef = useRef<{ branch: BranchDashboard; marker: L.Marker; circle: L.Circle }[]>([])
  const linesRef = useRef<L.Polyline[]>([])
  const filterRef = useRef<"all" | "active" | "inactive">("all")
  const { resolvedTheme } = useTheme()

  useImperativeHandle(ref, () => ({
    flyTo: (lat: number, lng: number) => {
      mapInstanceRef.current?.flyTo([lat, lng], 15, { duration: 1.2 })
      // Open popup for that branch
      const entry = markersRef.current.find(
        (m) => m.branch.lat === lat && m.branch.lng === lng
      )
      if (entry) {
        setTimeout(() => entry.marker.openPopup(), 600)
      }
    },
  }))

  // Switch tiles on theme change
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return
    const url = resolvedTheme === "dark" ? TILES.dark : TILES.light
    tileLayerRef.current.setUrl(url)
  }, [resolvedTheme])

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Inject pulse CSS
    if (!document.getElementById("map-pulse-css")) {
      const style = document.createElement("style")
      style.id = "map-pulse-css"
      style.textContent = PULSE_CSS
      document.head.appendChild(style)
    }

    const map = L.map(mapRef.current, {
      center: [17.975, 102.615],
      zoom: 13,
      scrollWheelZoom: true,
      zoomControl: false,
    })

    L.control.zoom({ position: "bottomright" }).addTo(map)

    const tileUrl = resolvedTheme === "dark" ? TILES.dark : TILES.light
    const tileLayer = L.tileLayer(tileUrl, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
      maxZoom: 19,
    }).addTo(map)
    tileLayerRef.current = tileLayer

    // ── Revenue radius & markers ──
    const maxRev = Math.max(...branches.map((b) => b.totalRevenue))
    const minRadius = 250
    const maxRadius = 800

    branches.forEach((branch) => {
      // Revenue circle
      const radius = minRadius + ((branch.totalRevenue / maxRev) * (maxRadius - minRadius))
      const circleColor = branch.status === "active" ? "#3b82f6" : "#94a3b8"
      const circle = L.circle([branch.lat, branch.lng], {
        radius,
        color: circleColor,
        fillColor: circleColor,
        fillOpacity: 0.08,
        weight: 1,
        opacity: 0.3,
        interactive: false,
      }).addTo(map)

      // Pill marker
      const html = pillMarker(branch)
      const icon = L.divIcon({
        className: "",
        html,
        iconSize: [0, 0],
        iconAnchor: [0, 14],
        popupAnchor: [70, -10],
      })

      const marker = L.marker([branch.lat, branch.lng], { icon }).addTo(map)

      const isDark = resolvedTheme === "dark"
      const popupText = isDark ? "#e2e8f0" : "#1e293b"
      const popupMuted = isDark ? "#94a3b8" : "#64748b"
      const popupStatBg = isDark ? "#0f172a" : "#f8fafc"

      marker.bindPopup(`
        <div style="min-width: 220px; font-family: 'Noto Sans Lao', system-ui, sans-serif; padding: 2px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <div style="width: 8px; height: 8px; border-radius: 50%; background: ${branch.status === "active" ? "#22c55e" : "#94a3b8"};"></div>
            <h3 style="margin: 0; font-size: 13px; font-weight: 700; color: ${popupText};">${branch.name}</h3>
          </div>
          <p style="margin: 0 0 10px 0; font-size: 11px; color: ${popupMuted}; line-height: 1.4;">${branch.address}</p>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px; padding: 8px; background: ${popupStatBg}; border-radius: 8px; font-size: 11px;">
            <div style="text-align: center;">
              <div style="color: ${popupMuted}; font-size: 10px; margin-bottom: 2px;">ລາຍຮັບ</div>
              <div style="font-weight: 700; color: #16a34a;">₭${formatLAK(branch.totalRevenue)}</div>
            </div>
            <div style="text-align: center;">
              <div style="color: ${popupMuted}; font-size: 10px; margin-bottom: 2px;">ລາຍຈ່າຍ</div>
              <div style="font-weight: 700; color: #ef4444;">₭${formatLAK(branch.totalExpense)}</div>
            </div>
            <div style="text-align: center;">
              <div style="color: ${popupMuted}; font-size: 10px; margin-bottom: 2px;">ກຳໄລ</div>
              <div style="font-weight: 700; color: #3b82f6;">₭${formatLAK(branch.profit)}</div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 10px; margin-top: 8px; font-size: 10px; color: ${popupMuted};">
            <span>📦 ${branch.totalOrders} ອໍເດີ</span>
            <span>👥 ${branch.employeeCount} ພະນັກງານ</span>
          </div>
        </div>
      `, { className: "modern-popup" })

      markersRef.current.push({ branch, marker, circle })
    })

    // ── Connection lines ──
    const activeBranches = branches.filter((b) => b.status === "active")
    for (let i = 0; i < activeBranches.length; i++) {
      for (let j = i + 1; j < activeBranches.length; j++) {
        const a = activeBranches[i]
        const b = activeBranches[j]
        const line = L.polyline(
          [[a.lat, a.lng], [b.lat, b.lng]],
          {
            color: "#3b82f6",
            weight: 1,
            opacity: 0.15,
            dashArray: "6, 8",
            interactive: false,
          }
        ).addTo(map)
        linesRef.current.push(line)
      }
    }

    // ── Stats overlay (top-left) ──
    const StatsControl = L.Control.extend({
      onAdd: () => {
        const total = branches.reduce((s, b) => s + b.totalRevenue, 0)
        const activeCount = branches.filter((b) => b.status === "active").length
        const div = L.DomUtil.create("div")
        div.innerHTML = `
          <div style="
            background: rgba(255,255,255,0.92); backdrop-filter: blur(8px);
            border-radius: 10px; padding: 10px 14px; font-family: 'Noto Sans Lao', system-ui, sans-serif;
            box-shadow: 0 2px 12px rgba(0,0,0,0.1); font-size: 11px; line-height: 1.5;
            min-width: 140px; border: 1px solid rgba(0,0,0,0.06);
          ">
            <div style="font-weight: 700; font-size: 12px; margin-bottom: 4px; color: #1e293b;">📊 ສະຖິຕິ</div>
            <div style="color: #64748b;">ສາຂາ: <b style="color:#1e293b;">${activeCount}/${branches.length}</b> active</div>
            <div style="color: #64748b;">ລວມລາຍຮັບ: <b style="color:#16a34a;">₭${formatLAK(total)}</b></div>
            <div style="color: #64748b;">ພະນັກງານ: <b style="color:#1e293b;">${branches.reduce((s, b) => s + b.employeeCount, 0)}</b></div>
          </div>
        `
        L.DomEvent.disableClickPropagation(div)
        return div
      },
    })
    new StatsControl({ position: "topleft" }).addTo(map)

    // ── Filter control (top-right) ──
    const FilterControl = L.Control.extend({
      onAdd: () => {
        const div = L.DomUtil.create("div")
        const btnStyle = (active: boolean) => `
          padding: 4px 12px; border-radius: 6px; font-size: 11px; font-weight: 600;
          cursor: pointer; border: 1px solid ${active ? "#3b82f6" : "rgba(0,0,0,0.1)"};
          background: ${active ? "#3b82f6" : "rgba(255,255,255,0.92)"};
          color: ${active ? "white" : "#64748b"};
          font-family: 'Noto Sans Lao', system-ui, sans-serif;
          backdrop-filter: blur(8px);
        `
        const render = () => {
          div.innerHTML = `
            <div style="display: flex; gap: 4px; box-shadow: 0 2px 12px rgba(0,0,0,0.1); border-radius: 8px; padding: 3px; background: rgba(255,255,255,0.8); backdrop-filter: blur(8px);">
              <span class="map-filter-btn" data-filter="all" style="${btnStyle(filterRef.current === "all")}">ທັງໝົດ</span>
              <span class="map-filter-btn" data-filter="active" style="${btnStyle(filterRef.current === "active")}">Active</span>
              <span class="map-filter-btn" data-filter="inactive" style="${btnStyle(filterRef.current === "inactive")}">Inactive</span>
            </div>
          `
          div.querySelectorAll(".map-filter-btn").forEach((btn) => {
            btn.addEventListener("click", () => {
              const f = (btn as HTMLElement).dataset.filter as "all" | "active" | "inactive"
              filterRef.current = f
              render()
              applyFilter(f)
            })
          })
        }
        render()
        L.DomEvent.disableClickPropagation(div)
        return div
      },
    })
    new FilterControl({ position: "topright" }).addTo(map)

    function applyFilter(f: "all" | "active" | "inactive") {
      markersRef.current.forEach(({ branch, marker, circle }) => {
        const show =
          f === "all" ||
          (f === "active" && branch.status === "active") ||
          (f === "inactive" && branch.status === "inactive")
        if (show) {
          if (!map.hasLayer(marker)) marker.addTo(map)
          if (!map.hasLayer(circle)) circle.addTo(map)
        } else {
          if (map.hasLayer(marker)) map.removeLayer(marker)
          if (map.hasLayer(circle)) map.removeLayer(circle)
        }
      })
      // Show/hide lines
      linesRef.current.forEach((line) => {
        if (f === "inactive") {
          if (map.hasLayer(line)) map.removeLayer(line)
        } else {
          if (!map.hasLayer(line)) line.addTo(map)
        }
      })
    }

    mapInstanceRef.current = map

    return () => {
      map.remove()
      mapInstanceRef.current = null
      tileLayerRef.current = null
      markersRef.current = []
      linesRef.current = []
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branches])

  return <div ref={mapRef} className="h-full w-full rounded-xl" />
})

export default BranchMap
