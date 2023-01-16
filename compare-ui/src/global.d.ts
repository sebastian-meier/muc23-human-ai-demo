export {};

declare global {
  const __global: {
    env: {
      isProd: boolean;
      SITE_URL: string;
      SPATIAL_PORT: string;
      MAPBOXKEY: string;
    };
  };
}
