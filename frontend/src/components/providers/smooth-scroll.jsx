import { useMemo } from 'react'
import { ReactLenis } from 'lenis/react'

export function SmoothScroll({ children }) {
    const lenisOptions = useMemo(() => ({
        lerp: 0.1, // Slightly more responsive
        duration: 1.2,
        smoothWheel: true,
        syncTouch: false, // Use native touch scroll for better mobile feel
        syncTouchLerp: 0.08,
        touchMultiplier: 1.5,
        wheelMultiplier: 1,
        normalizeWheel: true,
    }), [])

    return (
        <ReactLenis root autoRaf options={lenisOptions}>
            {children}
        </ReactLenis>
    )
}
