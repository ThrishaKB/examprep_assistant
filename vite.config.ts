import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/examprep_assistant/', // <- EXACT repo name between slashes
  plugins: [react()],
})

    },
  };
});
