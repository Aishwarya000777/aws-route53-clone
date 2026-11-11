
const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token =
        typeof window !== "undefined"
            ? localStorage.getItem("route53_token")
            : null;

    const headers = new Headers(options.headers);

    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    if (
        options.body &&
        !(options.body instanceof FormData) &&
        !(options.body instanceof URLSearchParams)
    ) {
        headers.set("Content-Type", "application/json");
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
        cache: "no-store",
    });

    if (!response.ok) {
        if (response.status === 401 && typeof window !== "undefined") {
            localStorage.removeItem("route53_token");
        }

        const error = await response.json().catch(() => null);

        throw new Error(
            error?.detail || `API request failed: ${response.status}`
        );
    }

    return response.json() as Promise<T>;
}

export async function login(username: string, password: string) {
    const body = new URLSearchParams();
    body.set("username", username);
    body.set("password", password);

    const result = await apiRequest<{
        access_token: string;
        token_type: string;
        username: string;
    }>("/api/auth/login", {
        method: "POST",
        body,
    });

    localStorage.setItem("route53_token", result.access_token);
    return result;
}

export function logout() {
    localStorage.removeItem("route53_token");
    window.location.href = "/login";
}
