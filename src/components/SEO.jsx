import { Helmet } from 'react-helmet-async';

const BASE_URL = 'https://scanmyride.vercel.app';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.jpg`;

/**
 * Reusable SEO component using react-helmet-async
 *
 * Usage:
 *   <SEO
 *     title="Page Title"
 *     description="Page description"
 *     path="/page-path"       // used to build canonical + og:url
 *     image="/og-image.jpg"   // optional
 *   />
 */
const SEO = ({
    title = 'ScanMyRide | Smart Digital Car Identity & QR Stickers',
    description = 'ScanMyRide lets car owners create a smart digital identity with QR stickers. Scan any car to view owner details, emergency contacts, and vehicle info instantly.',
    path = '/',
    image = DEFAULT_IMAGE,
    noIndex = false,
}) => {
    const canonical = `${BASE_URL}${path}`;
    const ogImage = image.startsWith('http') ? image : `${BASE_URL}${image}`;

    return (
        <Helmet>
            {/* Primary */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow'} />
            <link rel="canonical" href={canonical} />

            {/* Open Graph */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={canonical} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:site_name" content="ScanMyRide" />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={canonical} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />
        </Helmet>
    );
};

export default SEO;
