import { LoadingOverlay } from "./LoadingOverlay.js";
import { Base64LogoRenderer, MaskLogoRenderer } from "./LoadingLogoRenderer.js";
import { SHIITAKE_LOGO_BASE64, SHIITAKE_LOGO_MASK } from "./logo.js";
export const ShiitakeLoadingOverlay = {
    pixel: (stages, display) => new LoadingOverlay(stages, display, new MaskLogoRenderer(SHIITAKE_LOGO_MASK)),
    logo: (stages, display) => new LoadingOverlay(stages, display, new Base64LogoRenderer(SHIITAKE_LOGO_BASE64)),
};
