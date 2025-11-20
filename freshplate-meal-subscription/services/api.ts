const API_BASE = (import.meta.env.VITE_EXPRESS_BASE_URL || "").replace(/\/+$/, "");

if (!API_BASE) {
  console.warn("VITE_EXPRESS_BASE_URL is not set. API calls will fail.");
}

type RequestOptions = RequestInit & { token?: string };

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (!API_BASE) {
    throw new Error("API base URL not configured");
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.message || "Request failed");
  }
  return data as T;
}

export interface AuthResponse {
  token: string;
  user: {
    userId: string;
    name: string;
    email: string;
    role: "user" | "admin";
    createdAt: string;
  };
}

export interface ProfileResponse {
  user: AuthResponse["user"];
  orders: unknown[];
}

export interface ProductPayload {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: 'Vegan' | 'Chicken' | 'Beef' | 'Fish';
  calories: number;
}

type ProductDTO = ProductPayload & { id?: string; productId?: string };

export interface ProductsResponse {
  products: ProductDTO[];
}

export const authApi = {
  signUp: (payload: { name: string; email: string; password: string }) =>
    request<AuthResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  login: (payload: { email: string; password: string }) =>
    request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  profile: (token: string) =>
    request<ProfileResponse>("/users/me", {
      method: "GET",
      token,
    }),
};

export const productApi = {
  list: () => request<ProductsResponse>("/products"),
  create: (token: string, payload: ProductPayload) =>
    request<{ productId: string }>("/admin/products", {
      method: "POST",
      token,
      body: JSON.stringify(payload),
    }),
  update: (token: string, id: string, payload: ProductPayload) =>
    request<{ message: string }>(`/admin/products/${id}`, {
      method: "PUT",
      token,
      body: JSON.stringify(payload),
    }),
  remove: (token: string, id: string) =>
    request<{ message: string }>(`/admin/products/${id}`, {
      method: "DELETE",
      token,
    }),
};
