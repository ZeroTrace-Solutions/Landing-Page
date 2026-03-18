import { useMemo } from 'react'
import { ReactLenis } from 'lenis/react'

export function SmoothScroll({ children }) {
    const lenisOptions = useMemo(() => ({
        lerp: 0.08,
        duration: 1.1,
        smoothWheel: true,
        syncTouch: true,
        syncTouchLerp: 0.08,
        touchMultiplier: 1,
        wheelMultiplier: 0.9,
        normalizeWheel: true,
    }), [])

    return (
        <ReactLenis root autoRaf options={lenisOptions}>
            {children}
        </ReactLenis>
    )
}
