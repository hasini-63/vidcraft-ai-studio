import { Project, StockMediaItem, EnhancementProfile, StoryboardResult, User } from '../types';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('vidcraft_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  // Authentication
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to login');
    }
    const data = await res.json();
    localStorage.setItem('vidcraft_token', data.token);
    return data;
  },

  async register(email: string, password: string, name: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to register');
    }
    const data = await res.json();
    localStorage.setItem('vidcraft_token', data.token);
    return data;
  },

  async demoLogin(): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/demo`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Demo login failed');
    const data = await res.json();
    localStorage.setItem('vidcraft_token', data.token);
    return data;
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: getAuthHeader()
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.user;
    } catch {
      return null;
    }
  },

  logout() {
    localStorage.removeItem('vidcraft_token');
  },

  // Projects
  async getProjects(): Promise<Project[]> {
    try {
      const res = await fetch(`${API_BASE}/projects`, {
        headers: getAuthHeader()
      });
      if (!res.ok) return [];
      const data = await res.json();
      return data.projects || [];
    } catch (e) {
      console.warn('Backend unavailable, using local project memory', e);
      return [];
    }
  },

  async getTemplates(): Promise<Project[]> {
    try {
      const res = await fetch(`${API_BASE}/projects/templates`);
      if (!res.ok) return [];
      const data = await res.json();
      return data.templates || [];
    } catch {
      return [];
    }
  },

  async getProject(id: string): Promise<Project | null> {
    try {
      const res = await fetch(`${API_BASE}/projects/${id}`, {
        headers: getAuthHeader()
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.project;
    } catch {
      return null;
    }
  },

  async createProject(params: {
    title: string;
    description?: string;
    aspectRatio?: string;
    duration?: number;
    templateId?: string;
    initialData?: any;
    thumbnail?: string;
  }): Promise<Project> {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error('Failed to create project');
    const data = await res.json();
    return data.project;
  },

  async saveProject(id: string, updates: Partial<Project>): Promise<Project> {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to save project');
    const data = await res.json();
    return data.project;
  },

  async duplicateProject(id: string): Promise<Project> {
    const res = await fetch(`${API_BASE}/projects/${id}/duplicate`, {
      method: 'POST',
      headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Failed to duplicate project');
    const data = await res.json();
    return data.project;
  },

  async deleteProject(id: string): Promise<void> {
    await fetch(`${API_BASE}/projects/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
  },

  // Media
  async uploadFile(file: File, projectId?: string): Promise<{ url: string; name: string; type: string; size: number }> {
    const formData = new FormData();
    formData.append('file', file);
    if (projectId) formData.append('projectId', projectId);

    const res = await fetch(`${API_BASE}/media/upload`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: formData
    });

    if (!res.ok) {
      // Browser Object URL fallback if backend upload fails
      return {
        url: URL.createObjectURL(file),
        name: file.name,
        type: file.type.startsWith('video') ? 'video' : file.type.startsWith('audio') ? 'audio' : 'image',
        size: file.size
      };
    }

    const data = await res.json();
    return {
      url: data.asset.url,
      name: data.asset.name,
      type: data.asset.type,
      size: data.asset.size
    };
  },

  async getStockMedia(type = 'all', query = '', category = ''): Promise<{
    videos?: StockMediaItem[];
    music?: StockMediaItem[];
    sfx?: StockMediaItem[];
    images?: StockMediaItem[];
  }> {
    try {
      const url = new URL(`${window.location.origin}${API_BASE}/media/stock`);
      if (type) url.searchParams.set('type', type);
      if (query) url.searchParams.set('query', query);
      if (category) url.searchParams.set('category', category);

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error('Stock media fetch failed');
      return await res.json();
    } catch {
      return {};
    }
  },

  // AI Tools
  async generateStoryboard(prompt: string, duration = 15, style = 'cinematic', aspectRatio = '16:9'): Promise<StoryboardResult> {
    const res = await fetch(`${API_BASE}/ai/storyboard`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, duration, style, aspectRatio })
    });
    if (!res.ok) throw new Error('Failed to generate AI storyboard');
    const data = await res.json();
    return data.result;
  },

  async generateImage(prompt: string, aspectRatio = '16:9', style = 'photorealistic'): Promise<string> {
    const res = await fetch(`${API_BASE}/ai/image-gen`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, aspectRatio, style })
    });
    if (!res.ok) throw new Error('Failed to generate image');
    const data = await res.json();
    return data.imageUrl;
  },

  async getEnhancementPresets(): Promise<EnhancementProfile[]> {
    try {
      const res = await fetch(`${API_BASE}/ai/presets`);
      if (!res.ok) return [];
      const data = await res.json();
      return data.presets || [];
    } catch {
      return [];
    }
  },

  async getAIProviders(): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/ai/providers`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  async setAIKey(provider: string, apiKey: string): Promise<void> {
    await fetch(`${API_BASE}/ai/providers/key`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider, apiKey })
    });
  }
};
