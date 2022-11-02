// log the pageview with their URL
export const pageview = (url) => {
    window.gtag('config', 'G-V44B3NZN1L', {
        page_path: url,
    })
}

// log specific events happening.
export const event = ({ action, params }) => {
    window.gtag('event', action, params)
}