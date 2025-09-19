import { FastifyInstance } from "fastify";
import { knex } from "../database";
import { randomUUID } from "node:crypto";
import z from "zod";
import { checkSessionIdExists } from "../middlewares/check-session-id";

export async function mealsRoutes(app: FastifyInstance) {
  app.post(
    "/",
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const createMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        isOnDiet: z.boolean(),
        date: z.coerce.date(),
      });

      const { name, description, isOnDiet, date } = createMealBodySchema.parse(
        request.body
      );
      await knex("meals").insert({
        id: randomUUID(),
        name,
        description,
        is_on_diet: isOnDiet,
        date_time: date.toISOString(),
        user_id: request.user?.id,
      });

      return reply.status(201).send();
    }
  );

  app.get(
    "/",
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const meals = await knex("meals")
        .where({ user_id: request.user?.id })
        .orderBy("date_time", "desc");

      return reply.status(200).send({ meals });
    }
  );

  app.get(
    "/:mealId",
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const getMealParamsSchema = z.object({
        mealId: z.uuid(),
      });

      const { mealId } = getMealParamsSchema.parse(request.params);

      const meal = await knex("meals").where({ id: mealId }).first();

      if (!meal) {
        return reply.status(404).send({
          message: "Meal not found",
        });
      }

      return reply.status(200).send({ meal });
    }
  );

  app.put(
    "/:mealId",
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const getMealParamsSchema = z.object({
        mealId: z.uuid(),
      });

      const { mealId } = getMealParamsSchema.parse(request.params);

      const meal = await knex("meals").where({ id: mealId }).first();

      if (!meal) {
        return reply.status(404).send({
          message: "Meal not found",
        });
      }

      const updateMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        isOnDiet: z.boolean(),
        date: z.coerce.date(),
      });

      const { name, description, isOnDiet, date } = updateMealBodySchema.parse(
        request.body
      );

      await knex("meals").where({ id: mealId }).update({
        name,
        description,
        is_on_diet: isOnDiet,
        date_time: date.toISOString(),
      });

      return reply.status(204).send();
    }
  );

  app.delete(
    "/:mealId",
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const getMealParamsSchema = z.object({
        mealId: z.uuid(),
      });

      const { mealId } = getMealParamsSchema.parse(request.params);

      const meal = await knex("meals").where({ id: mealId }).first();

      if (!meal) {
        return reply.status(404).send({
          message: "Meal not found",
        });
      }

      await knex("meals").where({ id: mealId }).delete();

      return reply.status(204).send();
    }
  );

  app.get(
    "/metrics",
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const totalMeals = await knex("meals")
        .where({ user_id: request.user?.id })
        .orderBy("date_time", "desc");

      const totalMealsOnDiet = await knex("meals")
        .where({ user_id: request.user?.id, is_on_diet: true })
        .count("id", { as: "total" })
        .first();

      const totalMealsOffDiet = await knex("meals")
        .where({ user_id: request.user?.id, is_on_diet: false })
        .count("id", { as: "total" })
        .first();

      const { bestOnDietSequence } = totalMeals.reduce(
        (acc, meal) => {
          if (meal.is_on_diet) {
            acc.currentSequence++;
          } else {
            acc.currentSequence = 0;
          }
          if (acc.currentSequence > acc.bestOnDietSequence) {
            acc.bestOnDietSequence = acc.currentSequence;
          }
          return acc;
        },
        {
          bestOnDietSequence: 0,
          currentSequence: 0,
        }
      );

      return reply.send({
        totalMeals: totalMeals.length,
        totalMealsOnDiet: totalMealsOnDiet?.total,
        totalMealsOffDiet: totalMealsOffDiet?.total,
        bestOnDietSequence,
      });
    }
  );
}
