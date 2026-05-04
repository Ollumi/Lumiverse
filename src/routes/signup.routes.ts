import { Hono } from "hono";
import { auth, allowCreation, CREATION_NONCE_HEADER } from "../auth";
import { rateLimit } from "../middleware/rate-limit";

const app = new Hono();

const signupLimiter = rateLimit({
  bucket: "public-signup",
  max: 5,
  windowMs: 5 * 60 * 1000,
  message: "Too many sign-up attempts. Try again in a few minutes.",
});

app.post("/", signupLimiter, async (c) => {
  let body: any;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid request body" }, 400);
  }

  const { username, password, name } = body ?? {};

  if (!username || typeof username !== "string" || username.trim().length === 0) {
    return c.json({ error: "Username is required" }, 400);
  }
  if (username.trim().length > 64) {
    return c.json({ error: "Username must be 64 characters or fewer" }, 400);
  }
  if (!password || typeof password !== "string") {
    return c.json({ error: "Password is required" }, 400);
  }
  if (password.length < 8 || password.length > 128) {
    return c.json({ error: "Password must be between 8 and 128 characters" }, 400);
  }

  const trimmedUsername = username.trim();
  const displayName = typeof name === "string" && name.trim().length > 0
    ? name.trim().slice(0, 100)
    : trimmedUsername;

  const creationNonce = allowCreation();

  try {
    await auth.api.signUpEmail({
      headers: new Headers({ [CREATION_NONCE_HEADER]: creationNonce }),
      body: {
        email: `${trimmedUsername.toLowerCase()}@lumiverse.local`,
        password,
        name: displayName,
        username: trimmedUsername,
      },
    });

    return c.json({ success: true, username: trimmedUsername }, 201);
  } catch (err: any) {
    const msg: string = err?.message || "";
    if (/username.*taken|already.*exist|duplicate/i.test(msg)) {
      return c.json({ error: "That username is already taken" }, 409);
    }
    return c.json({ error: msg || "Sign-up failed. Please try again." }, 400);
  }
});

export { app as signupRoutes };
