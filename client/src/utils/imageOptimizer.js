export const optimizeCloudinaryUrl = (url, width = null) => {
    if (!url || !url.includes("cloudinary.com")) return url;
    // Return raw URL to avoid 401s with strict transformations
    return url;
};

export const optimizeUnsplashUrl = (url, width = 800) => {
    if (!url || !url.includes("unsplash.com")) return url;

    const baseUrl = url.split("?")[0];
    return `${baseUrl}?q=80&w=${width}&auto=format&fit=crop`;
};

export const optimizeImageKitUrl = (url, width = null) => {
    if (!url || !url.includes("ik.imagekit.io")) return url;

    // Check if URL already has query parameters
    const separator = url.includes("?") ? "&" : "?";
    let params = "tr=f-auto,q-80";

    if (width) {
        params += `,w-${width}`;
    }

    return `${url}${separator}${params}`;
};

export const getOptimizedUrl = (url, width = null) => {
    if (!url) return "";
    if (url.includes("cloudinary.com")) return optimizeCloudinaryUrl(url, width);
    if (url.includes("unsplash.com")) return optimizeUnsplashUrl(url, width);
    if (url.includes("ik.imagekit.io")) return optimizeImageKitUrl(url, width);
    return url;
};

export const getResponsiveSrcSet = (url) => {
    if (!url) return null;
    const isCloudinary = url.includes("cloudinary.com");
    const isImageKit = url.includes("ik.imagekit.io");

    if (!isCloudinary && !isImageKit) return null;

    const widths = [640, 1024, 1920];
    return widths
        .map(w => `${getOptimizedUrl(url, w)} ${w}w`)
        .join(", ");
};
