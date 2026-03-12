import { ReactLenis } from 'lenis/react'

export function SmoothScroll({ children }) {
    return (
        <ReactLenis root>
            {children}
        </ReactLenis>
    )
}
