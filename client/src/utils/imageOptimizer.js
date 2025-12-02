export const optimizeCloudinaryUrl = (url, width = null) => {
    if (!url || !url.includes("cloudinary.com")) return url;

    // Split the URL at 'upload/'
    const parts = url.split("upload/");
    if (parts.length < 2) return url;

    // Build transformation string
    let transformations = "f_auto,q_auto";
    if (width) {
        transformations += `,w_${width}`;
    }

    return `${parts[0]}upload/${transformations}/${parts[1]}`;
};

export const optimizeUnsplashUrl = (url, width = 800) => {
    if (!url || !url.includes("unsplash.com")) return url;

    const baseUrl = url.split("?")[0];
    return `${baseUrl}?q=80&w=${width}&auto=format&fit=crop`;
};

export const getResponsiveSrcSet = (url) => {
    if (!url.includes("cloudinary.com")) return null;

    const widths = [640, 1024, 1920];
    return widths
        .map(w => `${optimizeCloudinaryUrl(url, w)} ${w}w`)
        .join(", ");
};
