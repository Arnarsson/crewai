interface Environment {
  BACKEND_URL: string;
  SUPABASE_URL: string;
  SUPABASE_KEY: string;
}

const development: Environment = {
  BACKEND_URL: 'http://localhost:8000',
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  SUPABASE_KEY: process.env.NEXT_PUBLIC_SUPABASE_KEY || '',
};

const staging: Environment = {
  BACKEND_URL: 'https://crewai-backend-staging.vercel.app',
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  SUPABASE_KEY: process.env.NEXT_PUBLIC_SUPABASE_KEY || '',
};

const production: Environment = {
  BACKEND_URL: 'https://crewai-backend.vercel.app',
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  SUPABASE_KEY: process.env.NEXT_PUBLIC_SUPABASE_KEY || '',
};

const getEnvironment = (): Environment => {
  switch (process.env.NEXT_PUBLIC_VERCEL_ENV) {
    case 'production':
      return production;
    case 'preview':
      return staging;
    default:
      return development;
  }
};

export const env = getEnvironment();
