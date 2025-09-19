import { FastifyInstance } from "fastify";
import { knex } from "../database";
import { randomUUID } from "node:crypto";
import z from "zod";

export async function usersRoutes(app: FastifyInstance) {
  app.post("/", async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.email(),
    });

    let sessionId = request.cookies.sessionId;
    if (!sessionId) {
      sessionId = randomUUID();
      reply.setCookie("sessionId", sessionId, {
        path: "/",
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
    }
    const { name, email } = createUserBodySchema.parse(request.body);
    const existingUserWithEmail = await knex("users").where({ email }).first();

    if (existingUserWithEmail) {
      return reply.status(400).send({
        message: "Email already exists",
      });
    }

    await knex("users").insert({
      id: randomUUID(),
      name,
      email,
      session_id: sessionId,
    });

    return reply.status(201).send();
  });
}
